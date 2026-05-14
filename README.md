<div align="center">

# smb_loan_ai

### Chat with your lending database.

An agentic Business Intelligence app where a small-business operator asks a question in plain English — and an AI agent reads the schema, writes the SQL, runs it, and answers with a Markdown table.

<br />

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.118-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![AWS Bedrock](https://img.shields.io/badge/AWS_Bedrock-Claude_/_Nova-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/bedrock/)
[![Strands Agents](https://img.shields.io/badge/Strands_Agents-1.26-7C3AED)](https://github.com/strands-agents/sdk-python)
[![NeonDB](https://img.shields.io/badge/NeonDB-Postgres-00E599?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

<br />

<!-- TODO: drop a hero screenshot or GIF of the chat answering a question here -->
<!-- <img src="public/images/hero.png" alt="smb_loan_ai chat demo" width="820"/> -->

</div>

---

## What it does

Type a business question. Get a real answer, backed by real SQL, against your real lending database.

```
You ›  What's the default rate by industry, and which industries
        are most concentrated in our portfolio?

Bot ›  (thinking…  inspecting schema  →  joining loan ⋈ customer ⋈ default_event  →  )

       | industry        | loans | defaults | default_rate | portfolio_share |
       |-----------------|------:|---------:|-------------:|----------------:|
       | Construction    |   412 |       58 |        14.1% |           23.4% |
       | Restaurants     |   287 |       33 |        11.5% |           16.3% |
       | Retail          |   194 |       12 |         6.2% |           11.0% |
       ...

       Construction shows ~2× the default rate of Retail and accounts
       for nearly a quarter of the portfolio. Consider tightening
       underwriting for new construction applicants.
```

The agent does the SQL. The user does the thinking.

---

## Highlights

<table>
<tr>
<td valign="top" width="33%">

### Schema-aware agent

Three tools — `get_database_schema`, `execute_sql_query`, `write_debug_report` — let the agent inspect the database before writing a query, then explain its reasoning in plain English. Built on [Strands Agents](https://github.com/strands-agents/sdk-python).

</td>
<td valign="top" width="33%">

### Domain-tuned prompting

A single Markdown file — [`bi-agent-system-prompt.md`](smb_loan_ai/prompts/bi-agent-system-prompt.md) — teaches the agent 13 lending metrics (default rate, pricing gap, vintage analysis, recovery rate…) and the table relationships behind them. Editable by non-engineers.

</td>
<td valign="top" width="33%">

### Token-efficient by design

Schema is encoded in a compact custom format that is ~70% smaller than raw SQL DDL. SQL results stream back as Markdown tables (~24% leaner than JSON). Read-only by validator, by prompt, and (recommended) by DB grant.

</td>
</tr>
<tr>
<td valign="top" width="33%">

### Stream-first UX

The agent's *thinking* and its *answer* arrive on separate SSE channels. The frontend renders both in real time via `@ai-sdk/react`'s `useChat` — users see how the answer is being built.

</td>
<td valign="top" width="33%">

### Runs anywhere

`mise run dev` spins up Next.js + FastAPI locally against a SQLite snapshot. `git push` deploys both to Vercel — FastAPI rides along as a Serverless Function, swapping in NeonDB Postgres for production.

</td>
<td valign="top" width="33%">

### Cost-safe demo

A DynamoDB-backed per-user monthly token quota (`smb_loan_ai/quota.py`) keeps Bedrock spend bounded on the public demo — no surprise bills.

</td>
</tr>
</table>

---

## Architecture

```
 ┌────────────────────────┐    POST /api/chat      ┌──────────────────────────┐
 │ Next.js 16 (port 3000) │  ───── SSE stream ──▶  │ FastAPI (port 8000 /     │
 │  app/chat/page.tsx     │ ◀──── reasoning+text ─ │   api/index.py)          │
 │  components/chat/*     │                        │                          │
 │  @ai-sdk/react useChat │                        │  ai_sdk_adapter.py       │
 └────────────────────────┘                        │  one.agent (Strands)     │
                                                   │   ├─ tool_get_db_schema  │
                                                   │   ├─ tool_execute_sql    │
                                                   │   └─ tool_write_debug    │
                                                   └──────┬───────────┬───────┘
                                                          │           │
                                              ┌───────────▼───┐   ┌───▼─────────────┐
                                              │ AWS Bedrock   │   │ NeonDB Postgres │
                                              │  (Claude /    │   │  or SQLite      │
                                              │   Nova)       │   │  tmp/data.sqlite│
                                              └───────────────┘   └─────────────────┘
```

A single `runtime` singleton flips between `local` (SQLite, `~/.aws/credentials`) and `vercel` (Postgres, env-var credentials) — no `if VERCEL:` checks scattered through the code.

---

## Quick start

```bash
# 1. install mise (one-time)
curl https://mise.run | sh

# 2. clone and bootstrap
git clone <repo-url> && cd agentic_bi_app_for_smb_analytics-project
mise trust
mise run venv-create
mise run inst              # installs Python (uv) + Node (pnpm) deps
mise run download-db       # pulls tmp/data.sqlite from a GitHub Release

# 3. run both dev servers (kills stale ones first)
mise run dev
```

Then open:

| URL | What |
|---|---|
| <http://localhost:3000/> | Marketing page |
| <http://localhost:3000/chat> | The chat UI |
| <http://localhost:8000/api/hello> | FastAPI health check |

Prereqs: AWS credentials with Bedrock access in `us-east-1` (`~/.aws/credentials`). A `.env` with `DB_*` vars is only needed if you want to point local queries at NeonDB instead of SQLite.

---

## Project layout

```
.
├── smb_loan_ai/              # Python package — the "brain"
│   ├── one/                  # One class (mixins: config, db, boto3, agent)
│   ├── config/               # environment-aware Config dataclass
│   ├── db_schema/            # SQLAlchemy reflection → compact LLM-friendly text
│   ├── prompts/              # the agent's system prompt (Markdown)
│   ├── sql_utils.py          # SELECT validator + Markdown-table formatter
│   ├── ai_sdk_adapter.py     # Vercel AI SDK ↔ Bedrock format translator
│   ├── quota.py              # DynamoDB-backed monthly token quota
│   └── runtime.py            # local vs vercel detection
│
├── api/index.py              # FastAPI entry — /api/chat (SSE), /api/hello
├── app/                      # Next.js 16 App Router (marketing + chat)
├── components/chat/          # chat UI (useChat, messages, input, markdown)
├── components/ui/            # ~50 shadcn/ui components
├── scripts/                  # CLI utilities (run SQL, print schema, test agent)
├── tests_python/             # pytest suite mirroring smb_loan_ai/
├── docs/
│   ├── dev-guide/            # Chinese walkthrough docs (`*-CN.md`)
│   └── learn-this-project/   # English knowledge base for new owners
└── mise.toml                 # all `mise run …` tasks
```

---

## Day-to-day commands

| Task | Command |
|---|---|
| Start everything | `mise run dev` |
| Kill stale dev servers | `mise run kill` |
| Run Python tests | `mise run test-python` |
| Coverage HTML report | `mise run cov-python` |
| Run a SQL SELECT against local SQLite | `.venv/bin/python scripts/test_run_sql_locally_cli.py --sql "SELECT * FROM customer LIMIT 5"` |
| Print the LLM-optimized schema | `.venv/bin/python scripts/test_print_database_schema.py` |
| Hit the agent without spinning up the UI | `.venv/bin/python scripts/test_agent.py` |

Full task list lives in [`mise.toml`](mise.toml).

---

## Tech stack

| Layer | What |
|---|---|
| **Frontend** | Next.js 16, React 18, `@ai-sdk/react` (`useChat`), shadcn/ui (Radix + Tailwind), `react-markdown`, `framer-motion`, `recharts` |
| **Backend** | FastAPI, Uvicorn, Pydantic, `vercel-ai-sdk-mate` (request parsing) |
| **Agent** | Strands Agents over AWS Bedrock (Claude / Nova), `boto3-dataclass[bedrock-runtime]`, `boto-session-manager` |
| **Data** | NeonDB Postgres in prod, SQLite locally, SQLAlchemy 2, custom compact schema encoder |
| **Ops** | DynamoDB (per-user quota), Vercel (Next.js + Python Serverless), mise (tasks + tool versions), uv, pnpm |
| **Tests** | pytest + coverage; Node's built-in test runner |

---

## Roadmap

The next 3–6 months of investment, prioritized:

1. **Observability** — request ids, structured logs, per-tool spans, token-cost metrics.
2. **Eval harness** — 30–50 (question, expected-SQL-shape) pairs, scored on every PR.
3. **Read-only DB user** — defense-in-depth beyond the SELECT validator.
4. **Bedrock prompt caching** — cache the system prompt + schema for cost and latency.
5. **Chart output** — `recharts` is already installed; agent should be able to answer with a chart when the question wants one.

Full breakdown with alternatives and learning paths: [`docs/learn-this-project/03-elevation-roadmap.md`](docs/learn-this-project/03-elevation-roadmap.md).

---

## Documentation

This repo ships with two parallel doc sets — read whichever fits.

**English (`docs/learn-this-project/`)** — a knowledge base for new owners, also used by interactive learning skills:

- [`01-knowhow-inventory.md`](docs/learn-this-project/01-knowhow-inventory.md) — every component + the WHY behind it
- [`02-runbook.md`](docs/learn-this-project/02-runbook.md) — install, run, test, debug
- [`03-elevation-roadmap.md`](docs/learn-this-project/03-elevation-roadmap.md) — what 3–6 more months would improve
- [`04-quiz-bank.md`](docs/learn-this-project/04-quiz-bank.md) — 100 granular Q&A items
- [`05-interview-playbook.md`](docs/learn-this-project/05-interview-playbook.md) — mock-interview questions with model answers
- [`06-demo-playbook.md`](docs/learn-this-project/06-demo-playbook.md) — how to demo this without exposing scratch material

**Chinese (`docs/dev-guide/`)** — long-form developer walkthroughs:

- [`01-overview-CN.md`](docs/dev-guide/01-overview-CN.md) · [`02-backend-walkthrough-CN.md`](docs/dev-guide/02-backend-walkthrough-CN.md) · [`03-frontend-walkthrough-CN.md`](docs/dev-guide/03-frontend-walkthrough-CN.md) · [`05-codebase-walkthrough-CN.md`](docs/dev-guide/05-codebase-walkthrough-CN.md) · [`11-agent-prompt-and-tools-CN.md`](docs/dev-guide/11-agent-prompt-and-tools-CN.md) · *(more in `docs/dev-guide/`)*

If you're using Claude Code in this repo, the five `learn-this-project-*` skills (`/learn-this-project-absorb`, `/elevate`, `/quiz`, `/interview`, `/demo`) drive interactive sessions on top of these docs.

---

<div align="center">

Built as a case study in shipping a production-grade agentic data app on a small budget.

</div>
