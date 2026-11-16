#!/bin/bash
# Makes the Kokoro recordings of the lessons listed in out/new-courses.txt for both voices side by side at low priority, then uploads to R2.
#   nohup caffeinate -i scripts/audio/run-new.sh > scripts/audio/out/run-new.log 2>&1 &
cd "$(dirname "$0")" || exit 1
rm -f out/run-new.done
PY=.venv/bin/python
nice -n 19 $PY generate.py --voice am_puck --lessons $(cat out/new-courses.txt) > out/generate-am_puck-new.log 2>&1 &
A=$!
nice -n 19 $PY generate.py --voice af_heart --lessons $(cat out/new-courses.txt) > out/generate-af_heart-new.log 2>&1 &
B=$!
wait $A $B
(cd ../.. && node --env-file=.env scripts/audio/upload-r2.mjs) >> out/upload-r2-new.log 2>&1
date > out/run-new.done
