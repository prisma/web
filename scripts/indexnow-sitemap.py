"""Parse a complete URL sitemap before any removal notifications are calculated."""

import json
import re
import sys
import xml.etree.ElementTree as ET


def parse_sitemap(xml):
    """Reject malformed XML, DTDs, and invalid URL/loc structure."""
    if re.search(r"<!DOCTYPE|<!ENTITY", xml, re.IGNORECASE):
        raise ValueError("DTD and entity declarations are not allowed")
    root = ET.fromstring(xml)
    namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    if root.tag not in ("urlset", namespace + "urlset"):
        raise ValueError("Expected a URL sitemap")
    prefix = namespace if root.tag.startswith("{") else ""
    urls = []
    for entry in root:
        if entry.tag != prefix + "url":
            raise ValueError("Unexpected sitemap entry")
        locations = entry.findall(prefix + "loc")
        if len(locations) != 1 or len(locations[0]) or not locations[0].text:
            raise ValueError("Each URL must have one text-only loc")
        urls.append(locations[0].text.strip())
    if not urls or len(urls) > 10000:
        raise ValueError(f"Unexpected sitemap size: {len(urls)}")
    return urls


if __name__ == "__main__":
    try:
        print(json.dumps(parse_sitemap(sys.stdin.read())))
    except (ValueError, ET.ParseError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
