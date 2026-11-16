"""Checks of word_timing.align with a stand-in phonemiser (no model needed):  .venv/bin/python -m unittest test_word_timing"""
import unittest
from collections import namedtuple

from word_timing import align

Timing = namedtuple('Timing', 'phoneme start end')


class Fake:
    """A speech engine whose words are looked up in a table."""

    def __init__(self, table):
        self.tokenizer = self
        self.table = table

    def phonemize(self, word, lang):
        return self.table.get(word, '')


def timings_of(phrase, step=0.1):
    """One timing per phoneme character, `step` seconds each; spaces are timings too, as kokoro-onnx reports them."""
    return [Timing(ch, round(i * step, 3), round((i + 1) * step, 3)) for i, ch in enumerate(phrase)]


class AlignTest(unittest.TestCase):
    def test_every_word_starts_where_its_first_sound_is(self):
        engine = Fake({'one': 'wʌn', 'two': 'tuː', 'three': 'θɹiː'})
        starts, matched = align(engine, 'one two three', 'en-us', timings_of('wʌn tuː θɹiː'))
        self.assertEqual(starts, [0.0, 0.4, 0.8])
        self.assertEqual(matched, 1.0)

    def test_words_the_engine_joins_each_still_get_a_start(self):
        # "at a" is spoken as one group "æɾə"; the words on their own are "æt" and "ɐ".
        engine = Fake({'stops': 'stɑps', 'at': 'æt', 'a': 'ɐ', 'point': 'pɔɪnt'})
        starts, _ = align(engine, 'stops at a point', 'en-us', timings_of('stɑps æɾɐ pɔɪnt'))
        self.assertEqual(len(starts), 4)
        self.assertEqual(starts[0], 0.0)
        self.assertEqual(starts[1], 0.6)  # "at" at the start of the joined group
        self.assertEqual(starts[3], 1.0)  # "point" after it
        self.assertEqual(starts, sorted(starts))

    def test_a_word_the_engine_splits_into_several_groups_is_one_word(self):
        engine = Fake({'ask': 'ɑːsk', 'GPT,': 'dʒiːpiːtiː,', 'now': 'naʊ'})
        starts, _ = align(engine, 'ask GPT, now', 'en-us', timings_of('ɑːsk dʒiː piː tiː, naʊ'))
        self.assertEqual(starts[0], 0.0)
        self.assertEqual(starts[1], 0.5)
        self.assertEqual(starts[2], 1.9)

    def test_a_word_with_no_sound_is_lit_with_the_next_word(self):
        engine = Fake({'•': '', 'Hello': 'həloʊ'})
        starts, _ = align(engine, '• Hello', 'en-us', timings_of('həloʊ'))
        self.assertEqual(starts, [0.0, 0.0])

    def test_a_word_said_differently_in_context_lands_between_its_neighbours(self):
        # "A" alone is the letter's name (ˈeɪ) but in the sentence it is "ɐ": nothing matches, so it is placed by its share.
        engine = Fake({'A': 'ˈeɪ', 'plain': 'plˈeɪn', 'day': 'dˈeɪ'})
        starts, _ = align(engine, 'A plain day', 'en-us', timings_of('ɐ plˈeɪn dˈeɪ'))
        self.assertLess(starts[0], starts[1])
        self.assertEqual(starts[0], 0.0)
        self.assertEqual(starts, sorted(starts))

    def test_nothing_spoken_or_nothing_to_say(self):
        engine = Fake({})
        self.assertEqual(align(engine, '', 'en-us', []), ([], 1.0))
        self.assertEqual(align(engine, 'a b', 'en-us', [])[0], [0.0, 0.0])

    def test_never_goes_backwards(self):
        engine = Fake({'a': 'ɐ', 'b': 'bˈiː', 'c': 'sˈiː'})
        starts, _ = align(engine, 'a b c', 'en-us', timings_of('ɐ bˈiː sˈiː'))
        self.assertEqual(starts, sorted(starts))


if __name__ == '__main__':
    unittest.main()
