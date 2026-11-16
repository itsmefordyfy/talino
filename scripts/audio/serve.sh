#!/bin/sh
# Serves the finished lesson audio to the app while developing: the simulator and any phone on the same Wi-Fi can play
# the Kokoro voice. Run it in a terminal and leave it running (Ctrl-C stops it); the address is the one in
# `.env.development.local` (EXPO_PUBLIC_AUDIO_ORIGIN). For real users the audio is hosted instead (README).
cd "$(dirname "$0")/out/audio" || exit 1
echo "Serving $(pwd) on http://$(ipconfig getifaddr en0 2>/dev/null || echo localhost):8099"
exec python3 -m http.server 8099 --bind 0.0.0.0
