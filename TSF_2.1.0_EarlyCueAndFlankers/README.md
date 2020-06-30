# Task Switching Flanker - Version 2.1.0

Update to TSF 2.0.0 - early flankers and cues.

**Task Description**

In this task, participants are required to switch between making parity (odd or even) or magnitude (greater or less than 5) discriminations on a series of cued numbers (1 to 5 excluding 5). On each trial, participants are cued by a color (red/blue) to perform either of the two tasks, and performance is compared between trials in which the cued task repeats (repetition trials) and trials where the task switches (switch trials).

Additionally, each number stimulus is flanked by distractor digits, that are either the same or different than the central number. Each number can be congruent (i.e., the same number, having therefore the same parity and magnitude as the center number), magnitude incongruent (magnitude different but parity the same), or parity incongruent (parity different but magnitude the same). Performance is compared between congruent trials and incongruent trials.

# Version changes from previous

In all previous versions, task selection was cued by the numbers themselves being highlighted in a color. Crucially, this prevents early cues (cues that precede target presentation and allow for preparation) since the stimuli themselves cue the task.

Pilot testing of TSF version 2.0.0 revealed a robust switch cost but weak congruency/flanker effects. One possibility is that task set selection (which color?) and target selection (which number to focus on) happened concurrently, resulting in no flanker effect. In order to increase the flexibility of the task, Version 2.1.0 allows for the presentation of a rectangular cue that cues the task. Importantly, this cue can precede target presentation, allowing for task set preparation. Task set preparation is a classic component of task switching experiments, and while it reduces switch costs it does not erase them (see Kiesel et al. 2010, "residual cost").

Additionally, not only can the cue now precede the target, flankers can also precede the target. This generally enhances flanker effects (Wyatt & Machado 2013). The preceding flankers can be task informative (colored red/blue), indicating the cued task and in effect precuing the task in a manner similar to the rectangle cue above, or noninformative (colored "black"). In the case of an early colored rectangular cue AND early flankers, the flanker will be uninformative regardless of variable settings.

These settings can all be customized in `main.js`.

# Repo Contents

`menu.html` calls `menu.js`, the main experiment script which calls the demographics, task, and submission scripts. `main.html` is the main task html file, and recruits a variety of scripts, including `main.js`, `instructions.js`, and `tasks.js`, which together run the task.

To see the main experiment flow, run `menu.html` and then call the script `updateMenu()` using your browser's DevTools console. This will override the initial MTurk script that requires an MTurk ID.

To see the main experiment, including instructions, practice, and the main task, run `main.html`.

Email any questions or comments to raphael (dot) geddert (at) duke (dot) edu
