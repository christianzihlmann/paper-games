# What Gets Counted — author note

1. **Look first at** round 2, the teacher, with the dial being turned. Curiosity boxes are rubbed out and test points climb; after PAY the net falls below the no-bonus line, right after round 1, where the same dial paid off for Sam. Then rounds 3 and 4, where swapping the cards lets a strong bonus do no harm. Then the verdict's "Today" section.
2. **The config block** is at the top of `mechanism.js` (`CONFIG`). The paper gives no numbers, so every value per hour, the normal day, the substitution strength κ and the responsiveness a are our choices, tagged as such; the best bonus shown is the paper's eq. (7). After a change, run `python3 build.py`: it re-runs `calibration.js` and refuses to build if a check fails.
3. **Least sure about:**
   - **Rounds 3–4:** the job-design gain is modest (+7%) because our toy has no risk premia, and in the toy splitting only pays when the uncounted work is valuable. That is why round 4 moves the firm to subscriptions, with care worth $20 an hour. The paper's grouping argument also runs through risk premia.
   - **The "Today" bullets:** all were checked against sources on 2026-11-24 and are listed under About.
   - **Voice:** whether "value of the work − extra pay = net" reads naturally to students who have not met the idea that the bonus itself is a transfer.

**For class:** project it. Before each PAY, ask the room "none, a little, or a lot?" The arrow keys turn the dial and Enter pays and moves on. Above about 900 px wide, the round screen switches to two columns.

This game has had the builder's review only (screenshots and scripted headless sessions, phone and projector). It has not been played by a stranger or used in class.
