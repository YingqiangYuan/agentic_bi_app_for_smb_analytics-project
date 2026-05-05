# -*- coding: utf-8 -*-

if __name__ == "__main__":
    from smb_loan_ai.tests import run_cov_test

    run_cov_test(
        __file__,
        "smb_loan_ai.config",
        is_folder=True,
        preview=False,
    )