"""Local UTF-8 assignments with literal quoted values; no shell evaluation.

Use only when the project's reader supports this encoding. This is a file check,
not proof that a credential is valid with a vendor. Never print returned values.
"""
import os
from pathlib import Path
import re
import tempfile


class SetupError(Exception):
    pass


def _pattern(name):
    if not isinstance(name, str) or not re.fullmatch(r"[A-Z][A-Z0-9_]*", name):
        raise SetupError("Invalid configuration key name")
    return re.compile(r"^(?:\ufeff)?[ \t]*(?:export[ \t]+)?" + re.escape(name) + r"[ \t]*=(.*?)(?:\r?\n)?$")


def _read(destination):
    destination = Path(destination)
    if destination.is_symlink():
        raise SetupError("Destination must be a regular local file")
    try:
        return destination.read_bytes()
    except FileNotFoundError:
        return b""


def _validate(value):
    if not isinstance(value, str) or not value.strip():
        raise SetupError("A nonempty string is required")
    if any(ord(c) < 32 or ord(c) == 127 or c in "\x85\u2028\u2029" for c in value):
        raise SetupError("Control characters and multiline values are unsupported")
    try:
        value.encode("utf-8")
    except UnicodeError:
        raise SetupError("Value must be valid UTF-8") from None


def _encode(value):
    # Delimiters are literal: reject an unrepresentable value instead of escaping
    # it into a different credential for a reader that keeps backslashes.
    for delimiter in ("'", "`", '"'):
        if delimiter not in value:
            if delimiter == '"' and "\\" in value:
                raise SetupError("Double-quoted escapes require the application's verified encoding")
            return delimiter + value + delimiter
    raise SetupError("Value contains every supported delimiter; use the application's verified encoding")


def _decode(raw):
    if raw.startswith(("'", '"', "`")):
        end = raw.find(raw[0], 1)
        if end < 0 or (raw[end + 1:].strip() and not raw[end + 1:].strip().startswith("#")):
            raise SetupError("Target assignment has invalid quoting")
        value = raw[1:end]
        if raw[0] == '"' and "\\" in value:
            raise SetupError("Double-quoted escapes require the application's verified encoding")
        return value
    return raw.split("#", 1)[0].rstrip()


def _lines(data):
    try:
        lines = data.decode("utf-8").splitlines(keepends=True)
    except UnicodeError:
        raise SetupError("Configuration is not UTF-8") from None
    assignment = re.compile(r"^(?:\ufeff)?[ \t]*(?:export[ \t]+)?[A-Za-z_][A-Za-z0-9_]*[ \t]*=[ \t]*(['\"`])(.*)")
    for line in lines:
        match = assignment.match(line)
        rest = match.group(2) if match else ""
        if match and match.group(1) == '"':
            rest = re.sub(r"\\.", "", rest)  # an escaped quote does not close the value
        if line.rstrip("\r\n").endswith("\\") or (match and match.group(1) not in rest):
            # A target-looking line inside another multiline value is data.
            # Leave the entire file untouched rather than corrupt that value.
            raise SetupError("Multiline configuration requires the application's verified parser")
    return lines


def _value(data, name):
    pattern = _pattern(name)
    values = [m.group(1).strip() for line in _lines(data) if (m := pattern.fullmatch(line))]
    if len(values) != 1:
        raise SetupError("Exactly one target assignment is required")
    value = _decode(values[0])
    _validate(value)
    return value


def read_value(destination, name):
    return _value(_read(destination), name)


def store_value(destination, name, value, *, replace=False):
    """Preserve unrelated bytes; replacement needs the caller's explicit True."""
    _validate(value)
    pattern = _pattern(name)
    destination = Path(destination)
    original = _read(destination)
    lines = _lines(original)
    matches = [i for i, line in enumerate(lines) if pattern.fullmatch(line)]
    if matches and replace is not True:
        raise SetupError("Existing assignment requires replacement confirmation")
    newline = "\r\n" if b"\r\n" in original else "\n"
    assignment = name + "=" + _encode(value) + newline
    if matches:
        first = matches[0]
        prefix = "\ufeff" if lines[first].startswith("\ufeff") else ""
        lines = [prefix + assignment if i == first else line
                 for i, line in enumerate(lines) if i == first or i not in matches]
    else:
        if lines and not lines[-1].endswith(("\n", "\r")):
            lines[-1] += newline
        lines.append(assignment)
    updated = "".join(lines).encode("utf-8")
    if _value(updated, name) != value:
        raise SetupError("Value cannot be represented safely")
    temporary = None
    try:
        fd, temporary = tempfile.mkstemp(prefix=".setup-", dir=destination.parent)
        with os.fdopen(fd, "wb") as stream:
            os.fchmod(stream.fileno(), 0o600)
            stream.write(updated)
            stream.flush()
            os.fsync(stream.fileno())
        if _read(destination) != original:
            raise SetupError("Configuration changed; retry against current state")
        os.replace(temporary, destination)
        temporary = None
        if read_value(destination, name) != value:
            raise SetupError("Saved value did not verify")
    finally:
        if temporary is not None:
            os.unlink(temporary)
