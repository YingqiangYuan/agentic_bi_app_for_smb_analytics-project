# -*- coding: utf-8 -*-

"""Main module defining the One class that aggregates all mixins."""

from .one_01_config import ConfigMixin
from .one_02_db import DbMixin


class One(
    ConfigMixin,
    DbMixin,
):
    """Central class that combines all mixin functionalities for the application."""


one = One()
