#!/usr/bin/env python3
"""Builds the inner pages from one shell. A brand page = shell.html + brand.html + <brand>.json.
python templates/build.py                   every brand in BUILT, into site/
python templates/build.py a.json out.html   one data file to one output (a dry run for a new brand)
"""
import html
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
SITE = HERE.parent / 'site'
BUILT = ['tecnomar', 'midnight', 'iguana', 'vandutch']

# name, the home page's brand row, the current site's page, the picture for "Also at Prestige Marine", its alt
BRANDS = {
    'tecnomar': ('Tecnomar for Lamborghini 63', 'brand-tecnomar', 'https://www.prestigemarine.co/tecnomar-for-lamboughini-63-yacht/', 'assets/img/brand-tecnomar-poster.jpg', 'A Tecnomar for Lamborghini 63 running, Verde Gea and gold'),
    'iguana': ('Iguana Yachts', 'brand-iguana', 'https://www.prestigemarine.co/new-boat-showrooms/iguana/', 'assets/img/b2-iguana.webp', 'An Iguana on the sand beside the surf, from above'),
    'vandutch': ('VanDutch Yachts', 'brand-vandutch', 'https://www.prestigemarine.co/new-boat-showrooms/vandutch/', 'assets/img/inv-vandutch-48.webp', 'A VanDutch running at speed'),
    'midnight': ('Midnight Express', 'brand-midnight', 'https://www.prestigemarine.co/new-boat-showrooms/midnight-express/', 'assets/img/slip-me52-side.webp', 'A Midnight Express running'),
}
NAV = [('Inventory', 'inventory.html'),
       ('Sold', 'sold.html'), ('About Us', 'about.html'), ('Contact Us', 'contact.html')]
e = html.escape
BOATS = json.loads((HERE / 'boats.json').read_text(encoding='utf-8')) if (HERE / 'boats.json').exists() else []


def vdp_of(url):
    m = re.search(r'-(\d+)/?$', url or '')
    for x in BOATS:
        if m and x['id'] == m.group(1):
            return f"boat-{x['slug']}.html"
    return url


def page_of(slug):
    return f'brand-{slug}.html' if slug in BUILT else None


def brand_links(cur):
    out = []
    for k, (name, _, url, *_rest) in BRANDS.items():
        local = page_of(k)
        attrs = ' aria-current="page"' if k == cur else ''
        if not local:
            attrs += ' rel="noopener"'
        out.append(f'        <li><a href="{local or url}"{attrs}>{e(name)}</a></li>')
    return '\n'.join(out)


def chapter(c):
    if 'image' in c:
        media = f'<img src="{c["image"]}" style="object-position: {c["pos"]}" alt="{e(c["alt"])}" data-chap-media>'
    else:
        media = f'<video muted playsinline preload="none" poster="{c["poster"]}" style="object-position: {c["pos"]}" aria-label="{e(c["alt"])}" data-film-loop data-chap-media loop data-from="{c["from"]}" data-to="{c["to"]}"><source media="(max-width: 720px)" data-src="{c["phone"]}" type="video/mp4"><source data-src="{c["src"]}" type="video/mp4"></video>'
    return f'''    <section class="chap" aria-label="{e(c['line'])}" data-chap>
      <div class="chap__frame">
        {media}
        <div class="wrap chap__copy"><h2 class="h2 chap__line">{e(c['line'])}</h2></div>
      </div>
    </section>'''


def tag_html(tag):
    """Available now, Sale pending, New arrival, Sold: set per boat in the data with "tag"."""
    if not tag:
        return ''
    return f'<span class="tag tag--{re.sub(r"[^a-z]+", "-", tag.lower()).strip("-")}">{e(tag)}</span>'


def price_of(b):
    return re.sub(r'[^0-9]', '', b['price']) or '0'


def len_of(b):
    m = re.match(r'(\d+)′(?:(\d+)″)?', b['size'])
    return round(int(m.group(1)) + int(m.group(2) or 0) / 12, 2)


