#!/bin/bash
# Remakes the recordings whose lesson text changed since they were made (their timing was removed, see out/stale-<voice>.txt), for both voices
# side by side at low priority, then uploads everything to R2. Resumable: run it again after an interruption.
#   nohup caffeinate -i scripts/audio/run-stale.sh > scripts/audio/out/run-stale.log 2>&1 &
cd "$(dirname "$0")" || exit 1
echo $$ > out/run-stale.pid
rm -f out/run-stale.done
PY=.venv/bin/python
nice -n 19 $PY generate.py --voice am_puck --lessons $(cat out/stale-am_puck.txt) > out/generate-am_puck-stale.log 2>&1 &
A=$!
nice -n 19 $PY generate.py --voice af_heart --lessons $(cat out/stale-af_heart.txt) > out/generate-af_heart-stale.log 2>&1 &
B=$!
wait $A $B
(cd ../.. && node --env-file=.env scripts/audio/upload-r2.mjs) >> out/upload-r2-stale.log 2>&1
date > out/run-stale.done
