"""Copy the static dashboard snapshot into public/demo and fill in its banner.

Usage: python3 scripts/install-demo.py ~/dashboard-snapshot-aug19-v2 "Data as of 19 Aug 2026 (prices, rankings and announcements through 18 Aug 2026)."

The second argument is the dated statement shown first in the banner.

The snapshot is produced elsewhere (no scripts, no network requests). This only
adds the banner, a noindex tag and a page title, and refuses to install a
snapshot that contains scripts or external references.
"""
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
    ('screener.html', 'Screener'),
    ('learn.html', 'Learn'),
    ('education.html', 'Education'),
]
EXTRA = {
    'clustering.html': 'Clustering uses price history to 17 Jun 2026.',
    'education.html': 'Quizzes are switched off.',
}
# Pages present in the snapshot but deliberately not published; links to them are greyed out.
HELD_BACK = []
# Learn's "Further reading" is the only place that may link out, and only to these sites.
OUTBOUND_PAGES = {'learn.html'}
OUTBOUND_HOSTS = {
    'www.khanacademy.org', 'moneysmart.gov.au', 'www.investopedia.com', 'www.youtube.com',
    'www.asx.com.au', 'www.ato.gov.au',
}
OUTBOUND_LINK = re.compile(r'<a href="https://([^/"]+)[^"]*" target="_blank" rel="noopener noreferrer"')
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


if os.path.isdir(target):
    shutil.rmtree(target)
os.makedirs(os.path.join(target, 'assets'))
for asset in os.listdir(os.path.join(source, 'assets')):
    if not re.fullmatch(r'[A-Za-z0-9._-]+\.(css|woff2)', asset):
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