def boat(b, name):
    title = f"{b['year']} {b['name']}"
    nick = f" {b['nick']}" if b['nick'] else ''
    nick_html = f' <span class="boat__nick">{e(b["nick"])}</span>' if b['nick'] else ''
    tag = b.get('tag') or b.get('note') or ''
    return f'''          <li class="boat rise" data-brand="{e(name)}" data-year="{b['year']}" data-price="{price_of(b)}" data-len="{len_of(b)}">
            <a class="boat__img" href="{vdp_of(b['url'])}" aria-label="{e(title + nick)}, listing">
              <img class="boat__plan" src="{b['plan']}" width="960" height="640" loading="lazy" alt="{e(b['alt'])}">
              <img class="boat__side" data-src="{b['side']}" width="960" height="640" alt="" aria-hidden="true">
              {tag_html(tag)}
            </a>
            <p class="boat__brand">{e(name)} · <span class="num">{b['year']}</span></p>
            <h3 class="boat__name"><a href="{vdp_of(b['url'])}">{e(b['name'])}</a>{nick_html}</h3>
            <p class="boat__paint">{e(b['paint'])}</p>
            <div class="boat__row"><p class="boat__price num">{e(b['price'])}</p></div>
            <dl class="boat__spec">
              <div><dt>Hours</dt><dd class="num">{e(b['hours'])}</dd></div>
              <div><dt>Power</dt><dd>{e(b['power'])}</dd></div>
              <div><dt>Length × beam</dt><dd class="num">{e(b['size'])}</dd></div>
            </dl>
            <a class="btn btn--line boat__enq" href="#contact" data-enquire="{e(title)}">Inquire</a>
          </li>'''


def model(m):
    figs = '\n'.join(f'            <div><dt>{e(k)}</dt><dd class="num">{e(v)}</dd></div>' for k, v in m['figs'])
    return f'''        <li class="model">
          <div class="model__img"><img class="model__a" src="{m['above']}" loading="lazy" alt="{e(m['alt'])}"><img class="model__b" src="{m['side']}" loading="lazy" alt="" aria-hidden="true"></div>
          <div class="model__body">
            <h3 class="model__name">{e(m['name'])}</h3>
            <p class="model__line">{e(m['line'])}</p>
            <dl class="model__figs">
{figs}
            </dl>
            <p class="model__power">{e(m['power'])}</p>
            <a class="btn btn--line model__go" href="#contact" data-enquire="{e(m['name'])}">Inquire</a>
          </div>
        </li>'''


def view(v, i):
    return f'''        <figure class="view view--{i % 5}"><img src="{v['src']}" width="{v['w']}" height="{v['h']}" loading="lazy" alt="{e(v['alt'])}"></figure>'''


def other(k):
    name, anchor, _url, img, alt = BRANDS[k]
    href = page_of(k) or f'index_blue.html#{anchor}'
    return f'''        <li><a class="other" href="{href}">
          <span class="other__img"><img src="{img}" loading="lazy" alt="{e(alt)}"></span>
          <span class="other__name">{e(name)}</span>
        </a></li>'''


