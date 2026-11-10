import unittest
from app import is_weekend

class AppTests(unittest.TestCase):
    def test_sunday(self):
        self.assertTrue(is_weekend('SUN'))

    def test_monday(self):
        self.assertFalse(is_weekend('MON'))
