# One File, Ten Tables

---

## What I Thought Databases Were

Before today, here's what "database" meant to me:

- MySQL, PostgreSQL, Oracle — intimidating names
- Installing servers, configuring ports, setting up users and permissions
- Something that costs money and requires a DBA
- Basically enterprise stuff that's overkill for learning projects

So when my mentor said "we're connecting to a database today," I braced myself for pain.

Then this happened.

---

## Wait, That's It?

My mentor had me run one command:

```bash
mise run download-db
```

A file downloaded. A single `.sqlite` file in the `tmp/` folder.

"That's the database."

I blinked. No server? No Docker? No config files?

I opened it in DBeaver and there it was — tables, data, relationships, everything. I could literally copy this file to a USB drive, plug it into another computer, and it would just work.

It's like I expected to install some complicated home theater system and instead got handed an iPad that just plays Netflix.

**This is what they mean when they say SQLite "just works."**

No ops. No deployment. Just a file.

---

## Ten Tables That Tell a Story

Inside the database, I found 10 tables:

- `industry` — Industry categories (restaurant, tech, construction, etc.)
- `risk_grade` — Risk tiers A through E
- `loan_status` — Status codes (pending, approved, current, defaulted, paid off...)
- `loan_officer` — The credit team handling applications
- `customer` — The small businesses applying for loans
- `application` — Every loan application that comes in
- `loan` — Approved applications that became actual loans
- `repayment_schedule` — The planned monthly payments per loan
- `payment` — What customers actually paid
- `default_event` — When things went south

This is data for an SMB lending operation. Basically: small businesses apply for loans, get approved or rejected, pay back monthly, and either finish clean or default.

Sounds simple when you say it like that. But in reality? There's a ton going on. Who's borrowing? What industry? What risk grade? Are they paying on time? Did they miss a payment three months ago?

Overwhelming if you try to think about it all at once.

But split into 10 tables, each one becomes digestible:

- `customer` just tracks who the borrowers are
- `application` tracks the request to borrow
- `loan` tracks what actually got disbursed
- `payment` tracks money coming back in

Each table does one thing. Tables connect through IDs.

This is why relational databases organize data into tables. Not to be complicated — to be *organized*.

**Break down the chaos into manageable pieces.**

---

## Two Kinds of Simple

This lesson showed me simplicity works on multiple levels.

**Level 1: Simple tools.**

SQLite turns a database into a file. No server to install, no ports to configure, no credentials to manage. Download and go.

This kind of simplicity removes friction. I can focus on understanding the data instead of wrestling with infrastructure.

**Level 2: Simple design.**

The 10-table structure makes a complex business comprehensible. Instead of facing a tangled mess, I explore one table at a time.

This kind of simplicity creates clarity. Complex problems become solvable when you can break them into parts.

Both levels matter. Good tools let you focus on the actual problem. Good design makes the problem approachable.

---

## The Takeaway

I used to think "simple" meant dumbed down. Fewer features, less power.

Now I see "simple" as a design achievement. It takes work to make complex things feel easy.

SQLite's creator made a database that fits in a file. That's not laziness — that's brilliance.

Whoever designed this lending schema split a tangled business into 10 clean tables. That's not oversimplification — that's clarity.

> **Simplicity isn't a compromise. It's a skill.**

That's probably the biggest thing I'm taking from today.

---

## What's Next

Got the data. Now I need to learn how to query it.

`SELECT * FROM table LIMIT 5` is just the warm-up. Next comes `WHERE`, `JOIN`, `GROUP BY`...

But I'm not intimidated anymore. The tables are all laid out. I know what each one does.

One query at a time.
