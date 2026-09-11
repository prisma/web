#!/usr/bin/env bash
# Fails if docs pages contain banned source-code jargon in prose. Code blocks and inline code are ignored.
# Usage: check-plain.sh <file.mdx> [more files...]   Exit 1 on any hit. Keep the pattern in sync with references/banned-terms.md.
pat='\bterminal (call|method|verb)\b|\bterminals?\b|\bcodecs?\b|\benvelopes?\b|\btype position\b|\brelease line\b|\brelease cycle\b|\bruns ahead\b|\blanes?\b|\bfacades?\b|\bjunction model\b|\bjoin model\b|\bquery plans?\b|\blowered\b|\blowering\b|\bnamespace-qualified\b|\bnamespace coordinate\b|\breducers?\b|\brefinement callback\b|\bdotted codes?\b|\bCLI envelope\b|\bdev loop\b|\bbrownfield\b|\bgreenfield\b|\bdeterministic\b|\bidempotent\b|\btopology\b|\bunblocks?\b|\bsurfaces?\b|\bwires? up\b|\blives at\b|\bhands back\b|\brides on\b|\broutes on\b|\bkeys on\b|\bAPI surface\b|\bmaterializes?\b'
status=0
for f in "$@"; do
  # strip fenced code blocks and inline code before checking prose
  hits=$(awk '/^```/{c=!c;next} !c' "$f" | sed 's/`[^`]*`//g' | grep -n -E -i "$pat" || true)
  if [ -n "$hits" ]; then status=1; echo "== $f"; echo "$hits" | cut -c1-160; fi
done
[ $status -eq 0 ] && echo "plain-language check: clean" || echo "plain-language check: banned terms found"
exit $status