def build(d, out):
    slug, name = d['slug'], d['name']
    t = (HERE / 'shell.html').read_text(encoding='utf-8').replace('{{main}}', (HERE / 'brand.html').read_text(encoding='utf-8').rstrip('\n'))
    hero = d['hero']
    sold = ''
    if d.get('sold'):
        sold = f'''      <div class="sold" id="sold">
        <h3 class="sold__h">Recently sold</h3>
        <div>
          <p class="sold__run">{' · '.join(e(x) for x in d['sold'])}</p>
          <a class="link-btn" href="sold.html">All sold boats</a>
        </div>
      </div>'''
    n = len(d['stock'])
    stock = '        <ol class="boats">\n' + '\n'.join(boat(b, name) for b in d['stock']) + '\n        </ol>' if n else f'''        <div class="inv__none">
          <p>Tell us which {e(name)} you have in mind and we will find it.</p>
          <a class="btn btn--line" href="#contact">Inquire</a>
        </div>'''
    fill = {
        'title': e(d['title']), 'description': e(d['description']), 'name': e(name), 'logo': d['logo'],
        'logo_ratio': d['logo_ratio'], 'sub': e(d['sub']),
        'hero_side': hero.get('side', 'left'), 'hero_src': hero['src'], 'hero_phone': hero['phone'], 'hero_from': hero['from'], 'hero_to': hero['to'], 'hero_poster': hero['poster'], 'hero_pos': hero['pos'], 'hero_alt': e(hero['alt']),
        'chapters': '\n'.join(chapter(c) for c in d['chapters']),
        'range_h': e(d['range_h']), 'range_n': 'one' if len(d['range']) == 1 else 'many', 'range': '\n'.join(model(m) for m in d['range']),
        'views_h': e(d['views_h']), 'views': '\n'.join(view(v, i) for i, v in enumerate(d['views'])),
        'stock_n': 'none' if not n else 'one' if n == 1 else 'two' if n == 2 else 'many',
        'stock': stock, 'sold': sold,
        'others': '\n'.join(other(k) for k in BRANDS if k != slug),
        'options': '\n'.join(f'            <option>{e(x)}</option>' for x in [f"{b['year']} {b['name']}" for b in d['stock']] + [m['name'] for m in d['range']] + ['Brokerage: selling my boat']),
        'brand_links': brand_links(slug),
        'nav_links': '\n'.join(f'    <a href="{u}"{"" if u.endswith(".html") else " rel=\"noopener\""}>{label}</a>' for label, u in NAV),
        'menu_links': '\n'.join(f'      <li><a href="{u}"{"" if u.endswith(".html") else " rel=\"noopener\""}>{label}</a></li>' for label, u in NAV),
        'foot_brands': '\n'.join(f'        <a href="{page_of(k) or "index_blue.html#" + v[1]}">{e(v[0])}</a>' for k, v in BRANDS.items()),
    }
    for k, v in fill.items():
        t = t.replace('{{' + k + '}}', str(v))
    assert '{{' not in t, t[t.index('{{'):][:40]
    Path(out).write_text(t, encoding='utf-8', newline='\n')
    print('built', out)


def build_inventory():
    boats = []
    for s in BUILT:
        j = json.loads((HERE / f'{s}.json').read_text(encoding='utf-8'))
        boats += [(b, j['name'], s) for b in j['stock']]
    boats += [(o, o['brand'], '') for o in json.loads((HERE / 'stock-other.json').read_text(encoding='utf-8'))]
    boats.sort(key=lambda x: len_of(x[0]))
    names = list(dict.fromkeys(n for _, n, _ in boats))
    home = (SITE / 'index_blue.html').read_text(encoding='utf-8')
    run = re.search(r'<p class="sold__run">(.*?)</p>', home).group(1)
    sold = f'''      <div class="sold" id="sold">
        <h3 class="sold__h">Recently sold</h3>
        <div>
          <p class="sold__run">{run}</p>
          <a class="link-btn" href="sold.html">All sold boats</a>
        </div>
      </div>'''
    t = (HERE / 'shell.html').read_text(encoding='utf-8').replace('{{main}}', (HERE / 'inventory.html').read_text(encoding='utf-8').rstrip('\n'))
    fill = {
        'title': 'Inventory | Prestige Marine, North Miami Beach',
        'description': 'All the boats at Prestige Marine, new and pre-owned: Tecnomar for Lamborghini 63, Midnight Express and VanDutch, at 15050 Biscayne Blvd, North Miami Beach. 305-947-1000.',
        'stock': '\n'.join(boat(b, n) for b, n, _ in boats), 'sold': sold,
        'options': '\n'.join(f'            <option>{e(x)}</option>' for x in [f"{b['year']} {b['name']}" for b, _, _ in boats] + ['A new boat', 'Brokerage: selling my boat']),
        'brand_links': brand_links(None),
        'nav_links': '\n'.join(f'    <a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a>' for label, u in NAV),
        'menu_links': '\n'.join(f'      <li><a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a></li>' for label, u in NAV),
        'foot_brands': '\n'.join(f'        <a href="{page_of(k) or "index_blue.html#" + v[1]}">{e(v[0])}</a>' for k, v in BRANDS.items()),
    }
    for k, v in fill.items():
        t = t.replace('{{' + k + '}}', str(v))
    assert '{{' not in t, t[t.index('{{'):][:40]
    (SITE / 'inventory.html').write_text(t, encoding='utf-8', newline='\n')
    print('built inventory.html')


