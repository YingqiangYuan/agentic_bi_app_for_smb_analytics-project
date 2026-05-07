# Before And After

---

## The Trust Problem

The Agent answers questions now. Looks impressive in demos.

"What's our overall default rate?" → 6.8%
"How many C-grade loans defaulted last quarter?" → 17
"Which industry has the highest concentration?" → Restaurants, 28%

Numbers come back. They sound right. But...

**How do I actually know they're right?**

Demos are the easy part. Anyone can ask a question and get a confident-sounding answer. The hard part is being able to say "yes, this Agent's output is reliable enough to drive lending decisions."

That's the testing question I had to figure out today.

---

## But How Do You Test This?

Normal functions are easy. Input 1 + 1, expect 2. Same every time.

But an Agent? Ask it "what's the default rate of C-grade loans?" and:

- First run: it might query `loan` first, then JOIN `default_event`
- Second run: pull `default_event` first, then JOIN back to `loan`
- Third run: completely different SQL with a CTE

Path is non-deterministic. The exact SQL changes every run.

Result should be the same — but the path won't be.

This breaks the way I usually write tests:

```python
assert agent("default rate of C-grade") == "11.2%"  # works sometimes
assert agent_sql == "SELECT ... GROUP BY rg.id"     # never works — SQL is different every time
```

---

## Before, Action, After

After thinking about it, I landed on a simple framework:

> **Don't test the path. Test the outcome.**

Three steps:

1. **Before**: Set up a known database state with a known answer
2. **Action**: Ask the Agent a question
3. **After**: Verify the answer matches what we know is true

For testing "default rate of C-grade loans":

| Step | What to do | What to verify |
|------|------------|----------------|
| Before | Seed the test DB: 10 C-grade loans, 2 with default_event records | Confirm the ground truth: 20% default rate |
| Action | Ask the Agent "what's the default rate for C-grade loans?" | Tool calls happened, no errors |
| After | Parse the Agent's answer | Answer contains "20%" (within tolerance) |

The beauty of this approach:

**I don't care how the Agent got there. I only care that the answer matches reality.**

Agent wants to use a CTE? Fine. Want to write three separate queries and combine in Python? Also fine. As long as the final number is 20%, it's correct.

---

## Allow Some Wiggle Room

One trick I picked up: don't assert exact strings.

LLMs vary in how they phrase answers:

- "The default rate is 20%."
- "C-grade loans default 20% of the time."
- "20% of C-grade loans defaulted."

All correct. All worded differently.

So tests check for the *number* and the *tolerance*, not the exact sentence:

```python
import re
match = re.search(r"(\d+(?:\.\d+)?)\s*%", agent_response)
assert match is not None
assert abs(float(match.group(1)) - 20.0) < 0.5  # 0.5% tolerance
```

You're testing analytical correctness, not prose style.

---

## The Audit Question

Testing problem: solved.

But then another thought hit me:

**Tests catch things in dev. Production runs don't have asserts.**

Once this Agent is deployed and people start asking real questions, how do we know its answers are still correct? Bad data, schema drift, prompt regressions — anything could quietly break it.

Without records, it's like a plane with no black box.

I looked into it. This domain is called **Governance** or **Observability**. The core ideas:

1. **Logging** — Every question, every SQL, every result, every timestamp
2. **Spot-checking** — Sample N% of answers daily and re-run them by hand
3. **Drift detection** — When yesterday's "default rate is 6.8%" suddenly becomes "11%", something changed

The Strands framework already has audit hooks. You can pipe logs to S3, CloudWatch, whatever.

---

## Know What, But Not Now

I didn't implement the audit pipeline.

Not because I forgot — I thought about it and decided not to.

Reason is simple: **My current goal is mastering the Agent's core mechanics.**

Audit is a production problem. Before I've nailed the fundamentals — prompting, tools, testing — adding production observability is putting the cart before the horse.

But I documented the thinking.

Because I know: when this gets used by real people making real lending decisions, observability is non-negotiable. Not doing it now doesn't mean it doesn't matter. It's a prioritization call.

**Knowing what needs to be done is more important than doing everything right now.**

---

## The Takeaway

Biggest lesson today:

> **Testing a non-deterministic system: don't test the path, test the outcome. Question → Action → Result.**

This framework applies way beyond Agents. Anything where the same input produces different intermediate behavior but should produce the same final answer:

- LLM outputs in general
- Search/recommendation systems
- Any AI-driven analytics

Simple frameworks tend to be the most useful.

---

## What's Next

The Agent reads, queries, and now I can verify its answers. But it still only lives in the terminal.

Next step: connect it to the frontend so the team can chat with it through a web interface.

From command-line tool to web app — that's another level up.
