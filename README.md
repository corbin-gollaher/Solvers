How does it work?
The solver will pull from available words from a 12,000 word bank. Common words take precedence over lesser known words, and the suggestions will create the smallest possible set of resulting words.

Does it work on mobile devices?
No, still figuring that out.

What limitations does it have?
Since it is meant to be a 'Hard mode' solver, it only gives suggestions that are valid based on the hints you received. This makes it different than other solvers, who solely guess words that decrease the solution set the most.

What bugs does it have?
Consider the word solution is "BLEAK", you guess "TEAMS" which gives you a yellow 'E' on the second letter. Then you guess "BLEED". Wordle will make the 'E' that matches with "BLEAK", but make the second 'E' gray. If you input the second 'E' as grey in the solver, it will break it. Change that 'E' to yellow in the solver, and the solver will work just fine.

Speed Issues?
I have it limited to give the best solution with less than 250 possible words. If the available words is over 250, it will return a valid solution with every letter being unique.
