# Meat Log

A carnivore / very-low-carb food, macro and weight tracker. Single-page PWA, no build step,
no server, no account. Everything is stored on your own phone in localStorage.

## Put it on your phone

1. Create a new GitHub repo (e.g. `meat-log`) and upload these files to the root:
   `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`
2. Repo **Settings → Pages → Source: Deploy from a branch → main / (root)**. Save.
3. Wait a minute, then open `https://<your-username>.github.io/meat-log/` in Safari.
4. Share button → **Add to Home Screen**.

It works offline once installed. When you update `index.html`, bump `CACHE` in `sw.js`
(e.g. `meatlog-v2`) so your phone picks up the new version.

## On a computer

The app is one 640px column, centred. On a wide screen the header, content and tab bar all line up
in that column rather than stretching across the monitor, sheets open as a centred panel, and
buttons and rows get hover states. Nothing about the layout is phone-only — it's the same single
build either way.

## Demo data

A small switch at the top of Today fills the app with a sample week so you can see how everything
looks before you have history of your own: seven days of logging (including one off-plan day that
breaks the carb streak), three saved meals, sixteen foods, and five weeks of weigh-ins drifting from
138.6 kg to 134.1 so the chart, trend and weekly table all have something to show.

Demo lives in a **separate store** (`meatlog_demo_v1`). Your own data is never read or written while
the switch is on, and anything you log in demo stays in demo. A violet bar across the top makes it
obvious which mode you're in, and the setting survives a reload. Flip it off and your own log comes
back exactly as it was.

## Logging

- **Today** — six running totals (calories, protein, fat, carbs, sodium, fluid) against your
  targets. The carb bar turns red when you pass your limit. Swipe back with `‹` to log a past day.
- **Progress** sits inside the weight card: how far down you are from your highest recorded weight,
  how far to your goal, and a bar showing the share of the journey covered.
- **7 days** shows the net change across the week ending on the day you're viewing — green for down,
  red for up, "level" when it barely moved — next to a tiny sparkline of the actual weigh-ins. The
  sparkline is the point: a week that finishes level having swung 1.8 kg looks nothing like a week
  that genuinely sat still, and the net figure alone can't tell you which you had. Long-press it for
  the swing size and how many weigh-ins it's drawn from. Needs two weigh-ins in the window.
- **Note** — one line a day for how you felt: energy, sleep, cravings. It rides along in the daily
  CSV and the AI summary, which is what makes the analysis interesting rather than just arithmetic.
- **Copy a day** — pick any earlier logged day and tick the items or whole meals to repeat. Meals
  copy as a group, amounts come across as they were, and the whole lot is undoable.
- **Weight** sits just under the Add button, above the log, so it stays reachable no matter how
  many items you log. Once recorded it turns green and the button reads **Change**.
- **By meal / Every item** — two ways to read the same day. *By meal* collapses each meal into one
  row showing its combined totals; tap it to expand the items, or use **Expand all meals**.
  *Every item* is the flat list with a meal label under anything that came from one. The choice
  sticks between sessions.
- **Add food or drink** — pick a saved food, choose serves, done. Two taps for a repeat meal.
  The picker stays open so you can add a whole meal in a row.
- **Foods** — everything you've saved, most-used first. Tap the name to edit, `+` to log it.
  Drinks carry a blue dot. Water, coffee, tea, Coke Zero and bone broth are seeded to start.

## Meals

A meal is a named set of saved foods with serve counts, listed above single foods in both the
picker and the Foods tab. One `+` logs the whole thing — a three-item McDonald's combo is one tap.

Meals are stored **as well as** the individual foods, never instead of them, so you can still add
just the fries another day. Logging a meal writes one entry per food rather than a single blob,
which keeps macros exact and lets you delete one component (skip the fries) without touching the rest.
On Today, the **By meal** view collapses a meal into one row with its combined totals and a
chevron; tapping it opens the items underneath, and **Expand all meals** toggles the lot.
The `✕` on a meal row removes the whole meal after confirming; the `✕` on an item inside removes
just that one. Logging the same meal twice in a day gives two separate collapsible rows, not one
merged pile. The meal name also gets its own column in the entries export.

The Foods tab has a **Meals** filter showing only meals, with a **Build a meal from saved foods**
button underneath for assembling one by hand.

Three ways to make one:
- the offer that appears when an AI reply contains several items
- **Save this day's food as a meal** on Today, which appears once a day has two or more items —
  useful when you assembled something by hand and want it back later
- tap an existing meal's name to rename it, change serve counts, add or drop items
- **Build a meal from saved foods** on the Meals filter, to assemble one from scratch

