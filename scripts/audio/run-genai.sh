#!/bin/bash
# Makes the Kokoro recordings of Generative AI: From Fundamentals to Real-World Applications (67 lessons, English) for both voices side by side at low priority. Local files only: nothing is uploaded
# (hosting the recordings is the owner's step: scripts/audio/upload-r2.mjs). Start:
#   nohup caffeinate -i scripts/audio/run-genai.sh > scripts/audio/out/run-genai.log 2>&1 &
# First: cat scripts/audio/out/genai-lessons.txt | xargs node scripts/audio/export-scripts.cjs   (re-run after the lessons' text changes).
cd "$(dirname "$0")" || exit 1
rm -f out/run-genai.done
PY=.venv/bin/python
IDS=$(cat out/genai-lessons.txt)
nice -n 19 $PY generate.py --voice am_puck --lessons $IDS > out/generate-am_puck-genai.log 2>&1 &
A=$!
nice -n 19 $PY generate.py --voice af_heart --lessons $IDS > out/generate-af_heart-genai.log 2>&1 &
B=$!
wait $A $B
date > out/run-genai.done
