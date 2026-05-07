# Good Enough Is Good Enough

---

## The Problem: An LLM With Database Access

The Agent can finally query the database. Awesome.

But there's a real concern lurking in the background: **the LLM writes the SQL itself.**

Right now the system prompt tells it "only generate SELECT queries." That works most of the time. But "most of the time" doesn't cut it when the database holds real lending data.

What happens if some user prompt manipulates the Agent into writing:

```sql
DELETE FROM loan WHERE risk_grade_id = 5;
```

Or worse, hallucinates a "cleanup" query like:

```sql
TRUNCATE TABLE payment;
```

A prompt isn't enforcement. It's a polite request.

So my strategy: **never trust the SQL the LLM produces. Validate it on the Python side before it touches the database.**

---

## The "Right" Way vs The "Right Now" Way

Before coding, I researched the "proper" approach.

Full production architecture for SQL safety looks something like:

```
Agent (Bedrock)
    ↓
Calls a stored procedure / parameterized API
    ↓
IAM Role restricts the Agent to a read-only DB role
    ↓
Database role has SELECT-only on specific tables, no DDL, no DML
    ↓
All queries logged to a separate audit pipeline
```

This is solid:
- Database-level permissions are the real defense
- IAM ties identity to capability
- Audit logs survive even if the Agent goes rogue

But I thought about it and realized: **I don't need this level of complexity right now.**

I'm still iterating on the Agent itself. Database is SQLite locally, Postgres on NeonDB for the deployed version. What I actually need:

1. Block obviously dangerous SQL (no UPDATE, DELETE, DROP, TRUNCATE)
2. Make sure LLM hallucinations don't corrupt data
3. Move fast, don't get stuck on ops

Database-role separation can wait.

---

## The 99% Solution

So I went with the simplest thing that could work:

**A Python validator. Twenty lines of code.**

```python
def ensure_valid_select_query(query: str) -> None:
    parsed = sqlparse.parse(query)
    if len(parsed) != 1:
        raise ValueError("Only one statement allowed.")
    stmt = parsed[0]
    if stmt.get_type() != "SELECT":
        raise ValueError(f"Only SELECT allowed, got: {stmt.get_type()}")
    # ...etc
```

Every SQL the Agent generates passes through this before execution. Three checks:

1. **Single statement only** — no SQL injection via stacked queries
2. **SELECT only** — no UPDATE / DELETE / DROP / anything destructive
3. **Parameterized binding** — no raw string interpolation anywhere

This eliminates 99% of potential problems:
- Agent hallucinates a DROP → blocked at the gate
- Prompt injection tries to slip in a DELETE → blocked
- Multi-statement attack with `;` → blocked

The remaining 1% (defense-in-depth at the DB layer)? I'll handle that when this actually goes to production.

---

## An Analogy That Clicked

My mentor put it this way:

> "The Agent is the eyes and mouth — it can see and talk, but it shouldn't touch."
> "The validator is the hand on its shoulder — checks every move before it lands."

This helped me understand the layering:

- The brain can make mistakes (LLM hallucinations)
- But the validator checks before anything runs
- Even if the LLM gets something wrong, the validator stops it

This is **defense in depth**. Don't rely on any single point being correct. Put checks at multiple layers.

---

## The Takeaway

In the past, I would've agonized over this. "This isn't perfect. No DB roles. No audit pipeline. Not 'production-grade.'"

But this time I learned something:

**Perfectionism kills momentum.**

I know the full solution. I know how to make it better.

But I chose the "good enough" solution because:

1. It handles 99% of the threat surface
2. It lets me keep moving
3. It doesn't block future improvements
4. I can upgrade anytime

Sometimes "good enough" really is good enough.

This isn't cutting corners. It's **making a trade-off**.

Use minimum effort to eliminate maximum uncertainty. Leave the rest for Future Me, who'll have more context anyway.

---

## What's Next

SQL is now safe-ish. The Agent can query without me losing sleep over it.

Next problem: the Agent runs locally, against a SQLite file. Cool for dev. Useless for the team.

Time to put the data somewhere everyone can reach — without spinning up a full RDS cluster on day one.
