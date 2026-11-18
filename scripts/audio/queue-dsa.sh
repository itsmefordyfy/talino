#!/bin/bash
# Waits until no other Kokoro generation is running on this Mac, finishes the Data Structures and Algorithms recordings (run-dsa.sh), then uploads that course and
# Building AI Agents to the audio host (upload-r2.mjs sends only finished lessons and skips what is already there), so they play in the app without another step.
# Start: nohup scripts/audio/queue-dsa.sh > scripts/audio/out/queue-dsa.log 2>&1 &
while pgrep -f "[g]enerate\.py --voice" > /dev/null; do sleep 300; done
cd "$(dirname "$0")/../.." || exit 1
caffeinate -i scripts/audio/run-dsa.sh > scripts/audio/out/run-dsa.log 2>&1
node --env-file=.env scripts/audio/upload-r2.mjs --course=data-structures-algorithms
node --env-file=.env scripts/audio/upload-r2.mjs --course=building-ai-agents
date > scripts/audio/out/queue-dsa.done
