#!/bin/bash
# Makes the Kokoro recordings of How Large Language Models Work (77 lessons, English) for both voices side by side at low priority. Local files only: nothing is uploaded
# (hosting the recordings is the owner's step: scripts/audio/upload-r2.mjs). Kokoro has no Filipino voice, so narration is English only. Start:
#   nohup caffeinate -i scripts/audio/run-how-llms-work.sh > scripts/audio/out/run-how-llms-work.log 2>&1 &
# First: seq -f 'how-llms-work-%02g' 1 77 > scripts/audio/out/how-llms-work-lessons.txt && cat scripts/audio/out/how-llms-work-lessons.txt | xargs node scripts/audio/export-scripts.cjs
# (re-run after the lessons' text changes). Gemini speech is never used for lessons (owner's decision, 2026-11-15, 2026-11-17 and 2026-11-18: "use Kokoro TTS here").
cd "$(dirname "$0")" || exit 1
rm -f out/run-how-llms-work.done
PY=.venv/bin/python
IDS=$(cat out/how-llms-work-lessons.txt)
nice -n 19 $PY generate.py --voice am_puck --lessons $IDS > out/generate-am_puck-how-llms-work.log 2>&1 &
A=$!
nice -n 19 $PY generate.py --voice af_heart --lessons $IDS > out/generate-af_heart-how-llms-work.log 2>&1 &
B=$!
wait $A $B
date > out/run-how-llms-work.done
