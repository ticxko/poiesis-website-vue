#!/usr/bin/env python3
"""Post-build prerender for the Poiesis SPA.

Serves ./dist over a tiny SPA-fallback HTTP server, drives a headless Chrome
(remote-debugging on :9227) to each route, waits for Vue + seo.js to render and
set the document head, then snapshots the fully-rendered HTML to
  dist/<route>/index.html   (dist/index.html for '/').

Result: every URL now serves static HTML with that page's real content, correct
<title>/description/canonical, per-page Open Graph image, and per-project JSON-LD
— so social scrapers and crawlers see the right thing without running JS. Real
visitors still boot the SPA normally (Vue re-mounts into #app).

Prereq: a Chrome already listening, e.g.
  google-chrome --headless=new --no-sandbox --user-data-dir=/tmp/cr-pr \
     --remote-debugging-port=9227 about:blank &
Run from the project root after `npm run build`:  python3 scripts/prerender.py
"""
import base64, json, mimetypes, os, socket, struct, sys, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.request import urlopen

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
PORT = 4199
CDP_PORT = 9227

with open(os.path.join(DIST, "index.html"), "rb") as f:
    INDEX_BYTES = f.read()

# ---- routes ----
projects = json.load(open(os.path.join(ROOT, "public/data/projects.json")))
ROUTES = ["/", "/projects", "/about", "/enquiry", "/contact"] + [f"/project/{p['id']}" for p in projects]

# ---- SPA static server (fallback → index.html) ----
class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):  # quiet
        pass
    def do_GET(self):
        path = self.path.split("?", 1)[0]
        rel = path.lstrip("/")
        fp = os.path.join(DIST, rel)
        if rel and os.path.isfile(fp):
            ctype = mimetypes.guess_type(fp)[0] or "application/octet-stream"
            with open(fp, "rb") as fh:
                body = fh.read()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        # SPA fallback: serve the bootstrap index for any unknown route
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(INDEX_BYTES)))
        self.end_headers()
        self.wfile.write(INDEX_BYTES)

server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
threading.Thread(target=server.serve_forever, daemon=True).start()

# ---- minimal CDP (raw websocket) ----
def ws_connect(url):
    host, port = "127.0.0.1", CDP_PORT
    path = url.split(str(port), 1)[1]
    key = base64.b64encode(os.urandom(16)).decode()
    s = socket.create_connection((host, port))
    s.send((f"GET {path} HTTP/1.1\r\nHost: {host}:{port}\r\nUpgrade: websocket\r\n"
            f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n").encode())
    s.recv(4096)
    return s

def ws_send(s, data):
    b = data.encode(); hdr = bytearray([0x81]); l = len(b); m = os.urandom(4)
    if l < 126: hdr.append(0x80 | l)
    elif l < 65536: hdr.append(0x80 | 126); hdr += struct.pack(">H", l)
    else: hdr.append(0x80 | 127); hdr += struct.pack(">Q", l)
    hdr += m
    s.send(bytes(hdr) + bytes(c ^ m[i % 4] for i, c in enumerate(b)))

def ws_recv(s):
    def rd(n):
        d = b""
        while len(d) < n:
            c = s.recv(n - len(d))
            if not c: raise IOError("closed")
            d += c
        return d
    b1, b2 = rd(2); l = b2 & 0x7f
    if l == 126: l = struct.unpack(">H", rd(2))[0]
    elif l == 127: l = struct.unpack(">Q", rd(8))[0]
    return rd(l).decode()

_id = [0]
def cmd(s, method, params=None):
    _id[0] += 1; mid = _id[0]
    ws_send(s, json.dumps({"id": mid, "method": method, "params": params or {}}))
    while True:
        msg = json.loads(ws_recv(s))
        if msg.get("id") == mid:
            return msg.get("result", {})

def evaluate(s, expr):
    r = cmd(s, "Runtime.evaluate", {"expression": expr, "returnByValue": True})
    return r.get("result", {}).get("value")

READY_JS = """(function(){
  if (document.readyState !== 'complete') return false;
  var app = document.getElementById('app');
  if (!app || app.children.length === 0) return false;
  if (location.pathname.indexOf('/project/') === 0 && !document.querySelector('h1.detail-title')) return false;
  if (location.pathname === '/projects') {
    var eb = document.querySelector('.plate-eyebrow');
    if (!eb || !/\\d/.test(eb.textContent)) return false;  // wait for the async count
  }
  return !!document.title;
})()"""

tab = json.load(urlopen(f"http://127.0.0.1:{CDP_PORT}/json"))
page = [t for t in tab if t["type"] == "page"][0]
s = ws_connect(page["webSocketDebuggerUrl"])
cmd(s, "Page.enable"); cmd(s, "Runtime.enable")

results = {}
for route in ROUTES:
    cmd(s, "Page.navigate", {"url": f"http://127.0.0.1:{PORT}{route}"})
    # poll readiness up to ~12s
    ok = False
    for _ in range(40):
        time.sleep(0.3)
        try:
            if evaluate(s, READY_JS) is True:
                ok = True; break
        except Exception:
            pass
    time.sleep(0.4)  # settle
    html = evaluate(s, "document.documentElement.outerHTML")
    results[route] = ("<!doctype html>\n" + html) if html else None
    print(f"  {'ok ' if ok else 'SLOW'} {route}  ({len(html or '')} bytes)")

server.shutdown()

# ---- write files ----
# Home → dist/index.html; every other route → dist/<route>.html (NOT <route>/index.html)
# so nginx `try_files $uri $uri.html …` serves a direct 200 at the canonical URL with no
# trailing-slash 301 redirect.
written = 0
for route, html in results.items():
    if not html:
        print(f"  !! no html for {route} — skipped"); continue
    out = os.path.join(DIST, "index.html") if route == "/" else os.path.join(DIST, route.lstrip("/") + ".html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    written += 1
print(f"prerendered {written}/{len(ROUTES)} routes")
