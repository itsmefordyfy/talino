#!/bin/bash
# Makes the Kokoro recordings of Building AI Agents (109 lessons, English) for both voices side by side at low priority. Local files only: nothing is uploaded
# (hosting the recordings is the owner's step: scripts/audio/upload-r2.mjs). Kokoro has no Filipino voice, so narration is English only. Start:
#   nohup caffeinate -i scripts/audio/run-building-ai-agents.sh > scripts/audio/out/run-building-ai-agents.log 2>&1 &
# First: seq -f 'building-ai-agents-%02g' 1 109 > scripts/audio/out/building-ai-agents-lessons.txt && cat scripts/audio/out/building-ai-agents-lessons.txt | xargs node scripts/audio/export-scripts.cjs
# (re-run after the lessons' text changes). Gemini speech is never used for lessons (owner's decision, 2026-11-15 and 2026-11-17; "use Kokoro TTS here", 2026-11-18).
cd "$(dirname "$0")" || exit 1
rm -f out/run-building-ai-agents.done
PY=.venv/bin/python
IDS=$(cat out/building-ai-agents-lessons.txt)
nice -n 19 $PY generate.py --voice am_puck --lessons $IDS > out/generate-am_puck-building-ai-agents.log 2>&1 &
A=$!
nice -n 19 $PY generate.py --voice af_heart --lessons $IDS > out/generate-af_heart-building-ai-agents.log 2>&1 &
B=$!
wait $A $B
date > out/run-building-ai-agents.done
