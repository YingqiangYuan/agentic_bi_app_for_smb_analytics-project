# -*- coding: utf-8 -*-

"""AI Agent mixin for the One class."""

import typing as T
from functools import cached_property

from strands import Agent, tool
from strands.models import BedrockModel

from ..paths import path_enum

if T.TYPE_CHECKING:  # pragma: no cover
    from .one_00_main import One


class AgentMixin:
    """Mixin providing AI agent and tool definitions for database queries."""

    @cached_property
    def bedrock_model(self: "One") -> BedrockModel:
        """Create a BedrockModel instance with configured model ID."""
        return BedrockModel(
            boto_session=self.boto_ses,
            model_id=self.config.model_id,
        )

    @cached_property
    def model(self: "One"):
        """Get the model instance (alias for bedrock_model)."""
        return self.bedrock_model

    @cached_property
    def agent(self: "One") -> Agent:
        """Create an Agent instance with the configured model."""
        return Agent(
            model=self.model,
            system_prompt=path_enum.path_bi_agent_system_prompt_content,
            tools=[
                # Read-only tools
                self.tool_get_database_schema,
                self.tool_execute_sql_query,
                self.tool_write_debug_report,
            ],
        )

    @tool(
        name="get_database_schema",
    )
    def tool_get_database_schema(
        # self: "One",  # keep for IDE type hints, strands @tool doesn't support typed self
        self,  # uncomment this and comment above when running with strands
    ) -> str:
        """
        Retrieve the complete database schema information in LLM-optimized compact format.

        This tool returns the structure of all tables in the healthcare obstetrics ward
        scheduling database, including:
        - Table names and column definitions
        - Data types (simplified to STR, INT, DEC, TS, DT, etc.)
        - Constraints: Primary Key (*PK), Unique (*UQ), Not Null (*NN), Index (*IDX)
        - Foreign key relationships (*FK->Table.Column)

        Use this tool FIRST to understand the database structure before writing SQL queries.
        The compact format reduces token usage by ~70% compared to verbose SQL DDL.

        Returns:
            A string containing the encoded database schema in compact format.
        """
        return self.database_schema_str

    @tool(
        name="execute_sql_query",
    )
    def tool_execute_sql_query(
        # self: "One",  # keep for IDE type hints, strands @tool doesn't support typed self
        self,  # uncomment this and comment above when running with strands
        sql: str,
    ) -> str:
        """
        Execute a SQL SELECT query and return results as a Markdown table.

        This tool runs the provided SQL query against the healthcare obstetrics ward
        scheduling database and returns the results formatted as a Markdown table.
        Markdown tables are token-efficient (~24% fewer tokens than JSON) and
        easy for LLMs to parse.

        Args:
            sql: A valid SQL SELECT query string to execute.

        Returns:
            - On success: A Markdown-formatted table with query results
            - If no rows match: "No result"
            - On error: An error message describing what went wrong

        Note:
            Only SELECT queries are supported. Use get_database_schema first to
            understand available tables and columns before constructing queries.
        """
        return self.execute_and_print_result(sql=sql)


    @tool(
        name="write_debug_report",
    )
    def tool_write_debug_report(
        self,
        content: str,
    ) -> str:
        """
        Write a debug report documenting the reasoning process and intermediate steps.

        This tool writes a markdown report to tmp/debug_report.md for debugging and
        transparency purposes. Use this to document your reasoning process.

        Args:
            content: The full markdown content to write to the debug report file.
                     Should include sections like:
                     - User Question
                     - Schema Analysis
                     - SQL Queries and Results
                     - Reasoning Steps
                     - Final Answer

        Returns:
            A confirmation message with the file path.
        """
        try:
            path_enum.path_debug_report_md.write_text(content, encoding="utf-8")
        except FileNotFoundError:
            path_enum.dir_tmp.mkdir(parents=True, exist_ok=True)
            path_enum.path_debug_report_md.write_text(content, encoding="utf-8")
        return f"Debug report written to: {path_enum.path_debug_report_md}"
