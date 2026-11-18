#!/bin/bash
# Makes the Kokoro recordings of Software Architecture with AI (44 lessons, English) for both voices side by side at low priority. Local files only: nothing is uploaded
# (hosting the recordings is the owner's step: scripts/audio/upload-r2.mjs). Kokoro has no Filipino voice, so narration is English only. Start:
#   nohup caffeinate -i scripts/audio/run-software-architecture.sh > scripts/audio/out/run-software-architecture.log 2>&1 &
# First: seq -f 'software-architecture-ai-%02g' 1 44 > scripts/audio/out/software-architecture-lessons.txt && cat scripts/audio/out/software-architecture-lessons.txt | xargs node scripts/audio/export-scripts.cjs
# (re-run after the lessons' text changes). Gemini speech is never used for lessons (owner's decision, 2026-11-15 and 2026-11-17).
cd "$(dirname "$0")" || exit 1
rm -f out/run-software-architecture.done
PY=.venv/bin/python
IDS=$(cat out/software-architecture-lessons.txt)
nice -n 19 $PY generate.py --voice am_puck --lessons $IDS > out/generate-am_puck-software-architecture.log 2>&1 &
A=$!
nice -n 19 $PY generate.py --voice af_heart --lessons $IDS > out/generate-af_heart-software-architecture.log 2>&1 &
B=$!
wait $A $B
date > out/run-software-architecture.done
