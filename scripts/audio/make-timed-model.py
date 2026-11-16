"""Makes models/kokoro-v1.0-timed.onnx: the same Kokoro v1.0 network with ONE extra output, `duration`, the number of audio frames the
model gives each phoneme (the value it already computes to lay the speech out in time). Nothing else changes, so the audio is
byte-for-byte what models/kokoro-v1.0.onnx makes; kokoro-onnx (0.6+) sees the `duration` output and can then say when each phoneme is
spoken (`create_timed`), which word-timings.py turns into the start and end of every WORD for the app's follow-along highlight.

  .venv/bin/pip install onnx        (one time; only this script needs it)
  .venv/bin/python make-timed-model.py
"""
from pathlib import Path

import onnx
from onnx import TensorProto, helper

HERE = Path(__file__).parent
SOURCE = HERE / 'models' / 'kokoro-v1.0.onnx'
TARGET = HERE / 'models' / 'kokoro-v1.0-timed.onnx'
# The predictor's rounded, clipped durations (sigmoid -> sum -> / speed -> round -> clip(min 1) -> int64), found by name in the export.
DURATIONS = '/encoder/Cast_output_0'

model = onnx.load(str(SOURCE))
graph = model.graph
producer = [n for n in graph.node if DURATIONS in n.output]
if len(producer) != 1 or producer[0].op_type != 'Cast' or not producer[0].name.startswith('/encoder/'):
    raise SystemExit(f'{DURATIONS} is not the duration cast in this model: the export differs, inspect the graph before patching')
if any(o.name == 'duration' for o in graph.output):
    raise SystemExit('already has a duration output')
graph.node.append(helper.make_node('Identity', [DURATIONS], ['duration'], name='/timing/Duration'))
graph.output.append(helper.make_tensor_value_info('duration', TensorProto.INT64, None))
# (onnx.checker insists on a declared shape; the output is a plain int64 vector and onnxruntime, which is what runs it, loads it fine)
onnx.save(model, str(TARGET))
print(f'wrote {TARGET} ({TARGET.stat().st_size // 1_000_000} MB)')
