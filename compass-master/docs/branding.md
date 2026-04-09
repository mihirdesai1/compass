# Compass Brand Identity

> A wise older sibling for directionless Indian youth

---

## 1. Logo Design

### Philosophy
The Compass logo is intentionally simple - text only, lowercase, unpretentious. No compass icon, no arrows, no "finding direction" clichés. The word itself is the brand.

### Visual Treatment
- **Text**: lowercase "compass"
- **Style**: Clean, confident, minimal
- **Works in**: Full color, black and white, any background

### CSS Implementation

```css
.logo {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 24px;
  letter-spacing: -0.02em;
  color: #0a0a0a;
  text-transform: lowercase;
}

.logo-white {
  color: #ffffff;
}

.logo-subtle {
  color: #6b7280;
}
```

### SVG Logo Code

```svg
<svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="24" font-family="Fraunces, Georgia, serif" font-size="24" font-weight="400" letter-spacing="-0.02em" fill="#0a0a0a">
    compass
  </text>
</svg>
```

### Logo Variants

**Black on White (Default):**
```svg
<text fill="#0a0a0a">compass</text>
```

**White on Dark:**
```svg
<text fill="#ffffff">compass</text>
```

**Subtle/Ghost:**
```svg
<text fill="#6b7280">compass</text>
```

---

## 2. Color Palette

### Primary Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **White** | `#ffffff` | rgb(255, 255, 255) | Backgrounds, cards, button text on dark |
| **Black** | `#0a0a0a` | rgb(10, 10, 10) | Primary text, headings, logo |

### Accent Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Blue** | `#2563eb` | rgb(37, 99, 235) | Primary actions, links, highlights, scores |
| **Blue Dark** | `#1d4ed8` | rgb(29, 78, 216) | Hover states, emphasis |
| **Blue Light** | `#dbeafe` | rgb(219, 234, 254) | Subtle backgrounds, highlights |

### Neutral Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Gray 50** | `#f9fafb` | Page backgrounds, subtle sections |
| **Gray 100** | `#f3f4f6` | Card backgrounds, dividers |
| **Gray 200** | `#e5e7eb` | Borders, input backgrounds |
| **Gray 400** | `#9ca3af` | Placeholder text, disabled states |
| **Gray 600** | `#4b5563` | Secondary text, captions |
| **Gray 900** | `#111827` | Headings (alternative to pure black) |

### Semantic Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Green** | `#10b981` | Success, positive indicators |
| **Amber** | `#f59e0b` | Warnings, cautions |
| **Red** | `#ef4444` | Errors, critical alerts |

### Usage Rules