### Making a variant of a meal

Open a meal and tap **Duplicate as a new meal**. You get an unsaved copy named
"Big Arch medium meal copy" with the same items. Swap what differs — `✕` the old burger,
pick the new one from **Add a food to this meal** — rename it, and **Save meal**. The original
is untouched, and both meals share the same fries and drink.

Adding a food that's already in the meal bumps its serve count instead of listing it twice.
Repeat copies number themselves ("copy 2", "copy 3") rather than colliding.

Foods work the same way: open one and tap **Duplicate as a new food** to make a variant —
a 500 g ribeye from your 300 g one, say — without touching the original.

Deleting a meal leaves its foods and anything already logged alone. If you delete a food that a
meal uses, the meal keeps working from the figures it stored and flags the item in the editor.

## Amounts and units

Every food's figures describe a base amount — **per 1 egg**, **per 100 g**, **per 1 can** — and
logging asks for a quantity in that unit. Pick the base a person would naturally count and the
quantity is always a whole number:

| Food | Store it as | You log |
|---|---|---|
| Scrambled eggs | per **1 egg** (butter included proportionally) | `4 eggs` |
| Ribeye steak | per **100 g** | `350 g` |
| Bacon | per **1 rasher** | `3 rashers` |
| Coke Zero | per **1 can** | `1 can` |
| Butter | per **10 g** | `20 g` |

The logging sheet then says "How many eggs" with taps for 1/2/3/4/6, or "How many g" with taps for
50/100/150/200/300. Anything measured in **ml** gets pour sizes instead — 100 / 250 / 600 / 1000 /
1250 — since nobody drinks water in multiples of the stored base, and you can type any number in between. It remembers the last amount you logged
for that food and pre-fills it, showing "Last time: 4 eggs" — so a repeat breakfast is two taps. Everything scales together, so 4 eggs
scales the butter in that food too. Where the butter really matters, make it a **meal** of
"Egg" ×4 + "Butter" ×20 g instead — then each part moves independently.

Avoid storing a food as per "3 eggs" or per "300 g". It works, but then 4 eggs is ×1.33 and the
numbers stop reading clearly.

Foods saved before units existed are treated as **per 1 serve** and behave exactly as they did.

## Getting macros for something new

Foods → **New food — get macros from AI**:

1. Type what you ate: *"Large Quarter Pounder meal with Coke Zero"*
2. **Copy AI prompt** and paste it into any AI
3. Paste the reply back, tap **Read the reply**

The prompt asks for Australian sources (product labels, FSANZ/AUSNUT, Australian restaurant
data), splits combo meals into separate items, converts salt to sodium, and demands a bare
JSON array. The app parses it even if the AI wraps it in code fences, adds chatter, leaves a trailing
comma, or substitutes curly quotes (ChatGPT and the iOS keyboard both do this).
Each item has a **How many to log** box in its own unit. The prompt asks the AI for an `amount`
field — how much you actually had — so a photo it read as a 400 g plateful pre-fills the box with
400 and notes "AI estimated 400 g — change it if that looks wrong". Without an estimate the box
falls back to the base amount. The AI
returns scrambled eggs as *per 1 egg*, so type `4` there and **Save and log** records 4 eggs while
the saved food stays per-egg for next time. **Save only** files it away without logging.

When a reply has more than one item, a **Save as a meal** card appears set to **Yes**, with the
name the AI suggested (the prompt asks for one) — edit it if you like. Tap **No** to keep the
items as separate foods with no meal.

### Dishes you didn't cook

For a casserole, stew, curry, pie or bake where you have no idea what went in, the prompt tells the
AI to assume a standard Australian home recipe and **say in the notes which recipe it assumed**, so
you can sanity-check it. It also makes it account for what usually hides in those dishes — flour or
cornflour thickening, potato, rice, pasta, breadcrumbs, pastry, sugar in sauces, stock powder,
cooking oil — and to estimate sodium rather than returning zero.

Because an underestimate of carbs costs you more than an overestimate, the prompt asks for the
**higher end** of the plausible carb range, not the middle. The notes come back with a confidence
level and the one thing you could tell it that would sharpen the estimate most — usually "was there
potato or flour in it?", which is often worth a text to whoever cooked it.

A casserole comes back as one food; a casserole with a side of veg comes back as two.

### Working from a photo

Set **Adding a photo of it?** to **Yes** and the prompt gains a section telling the AI to identify
the plate from the image: estimate each portion using visual scale references, list components
separately, account for visible cooking fat, avoid guessing brands without visible packaging, and
state in the notes that the portion was estimated from a photo with a low/medium/high confidence.
It also holds the per/unit rule, so a photo of three eggs still comes back as per 1 egg and the app
handles the 3.

