#!/bin/bash
# Makes every lesson's Kokoro recording for both coaches (Tali `am_puck`, Tala `af_heart`) side by side at low priority, and every 20
# minutes uploads what is finished to Supabase (up to the budget in upload-supabase.mjs). Resumable: run it again after an interruption.
#
#   nohup caffeinate -i scripts/audio/run-all.sh > scripts/audio/out/run-all.log 2>&1 &     (from the project root; caffeinate keeps the Mac awake)
#   cat scripts/audio/out/run-all.pid                                                      the process to stop:  kill $(cat scripts/audio/out/run-all.pid)
#   tail -2 scripts/audio/out/generate-am_puck-all.log                                      progress, "[n/580] lesson"
#   scripts/audio/out/run-all.done                                                          appears when everything is finished and uploaded
cd "$(dirname "$0")" || exit 1
echo $$ > out/run-all.pid
rm -f out/run-all.done
PY=.venv/bin/python
upload() { (cd ../.. && node --env-file=.env scripts/audio/upload-supabase.mjs) >> out/upload.log 2>&1; }

nice -n 19 $PY generate.py --voice am_puck --all > out/generate-am_puck-all.log 2>&1 &
TALI=$!
nice -n 19 $PY generate.py --voice af_heart --all > out/generate-af_heart-all.log 2>&1 &
TALA=$!

while kill -0 $TALI 2>/dev/null || kill -0 $TALA 2>/dev/null; do
  sleep 1200
  upload
done
upload
date > out/run-all.done