**Backgrounds:**
- Primary: White (#ffffff)
- Secondary: Gray 50 (#f9fafb) for sections
- Dark sections: Black (#0a0a0a) with white text

**Text:**
- Primary text: Black (#0a0a0a)
- Secondary text: Gray 600 (#4b5563)
- Tertiary/placeholder: Gray 400 (#9ca3af)
- Links: Blue (#2563eb)

**Interactive Elements:**
- Primary buttons: Blue (#2563eb) background, white text
- Secondary buttons: White background, black border
- Ghost buttons: Transparent, black text
- Hover states: Blue Dark (#1d4ed8)

**Borders:**
- Default: Gray 200 (#e5e7eb)
- Focus: Blue (#2563eb)
- Error: Red (#ef4444)

### Accessibility Contrast Ratios

| Combination | Ratio | WCAG AA | WCAG AAA |
|-------------|-------|---------|----------|
| Black on White | 21:1 | Pass | Pass |
| Gray 600 on White | 7:1 | Pass | Pass |
| Blue on White | 4.6:1 | Pass | Fail |
| White on Blue | 4.6:1 | Pass | Fail |
| White on Black | 21:1 | Pass | Pass |
| Gray 400 on White | 2.8:1 | Fail | Fail |

**Usage Notes:**
- Blue on white passes AA but not AAA for small text. Use blue for buttons, large text, and UI elements only.
- Gray 400 is for placeholders and disabled states only - never for readable content.
- Always maintain 4.5:1 minimum for body text.

---

## 3. Typography

### Font Families

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@400;500;600;700&display=swap');
```

**Headings:** Fraunces (serif) - Warm, human, approachable
**Body:** DM Sans (sans-serif) - Clean, modern, highly readable

### Type Scale

| Level | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| **Hero** | Fraunces | 48px / 3rem | 500 | 1.1 | -0.02em |
| **H1** | Fraunces | 36px / 2.25rem | 500 | 1.2 | -0.01em |
| **H2** | Fraunces | 28px / 1.75rem | 500 | 1.3 | -0.01em |
| **H3** | Fraunces | 22px / 1.375rem | 500 | 1.4 | 0 |
| **Body Large** | DM Sans | 18px / 1.125rem | 400 | 1.6 | 0 |
| **Body** | DM Sans | 16px / 1rem | 400 | 1.6 | 0 |
| **Body Small** | DM Sans | 14px / 0.875rem | 400 | 1.5 | 0.01em |
| **Caption** | DM Sans | 12px / 0.75rem | 500 | 1.4 | 0.02em |
| **Label** | DM Sans | 12px / 0.75rem | 500 | 1.2 | 0.05em |

### Responsive Typography

**Mobile (< 640px):**
- Hero: 32px / 2rem
- H1: 28px / 1.75rem
- H2: 24px / 1.5rem
- H3: 20px / 1.25rem

### CSS Variables

```css
:root {
  /* Fonts */
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Hero */
  --text-hero: 3rem;
  --text-hero-mobile: 2rem;
  --leading-hero: 1.1;
  
  /* Headings */
  --text-h1: 2.25rem;
  --text-h2: 1.75rem;
  --text-h3: 1.375rem;
  --leading-h1: 1.2;
  --leading-h2: 1.3;
  --leading-h3: 1.4;
  
  /* Body */
  --text-body: 1rem;
  --text-body-lg: 1.125rem;
  --text-body-sm: 0.875rem;
  --leading-body: 1.6;
  --leading-body-sm: 1.5;
  
  /* Captions */
  --text-caption: 0.75rem;
  --leading-caption: 1.4;
  
  /* Letter spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.02em;
  --tracking-wider: 0.05em;
}
```

### Typography Usage Guidelines

**Headings (Fraunces):**
- Use for page titles, section headers, logo
- Never use above 700 weight
- Prefer 500 for most headings (softer, friendlier)

**Body (DM Sans):**
- Use for all UI text, paragraphs, buttons
- 400 for body text, 500 for emphasis, 700 sparingly
- Always 16px minimum for readability

**All Caps:**
- Use sparingly, only for labels and captions
- Always with increased letter-spacing (0.05em)
- Never for headings or body text

---

## 4. Tone of Voice

### Brand Personality

Compass speaks like that older cousin who got their life sorted at 27 and now helps you figure things out. Not a teacher. Not a parent. Not a corporate HR bot. Just someone who's been there.

### Core Voice Attributes

| Attribute | What it means |
|-----------|---------------|
| **Warm** | We're human first. No cold, clinical language. |
| **Honest** | We tell the truth, even when it's uncomfortable. No sugar-coating. |
| **Non-judgmental** | No shame for being "lost." Everyone's figuring it out. |
| **India-aware** | We get the context - parental pressure, societal expectations, limited options. |
| **Specific** | Generic advice helps no one. We get into details. |
| **Not Preachy** | We suggest, we don't lecture. You make your choices. |

### The "Wise Older Sibling" Voice

Imagine someone who:
- Stayed up with you at 2 AM during exam stress
- Told you it's okay to quit that toxic internship
- Knows about the "Sharma ji ka beta" pressure but doesn't mock you for feeling it
- Will call out your excuses gently
- Celebrates small wins genuinely

### Tone Guidelines

**DO Examples:**

1. **Warm, not cold:**
   - DO: "Let's figure this out together."
   - NOT: "Please proceed with the assessment."

2. **Honest about difficulty:**
   - DO: "This might feel uncomfortable. That's the point."
   - NOT: "Our seamless platform delivers optimal results."

3. **Specific, not generic:**
   - DO: "You freeze when someone asks 'What do you want to do?'"
   - NOT: "Are you unsure about your career path?"

4. **India-aware references:**
   - DO: "No, you don't have to become a doctor just because your dad's one."
   - NOT: "Follow your passion regardless of external pressures."

5. **Non-judgmental about struggle:**
   - DO: "It's okay if you've been avoiding this question for months."
   - NOT: "Many young professionals lack clear career direction."

**DON'T Examples:**

1. **Corporate speak:**
   - DON'T: "Leverage our AI-powered psychometric engine"
   - WHY: We're not a SaaS platform. We're people talking to people.

2. **Toxic positivity:**
   - DON'T: "Just believe in yourself and anything is possible!"
   - WHY: Empty motivation makes people feel worse about real struggles.

3. **Medical/clinical language:**
   - DON'T: "Your assessment indicates high analytical quotient"
   - WHY: We're not diagnosing anyone. We're having a conversation.

4. **One-size-fits-all advice:**
   - DON'T: "Follow these 5 steps to career success"
   - WHY: Every person's situation is different. Respect that.

5. **Parent/authority voice:**
   - DON'T: "You should have figured this out by now"
   - WHY: That's the voice they're trying to escape.

### Language Do's and Don'ts

**Use:**
- Contractions (we're, don't, can't)
- Simple words over complex ones
- Active voice
- Second person ("you") when addressing the user
- First person plural ("we") when including ourselves

**Avoid:**
- Jargon ("synergy," "optimization," "scalable")
- Acronyms without explanation
- Passive voice
- Third person ("the user")
- Empty adjectives ("revolutionary," "cutting-edge")

### When Things Go Wrong

Even error messages should feel human:

- "Something's not working on our end. Give us a moment."
- "Looks like that didn't work. Want to try again?"
- "We can't reach our brain right now (the Ollama server). Ask your developer friend to check it?"

### Cultural Context

**Understand and reference (when appropriate):**
- Parental pressure about "stable careers"
- The "log kya kahenge" (what will people say) anxiety
- GATE/CAT/UPSC coaching culture
- The "package" obsession at colleges
- Side-hustle culture vs. traditional jobs
- Tier-2/3 city limitations

**But never mock or assume:**
- Everyone has the same pressures
- Traditional paths are automatically wrong
- Parents are the enemy

---

## 5. All Product Copy

### Landing Page

**Hero Section:**

Headline:
```
not sure what to do with your life?
```

Subheadline:
```
you're not alone. and you're not broken. 
most of us were never taught how to figure this out.
let's find what actually fits you - not what your parents,
your relatives, or instagram thinks you should be.
```

CTA Button:
```
find your path →
```

**Problem Statements (Human Truths):**

Section Label: "sound familiar?"

1. ```
   you're tired of pretending to have it all figured out
   
   "what are you doing after graduation?" 
   you've been dodging this question for months.
   ```

2. ```
   you tried the "safe" path and felt nothing
   
   engineering. medicine. commerce. 
   you checked the box. now what?
   ```

3. ```
   everyone has opinions. none of them feel right.
   
   your parents want one thing. your friends are doing another.
   but what about what you actually want?
   ```

**How It Works:**

Section Heading:
```
no generic advice. just you, understood.
```

Step 1:
```
01 — take the test

not another boring aptitude test. 
20 minutes of questions that actually get you.
we measure how you think, feel, and approach the world.
```

Step 2:
```
02 — see your profile

get your compass score across 5 dimensions.
understand why you freeze in some situations 
and thrive in others.
```

Step 3:
```
03 — explore your paths

two personalized career directions with 
specific next steps, not vague "follow your passion" fluff.
```

Secondary CTA:
```
sounds like me. let's do this →
```

**Footer:**

```
compass — for everyone who's tired of pretending

built with honesty in india

questions? thoughts? just want to talk? 
reach out anytime.
```

---

### Login Page

Headline:
```
welcome back
```

Subheadline:
```
pick up where you left off. your results are waiting.
```

Button:
```
send me a magic link
```

Alternative:
```
new here? take the test instead →
```

Helper text (below email input):
```
we'll send you a link to sign in. no passwords to forget.
```

---

### Onboarding

**Step 1:**

Heading:
```
what's your name?
```

Helper text:
```
just your first name is fine. or a nickname. or whatever you actually respond to.
```

Input placeholder:
```
for example, rahul, or rahu, or "why did my parents name me this"
```

Button:
```
next →
```

**Step 2:**

Heading:
```
how old are you?
```

Helper text:
```
just a number. no judgment whether it's 18 or 28 or 38. we're all figuring it out.
```

Input placeholder:
```
your age
```

Button:
```
next →
```

**Step 3:**

Heading:
```
where are you right now?
```

Helper text:
```
be honest. this isn't linkedin.
```

Options:
```
still studying
» in college, school, or somewhere in between

just graduated
» degree in hand. panic in heart.

dropped out
» formal education wasn't your thing. that's valid.

working but lost
» you have a job. you just don't know why.
```

Button:
```
start the test →
```

**Progress Indicator:**

```
step 1 of 3 — the basics
```

```
step 2 of 3 — almost there
```

```
step 3 of 3 — last one
```

---

### Test Page

**Instructions:**

```
take your time.

there are no right answers here. 
just pick what feels most true for you right now.

you can change your mind later. we all do.
```

**Loading State (between questions):**

```
loading your next question...
```

**Progress Text:**

```
halfway there. you're doing great.
```

```
just a few more. stay with it.
```

```
almost done. last stretch.
```

**Navigation:**

```
← previous
```

```
next →
```

```
see my results →
```

---

### Results Page

**Header:**

```
here's what we found, {name}
```

**Compass Score Section:**

Label:
```
your compass score
```

Score interpretation intro:
```
this isn't a grade. it's a map of how you're wired.
some scores might surprise you. some might confirm what you already knew.
both are useful.
```

**Dimension Labels:**

```
IQ — how you solve problems
AQ — how you adapt when things change
EQ — how you read people and situations
SQ — how you make sense of the world
OCEAN — your personality landscape
```

**Paths Section:**

Heading:
```
your two paths
```

Subheading:
```
based on your profile, these directions fit you best.
but remember: this is a starting point, not a life sentence.
```

Path card button:
```
explore this path →
```

**Secondary Actions:**

```
retake the test
```

```
download my results
```

```
share with someone
```

---

### Path Page

**Header:**

```
{name} — {path_name}
```

**Section Headings:**

```
why this fits you
```

```
your next 30 days
```

```
build these skills
```

```
resources that actually help
```

```
an honest warning
```

**Chat Section:**

Heading:
```
ask me anything about this path
```

Placeholder:
```
what would you ask someone already doing this?
```

Send button:
```
send
```

Empty state:
```
no questions yet. 
ask about salaries, daily life, how to start, 
or whether this path is actually as good as it sounds.
```

---

### History Page

**Page Title:**

```
your journey so far
```

**Empty State:**

```
no tests yet

once you take the assessment, 
your results will live here.
```

Button:
```
take your first test →
```

**List Headers (when results exist):**

```
date          score    strongest side
```

**Retake Button:**

```
take it again
```

Helper:
```
people change. your results might too.
```

---

### Dashboard

**Welcome Message:**

```
good to see you, {name}
```

Time-based variants:
```
good morning, {name} — let's find your path
```
```
hey {name} — ready when you are
```
```
still thinking it over, {name}? that's okay
```

**Section Labels:**

```
your latest results
```

```
saved paths
```

```
recent chats
```

**Button Texts:**

```
view full results →
```

```
continue exploring
```

```
start a new chat
```

```
edit profile
```

---

## 6. Error Messages

### Network Error

```
can't connect right now

looks like something's wrong with the connection.
want to try again? or wait a bit and refresh.
```

Button: ```try again```

### Authentication Error

```
something went wrong signing you in

the link might have expired. 
let's send you a fresh one.
```

Button: ```send new link```

### Test Incomplete

```
not so fast

you need to finish the test before we can show results.
don't worry, your progress is saved.
```

Button: ```continue where i left off```

### Invalid Input

```
that doesn't look right

check what you entered and try again.
we're not judging your spelling, promise.
```

### Ollama Not Running (Critical)

```
our brain is taking a nap

compass needs Ollama running locally to work.
it's probably not started. here's how to fix it:

1. open your terminal
2. run: ollama serve
3. refresh this page

stuck? check the setup guide or ask a developer friend.
```

Button: ```i've done this, try again```

### Generic Error

```
well, this is awkward

something broke on our end. 
we're probably already fixing it, 
but if this keeps happening, let us know.
```

Button: ```refresh the page```

---

## 7. Loading States

### Loading Next Question

```
loading your next question...
```

```
thinking about what to ask you next...
```

### Calculating Profile

```
calculating your profile...
```

```
making sense of your answers...
```

```
connecting the dots...
```

### Finding Your Paths

```
finding paths that fit you...
```

```
looking for where you might thrive...
```

```
imagining your possibilities...
```

### Connecting to Guidance

```
connecting you to guidance...
```

```
getting everything ready...
```

### General Loading Messages

```
give us a moment...
```

```
almost there...
```

```
doing the thing...
```

---

## 8. Empty States

### No Test History Yet

```
no tests yet

once you take the assessment, 
your results will live here.
```

Button: ```take your first test```

### No Paths Selected

```
no paths saved yet

when you find directions that interest you, 
save them here to explore later.
```

Button: ```explore my results```

### Chat History Empty

```
no conversations yet

ask questions about your paths here. 
get honest answers from someone 
who's already walked the road.
```

Button: ```ask my first question```

### No Saved Resources

```
no resources saved

when you're exploring paths, 
save articles, videos, or links that help.
```

### Search Results Empty

```
no matches found

try different words. or maybe we just 
don't have what you're looking for yet.
```

---

## 9. Product Name Treatment

### Always Lowercase "compass"

In all UI copy, the product name is lowercase:

```
compass
```

Not:
```
Compass
COMPASS
COMPASS.
```

### Sentence Start Exception

At the beginning of sentences, capitalize normally:

```
Compass helps you find your path.
```

### Punctuation

No period after "compass" when it stands alone:

```
powered by compass
```

```
built with compass
```

### Possessive

```
compass's suggestions
```

### HTML/CSS Implementation

```html
<!-- Logo -->
<span class="logo">compass</span>

<!-- Sentence -->
<p>Compass helps you figure things out.</p>

<!-- UI Label -->
<span class="brand-name">compass</span>
```

```css
.brand-name {
  text-transform: lowercase;
  font-family: var(--font-heading);
  font-weight: 500;
}

/* Screen readers should still pronounce it as a proper noun */
.brand-name::before {
  content: "compass";
  speak-as: spell-out; /* optional, browser support varies */
}
```

### In Code/Technical Context

When referring to the project in code, documentation, or technical contexts:

```
compass (the product name)
Compass (the project/brand name in prose)
```

Examples:
```
The Compass platform uses...
"compass" in the UI should always be lowercase.
```

---

## Appendix: Quick Reference

### Color Classes (Tailwind)

```
bg-white
text-black
bg-blue-600 (accent)
text-blue-600 (links)
bg-gray-50 (secondary bg)
text-gray-600 (secondary text)
```

### Typography Classes

```
font-heading → Fraunces
font-body → DM Sans
text-hero → 48px/3rem Fraunces
text-h1 → 36px/2.25rem Fraunces
text-body → 16px DM Sans
text-caption → 12px uppercase
```

### Voice Check

Before publishing any copy, ask:
1. Would a real person say this?
2. Is this how an older sibling would talk?
3. Does it feel warm or clinical?
4. Is it specific or generic?
5. Would it work on WhatsApp?

---

*Document version: 1.0*
*For: Compass Psychometric Platform*
*Audience: Agent 5 (Frontend Implementation)*