def sold_card(s):
    title = f"{s['year']} {s['name']}"
    pic = s.get('pic')
    img = f'<img class="boat__plan" src="{pic}" loading="lazy" alt="{e(title)}, sold">' if pic else f'<span class="boat__plate">{e(s["name"])}</span>'
    return f'''        <li class="boat boat--sold rise" data-brand="{e(s['brand'])}">
          <div class="boat__img">{img}{tag_html(s.get('tag', 'Sold'))}</div>
          <p class="boat__brand">{e(s['brand'])} · <span class="num">{s['year']}</span></p>
          <h2 class="boat__name">{e(s['name'])}</h2>
          <div class="boat__row"><p class="boat__price num">{e(s['price'])}</p></div>
          <a class="btn btn--line boat__enq" href="#contact" data-enquire="Something like the {e(title)}">Find one like it</a>
        </li>'''


def build_sold():
    boats = json.loads((HERE / 'sold.json').read_text(encoding='utf-8'))['boats']
    names = list(dict.fromkeys(s['brand'] for s in boats))
    t = (HERE / 'shell.html').read_text(encoding='utf-8').replace('{{main}}', (HERE / 'sold.html').read_text(encoding='utf-8').rstrip('\n'))
    fill = {
        'title': 'Sold | Prestige Marine, North Miami Beach',
        'description': 'Boats recently sold by Prestige Marine, at 15050 Biscayne Blvd, North Miami Beach. 305-947-1000.',
        'filters': '\n'.join(f'          <button type="button" aria-pressed="false" data-inv-brand="{e(n)}">{e(n)}</button>' for n in names),
        'rows': '\n'.join(sold_card(s) for s in boats),
        'options': '\n'.join(f'            <option>{e(x)}</option>' for x in ['A boat like one of these'] + [f"Something like the {s['year']} {s['name']}" for s in boats] + ['Brokerage: selling my boat']),
        'brand_links': brand_links(None),
        'nav_links': '\n'.join(f'    <a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a>' for label, u in NAV),
        'menu_links': '\n'.join(f'      <li><a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a></li>' for label, u in NAV),
        'foot_brands': '\n'.join(f'        <a href="{page_of(k) or "index_blue.html#" + v[1]}">{e(v[0])}</a>' for k, v in BRANDS.items()),
    }
    for k, v in fill.items():
        t = t.replace('{{' + k + '}}', str(v))
    assert '{{' not in t, t[t.index('{{'):][:40]
    (SITE / 'sold.html').write_text(t, encoding='utf-8', newline='\n')
    print('built sold.html')


def build_about():
    t = (HERE / 'shell.html').read_text(encoding='utf-8').replace('{{main}}', (HERE / 'about.html').read_text(encoding='utf-8').rstrip('\n'))
    fill = {
        'title': 'About Us | Prestige Marine, North Miami Beach',
        'description': 'Prestige Marine, a division of the Prestige Imports family: land, air and now sea, from North Miami Beach since 1977. 15050 Biscayne Blvd. 305-947-1000.',
        'others': '\n'.join(other(k) for k in BRANDS),
        'options': '\n'.join(f'            <option>{e(x)}</option>' for x in ['A new boat', 'A pre-owned boat', 'Brokerage: selling my boat', 'Something else']),
        'brand_links': brand_links(None),
        'nav_links': '\n'.join(f'    <a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a>' for label, u in NAV),
        'menu_links': '\n'.join(f'      <li><a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a></li>' for label, u in NAV),
        'foot_brands': '\n'.join(f'        <a href="{page_of(k) or "index_blue.html#" + v[1]}">{e(v[0])}</a>' for k, v in BRANDS.items()),
    }
    for k, v in fill.items():
        t = t.replace('{{' + k + '}}', str(v))
    assert '{{' not in t, t[t.index('{{'):][:40]
    (SITE / 'about.html').write_text(t, encoding='utf-8', newline='\n')
    print('built about.html')


