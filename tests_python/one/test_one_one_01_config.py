# -*- coding: utf-8 -*-

from smb_loan_ai.one.one_00_main import one


class TestConfigMixin:
    def test_config(self):
        _ = one.config


if __name__ == "__main__":
    from smb_loan_ai.tests import run_cov_test

    run_cov_test(
        __file__,
        "smb_loan_ai.one.one_01_config",
        preview=False,
    )
