#!/bin/bash
# Waits for queue-dsa.sh to finish (Data Structures and Algorithms recorded, then that course and Building AI Agents uploaded), then deletes every local
# recording that is verified in the bucket (free-local-audio.mjs checks sizes against R2 itself; anything not fully hosted is kept).
# Start: nohup scripts/audio/queue-free.sh > scripts/audio/out/queue-free.log 2>&1 &
cd "$(dirname "$0")/../.." || exit 1
while [ ! -f scripts/audio/out/queue-dsa.done ]; do sleep 300; done
node --env-file=.env scripts/audio/free-local-audio.mjs --delete
date > scripts/audio/out/queue-free.done
