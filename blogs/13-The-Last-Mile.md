# The Last Mile

---

## "Works On My Machine"

"Works on my machine."

Every developer has said this at least once. Usually as an excuse.

Before today, my Agent was in exactly this state. Run some test scripts in the terminal, everything works great. Agent queries the database, writes reports, answers questions about the lending portfolio.

But here's the problem: **Only I can use it.**

What does a credit analyst think when they see a command line? "What is this? How do I use it?"

There's a massive gap between "runs in terminal" and "users can actually use it."

---

## Working vs Usable

Engineers easily fall into this trap: **code works = done.**

But users don't care if your code runs. Users care about:
- How do I interact with this?
- What do I see?
- How do I know what it's doing?

This is the difference between engineering thinking and product thinking.

Engineering thinking asks: "Does it work?"
Product thinking asks: "Can users use it?"

Working ≠ usable.

An Agent that runs blazingly fast in the terminal is invisible to users without a UI.

---

## Give Users Choice

Today I connected the Agent to a web UI. Users type in a chat interface, Agent responds.

But that's not enough.

Agents aren't regular chatbots. They "think" — analyze the question, query the schema, write SQL, look at results, reason through them. All this intermediate thinking — should users see it?

My first instinct: nah, too messy. Just show the final answer.

But then I thought about it from a different angle: **If I were a credit analyst getting a number back from this thing, would I want to see how it got there?**

Answer: **Sometimes yes, sometimes no.**

If I just want a quick answer, I don't want to wade through reasoning steps.
But if the answer seems off, or I want to verify the SQL, I need to see the process.

Especially in lending — where the answer drives a decision about real money — being able to audit "how did you get this?" is critical.

Best design: **Give users the choice.**

---

## The Collapsible Thinking Block

We built a collapsible "Thinking" section:

- Collapsed by default, shows just the final answer
- User wants details? Click to expand
- Don't care? Leave it collapsed

```tsx
const ReasoningBlock = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-amber-200 rounded-lg bg-amber-50">
      <button onClick={() => setIsExpanded(!isExpanded)}>
        <span>Thinking</span>
      </button>
      {isExpanded && <div>{text}</div>}
    </div>
  );
};
```

Code is simple. Design philosophy is the point:

**Don't decide for users. Give them options.**

Some users just want answers. Some want to see the work — the SQL, the JOIN logic, the assumptions. Both preferences are valid. Good products don't force one way — they let users choose.

---

## Separation of Concerns

This design has another benefit: **it separates "thinking" from "result."**

The Agent's raw output was all mixed together — a bunch of `<thinking>` tags wrapping reasoning, followed by the final answer.

We processed it on the backend:

```python
# Extract all thinking content
all_thinking = []
for msg in messages:
    thinking_matches = re.findall(r"<thinking>(.*?)</thinking>", text)
    all_thinking.extend(thinking_matches)

# Get just the answer from the last message
final_answer = re.sub(r"<thinking>.*?</thinking>", "", last_text)
```

Separate thinking from answer, render them differently on the frontend:
- Thinking → collapsible block
- Answer → regular display

**Separation of concerns** — basic software design principle, applies to product design too.

---

## Product Thinking

Looking back at this feature, the key isn't the technical implementation. It's the mindset shift.

I asked myself: what does the user actually want?

Users want:
1. Usable (not a command line)
2. Understandable (not walls of gibberish)
3. Choice (see details if wanted, hide if not)

That's product thinking. Thinking from the user's perspective.

Engineers naturally think from their own perspective: "This implementation is so elegant! This architecture is so clean!"

Users don't care about elegant implementations. Users care: **Can I use this? Is it easy to use?**

---

## Shipping vs Finishing Code

One more thing hit me today.

Before this internship, a lot of my code stayed at the "demo" stage. It runs. But nobody uses it.

This time is different. The Agent has a real interface. The team I'm embedded with can open a browser, go to the URL, start chatting.

**It's not a script anymore. It's a product.**

That feels different.

Writing code is easy. Making products is hard. Code just needs to work for machines. Products need to work for people.

Shipping isn't "code is done." It's "users can use it."

---

## The Takeaway

Most important lesson today:

> **Between "it runs" and "users can use it" is a gap called "product."**

Crossing that gap doesn't require more code. It requires different thinking:

- From "how my code works" to "how users will use it"
- From "feature complete" to "experience friendly"
- From "I think it's good" to "users think it's good"

That's the shift from engineering thinking to product thinking.

---

## What's Next

Agent works in a browser now. But there's still one problem: **it only runs locally.**

localhost:3000 — only I can access it.

Next step: deploy to the cloud so anyone with a link can use it.

From "works on my machine" to "works for the whole team." That's another gap to cross.
