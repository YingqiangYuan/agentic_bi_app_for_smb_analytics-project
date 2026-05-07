# When AI Learns To Think

---

## Holy Crap, It's Actually Thinking

Today I got my first real Agent running.

Not the fake chatbot from before — that thing was just returning hardcoded responses like a glorified FAQ.

This is different.

I asked it: "What tables are in the database?"

It paused. Then — without me telling it to — it called the `get_database_schema` tool, retrieved the database structure, and explained it back to me in its own words.

Nobody told it which tool to use. It figured that out itself.

I got actual chills. This thing is **thinking**.

---

## Chatbots vs Agents: The Difference Finally Makes Sense

I've used ChatGPT and Claude a ton. They're impressive. Ask them anything and you get a pretty good answer.

But today I really understood their limitation: **they can only talk.**

Ask ChatGPT: "Can you check our default rate this quarter?"

"I'm sorry, I don't have access to your database."

It's like hiring someone who aces every interview question but can't use a computer when they actually start working. All talk, no action.

Agents are different. Agents have **tools**.

Give an Agent a database query tool? It can query your database. Give it an S3 read tool? It can pull RAG documents. Give it a report writer? It can save its analysis to a file.

And here's the kicker — you don't have to tell it "now use Tool A." It **decides on its own** which tools to use and when.

That's what makes Agents genuinely exciting.

---

## How Does It Actually Work?

But "it works" wasn't enough for me. I wanted to understand the machinery.

How does an AI decide when to call a tool? What does "thinking" even mean here?

Turns out there are two main patterns for how Agents reason:

### ReAct: Think-Act-Observe-Repeat

First pattern is **ReAct** (Reasoning + Acting).

The loop looks like:

```
Observe → Think → Act → Observe → Think → Act → ...
```

Each step is small. The AI sees some information, thinks about it, takes a tiny action, observes the result, thinks again, acts again.

Like trying to find a light switch in a dark room. Feel around, hit the wall, slide left, feel again, hit a door frame, reach up, found it.

The advantage: **flexibility**. Every step can adjust based on new information. You never go too far down the wrong path.

### Plan and Execute: Map It Out First

Second pattern is **Plan and Execute**.

The flow is:

```
Make a complete plan → Execute step by step → Done
```

The AI breaks the task into a checklist upfront, then works through it systematically.

The advantage: **stability**. For complex tasks, having a roadmap prevents getting lost in the weeds.

### Real Systems Use Both

Most production Agent frameworks **combine these approaches**.

For a complex task:
1. Use Plan mode to break it into sub-tasks
2. Within each sub-task, use ReAct for flexibility
3. If things go sideways, re-plan

It's like how good project managers work. They have a high-level roadmap, but they stay adaptable during execution. When things change, they update the plan.

**Strategic thinking + tactical flexibility.**

---

## A Concrete Example

Let me make this less abstract.

Say someone on the credit team asks the Agent: "What's the default rate of our C-grade loans last quarter?"

**Pure ReAct approach:**

```
Think: User wants default rate for C-grade loans, need to query DB
Act: Call get_database_schema to see what tables exist
Observe: Found `loan`, `risk_grade`, and `default_event` tables
Think: Need to JOIN loan with risk_grade and LEFT JOIN default_event
Act: Call execute_sql_query with the query
Observe: Result is 11.2%
Answer: "C-grade loans had an 11.2% default rate last quarter"
```

**Pure Plan-and-Execute approach:**

```
Plan:
1. Get database structure
2. Identify the tables for risk grade and defaults
3. Write SQL for last quarter's C-grade default rate
4. Return result

Execute step 1... done
Execute step 2... done
Execute step 3... done
Execute step 4... done
```

**Hybrid approach (what usually happens):**

Make a quick plan for the general direction, then ReAct flexibly within each step. If step 2 reveals the schema isn't what you expected, adjust the remaining plan on the fly.

---

## Why This Matters

Once I understood this, the power of Agents clicked.

Chatbots are "one question, one answer." You ask, it responds, done.

Agents are "one question, multiple steps." You ask a question and the Agent might go through several think-act cycles before answering. And each cycle, it's **adjusting based on what it's learning**.

Isn't that how humans solve problems?

We don't instantly know answers to hard questions. We try something, observe results, adjust course, maybe re-plan entirely...

Agents are simulating this process.

---

## The Takeaway

The big lesson isn't "I got an Agent running." It's understanding the thinking patterns underneath.

ReAct is basically: **Small steps, fast feedback.**

Don't try to do everything perfectly at once. Take one small step, see what happens, adjust, repeat.

Plan-and-Execute is: **Know where you're going before you start walking.**

Don't just charge forward blindly. Have a map.

The combination: **Have a strategy, stay flexible on tactics.**

That might be the most useful thing I've learned from this project so far.

---

## What's Next

Right now my Agent only has one tool: `get_database_schema`. It can see the structure but can't actually query data.

Next up: adding the `execute_sql_query` tool so it can run queries.

Then I'll have an AI assistant that actually answers questions from real lending data.

Can't wait.
