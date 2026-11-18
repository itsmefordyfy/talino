#!/bin/bash
# Waits until no other Kokoro generation is running on this Mac, then makes the recordings of How Large Language Models Work (run-how-llms-work.sh).
# Start: nohup scripts/audio/queue-how-llms-work.sh > /dev/null 2>&1 &
while pgrep -f "[g]enerate\.py --voice" > /dev/null; do sleep 300; done
cd "$(dirname "$0")/../.." || exit 1
exec caffeinate -i scripts/audio/run-how-llms-work.sh
