"""When each WORD of a sentence is spoken, from Kokoro's own phoneme durations (models/kokoro-v1.0-timed.onnx, see make-timed-model.py).

`segment_words` speaks one sentence with the timed model and returns the audio plus, for every whitespace-separated word of the text
(the same `\\S+` words the app lights up), the second inside the clip at which the voice reaches it. The audio is the one the plain
model makes (sentence_pause and clause_pause are 0 on purpose: with a duration output kokoro-onnx would otherwise add pauses after
commas, and the recordings made so far have none).
"""
from difflib import SequenceMatcher

import numpy as np

SAMPLE_RATE = 24000


# Said alone these are read as a letter's name; in a sentence they are the article.
ARTICLE = {'a': 'ɐ', 'A': 'ɐ'}


def groups_of(timings):
    """The sound groups the engine put spaces between: the start of each."""
    starts, inside = [], False
    for timing in timings:
        if timing.phoneme == ' ':
            inside = False
        elif not inside:
            starts.append(timing.start)
            inside = True
    return starts


def align(kokoro, text: str, lang: str, timings):
    """Start second of every whitespace-separated word of `text`, from the per-phoneme `timings` of the whole sentence.

    The speech engine does not keep words apart the way the screen does: it joins some ("at a" is one sound group), splits others
    ("ChatGPT" is three) and changes a sound or two by context. So each word is phonemised on its own, the phonemes of all the words are
    laid end to end and matched, character by character (difflib), against the phonemes the sentence was really spoken with; a word starts
    where its first phoneme is found. A word that cannot be matched (a bullet, a symbol) takes the start of the next one. Returns
    (starts, matched): `matched` is the share of the words' own phonemes found in the real speech (1.0 for a clean sentence)."""
    words = text.split()
    spoken = [t for t in timings if t.phoneme != ' ']
    if not words:
        return [], 1.0
    if not spoken:
        return [0.0] * len(words), 0.0
    real = ''.join(t.phoneme for t in spoken)
    own = [ARTICLE.get(word) or kokoro.tokenizer.phonemize(word, lang).replace(' ', '') for word in words]
    joined = ''.join(own)
    first, at = [], 0
    for phonemes in own:
        first.append(at)
        at += len(phonemes)
    where = {}
    matched = 0
    for block in SequenceMatcher(None, joined, real, autojunk=False).get_matching_blocks():
        for offset in range(block.size):
            where[block.a + offset] = block.b + offset
        matched += block.size
    share = matched / max(1, len(joined))
    # The engine's own word groups are one per word in most sentences: when they are and the phonemes agree, they are the answer.
    groups = groups_of(timings)
    if len(groups) == len(words) and share >= 0.75:
        return groups, share
    starts = [None] * len(words)
    for index, phonemes in enumerate(own):
        # The first of this word's own phonemes that has a match; none of them matched means the word is unknown.
        for position in range(first[index], first[index] + len(phonemes)):
            if position in where:
                starts[index] = spoken[where[position]].start
                break
    # A word with no match is placed between its neighbours that have one, by its share of their phonemes: a word said differently in
    # context than alone ("A" as a letter name vs. "ɐ") still lands where it is spoken, and a word with no sound at all (a bullet) takes
    # the start of the word after it.
    end_of_speech = spoken[-1].end
    index = 0
    while index < len(words):
        if starts[index] is not None:
            index += 1
            continue
        run_end = index
        while run_end < len(words) and starts[run_end] is None:
            run_end += 1
        before = index - 1 if index > 0 else None
        left = starts[before] if before is not None else spoken[0].start
        right = starts[run_end] if run_end < len(words) else end_of_speech
        weights = ([len(own[before]) or 1] if before is not None else []) + [len(own[k]) for k in range(index, run_end)]
        total = float(sum(weights)) or 1.0
        done = float(weights[0]) if before is not None else 0.0
        offset = 1 if before is not None else 0
        for k in range(index, run_end):
            starts[k] = left + (right - left) * done / total
            done += weights[k - index + offset]
        index = run_end
    return starts, share


def segment_words(kokoro, text: str, voice: str, speed: float, lang: str):
    """(audio, starts, matched): the sentence's samples, the start second of each of its words inside them, and how much of the words'
    own phonemes were found in the speech (see `align`)."""
    audio, _, timings = kokoro.create_timed(text, voice=voice, speed=speed, lang=lang, sentence_pause=0.0, clause_pause=0.0)
    starts, matched = align(kokoro, text, lang, timings)
    # Never past the clip, never backwards.
    limit = len(audio) / SAMPLE_RATE
    previous, clean = 0.0, []
    for start in starts:
        previous = min(limit, max(previous, start))
        clean.append(round(previous, 3))
    return audio, clean, matched
