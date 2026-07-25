#!/bin/sh
# Rebuild and restart the production server on PORT (default 3100).
# Kills only previously recorded PIDs so it never matches the parent shell.
set -e
PORT="${PORT:-3100}"
PIDFILE=".next/serve.pid"
cd "$(dirname "$0")/.."
[ -f "$PIDFILE" ] && kill "$(cat "$PIDFILE")" 2>/dev/null || true
npm run build
setsid nohup npx next start -p "$PORT" >/tmp/next-serve.log 2>&1 </dev/null &
echo $! > "$PIDFILE"
for i in $(seq 1 40); do
  sleep 1
  if curl -sf -o /dev/null --noproxy '*' "http://127.0.0.1:$PORT/"; then
    echo "ready on $PORT"; exit 0
  fi
done
echo "server did not come up"; tail -20 /tmp/next-serve.log; exit 1
