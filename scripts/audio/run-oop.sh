#!/bin/bash
# Makes the Kokoro recordings of Object-Oriented Programming (80 lessons) for both voices side by side at low priority. Local files only: nothing is uploaded
# (hosting the recordings is the owner's step: scripts/audio/upload-r2.mjs). Start:
#   nohup caffeinate -i scripts/audio/run-oop.sh > scripts/audio/out/run-oop.log 2>&1 &
# First: cat scripts/audio/out/oop-lessons.txt | xargs node scripts/audio/export-scripts.cjs   (re-run after the lessons' text changes). Check any recording: .venv/bin/python check-timing.py out/audio/am_puck/<id>.m4a
cd "$(dirname "$0")" || exit 1
rm -f out/run-oop.done
PY=.venv/bin/python
IDS=$(cat out/oop-lessons.txt)
nice -n 19 $PY generate.py --voice am_puck --lessons $IDS > out/generate-am_puck-oop.log 2>&1 &
A=$!
nice -n 19 $PY generate.py --voice af_heart --lessons $IDS > out/generate-af_heart-oop.log 2>&1 &
B=$!
wait $A $B
date > out/run-oop.done
