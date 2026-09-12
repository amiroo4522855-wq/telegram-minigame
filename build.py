#!/usr/bin/env python3
"""Build standalone mini-game.html: inline CSS/JS + base64 images. Run: python3 build.py"""
import base64, re, pathlib

ROOT = pathlib.Path(__file__).parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')

# 1) inline stylesheets
def css_sub(m):
    p = ROOT / m.group(1)
    return '<style>\n' + p.read_text(encoding='utf-8') + '\n</style>'
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css_sub, html)

# 2) inline local scripts (keep telegram CDN)
def js_sub(m):
    src = m.group(1)
    if src.startswith('http'):
        return m.group(0)
    code = (ROOT / src).read_text(encoding='utf-8').replace('</script', '<\\/script')
    return '<script>\n' + code + '\n</script>'
html = re.sub(r'<script src="([^"]+)"></script>', js_sub, html)

# 3) base64 images
n = 0
for img in sorted((ROOT / 'images').glob('*.jpg')):
    b64 = base64.b64encode(img.read_bytes()).decode()
    uri = f'data:image/jpeg;base64,{b64}'
    key = f'images/{img.name}'
    if key in html:
        n += html.count(key)
        html = html.replace(key, uri)

out = ROOT / 'mini-game.html'
out.write_text(html, encoding='utf-8')
print(f'OK: {out.name} {out.stat().st_size//1024}KB, {n} image refs inlined')
