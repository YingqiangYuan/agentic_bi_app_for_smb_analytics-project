# From Doer to Manager

---

## I Was Asking the Wrong Question

My first instinct was: How do I teach AI to write SQL?

I started drafting rules in my head. "Use JOIN when you see this pattern." "Name columns with underscores." "Put WHERE clauses here..."

Then it hit me — I was thinking about this completely backwards.

AI doesn't need me to teach it SQL. Claude and GPT-4 know SQL better than I ever will. They've seen more SQL than any human has ever written.

The actual problem is: **AI doesn't know what MY database looks like.**

It has no idea what tables I have, what the columns are called, how things relate to each other. I ask it to "find all defaulted loans from the restaurant industry" and it's like... what's a loan? Is there a default flag? What table holds the industry? What's the column called in your schema?

So the real question isn't "how do I teach AI to do the work."

It's **"how do I give AI the information it needs to do the work."**

---

## A Shift in Mindset

This reframing changed how I think about working with AI.

When I used to code, I was the doer. I wrote the functions. I called the APIs. I debugged the errors.

With AI, I'm becoming more like a manager. I'm not writing SQL anymore — I'm **setting up the context** so AI can write correct SQL.

Think about what good managers do.

They don't micromanage every step. They:
- Define the goal clearly
- Provide the necessary background
- Explain the constraints
- Then get out of the way

That's exactly what working with AI looks like.

AI is smart. It doesn't need hand-holding. What it needs is context.

---

## Compress, Don't Teach

That's what this lesson was really about: compressing database schema into a format AI can consume efficiently.

The raw DDL looks like this:

```sql
CREATE TABLE customer (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    business_name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(20) NOT NULL,
    industry_id INTEGER NOT NULL,
    credit_score INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (industry_id) REFERENCES industry(id)
);
```

Compressed, it becomes:

```
Table customer(
  id:int*PK,
  business_name:str*NN,
  tax_id:str*NN,
  industry_id:int*NN*FK->industry.id,
  credit_score:int*NN,
  created_at:ts*NN,
)
```

70% fewer tokens. Same information.

This isn't "teaching" AI what primary keys are — it already knows. This is **efficient information transfer**.

Like how a good manager doesn't send 10-page requirement docs. They send one page with the key points. High signal, low noise.

---

## The Real Skill

Here's what I'm realizing: the most important skill in the AI era might not be coding.

It might be **organizing and communicating information**.

Think about great communicators. They speak clearly. They say what needs to be said and nothing more. No filler.

That skill used to be mainly for human-to-human communication. Now it's human-to-AI.

A lending database can have hundreds of columns across dozens of tables — way more than you could explain verbally. But AI needs this information to work effectively.

So we build systems to do it:
1. **Extract** — pull metadata from the database
2. **Model** — structure it into clean data models
3. **Encode** — compress it into token-efficient text

This pattern will keep showing up. Passing code context to AI. Conversation history. Business rules. It's all the same problem: **compressing information into a format AI can process efficiently**.

---

## The Takeaway

The real lesson isn't about schema extraction.

It's about a paradigm shift:

> **Don't think about teaching AI. Think about feeding AI context.**

AI is capable enough. What it lacks is information about YOUR specific situation.

This is the transition from doer to manager.

I used to care about "how do I do this." Now I care about "what information does AI need to do this."

Different question. Different way of working.

---

## What's Next

Schema's ready. Next up is plugging it into the Agent.

Let the AI understand the database structure, then write correct SQL based on natural language questions.

Text-to-SQL, here we come.