def build_simple(name, title, description, options=None):
    t = (HERE / 'shell.html').read_text(encoding='utf-8').replace('{{main}}', (HERE / f'{name}.html').read_text(encoding='utf-8').rstrip('\n'))
    fill = {
        'title': title, 'description': description,
        'options': '\n'.join(f'            <option>{e(x)}</option>' for x in (options or [])),
        'brand_links': brand_links(None),
        'nav_links': '\n'.join(f'    <a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a>' for label, u in NAV),
        'menu_links': '\n'.join(f'      <li><a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a></li>' for label, u in NAV),
        'foot_brands': '\n'.join(f'        <a href="{page_of(k) or "index_blue.html#" + v[1]}">{e(v[0])}</a>' for k, v in BRANDS.items()),
    }
    for k, v in fill.items():
        t = t.replace('{{' + k + '}}', str(v))
    assert '{{' not in t, t[t.index('{{'):][:40]
    t = t.replace('data-tone="water"', 'data-tone="light" data-top="light"')
    (SITE / f'{name}.html').write_text(t, encoding='utf-8', newline='\n')
    print('built', name)


def all_stock():
    names = []
    for s in BUILT:
        j = json.loads((HERE / f'{s}.json').read_text(encoding='utf-8'))
        names += [f"{x['year']} {x['name']}" for x in j['stock']]
    names += [f"{x['year']} {x['name']}" for x in json.loads((HERE / 'stock-other.json').read_text(encoding='utf-8'))]
    return sorted(names)


def all_cards():
    out = []
    for s in BUILT:
        j = json.loads((HERE / f'{s}.json').read_text(encoding='utf-8'))
        out += [(x, j['name']) for x in j['stock']]
    out += [(o, o['brand']) for o in json.loads((HERE / 'stock-other.json').read_text(encoding='utf-8'))]
    return out


def spec_columns(groups, render):
    weight = lambda g: 1 + (len(g.get('rows', g.get('items', []))) if g.get('open') else 0)
    half, run, left, right = sum(weight(g) for g in groups) / 2, 0, [], []
    for g in groups:
        (left if run < half else right).append(g)
        run += weight(g)
    col = lambda part: '        <div class="vdspecs__col">\n' + '\n'.join(render(g) for g in part) + '\n        </div>'
    return col(left) + '\n' + col(right)


