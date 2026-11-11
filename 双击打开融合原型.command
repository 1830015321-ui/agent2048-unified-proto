#!/bin/bash
cd "$(dirname "$0")"
PORT=9876
# kill previous server on this port if ours
lsof -ti tcp:$PORT 2>/dev/null | xargs -r kill 2>/dev/null
python3 -m http.server $PORT >/tmp/si-unified-9876.log 2>&1 &
sleep 0.4
open "http://127.0.0.1:${PORT}/step1-领证.html"
