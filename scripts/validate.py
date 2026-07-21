#!/usr/bin/env python3
"""Dependency-free structural validation for the Fire & Ice static site."""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
IGNORED_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_count = 0
        self.h1_count = 0
        self.references: list[tuple[str, str]] = []
        self.images_without_alt: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "title":
            self.title_count += 1
        if tag == "h1":
            self.h1_count += 1
        if tag in {"a", "link"} and values.get("href"):
            self.references.append((tag, values["href"] or ""))
        if tag in {"img", "script"} and values.get("src"):
            self.references.append((tag, values["src"] or ""))
        if tag == "img" and "alt" not in values:
            self.images_without_alt.append(values.get("src") or "unknown image")


def local_path(page: Path, value: str) -> Path | None:
    if not value or value.startswith("#"):
        return None
    parsed = urlsplit(value)
    if parsed.scheme.lower() in IGNORED_SCHEMES or parsed.netloc:
        return None
    clean = parsed.path
    if not clean:
        return None
    return (page.parent / clean).resolve()


def main() -> int:
    errors: list[str] = []
    pages = sorted(ROOT.glob("*.html"))
    if not pages:
        errors.append("No HTML pages found.")

    for page in pages:
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))

        if parser.title_count != 1:
            errors.append(f"{page.name}: expected one <title>, found {parser.title_count}")
        if parser.h1_count != 1:
            errors.append(f"{page.name}: expected one <h1>, found {parser.h1_count}")
        for image in parser.images_without_alt:
            errors.append(f"{page.name}: missing alt text on {image}")
        for tag, value in parser.references:
            target = local_path(page, value)
            if target and not target.exists():
                errors.append(f"{page.name}: missing local {tag} reference {value}")

        print(
            f"PASS {page.name}: title={parser.title_count}, "
            f"h1={parser.h1_count}, references={len(parser.references)}"
        )

    css_entry = ROOT / "assets/css/styles.css"
    if not css_entry.exists():
        errors.append("Missing assets/css/styles.css")
    else:
        for line in css_entry.read_text(encoding="utf-8").splitlines():
            if "@import" not in line:
                continue
            imported = line.split("url(", 1)[1].split(")", 1)[0].strip("\"'")
            if not (css_entry.parent / imported).exists():
                errors.append(f"styles.css: missing imported stylesheet {imported}")

    if errors:
        print("\nVALIDATION FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"\nPASS: validated {len(pages)} pages with no structural errors.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
