# -*- coding: utf-8 -*-

"""
Monthly LLM token / invocation quota tracking.

This module owns:

- ``MonthlyAppQuota`` — PynamoDB ORM model backed by a DynamoDB table whose
  name is read from ``config.monthly_llm_app_token_quota`` (env var).
- ``get_app_id()`` — builds the per-month partition key
  ``yq_agentic_bi_app_for_smb_analytics-YYYY-MM`` from the current UTC date.
- ``get_usage()`` — returns the current row, or a zero-initialized in-memory
  instance if the row does not yet exist (no write).
- ``increment_usage()`` — atomic ``UpdateItem(ADD)`` that bumps counters and
  upserts the row if missing. ADD on a missing numeric attribute initializes
  it to 0 first, so first-time callers don't need a separate ``put``.
- ``check_quota()`` — read counters and raise :class:`QuotaExceededError`
  if the configured caps are hit.

All DynamoDB calls are wrapped in
``pynamodb_session_manager.use_boto_session(...)`` against ``one.bsm`` so the
underlying AWS credentials match the rest of the app.
"""

import datetime

from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute
from pynamodb_session_manager.api import use_boto_session

from .one.api import one


MAX_INVOKE_PER_MONTH = 1000
MAX_OUTPUT_TOKENS_PER_MONTH = 10_000_000

APP_ID_PREFIX = "yq_agentic_bi_app_for_smb_analytics"


class QuotaExceededError(RuntimeError):
    """Raised when the current month's usage has hit a configured cap."""


class MonthlyAppQuota(Model):
    """One row per (app, month). PK is ``app_id``."""

    class Meta:
        table_name = one.config.monthly_llm_app_token_quota
        region = one.config.aws_region

    app_id = UnicodeAttribute(hash_key=True)
    total_input_token = NumberAttribute(default=0)
    total_output_token = NumberAttribute(default=0)
    total_invoke = NumberAttribute(default=0)


def get_app_id(now: datetime.datetime | None = None) -> str:
    """Return the per-month partition key for the current (or given) UTC time."""
    if now is None:
        now = datetime.datetime.now(datetime.timezone.utc)
    return f"{APP_ID_PREFIX}-{now.year:04d}-{now.month:02d}"


def get_usage(app_id: str | None = None) -> MonthlyAppQuota:
    """
    Return the quota row for ``app_id``.

    If the row does not exist yet, returns an in-memory ``MonthlyAppQuota``
    with all counters set to 0 (no write is issued).
    """
    if app_id is None:
        app_id = get_app_id()
    with use_boto_session(MonthlyAppQuota, one.bsm):
        try:
            return MonthlyAppQuota.get(app_id)
        except MonthlyAppQuota.DoesNotExist:
            return MonthlyAppQuota(
                app_id=app_id,
                total_input_token=0,
                total_output_token=0,
                total_invoke=0,
            )


def increment_usage(
    input_tokens: int,
    output_tokens: int,
    invokes: int = 1,
    app_id: str | None = None,
) -> None:
    """
    Atomically add to the current month's counters.

    Uses DynamoDB ``UpdateItem`` with ``ADD`` actions, which:

    - upserts the row if it does not exist, and
    - initializes a missing numeric attribute to 0 before adding,

    so callers never need to ``put`` first. This avoids the lost-update race
    that a naive get + set pattern would have under concurrent requests.
    """
    if app_id is None:
        app_id = get_app_id()
    item = MonthlyAppQuota(app_id)
    with use_boto_session(MonthlyAppQuota, one.bsm):
        item.update(
            actions=[
                MonthlyAppQuota.total_input_token.add(int(input_tokens)),
                MonthlyAppQuota.total_output_token.add(int(output_tokens)),
                MonthlyAppQuota.total_invoke.add(int(invokes)),
            ]
        )


def check_quota(
    app_id: str | None = None,
    max_invoke: int = MAX_INVOKE_PER_MONTH,
    max_output_tokens: int = MAX_OUTPUT_TOKENS_PER_MONTH,
) -> MonthlyAppQuota:
    """
    Read the current month's counters and raise :class:`QuotaExceededError`
    if either cap has been reached. Returns the row on success.
    """
    if app_id is None:
        app_id = get_app_id()
    usage = get_usage(app_id)
    if int(usage.total_invoke or 0) >= max_invoke:
        raise QuotaExceededError(
            f"Monthly invoke cap reached for {app_id}: "
            f"{int(usage.total_invoke)} >= {max_invoke}"
        )
    if int(usage.total_output_token or 0) >= max_output_tokens:
        raise QuotaExceededError(
            f"Monthly output-token cap reached for {app_id}: "
            f"{int(usage.total_output_token)} >= {max_output_tokens}"
        )
    return usage
