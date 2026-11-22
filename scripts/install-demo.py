"""Copy the static dashboard snapshot into public/demo and fill in its banner.

Usage: python3 scripts/install-demo.py ~/dashboard-snapshot-aug19-v6 "Data as of 19 Aug 2026 (prices, rankings and announcements through 18 Aug 2026)."

The second argument is the dated statement shown first in the banner.

The snapshot is produced elsewhere (no scripts, no network requests). This only
adds the banner, a noindex tag and a page title, and refuses to install a
snapshot that contains scripts or external references.

The one exception is maps-live/, the interactive map. It runs scripts, so it is
installed only if every file matches the copy that was reviewed (MAPS_LIVE below).
If the snapshot's maps-live/ changes, review it again and update the hashes.
"""
import hashlib
import os
import re
import shutil
import sys

source = os.path.expanduser(sys.argv[1])
statement = sys.argv[2]
target = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'demo')

PAGES = [
    ('commodities.html', 'Commodities'),
    ('commodity-gold.html', 'Gold'),
    ('sector-heat.html', 'Sector heat'),
    ('announcements.html', 'Announcements'),
    ('ranker.html', 'Ranker'),
    ('fundamentals-ranking.html', 'Fundamentals'),
    ('clustering.html', 'Clustering'),
    ('maps.html', 'Maps'),
    ('screener.html', 'Screener'),
    ('learn.html', 'Learn'),
    ('education.html', 'Education'),
]
EXTRA = {
    'clustering.html': 'Clustering uses price history to 17 Jun 2026.',
    'education.html': 'Quizzes are switched off.',
    'maps.html': 'The map views on this page are still images. The interactive map opens on its own page.',
}
# Pages present in the snapshot but deliberately not published; links to them are greyed out.
HELD_BACK = []
# Only Learn's "Further reading" and the Maps basemap credit may link out, and only to these sites.
OUTBOUND_PAGES = {'learn.html', 'maps.html'}
OUTBOUND_HOSTS = {
    'www.khanacademy.org', 'moneysmart.gov.au', 'www.investopedia.com', 'www.youtube.com',
    'www.asx.com.au', 'www.ato.gov.au', 'rationalreminder.ca', 'www.openstreetmap.org',
}
OUTBOUND_LINK = re.compile(r'<a (?:class="[^"]*" )?href="https://([^/"]+)[^"]*" target="_blank" rel="noopener noreferrer"')
# sha256 of each reviewed maps-live file: the viewer code, MapLibre GL JS 4.7.1 (official build
# without its source-map comment), one Open Sans glyph range, and collar positions only.
MAPS_LIVE = {
    'NOTICE.txt': '610a8aeefc6502853db84fc311ba7fd7ab89209f50463aaf17c856ce5f950501',
    'app.css': '8d0e5fd985b4a884c7690f8a94eb6a9c5177dcfb60e0ad614f3d7cd2f523a2a2',
    'app.js': 'aff72b3c66667cdced2dbfe2525ddcfe156d980e581ec811567777cd93e0ce0f',
    'data/collars-nsw.bin': 'ffe9dfa30bbf30260a04b96256d5d9265c6e94007eeb583ba74afc9296e8a9e0',
    'data/collars-wa.bin': 'c68447bef201c0b83745b8ed06ecd09e5352817d7e141938f31564de9fd47dd5',
    'fonts/Open Sans Bold/0-255.pbf': 'b3a5c066b416d69012009e3446ddd9544607ceb7355734922635521b6834c4d8',
    'index.html': 'f8385d321998c58c3d9aea1f44199d4c8f1d3bc4123fb011dfe62907a71a3710',
    'vendor/maplibre-gl-LICENSE.txt': 'ee5fc05a0677eaf69601d2c7db0d9ecd6cc27c3abc1d0733bc9ed34707cf8ef2',
    'vendor/maplibre-gl.css': '576b085fdd9487a65a19215328c1e086c07ce5bf6da09b666b3806d3d008dae9',
    'vendor/maplibre-gl.js': 'e877fe22fdfac649cdf4cac27d66e4cb4872c5960adcd9229a9eb993c22dafb8',
}
PLACEHOLDER = '<div id="snapshot-banner"></div>'
FORBIDDEN = re.compile(r'<script|<iframe|<object|<embed|<form|javascript:|\son[a-z]+\s*=|(?:src|href|action)\s*=\s*["\'](?:https?:)?//', re.I)

present = [(name, label) for name, label in PAGES if os.path.exists(os.path.join(source, name))]


def banner(current):
    links = ''.join(
        f'<a href="{name}" style="color:#0D1117;text-decoration:{"none" if name == current else "underline"};'
        f'font-weight:{"700" if name == current else "500"};white-space:nowrap">{label}</a>'
        for name, label in present
    )
    return (
        '<div id="snapshot-banner" style="position:sticky;top:0;z-index:1000;background:#30C55A;color:#0D1117;'
        'font:500 13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;padding:8px 14px;display:flex;flex-wrap:wrap;'
        'gap:6px 16px;align-items:center;border-bottom:2px solid #0D1117">'
        f'<strong>{statement}</strong>'
        + (f'<strong>{EXTRA[current]}</strong>' if current in EXTRA else '') +
        '<span>Not live data, not financial advice. Search, filters, ticker details, Ask Claude and greyed-out pages are switched off.</span>'
        f'<span style="display:flex;flex-wrap:wrap;gap:4px 12px">{links}</span>'
        '<a href="../" style="margin-left:auto;color:#0D1117;font-weight:700;white-space:nowrap">Back to Oscar\'s resume</a>'
        '</div>'
    )


