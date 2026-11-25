"""Incomplete publisher evidence must never report a current inventory."""
import contextlib
import gzip
import importlib.util
import io
import json
from pathlib import Path
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("inventory", Path(__file__).with_name("check-technology-inventory.py"))
inventory = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(inventory)


class InventoryEvidence(unittest.TestCase):
    def test_network_failure_is_incomplete_not_current(self):
        data = {"reviewed_on": str(inventory.date.today()), "technologies": [{"name": "Python", "latest_stable_as_of_review": "3.14.7"}]}
        with patch.object(inventory.Path, "read_text", return_value=json.dumps(data)), patch.object(inventory, "latest_release", side_effect=OSError("offline")), patch("sys.argv", ["checker"]), contextlib.redirect_stdout(io.StringIO()) as output:
            self.assertEqual(inventory.main(), 2)
        self.assertNotIn("inventory is current", output.getvalue())

    def test_python_prerelease_cannot_become_stable_baseline(self):
        response = unittest.mock.MagicMock()
        response.__enter__.return_value.read.return_value = b"Python 3.15.0rc1 Python 3.14.7 Python 3.13.14"
        with patch.object(inventory, "urlopen", return_value=response):
            self.assertEqual(inventory.latest_release("Python"), "3.14.7")

    def test_missing_release_is_an_error(self):
        response = unittest.mock.MagicMock()
        response.__enter__.return_value.read.return_value = b"Service unavailable"
        with patch.object(inventory, "urlopen", return_value=response):
            with self.assertRaises(ValueError):
                inventory.latest_release("Mermaid")

    def test_gzipped_publisher_response_is_decoded(self):
        response = unittest.mock.MagicMock()
        response.__enter__.return_value.read.return_value = gzip.compress(b"Python 3.14.7")
        with patch.object(inventory, "urlopen", return_value=response):
            self.assertEqual(inventory.latest_release("Python"), "3.14.7")


if __name__ == "__main__":
    unittest.main()
