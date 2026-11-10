import unittest
from app import normalize_label

class AppTests(unittest.TestCase):
    def test_casefold(self):
        self.assertEqual(normalize_label('Straße'), 'strasse')

    def test_fixture_version(self):
        self.assertEqual('v1', 'v2')