For mixed dishes the photo only establishes portion size and dish type — what's underneath comes
from the unknown-recipe rules above.

Copy the prompt into the AI's own app, attach the photo there, and send them together — the app
never sees the image. The description box becomes optional, but anything you know (weights, brand,
how it was cooked) still improves the answer, and where description and photo disagree the prompt
tells the AI to trust your words.

Photo estimates are guesses. Check the numbers before saving, especially for anything you eat often.

### Reusing foods you already have

Each item in the preview is matched against your saved foods, so a second combo doesn't create a
second set of fries. Where a match is found the app defaults to **Use saved** and says so in a green
badge; the AI's figures for that item are discarded and the meal points at the food you already
trust. The dropdown also offers:

- **Replace saved with these figures** — when a price/recipe change means the new numbers are better
- **Add as a new food** — when it really is different
- **Use a different saved food** — to map an item onto something the matcher missed

Size words have to agree, so *Medium Fries* never matches *Large Fries*. Brand punctuation and
apostrophes are ignored, so "Coca-Cola Zero Sugar medium" still finds "McDonald's Coca-Cola Zero
Sugar". A same-name collision is always reused rather than duplicated, whatever the dropdown says.

If a reply looks wrong, **Check the numbers first** opens it in the manual editor.

## Editing what you logged

Tap the name of anything in the day's log to reopen it with its current amount filled in, change the
number, and **Save change**. It updates that entry rather than adding a second one, and the change
itself is undoable. Items inside a meal can be edited the same way — the sheet tells you which meal
it belongs to.

## Undo

Every delete is undoable. Removing a logged item, a whole meal from the day, a weigh-in, a saved
food or a meal shows a toast with an **Undo** button for seven seconds, and taking it puts the thing
back exactly where it was — including whether a meal group was expanded at the time.

Because of that, removing a logged item doesn't ask for confirmation first: it is one tap to remove
and one tap to change your mind. Deleting a saved food or a meal still confirms, since those affect
more than one day, and they have undo as well.

## Deleting things

Tap a food's **name** in the Foods tab to open it, then **Delete this food** at the bottom.

What happens depends on whether it's been used:

- **Never logged** — it just goes, with a one-line confirmation.
- **In use** — the confirmation tells you how many times it's been logged and which meals use it,
  then explains that deleting removes it from your food list only. Logged entries keep the figures
  they were saved with, so your daily totals, streak and trends do not change. Any meal that used it
  keeps working from the figures stored when the meal was saved, and flags the item in the meal editor.

Deleting a **meal** (tap its name, then **Delete this meal**) leaves its foods in your list and
anything already logged untouched — it only removes the one-tap shortcut.

## Weight

Manual entry, one weight per day. **Import from Weight Diary** takes your CSV export
directly — it reads the `goal` line and skips dates you already have, so re-running it is safe.

## Trends

- Weight line plus a heavier 7-day average, with daily calories as bars underneath on the
  same timeline. Dashed green line is your goal weight.
- **Days in a row under your carb limit** — the streak counter. Today doesn't break it until
  you've logged something.
- Progress: highest recorded, total lost, distance to goal, 4-week kg/week trend, projected
  weeks to goal, and average intake over logged days.
- Weekly table pairing average intake and carbs against that week's average weight and the
  change from the week before.

## Export and backup

- **Copy summary for AI** — puts the last 30 days on your clipboard as plain text: your targets,
  weight trend, a day-by-day table including your notes, carb-adherence count, and your most logged
  foods, ending with a request for specific analysis. Days with only a weigh-in show dashes rather
  than zeros, so nothing reads as a fast that wasn't one. Paste it into any AI — no file handling.
- **Daily totals + weight (CSV)** — one row per day: macros, sodium, fluid, items logged,
  weight, 7-day average weight, and your note. For spreadsheets or a deeper dig.
- **Every entry (CSV)** — the raw log, one row per food, with amount and unit columns.
- **Weight history (CSV)** — date and kg.
- **Download backup (JSON)** — the whole database, restorable via **Restore from backup**.

Data lives only on the phone, so take a JSON backup occasionally. Clearing Safari website
data or deleting the home-screen app will wipe it.

The Data tab warns you if you have never taken a backup, or if the last one is more than 30 days
old, and puts a red dot on the Data tab so you notice from anywhere in the app. Safari clears
site data for web apps left unopened for a long stretch, which is the realistic way to lose
months of logging.
