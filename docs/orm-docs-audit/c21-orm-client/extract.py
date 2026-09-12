import sys,json
out=[]
for line in open(sys.argv[1]):
    try: o=json.loads(line)
    except: continue
    if o.get("type")!="assistant": continue
    for b in o.get("message",{}).get("content",[]):
        if isinstance(b,dict) and b.get("type")=="text": out=[b["text"]]
print(out[0] if out else "")
