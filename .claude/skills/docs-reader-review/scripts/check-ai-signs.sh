#!/usr/bin/env bash
# Fails if docs or blog pages contain the signs of AI writing a regex can catch.
# Usage: check-ai-signs.sh <file.mdx> [more files...]   Exit 1 on any hit.
#
# What is checked: the vocabulary table, the phrase-level sentence shapes, the leaked-chat
# phrases, em dashes, curly quotes, thematic breaks, and title-case headings from
# references/ai-writing-signs.md. Bold-label lists, the rule of three, participle tails,
# elegant variation, puffed significance, and "represents"/"refers to" in place of "is" need a
# reader (docs use those two verbs literally too often to grep); the reader review covers those.
# What is skipped: fenced code, indented code blocks, inline code, link targets, pinned heading
# anchors, href attributes, front matter, and import/export lines.
set -u
vocab='\b(additionally|moreover|furthermore),|\b(crucial|pivotal|robust|seamless(ly)?|leverag(e|es|ed|ing)|utiliz(e|es|ed|ing)|enhanc(e|es|ed|ing)|bolster(s|ed|ing)?|foster(s|ed|ing)?|cultivat(e|es|ed|ing)|empower(s|ed|ing)?|showcas(e|es|ed|ing)|underscor(e|es|ed|ing)|delv(e|es|ed|ing)|deep dive|tapestry|testament to|vibrant|intricate|nuanced|streamlined|cutting-edge|groundbreaking|garner(s|ed)?|boasts?|interplay|synergy|paradigm|meticulous(ly)?|thoughtfully|invaluable|game-chang(er|ing))\b|\b(in today.s world|in the modern era|ever-evolving|the landscape of|the realm of)\b|\b(align|aligns|aligned|resonate|resonates) with\b'
shapes='\b(serves?|acts?|functions?|stands?) as an?\b|\bnot (just|only|merely) [^.]{1,60}\bbut( also)?\b|\bisn.t [^.]{1,40}, it.s\b|\b(is|are|was|were|has been|have been) (closely |directly )?associated with\b|\bin connection with\b|\b(it.s|it is) (important|worth|crucial|essential|critical) (to note|noting|to remember|to consider|to keep in mind)\b|\bworth noting\b|\bkeep in mind that\b|\b(in summary|in conclusion|to recap|to sum up|overall),|\bdespite (these|its|their) (challenges|limitations|advantages)\b|\bfaces? (several|numerous|many|a number of) challenges\b|\b(many|most) (developers|teams|users|engineers) (find|agree|prefer|consider)\b|\b(it is|it.s) widely (considered|regarded|accepted)\b|\bexperts (recommend|agree|suggest)\b|\bbest practices? (suggests?|dictates?|recommends?)\b'
leaked='\bi hope this helps\b|\blet me know if\b|\bwould you like me to\b|\bcertainly!|\bhere.s an? (breakdown|overview|summary) of\b|\bbelow is an? (breakdown|overview|summary)\b|\bin this (section|guide|article|post),? we (will|.ll)\b|\bthis (document|page|guide|article) aims to\b|\bas mentioned (above|earlier|previously)\b|\[(your name|link to [^]]*|insert [^]]*)\]|\bINSERT_[A-Z_]+\b|\b20[0-9]{2}-(xx|XX)-(xx|XX)\b|\bbased on (the )?available (information|sources)\b|\bnot (widely|extensively|well) (documented|available|known)\b|\bas of my last\b|\bas an ai\b'
typo='—|[“”‘’]'
status=0
for f in "$@"; do
  prose=$(awk '
    NR == 1 && $0 == "---" { infront = 1; next }
    infront { if ($0 == "---") infront = 0; next }
    /^[[:space:]]*(```|~~~)/ { infence = !infence; next }
    infence { next }
    /^(    |\t)/ { next }
    /^(import|export) / { next }
    { print NR": "$0 }
  ' "$f" | sed -E 's/`[^`]*`//g; s/\]\([^)]*\)/]/g; s/\[#[^]]*\]//g; s/href="[^"]*"//g')
  hits=$(
    printf '%s\n' "$prose" | grep -E -i "$vocab|$shapes|$leaked"
    printf '%s\n' "$prose" | grep -E "$typo" | sed 's/$/    [em dash or curly quote]/'
    printf '%s\n' "$prose" | grep -E '^[0-9]+: ---+$' | sed 's/$/    [thematic break]/'
    printf '%s\n' "$prose" | grep -E '^[0-9]+: #{2,} ([0-9.]+ )?[A-Za-z]\S*.* (A|An|The|Of|To|For|With|And|Or|In|On|Your|From|Into|Via) ' | sed 's/$/    [title case heading]/'
  )
  if [ -n "$hits" ]; then status=1; echo "== $f"; printf '%s\n' "$hits" | sort -t: -k1,1n -s | cut -c1-180; fi
done
if [ $status -eq 0 ]; then echo "ai-signs check: clean"; else echo "ai-signs check: signs found (references/ai-writing-signs.md)"; fi
exit $status
