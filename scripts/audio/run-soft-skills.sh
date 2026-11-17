#!/bin/bash
# Makes the Kokoro recordings of Soft Skills for the Modern Workplace (54 lessons, English) for both voices side by side at low priority. Local files only: nothing is uploaded
# (hosting the recordings is the owner's step: scripts/audio/upload-r2.mjs). Start:
#   nohup caffeinate -i scripts/audio/run-soft-skills.sh > scripts/audio/out/run-soft-skills.log 2>&1 &
# First: cat scripts/audio/out/soft-skills-lessons.txt | xargs node scripts/audio/export-scripts.cjs   (re-run after the lessons' text changes).
cd "$(dirname "$0")" || exit 1
rm -f out/run-soft-skills.done
PY=.venv/bin/python
IDS=$(cat out/soft-skills-lessons.txt)
nice -n 19 $PY generate.py --voice am_puck --lessons $IDS > out/generate-am_puck-soft-skills.log 2>&1 &
A=$!
nice -n 19 $PY generate.py --voice af_heart --lessons $IDS > out/generate-af_heart-soft-skills.log 2>&1 &
B=$!
wait $A $B
date > out/run-soft-skills.done
