# Task Switching Flanker - Version 2.1.0

Update to TSF 2.0 - early flankers.

**Task Description**

In this task, participants are required to switch between making parity (odd or even) or magnitude (greater or less than 5) discriminations on a series of cued numbers (1 to 5 excluding 5). On each trial, participants are cued by a color (red/blue) to perform either of the two tasks, and performance is compared between trials in which the cued task repeats (repetition trials) and trials where the task switches (switch trials).

Additionally, each number stimulus is flanked by distractor digits, that are either the same or different than the central number. Each number can be congruent (i.e., the same number, having therefore the same parity and magnitude as the center number), magnitude incongruent (magnitude different but parity the same), or parity incongruent (parity different but magnitude the same). Performance is compared between congruent trials and incongruent trials.

# Version changes from previous

Pilot testing of TSF version 2.0.0 revealed a robust switch cost but a very weak congruency/flanker effect. This version adds a 200 ms window **where only the flankers are presented.** The flankers preceding the target in this way is meant to increase flanker incongruency effects.

# Repo Contents

`menu.html` calls `menu.js`, the main experiment script which calls the demographics, task, and submission scripts. `main.html` is the main task html file, and recruits a variety of scripts, including `main.js`, `instructions.js`, and `tasks.js`, which together run the task.

To see the main experiment flow, run `menu.html` and then call the script `updateMenu()` using your browser's DevTools console. This will override the initial MTurk script that requires an MTurk ID.

To see the main experiment, including instructions, practice, and the main task, run `main.html`.

Email any questions or comments to raphael (dot) geddert (at) duke (dot) edu