def build_vdp(x):
    title = f"{x['year']} {x['name']}"
    tel = x['broker'][1]
    gallery = '\n'.join(f'        <button class="vdg vdg--{i % 5}" type="button" data-lb-open="{i}" aria-label="Open photo {i + 1} of {len(x["photos"])}"><img src="{p}" loading="{"eager" if i < 2 else "lazy"}" alt="{e(title)}, photo {i + 1}"></button>' for i, p in enumerate(x['photos']))
    lists = ''
    if x['lists']:
        lists = '      <div class="vdabout__lists">\n' + '\n'.join('        <div><h3>' + e(g['h']) + '</h3><ul>' + ''.join(f'<li>{e(i)}</li>' for i in g['items']) + '</ul></div>' for g in x['lists']) + '\n      </div>'
    quote = ''
    if x.get('quote'):
        q = x['photos'][min(len(x['photos']) - 1, 3)]
        quote = f'''
  <div class="chaps" data-chaps>
    <section class="chap" aria-label="The broker's thoughts" data-chap>
      <div class="chap__frame">
        <img src="{q}" alt="" data-chap-media>
        <div class="wrap chap__copy"><div class="chap__line chap__line--para vdquote"><p class="vdquote__k">Broker\'s thoughts</p><p>{e(x['quote'])}</p></div></div>
      </div>
    </section>
  </div>
'''
    def group(g):
        o = ' open' if g.get('open') else ''
        if 'rows' in g:
            body = '<dl>' + ''.join(f'<div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in g['rows']) + '</dl>'
        else:
            body = '<ul>' + ''.join(f'<li>{e(i)}</li>' for i in g['items']) + '</ul>'
        return f'        <details class="spec"{o}><summary>{e(g["h"])}<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>{body}</details>'
    others = [c for c in all_cards() if vdp_of(c[0]['url']) != f"boat-{x['slug']}.html"]
    others.sort(key=lambda c: (c[1] != x['brand'], abs(len_of(c[0]) - 45)))
    fill = {
        'title': e(title), 'description': e(f"{title} at Prestige Marine: {x['price']}, {x['location']}. 15050 Biscayne Blvd, North Miami Beach. 305-947-1000."),
        'hero': x['photos'][0], 'year': x['year'], 'name': e(x['name']), 'brand': e(x['brand']), 'location': e(x['location']), 'price': e(x['price']),
        'tag': tag_html(x['tag']).replace('class="tag ', 'class="tag vdtop__tag ') if x['tag'] else '', 'broker_tel': tel, 'broker_tel_raw': '+1' + tel.replace('-', ''), 'broker_name': e(x['broker'][0]),
        'gallery': gallery, 'count': len(x['photos']), 'photos_note': f'        <p class="vdgal__note">{e(x["photos_note"])}</p>' if x.get('photos_note') else '',
        'figs': '\n'.join(f'          <div><dt>{e(k)}</dt><dd class="num">{e(v)}</dd></div>' for k, v in x['figs']), 'power': e(x['power']),
        'lead': '\n'.join(f'        <p>{e(p)}</p>' for p in x['lead']), 'lists': lists, 'quote': quote, 'specs': spec_columns(x['specs'], group),
        'more': '\n'.join(boat(c, n) for c, n in others[:4]), 'short': e(x['name']),
        'options': '\n'.join(f'            <option>{e(o)}</option>' for o in [title] + [f"{c['year']} {c['name']}" for c, _ in others] + ['Brokerage: selling my boat']),
        'brand_links': brand_links(None),
        'nav_links': '\n'.join(f'    <a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a>' for label, u in NAV),
        'menu_links': '\n'.join(f'      <li><a href="{u}"{"" if u.endswith(".html") else " rel=" + chr(34) + "noopener" + chr(34)}>{label}</a></li>' for label, u in NAV),
        'foot_brands': '\n'.join(f'        <a href="{page_of(k) or "index_blue.html#" + v[1]}">{e(v[0])}</a>' for k, v in BRANDS.items()),
    }
    t = (HERE / 'shell.html').read_text(encoding='utf-8').replace('{{main}}', (HERE / 'vdp.html').read_text(encoding='utf-8').rstrip('\n'))
    for k, v in fill.items():
        t = t.replace('{{' + k + '}}', str(v))
    assert '{{' not in t, t[t.index('{{'):][:40]
    (SITE / f"boat-{x['slug']}.html").write_text(t, encoding='utf-8', newline='\n')


if __name__ == '__main__':
    if len(sys.argv) == 3:
        build(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8')), sys.argv[2])
    else:
        for s in BUILT:
            build(json.loads((HERE / f'{s}.json').read_text(encoding='utf-8')), SITE / f'brand-{s}.html')
        build_inventory()
        build_sold()
        build_about()
        build_simple('contact', 'Contact Us | Prestige Marine, North Miami Beach', 'Prestige Marine, 15050 Biscayne Blvd, North Miami Beach, FL 33181. 305-947-1000. Sea trials and viewings by appointment.', ['A new boat'] + all_stock() + ['Brokerage: selling my boat', 'Something else'])
        build_simple('sitemap', 'Sitemap | Prestige Marine', 'Every page of the Prestige Marine site.')
        build_simple('privacy', 'Your Privacy Choices | Prestige Marine', 'Your privacy choices at Prestige Marine.')
        for x in BOATS:
            build_vdp(x)
        print('built', len(BOATS), 'boat pages')
