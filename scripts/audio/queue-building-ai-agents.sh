#!/bin/bash
# Waits until no other Kokoro generation is running on this Mac, then makes the recordings of Building AI Agents (run-building-ai-agents.sh).
# Start: nohup scripts/audio/queue-building-ai-agents.sh > /dev/null 2>&1 &
while pgrep -f "[g]enerate\.py --voice" > /dev/null; do sleep 300; done
cd "$(dirname "$0")/../.." || exit 1
exec caffeinate -i scripts/audio/run-building-ai-agents.sh > scripts/audio/out/run-building-ai-agents.log 2>&1
