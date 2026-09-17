#!/usr/bin/env python3
"""Add hand-read verdicts to techseo-notes.json.

    python3 scripts/sheets/techseo-note.py < notes.tsv

Each line:  <status>\t<opening words of the instruction>\t<why>
Status is met | fixed | na | open. The opening words are matched as a
prefix of the instruction text (lower-cased, punctuation dropped) against
scripts/sheets/out/techseo.json, and one note is written per distinct
instruction they open — under the key check-techseo.mts looks up (the
first 48 normalised characters), across every sheet the line appears on.
Opening words that open no instruction are reported, not written.
"""
import json, re, sys
P = "scripts/sheets/techseo-notes.json"
notes = json.load(open(P))
norm = lambda t: re.sub(r"[^a-z0-9]+", " ", t.lower()).strip()
lines = {norm(i["text"]) for i in json.load(open("scripts/sheets/out/techseo.json"))}
n = 0
for line in sys.stdin:
    line = line.rstrip("\n")
    if not line.strip() or line.startswith("#"): continue
    status, text, why = line.split("\t", 2)
    prefix = norm(text)
    keys = {l[:48] for l in lines if l.startswith(prefix)}
    if not keys:
        print(f"  ! no instruction opens with: {text[:70]}")
        continue
    for k in keys:
        notes[f"*:{k}"] = {"status": status.strip(), "why": why.strip()}
        n += 1
json.dump(notes, open(P, "w"), indent=1, ensure_ascii=False)
print(f"{n} note(s) added · {len(notes)} total")
