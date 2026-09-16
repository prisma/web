#!/usr/bin/env bash
# Fails if docs pages contain banned source-code jargon in prose.
# Usage: check-plain.sh <file.mdx> [more files...]   Exit 1 on any hit.
#
# What is checked: the unconditional rows of references/banned-terms.md. Rows marked
# "(unexplained)" there (emit, signature, marker, ref, plan) are allowed when the sentence
# defines them, which a regex cannot judge; the reader review covers those.
# What is skipped: fenced code (``` or ~~~, indented or not), indented code blocks,
# inline code, link targets, pinned heading anchors, href attributes, the front-matter url line, and any line carrying the marker {/* plain-language:defined */}, which
# an author adds only when the sentence itself defines the term in plain words.
set -u
pat='\bterminal (calls?|methods?|verbs?)\b|\b(read|write|query) terminals?\b|\bcodecs?\b|\benvelopes?\b|\btype position\b|\brelease (line|cycle)\b|\bruns ahead\b|\b(sql|raw|orm) lanes?\b|\blane object\b|\bfacades?\b|\bjunction (model|record|table)\b|\bjoin model\b|\bquery plans?\b|\blower(ed|ing)\b|\bnamespace-qualified\b|\bnamespace coordinate\b|\breducers?\b|\brefinement callback\b|\bdotted codes?\b|\b(CLI|config) envelope\b|\bdev loop\b|\bbrownfield\b|\bgreenfield\b|\bdeterministic\b|\bidempotent\b|\btopology\b|\bcapabilit(y|ies)\b|\bbuffer(s|ed)? (the|every|all)\b|\bmaterializ(e|es|ed)\b|\bunblocks?\b|\bAPI surface\b|\bsurfaces? (the|a|an|as)\b|\bwires? up\b|\blives at\b|\bhands back\b|\brides on\b|\broutes on\b|\bkeys on\b|\bmoves? (your|the|a) database (to|from) (the|an|a|where|one|its)\b|\bmoves? (your|the|a) database (to|from)[,.]|\bmoves? (your|the|a) database (back|forward)\b|\bmoves? the marker\b|\bmarker moves\b|\bmoves? (the|your) +refs?\b|\bspaces? moves? to\b|\bdatabases? (to )?catch(es)? up\b|\bwhere (the|a|your|my) database is\b'
status=0
for f in "$@"; do
  hits=$(awk '
    /^[[:space:]]*(```|~~~)/ { infence = !infence; next }
    infence { next }
    /^(    |\t)/ { next }
    /plain-language:defined/ { next }
    /^url: / { next }
    { print NR": "$0 }
  ' "$f" | sed -E 's/`(to|from)`/\1/g; s/`[^`]*`//g; s/\]\([^)]*\)/]/g; s/\[#[^]]*\]//g; s/href="[^"]*"//g' | grep -E -i "$pat" || true)
  if [ -n "$hits" ]; then status=1; echo "== $f"; echo "$hits" | cut -c1-160; fi
done
if [ $status -eq 0 ]; then echo "plain-language check: clean"; else echo "plain-language check: banned terms found"; fi
exit $status
