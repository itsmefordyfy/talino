"""The two short greetings the welcome plays when the learner taps "Hear Tali" / "Hear Tala": bundled in the app
(assets/audio/), so the choice of coach can be heard with no connection and before any lesson audio is hosted.
Same voices as the lessons (`COMPANIONS` in src/features/companion/lib/companions.ts).

  .venv/bin/python coach-samples.py
"""
from pathlib import Path

from kokoro_onnx import Kokoro

from generate import DEFAULT_SPEED, HERE, speak, to_m4a

SAMPLES = {
    'tali': ('am_puck', "Hi, I'm Tali! I'm your coach here at Talino. I'll read your lessons aloud, and I'm always right here whenever you get stuck. Let's have some fun!"),
    'tala': ('af_heart', "Hi, I'm Tala! I'm your coach here at Talino. I'll read your lessons aloud, and I'm always right here whenever you get stuck. Let's have some fun!"),
}
OUT = HERE.parent.parent / 'assets' / 'audio'

kokoro = Kokoro(str(HERE / 'models' / 'kokoro-v1.0.onnx'), str(HERE / 'models' / 'voices-v1.0.bin'))
for name, (voice, text) in SAMPLES.items():
    target = OUT / f'coach-{name}.m4a'
    to_m4a(speak(kokoro, text, voice, DEFAULT_SPEED), target)
    print(target, target.stat().st_size // 1024, 'KB')
