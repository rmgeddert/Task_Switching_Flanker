# Task_Switching_Flanker

This is the first iteration of the combined flanker/task switching paradigm devised by Raphael Geddert and Tobias Egner.

In this task, participant's are required to switch between making parity (odd or even) or magnitude (greater or less than 5) discriminations on a series of cued numbers (1 to 5 excluding 5). On each trial, participants are cued by a color (red/blue) to perform either of the two tasks, and performance is compared between trials in which the cued task repeats (repetition trials) and trials where the task switches (switch trials).

Additionally, each number stimulus is flanked by distractor digits, that are either the same or different than the central number. Each number can therefore be congruent (i.e., the same number, having therefore the same parity and magnitude as the center number), magnitude incongruent (magnitude different but parity the same), or parity incongruent (parity different but magnitude the same). Performance is comapred on congruent trials versus incongruent trials.

Notably, several flanker congruency types are ommitted from this initial realization of this task. For example, the number in incongruent trials is always different from the target numbers, whereas in congruent trials they are the same. It is entirely feasible to use congruent stimuli that are the same parity/magnitude type but are a different number. For example, for the stimulus '2', distractors '4' could be used for a stimulus '44244' that is congruent while using a different number. This would fix a potential confound in number versus parity/magnitude differences. Likewise, doubly incongruent (both magnitude AND parity different, i.e., '3' vs. '8') are also not used in this first version. Future versions of this task will use these stimuli types and identify any potential confounds.

# Repo Contents

`menu.html` calls `menu.js`, the main experiment script which calls the demographics, task, and submission scripts. `main.html` is the main task html file, and recruits a variety of scripts, including `main.js`, `instructions.js`, and `tasks.js`, which together run the task.

To see the main experiment flow, run `menu.html` and then call the script `updateMenu()` using your browser's DevTools console. This will override the initial MTurk script that requires an MTurk ID.

To see the main experiment, including instructions, practice, and the main task, run `main.html`.

Email any questions or comments to raphael (dot) geddert (at) duke (dot) edu
