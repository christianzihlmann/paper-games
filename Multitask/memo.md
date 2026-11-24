# What Gets Counted — design memo

## 0. Given

- **Whose game:** a gift. Footer *Built from the paper.* No signature, no counter.
- **Title:** names the substance, no author.
- **Ideas: "for teaching".** It should also work as a short in-class demo for business-school students, projected, as well as for strangers on a phone. Read together with the user's teaching style (frontal; brief plenum questions and hand votes, no group work), this means:
  - every round opens with one question the lecturer can put to the room as a hand vote, before anyone touches the control;
  - large type that reads on a projector;
  - the dial also works from the keyboard (arrow keys, Enter), so a presenter's clicker can drive it;
  - about five minutes in total.
- **Process:** save in `Games/Multitask/`. No commit or push; the user tests it, then uploads it to their GitHub.
- **Precedent:** the user's own collection, so far one game (section 6).
- **Revision 2 (after the user's first test, 2026-11-24).** Requests:
  - (a) start with sales, then teachers, and add a round 4 with task splitting for sales too, so both examples run through: one worker, then job design;
  - (b) more modern material at the end, including AI, for a course in management information systems: measurement risks (Goodhart's law), linked to the first lesson (Holmström's informativeness principle and optimal incentives).

  Also from the first test: "$12 an hour" was read as her pay. The labels now say "each hour is worth $12 to the school". See section 21.

## 1. Paper

Bengt Holmström and Paul Milgrom (1991), "Multitask Principal–Agent Analyses: Incentive Contracts, Asset Ownership, and Job Design," *Journal of Law, Economics, & Organization* 7 (Special Issue): 24–52. DOI: [10.1093/jleo/7.special_issue.24](https://doi.org/10.1093/jleo/7.special_issue.24).

Available: the HeinOnline scan (29 pages, image only, no text layer). It was read from page images; there was no OCR. There are no numbers to transcribe: the paper is pure theory.

## 2. What the paper hands over

**Primary: a model** (ported):
- The agent chooses efforts t = (t₁,…,tₙ) at private cost C(t).
- Expected benefit B(t) goes to the principal; signals are x = μ(t) + ε; pay is linear, w = αᵀx + β.
- Efficient contracts maximise B − C − ½rαᵀΣα subject to the agent's best response αᵢ = Cᵢ(t) (eqs. 1–3).
- Optimal commissions: α = (I + r[Cᵢⱼ]Σ)⁻¹B′ (eq. 5).
- With task 2 unmeasured: α₁ = (B₁ − B₂C₁₂/C₂₂)/[1 + rσ₁²(C₁₁ − C₁₂²/C₂₂)] (eq. 7). When the tasks are substitutes, α₁ falls and can hit zero even with a perfect measure (σ₁² = 0, p. 33).
- Agents work some amount for free: C′(t) ≤ 0 up to t̄ (Section 3.1, fn. 9).
- **Prop. 1:** fixed wage optimal (contractor).
- **Prop. 2:** employment means α = 0; independent contracting means high-powered incentives.
- **Props. 3–4:** outside activities are allowed more freely the higher the commission.
- **Props. 5–7:**
  - no task shared between agents;
  - hard-to-measure tasks are grouped on one agent, who works less and gets lower commissions;
  - easy-to-measure tasks go to the other.

**Secondary: the paper's cited evidence.**
- Teachers' test-based pay (Hannaway). A Greenville teacher passed test answers to her class to lift her rating (*WSJ*, 2 Nov 1989; fn. 3).
- Franchisees face at least a 90% commission (royalties ≤ 10%), while managers of company-owned stores get no explicit incentives (Krueger; Brickley and Dark; p. 38).
- Electronics firms use in-house sales forces where sales are hard to measure (Anderson and Schmittlein; p. 37).

## 3. The discovery, and its kind

**A counterintuitive result** (Prop. 1, eq. 7). The obvious view: if you can measure performance and people respond to pay, pay for performance. The paper:
- When a job holds tasks that can be counted and tasks that cannot, a bonus on the counted task drains effort from the others.
- The best bonus on a perfectly measured task can be zero.
- The right bonus for one task depends on everything else in the job.

**Secondary: a mechanism made intelligible** (job design, Props. 5–7). Splitting counted and uncounted tasks into different jobs lets strong pay go where it does no harm.

## 4. The core narrative

A teacher has one day. She spends some of it drilling for the test and some making children curious. You can count test scores; you can't count curiosity. So you offer her money for every test point. She is not lazy and she is not cheating: she just moves her hours to where the money is. Test scores shoot up. The children are less curious than before, and the school is worse off. The best pay was no bonus at all. If you want to pay for test scores, give the drilling to one teacher and the curiosity to another.

## 5. Who lives in the paper

| Who | Controls | Could anticipate |
|---|---|---|
| The principal (school, firm, homeowner) | commission α, the grouping of tasks into jobs, ownership, which outside activities are allowed | the agent's reallocation |
| The agent (teacher, sales rep, contractor, worker) | the hours given to each task | which tasks pay |
| The measure (the test, the sales count) | — | — |
| Outside activities (personal business) | — | — |

## 6. Precedent (the user's collection: one game)

| | The September Pile | This game |
|---|---|---|
| Position | Agent (the agency's purchasing chief) | **Controller**: you set the pay and design the job; the worker best-responds |
| Format | Challenge (a budget over months) | **Strategic**: a reacting agent, three short rounds |
| Feedback | the paper pile (monthly stacks) plus the reveal | **the day bar** (one of our own): a row of hour boxes that move between tasks as the dial turns; plus the chalk ledger (a sum written after each move) |
| Chassis | Retro, government paperwork. Light manila, typewriter Courier Prime, rubber-stamp buttons | **Drawn, chalk on a blackboard**: dark green, handwriting, chalk-box buttons |

## 7. The aim and the verdict

**Aim:** *Pay your people so the work gets done best.*

**Verdict leads with:**
1. **What the paper found:** paying for what can be counted pulls effort from what can't; the best bonus depends on the rest of the job and can be zero even with a perfect measure; to pay strongly, split the counted work from the rest.
2. **What you found:** your three bonuses and design, and what each did, in words.
3. **Where you part:** written from the player's choices, for example "you paid Ms. Ortiz $8 a point; the paper's formula says nothing", or "you split the jobs and paid strongly, as the paper says".
4. **What would have followed:** the real-world patterns the paper explains:
   - franchisees on at least a 90% commission, store managers on none;
   - in-house sales forces where sales are hard to measure;
   - the Greenville teacher.

## 8. Three concepts

**A. "The Bonus Dial" (Controller; Strategic). PICK.**
- **Controls:** one dial, the bonus per counted unit ($0–$12), plus, in round 3, sorting four task cards between two teachers.
- **Before pressing:** how much will this pull hours from the uncounted work, and is the trade worth it? Round 3 adds: which tasks belong together?
- **Afterwards:**
  - turning the dial redraws the worker's day live: chalk boxes erased from one task and drawn into the other, overtime boxes past the end-of-day line;
  - after PAY, the ledger writes the sum: value of the work − extra pay = net, then the paper's best bonus as a ghost line.
- **Discovery moment:** round 1, the dial turns and the curiosity boxes are wiped while test scores more than double; after PAY, the net falls.
- **Fun:** anticipation, agency, discovery, mastery (round 2 punishes the over-learned "never pay").
- **Replay:** the three jobs reward different answers ($0, about $7, and $12 once the job is split).

**B. (Reckless) "Two Plates" (Subject; real time).**
- **Setup:** the player is the worker. Two plates spin; tapping keeps them up. The left plate drops coins per spin (counted); the right has no counter (quality). No words on the play screen.
- **Rounds:** salary, then a piece rate. Under the piece rate the player's own thumbs drift left and the right plate falls. The reveal shows the hidden quality meter.
- **Discovery:** felt, not designed: you go where the pay is.
- **Fun:** real-time agency.
- **Replay:** thin.

**C. "The Rulebook" (Dilemma; Props. 3–4).**
- **Setup:** you write the office rules. For a salaried clerk and a commissioned salesperson, decide which personal activities to allow on company time (calls, a side business, selling a rival's products).
- **Discovery:** the same activity should be banned for the clerk and allowed for the salesperson, because commission pay already pulls attention to the job (Prop. 3ii).
- **Fun:** judgement.
- **Replay:** different activity values.

## 9. The first five minutes

**A (pick).**
- *0:00* Blackboard. "WHAT GETS COUNTED." Chalk clipping: in 1989 a teacher in Greenville, South Carolina, was caught passing test answers to her class to lift her rating. Aim underneath. START.
- *0:15* Round 1, Ms. Ortiz.
  - Her day is eight chalk boxes: four yellow "drill for the test ✓ counted, worth $12 an hour", four blue "make them curious ✗ not counted, worth $30 an hour" (written $20 in the first draft; changed in the build). The dial sits at $0.
  - The question: "Bonus per test point: none, a little, or a lot?" (*In class: hands up.*) *Motivate her: a lot.*
  - I drag to $8. Two blue boxes rub out, yellow ones are drawn in, and a box appears past the END OF DAY line. *Wait. She's dropping curiosity.* At $10 the last blue box goes. *Hm.*
  - I settle on $3 and press PAY.
  - Ledger: "Work done +$X, extra pay −$Y, net $Z. With no bonus: $128." Ghost line: the paper's best, $0. *Even $3 cost the school.*
- *1:30* Round 2, Sam, sales rep: sales ✓ ($10 an hour) and customer goodwill ✗ ($5 an hour), and the two tasks compete less. *Burned once: $0.* The dial shows sales boxes growing fast and goodwill shrinking only a little.
  - Option one: I keep $0. Ledger: "You left $14 on the table: the paper's best is about $7."
  - Option two: I try $6 and get close.
- *3:00* Round 3, two teachers, four cards (reading drill ✓, math drill ✓, discussion ✗, projects ✗), dealt one ✓ and one ✗ to each.
  - Turning the dial wipes both teachers' blue boxes. *Same trap.*
  - I swap the cards so drills sit with drills. Now the dial grows one teacher's yellow boxes and the other's blue boxes don't move.
  - I pay $12 and press PAY. Best net of the game; ghost: "the paper: split, pay the drills fully."
- *4:30* Verdict.

What the player thinks before pressing:
- **First action:** do bonuses motivate?
- **Middle:** after round 1, is zero always right?
- **Last:** which tasks go together, and how strongly can I now pay?

Three different thoughts.

**B (runner-up).**
- *0:00* Two plates, no words. I tap both to keep them spinning.
- *0:40* Coins appear on the left plate. I drift left; the right plate wobbles and falls.
- *1:30* Reveal: "that plate was quality."
- **Thinking before each press:** first, which plate is falling; middle, the same; last, the same. Hands without a decision, and the principal's problem (the paper's question) is never posed. B's hands are already in A: the live day bar is the worker's reallocation, drawn.

## 10. The pick, and why

**Pick: A.** The player sits where the paper sits: designing pay and jobs for an agent who best-responds. Three rounds, three answers ($0, an interior bonus, a strong bonus after splitting), so no single rule wins (section 19 checks this).

- **Teaching:** round 1 is the hand-vote moment. The class's instinct ("pay for results") meets the board.
- **Author test:** Holmström and Milgrom turn their own eq. (7) by hand and watch it erase a teacher's curiosity. It is alive.
- **Runner-up:** C. Switch if rounds 1–2 read as one lesson repeated.
- **Reckless B, given up:** the felt pull of a piece rate on one's own thumbs. Its essence, the agent's reallocation, is drawn live on A's day bar.

## 11. The shape

- **Screens:** Start (aim, clipping) → Round 1 (teacher) → Round 2 (sales rep) → Round 3 (two teachers, job design) → Verdict → How to play / About.
- **Each round:** one question (the hand vote), the dial (with the card sort in round 3), PAY, the ledger with the paper's best as a ghost, then NEXT.
- **Rounds:**
  - Round 1: the trap; best bonus $0 (b₁ < κb₂).
  - Round 2: the counter-case; best bonus inside the range (b₁ > κb₂).
  - Round 3: job design; best is split with a strong bonus.
- **Score:** each round's net for the employer against the best possible, in words and in $. The final verdict leads with the fate in words.

## 12. Controls, mechanism, feedback, moment

- **Dial:** $0–$12 per counted point, in $1 steps. Arrow keys work. There are no negative bonuses (p. 33: the worker can always lower a score for free).
- **Mechanism (ported, r = 0):**
  - The worker's private cost is C(t) = (c/2)(t − t̄)ᵀK(t − t̄), with K = [[1,κ],[κ,1]]. Zero at the normal day t̄ (Section 3.1's free day), rising when pushed. κ is how strongly the two tasks compete for the same hours (C₁₂/C₂₂).
  - Best response: t = t̄ + K⁻¹α/c, floored at zero hours.
  - Value: B = Σ bᵢtᵢ.
  - Employer's net = B − C. The bonus money itself is a transfer offset in the base salary (pp. 29–30).
  - Optimal bonus with one task counted: α* = max(0, b₁ − κb₂) (eq. 7 at r = 0).
- **Rule shown on the screen:** every $1 of bonus adds a·$1 hours of drilling and takes κ·a·$1 from curiosity; the extra pay is half the bonus times the extra counted hours (C = ½αᵀΔt at the agent's optimum).
- **Feedback:** the day bar (hour boxes, chalk-erased and redrawn live) and the chalk ledger after PAY.
- **Moment:** round 1, the blue boxes wiped by the turning dial, then the net below the no-bonus line.

## 13. The look

- **Register:** Drawn, chalk on a blackboard. It comes from the lead example (a teacher) and from the use (a lecture hall).
- **Palette:**
  - Blackboard `#22352B`
  - Chalk `#F1EEE4`
  - Chalk Yellow `#F2CF5B` (counted work)
  - Chalk Blue `#8DC0E0` (uncounted work)
  - Chalk Coral `#EE8A6E` (overtime, extra pay)
- **Type:** Patrick Hand (handwriting, body) and Cabin Sketch (chalky headings), both SIL OFL, inlined.
- **Buttons:** hand-drawn chalk rectangles, slightly crooked, with a chalk-dust press.
- **The one visual rule:** *everything is chalk. Nothing is typed or straight; every change is an erase and a redraw, leaving a faint smudge.*
- **Play screen at 380 × 700:**
  - top: round label, question, aim;
  - the job's two task labels with their worth and ✓/✗;
  - the day bar, large (12 hour boxes max, ~26 px);
  - test-score and curiosity counters written beside it;
  - the dial, full width, with the bonus written big;
  - PAY;
  - after PAY, the ledger replaces the dial.
- **What each picture answers:** the day bar (*where do her hours go?*), counters (*what gets counted?*), ledger (*was it worth it?*).

## 14. What is cut

- Risk and measurement noise (r = 0; the paper's Prop. 1 holds risk-neutral).
- Asset ownership (Prop. 2) and outside activities (Props. 3–4), read on the verdict screen.
- The continuum of tasks and the risk-premium logic of Props. 6–7 (round 3 is a four-task toy).
- Complementary tasks (C₁₂ < 0).

## 15. Divergences

- **Quadratic cost around a normal day** (the worker's own split, 4 + 4 hours). The paper has a cost of total effort only with a free region, where the agent splits as the principal likes; with perfect substitutes the response is all-or-nothing. κ < 1 gives a dial with a gradual response; κ → 1 recovers the paper's Section 3.
- **Linear values per hour** (ours): teacher $12 drilling / $30 curiosity; sales $10 / $5; round 3 drills $12, discussion and projects $30.
- **No measurement noise, no risk aversion** (r = 0): eq. 7 reduces to α* = b₁ − κb₂.
- **Round 3:** two teachers, four tasks, two each, one shared bonus per counted point. A toy of Section 5; its gain comes from extra effort on counted work, not from risk premia.
- **Names** (Ms. Ortiz, Sam) are ours.

## Changed in the build

- **Curiosity raised from $20 to $30 an hour**, so that the on-screen sums come out in whole dollars.
- **Responsiveness lowered:** a $1 bonus moves 0.4 h, not 0.5 h. At 0.5 h the best round-3 answer had the drill teacher on a 12 h 50 min day; now it is 11 h 50 min.
- **The teacher's day bar draws the uncounted work first**, so overtime past the line shows as the paid work.
- **Projector layout:** on wide screens the round screen switches to two columns (picture left, dial and ledger right). Root type is about 23 px at 1280 × 720.

---

## 16. Mechanism kind and claim boundaries (build.md 1)

**Rounds 1–2: ported.** The paper's linear model (eqs. 1–2) with:
- μ(t) = t;
- the private cost C = (c/2)(t − t̄)ᵀK(t − t̄): zero cost up to the normal day (Section 3.1); κ = C₁₂/C₂₂;
- linear B;
- r = 0.

The best bonus on screen is eq. 7. **Round 3: toy** of Section 5 (two teachers, four tasks, one shared bonus).

- **Demonstrates:** in this model a bonus on counted work moves hours away from uncounted work. The best bonus is zero when B₁ ≤ κB₂ (round 1), positive but below B₁ otherwise (round 2). Grouping the counted tasks in one job allows a full bonus without harm (round 3).
- **Assumes:** our numbers. The paper gives none:
  - values per hour;
  - an 8-hour normal day split 4 + 4;
  - κ = 0.6 for teachers and 0.4 for the sales rep;
  - a = 0.4 hours per $;
  - no risk.
- **The paper establishes:** the conditions (eq. 7; Props. 1–7) as theorems about the model, read against others' evidence (franchising; in-house sales forces; the Greenville teacher). Not measurements.

**Where the discoveries come from:**
- Round 1's zero and round 2's interior bonus follow from eq. 7 given the stated values. The values are ours, and the game says so: "worth $X an hour".
- Round 3's ranking follows from the toy. Its size (+7%) is a feature of our numbers. The paper's own argument for grouping runs through risk premia, which the game leaves out.
- The scoring (net per day) is the paper's total certainty equivalent B − C, at r = 0.

**Robustness:** every designer number moved ±20% leaves the round-1 best at $0 and the round-2 best at $8 (`calibration-result.txt`). Round 1 flips to a positive bonus only when drilling is worth more than κ times curiosity (more than $18 an hour here).

## 17. Calibration plan

There are no reported numbers to match. `calibration.js` checks the mechanism against the paper's equations and propositions on random parameters, and against the game's own rounds:

- **Best response:** equal to a brute-force maximum (eq. 2).
- **Eq. 7:** equal to the numerical optimum of total certainty equivalent, with r and σ² free.
- **The paper's special cases:**
  - eq. 5's independent-task benchmark;
  - p. 32, complements raise the bonus;
  - p. 33, zero even with a perfect measure;
  - the Section 3 limit at κ → 1 (all-or-nothing).
- **The on-screen rule:** extra pay = ½ × bonus × extra counted hours, exact at every dial position; no corner anywhere on the game's dial.
- **Section 5 toy:** grouping is never worse than mixing; Prop. 7's shape (the uncounted-task teacher works no extra hours and earns no bonus); 300 random schools.
- **The game:** the three rounds' best answers equal eq. 7 and the toy's optimum.
- **Robustness:** ±20% on every designer number.
- **Gate:** `build.py` refuses to build unless all checks pass, and verifies that the embedded `mechanism.js` is byte-identical.

## 18. Calibration result (2026-11-24)

**All 16 gates pass.**
- Best response: worst shortfall 0.0000 over 300 random workers.
- Eq. 7: worst gap $0.005 over about 396 interior cases (grid $0.01).
- Extra-pay identity: exact (7e-15).
- Toy: grouping wins 300 of 300; Prop. 7's shape holds 300 of 300.
- Round answers: $0, $8 (eq. 7: $8), and split with $12.
- Robustness: round 1 stays at $0 and round 2 at $8 under every ±20% change.

## 19. Play it in numbers (numbers-log.txt)

| Strategy | Round 1 | Round 2 | Round 3 | Mean share of best |
|---|---|---|---|---|
| Paper | $168 | $73 | $359 | 100% |
| Never pay a bonus | — | — | — | 92% (loses in rounds 2–3) |
| One-task theory (pay what a counted hour is worth) | $110 | — | $221 | 75% |
| Pay the most everywhere | — | — | — | 74% |
| Pay the most, split the jobs | — | — | — | 87% |
| A little ($3) everywhere | — | — | — | 92% |
| Middle ($6) everywhere | — | — | — | 89% |
| Learns from round 1 ($0, $0, split + $12) | — | — | — | 94% (overlearns in round 2) |

No single rule wins all three rounds. The ways of going wrong are the paper's: crowding out (one-task theory), missing incentives where they are cheap (never pay), and keeping jobs mixed.

## 20. Build log

- **Reading the paper:** the PDF is a HeinOnline scan with no text layer and no OCR tool was installed, so it was rendered to 29 page images and read in full.
- **Precedent:** taken from the user's own collection (The September Pile). This game differs from it in position, format, feedback device and chassis.
- **Flow and text:** written as pure functions (`game.js`) and played as text first (`loop.js`), including the perfect path. Fixes:
  - pronouns: neutral "Normal day"; Sam unnamed by pronoun;
  - the teacher's day length.
- **Browser** (`session-test.js`, headless Chrome, 380 × 700). One complete session:
  - round 1 with buttons;
  - How to play opened mid-round;
  - round 2 by keyboard only (arrows and Enter, the presenter's path);
  - round 3 with a card swap and a dragged dial;
  - verdict, About, replay.
  - No script errors (after clamping tiny hour boxes to a positive width) and no horizontal scroll. Day and controls fit on one screen in every round.
- **Projector** (`projector-test.js`, 1280 × 720): all three rounds fit on one screen in two columns.
- **Fixes from the screenshots:** overlapping "normal day ends" and "overtime" labels; overtime drawn as curiosity; "counted points" now "test points" or "sales points"; the dial's focus outline.
- **Not done:** real-stranger testing and a classroom trial (the user's to do). Session length is estimated, not measured: about 4–6 minutes, three PAY decisions and one card sort.

---

## 21. Revision 2: four rounds, two examples, a "Today" ending

**Shape now:**
- Round 1: sales rep. A bonus helps; the best is $8 (eq. 7). The room's instinct is confirmed first.
- Round 2: teacher. A bonus backfires; the best is $0.
- Round 3: two teachers. Split the jobs and pay $12.
- Round 4: two sales reps. Split the jobs and pay $10.

The aim, the dial, the day bar and the ledger are unchanged.

**Round 4 needed a reason.** With round 1's numbers (goodwill $5 an hour), the toy prefers mixed jobs with an $8 bonus ($139.2 against $138 split), so splitting the sales job would teach nothing true. Round 4 therefore moves the firm to subscriptions:
- looking after customers (setting up new customers, solving problems) is worth $20 an hour, twice a selling hour;
- round 1's $8 bonus, kept with mixed jobs, now loses money ($230 against $240 with no bonus);
- mixed jobs allow only a token $2;
- splitting (new customers and upgrades to one rep on commission, care to the other) gives $258.

This is the account-executive / customer-success split common in software sales. The card values show the new $20, and About states the assumption.

**The calibration check of grouping was rewritten.** The earlier "grouping is never worse than mixing" check compared the best overall deal (which includes mixed deals) with the best mixed deal, so it could not fail. The new check tests the toy's exact condition: split beats mixed if and only if b_M²(1 − κ) > (b_M − κ·b_U)². It agrees on all 272 random interior schools (28 draws with an emptied task skipped).

The memo's earlier claim that "grouping is never worse" (sections 17–18) is therefore wrong for the toy. In the toy, grouping wins only when the uncounted work is valuable enough. The paper's own case also runs through risk premia, which the toy leaves out. About now says so.

**Ending ("Today: when a measure becomes a target")**, facts checked against sources on 2026-11-24:
- **Goodhart's law in Strathern's wording** (*European Review* 5(3), 1997). Goodhart's own 1975 remark was about monetary statistics.
- **Wells Fargo, September 2016:** about 1.5 million deposit accounts and about 565,000 credit-card applications without customers' consent, to meet sales targets; fines of $185 million in total (CFPB $100M, OCC $35M, Los Angeles $50M).
- **Round 4's split** as current practice in software sales (account executives on commission, customer-success managers on mostly fixed pay). This is common practice, stated without a figure.
- **AI reward hacking:**
  - OpenAI's 2016 CoastRunners agent circling a lagoon to hit the same targets instead of finishing the race;
  - Gao, Schulman and Hilton (ICML 2023): over-optimising a learned reward model lowers quality under a stronger "gold" judge.

  The figure "20% above human scores" sometimes quoted for CoastRunners could not be confirmed and is not used.
- **AI and job design:** AI makes more work countable (calls, code, answers). Paying on the new number helps only if what it leaves out does not suffer. As AI takes over countable tasks, human jobs keep the hard-to-count ones, where by this paper strong pay for numbers works worst. This is the paper's logic applied, not an empirical claim, and it is worded as such.
- **Bridge to lesson 1:** the informativeness principle (Holmström 1979) says to use every signal that is informative about effort; the multitask paper adds that a precise signal can still be the wrong thing to pay on.
- **Closing question:** "Before you pay on a number, ask: what does it leave out, and does that compete for the same hours?"

The paper's own 1991 examples stay as a separate section, "In 1991". About gains a "For the lecture" source list: Holmström 1979; Holmström and Milgrom 1987; Baker 1992; Kerr 1975; Goodhart 1975 / Strathern 1997; the Wells Fargo consent orders; OpenAI 2016; Gao et al. 2023.

**Calibration:** all 19 gates pass.
- The four round answers match eq. 7 and the toy.
- Robustness: round 1 stays at $8 and round 2 at $0, and rounds 3 and 4 stay split, under ±20% on every designer number, including care's value in round 4.
- Sales responsiveness is now a = 0.3 (was 0.4), so the round-4 seller's best day is 11 h 35 min rather than about 13 h.

**Strategies** (numbers-log.txt), mean share of the best:

| Strategy | Mean share of best |
|---|---|
| The paper | 100% |
| Learns the trap but never splits ($8, $0, mixed $0, mixed $0) | 96.7% |
| Never pays | 93.2% |
| Round 1's $8 everywhere | 86.5% |
| One-task theory | 78.1% |
| Pays the most everywhere | 76.4% |

**Browser:** the four-round session runs on a phone (380 × 700) and on a projector (1280 × 720, rounds 1, 3 and 4), with no errors. On the projector, after PAY in round 4 the long ledger pushes the NEXT button slightly below the fold; Enter still moves on.

## 22. Revision 3: rounds 3 and 4 swapped (user, 2026-11-24)

**Order now:** sales rep, teacher, two sales reps (subscriptions), two teachers. Each example comes back for its job-design round in the same order it was first met. Only the round order, labels and texts moved; the mechanism and every number are unchanged.
