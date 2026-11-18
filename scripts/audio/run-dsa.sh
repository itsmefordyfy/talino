#!/bin/bash
# Finishes the Kokoro recordings of Data Structures and Algorithms (72 lessons) for both voices side by side at low priority. generate.py skips every lesson that
# already has its recording and timing, so this only makes what is missing (it stopped at lesson 48 on 2026-11-17). Local files only. Start:
#   nohup caffeinate -i scripts/audio/run-dsa.sh > scripts/audio/out/run-dsa.log 2>&1 &
# First: cat scripts/audio/out/dsa-lessons.txt | xargs node scripts/audio/export-scripts.cjs   (re-run after the lessons' text changes).
cd "$(dirname "$0")" || exit 1
rm -f out/run-dsa.done
PY=.venv/bin/python
IDS=$(cat out/dsa-lessons.txt)
nice -n 19 $PY generate.py --voice am_puck --lessons $IDS >> out/generate-am_puck-dsa.log 2>&1 &
A=$!
nice -n 19 $PY generate.py --voice af_heart --lessons $IDS >> out/generate-af_heart-dsa.log 2>&1 &
B=$!
wait $A $B
date > out/run-dsa.done