STRIP_START = '</nav><div class="flex flex-wrap items-center gap-x-5'


def remove_status_strip(page, name):
    """Drop the status strip under the nav (frozen clock, data-freshness and 'stale' markers)."""
    start = page.find(STRIP_START)
    if start == -1:
        return page  # already removed at capture time
    start += len('</nav>')
    depth = 0
    for tag in re.finditer(r'<div\b|</div>', page[start:]):
        depth += 1 if tag.group(0) != '</div>' else -1
        if depth == 0:
            removed = page[start:start + tag.end()]
            if 'Rankings' not in removed or len(removed) > 5000:
                sys.exit(f'{name}: status strip did not look as expected')
            return page[:start] + page[start + tag.end():]
    sys.exit(f'{name}: status strip not closed')


# Checked before anything is replaced, so a mismatch leaves the installed copy untouched.
live = os.path.join(source, 'maps-live')
if os.path.isdir(live):
    found = {}
    for folder, folders, files in os.walk(live):
        for file in folders + files:
            path = os.path.join(folder, file)
            if os.path.islink(path):
                sys.exit(f'maps-live contains a symlink: {path}')
        for file in files:
            path = os.path.join(folder, file)
            found[os.path.relpath(path, live)] = hashlib.sha256(open(path, 'rb').read()).hexdigest()
    if found != MAPS_LIVE:
        changed = sorted(k for k in set(found) | set(MAPS_LIVE) if found.get(k) != MAPS_LIVE.get(k))
        sys.exit(f'maps-live differs from the reviewed copy ({", ".join(changed)}); review it before installing')

if os.path.isdir(target):
    shutil.rmtree(target)
os.makedirs(os.path.join(target, 'assets'))
for asset in os.listdir(os.path.join(source, 'assets')):
    if not re.fullmatch(r'[A-Za-z0-9._-]+\.(css|woff2|webp)', asset):
        sys.exit(f'Unexpected asset: {asset}')
    shutil.copy(os.path.join(source, 'assets', asset), os.path.join(target, 'assets', asset))

for name, label in present:
    page = open(os.path.join(source, name), encoding='utf-8').read()
    checked = page
    if name in OUTBOUND_PAGES:
        for link in OUTBOUND_LINK.finditer(page):
            if link.group(1) not in OUTBOUND_HOSTS:
                sys.exit(f'{name} links to an unexpected site: {link.group(1)}')
        checked = OUTBOUND_LINK.sub('<a', page)
    if FORBIDDEN.search(checked):
        sys.exit(f'{name} contains a script, handler, form or external reference; not installing')
    if page.count(PLACEHOLDER) != 1:
        sys.exit(f'{name} has no banner placeholder')
    page = remove_status_strip(page, name)
    for held in HELD_BACK:
        page = page.replace(f'href="{held}"', 'aria-disabled="true" tabindex="-1" title="Not included in this snapshot" style="opacity:.45;pointer-events:none"')
        if held in page:
            sys.exit(f'{name} still refers to {held}')
    page = page.replace(PLACEHOLDER, banner(name))
    page = page.replace('<title>Canetoad</title>', f'<title>Canetoad dashboard preview: {label}</title><meta name="robots" content="noindex, nofollow">')
    open(os.path.join(target, name), 'w', encoding='utf-8').write(page)
    print('installed', name)


def maps_live_banner():
    link = 'color:#0D1117;font-weight:700;white-space:nowrap'
    return (
        '<div id="snapshot-banner" style="background:#30C55A;color:#0D1117;'
        'font:500 13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;padding:8px 14px;display:flex;flex-wrap:wrap;'
        'gap:6px 16px;align-items:center;border-bottom:2px solid #0D1117">'
        '<strong>Interactive map from the dashboard preview.</strong>'
        '<span>Open-file drill-hole collar positions. Not live data, not financial advice. Map tiles load from OpenStreetMap.</span>'
        f'<a href="../maps.html" style="margin-left:auto;{link}">Back to dashboard preview</a>'
        f'<a href="../../" style="{link}">Back to Oscar\'s resume</a>'
        '</div>'
    )


if os.path.isdir(live):
    for rel in MAPS_LIVE:  # copy only the reviewed files
        dest = os.path.join(target, 'maps-live', rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copyfile(os.path.join(live, rel), dest)
    index = os.path.join(target, 'maps-live', 'index.html')
    page = open(index, encoding='utf-8').read()
    if page.count(PLACEHOLDER) != 1 or page.count('<script') != 2:
        sys.exit('maps-live/index.html did not look as expected')
    page = page.replace(PLACEHOLDER, maps_live_banner())
    page = page.replace('<title>', '<meta name="robots" content="noindex, nofollow">\n<title>', 1)
    open(index, 'w', encoding='utf-8').write(page)
    print('installed maps-live')
elif any('maps-live/' in open(os.path.join(target, name), encoding='utf-8').read() for name, _ in present):
    sys.exit('a page links to maps-live/ but the snapshot has no such folder')
