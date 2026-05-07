# When The Window Opened

---

## The Worst Way to Learn SQL

You know the most boring way to learn SQL?

Memorizing syntax like vocabulary flashcards.

`SELECT`, `WHERE`, `JOIN`, `GROUP BY`, `HAVING`... stuff it all in your head, do some practice problems, forget everything after the exam.

I've been there. It sucks.

This time I tried something different: **start with a real problem, learn the syntax you need to solve it.**

Imagine you're a credit analyst on the lending team. Every day you need answers:

- "Which loans are missing payments right now?"
- "What's the default rate for C-grade restaurant borrowers?"
- "How did Borrower #412 pay last month?"

You need to pull data. SQL is your tool.

When you learn syntax this way, everything has a reason.

`WHERE` isn't just "a keyword for filtering data" — it's *how I find loans that defaulted*.

`JOIN` isn't just "connecting tables together" — it's *how I match a loan to its customer's industry*.

**Learn something → Solve a real problem → Feel accomplished → Repeat.**

Way better than grinding through abstract exercises.

---

## Then I Hit a Wall

Everything was going great until I hit window functions.

The problem: For each loan, find its **most recent** payment.

Sounds easy, right? But each loan has many payments (one per month). I only want the latest one for each loan.

My first instinct: `GROUP BY`.

But `GROUP BY` has a limitation. It only returns the grouped column and aggregate values. I needed specific values — payment amount, days late, payment method — not just "max payment_date."

Enter window functions.

```sql
ROW_NUMBER() OVER (
    PARTITION BY loan_id
    ORDER BY payment_date DESC
) AS rn
```

I stared at this for way too long.

What the hell is `OVER`? What's `PARTITION BY` doing? Why is there an `ORDER BY` inside the parentheses?

My brain was fried.

---

## The Aha Moment

The breakthrough came when I found the right mental model.

**Think of "window" literally. Like a window into each loan's payment history.**

Picture this: you have a giant table of payments for 2,000 loans. All mixed together.

`PARTITION BY loan_id` **slices that big table into 2,000 windows** — one window per loan. Like putting dividers between sections.

Then **within each window**, `ORDER BY payment_date DESC` sorts that loan's payments newest-first, and `ROW_NUMBER()` numbers them: 1, 2, 3...

So the most recent payment for each loan gets numbered 1.

Finally, `WHERE rn = 1` — keep only the rows numbered 1.

**Each loan's latest payment. Done.**

But here's what really made it click: **I ran it with and without `PARTITION BY`.**

First, I removed `PARTITION BY` completely. Made the whole table one giant window.

Ran the query. Every row in the entire table got numbered sequentially: 1, 2, 3... all the way to the end.

Then I added `PARTITION BY` back. Ran it again.

Now each loan's payments got numbered *separately*. Loan A: 1, 2, 3. Loan B: 1, 2, 3. Loan C: 1, 2, 3.

**Seeing both results side by side — that's when it clicked.**

---

## Why Tinkering Beats Reading

This reminded me why programming is such a great way to learn things.

If I'd just read tutorials about window functions, I'd probably end up in "I think I get it" limbo forever. That fake understanding where you can nod along but couldn't actually use it.

But when I changed the code and saw the results immediately? That "OHHH, that's what it does" moment is unbeatable.

**Programming gives you instant feedback.**

Change one thing, see what happens. No waiting for a teacher to grade your work. No wondering if you understood correctly. The computer tells you: right or wrong.

This feedback loop is like a cheat code for learning. You can iterate dozens of times in an hour, each time getting a little closer to understanding.

---

## The Takeaway

Looking back, the real lesson isn't about SQL syntax. It's about how to learn:

> **Learning through problems beats learning through outlines.**

When you have a real problem to solve, your brain filters out the noise. You focus on what actually matters: how do I solve this?

Syntax stops being trivia to memorize and becomes tools to wield.

My approach from now on:

1. Find a real problem
2. Learn just enough to take a stab at it
3. Try it, see what happens
4. When stuck, simplify and verify one piece at a time

Window functions felt impossible at first. But I cracked them.

Not by being smart. By **being willing to experiment and break things down.**

---

## What's Next

SQL basics: done. Now it's time to let the AI Agent handle the querying.

Because honestly, I don't want to write SQL by hand every time someone on the team needs an answer. I want them to ask in plain English and let the Agent figure out the query.

That's the whole point of building an Agent: **They talk, it works.**

Let's go.
