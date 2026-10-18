#!/usr/bin/env node
// Builds the SVGs in assets/ for the profile README.
// The header needs nothing; the cards and the facts label need GITHUB_TOKEN (or GH_TOKEN).
// Display lettering comes pre-outlined from scripts/outlines.json (see outline.py).
//
//   GITHUB_TOKEN=$(gh auth token) node scripts/generate.mjs

import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'assets');
const LOGIN = 'NikGob';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const TYPE = JSON.parse(await readFile(join(HERE, 'outlines.json'), 'utf8'));

const FEATURED = [
  {
    repo: 'ClockManage',
    tags: 'RUST / TAURI 2 / MCP',
    description:
      'Study timer for Windows and Linux. Sites and apps on the block list stay closed until the block is done. Claude can edit the plan over MCP.',
  },
  {
    repo: 'Steam-Currency',
    tags: 'C# / ASP.NET CORE / MONGODB',
    description: 'Transfer funds between Steam currencies at the official exchange rates. Public REST API with Swagger.',
  },
  {
    repo: 'share.nikgob',
    tags: 'C# / .NET / GOOGLE DRIVE',
    description: 'Google Drive API helpers that I reuse across my own projects.',
  },
  {
    repo: '404',
    tags: 'HTML / NGINX / DOCKER',
    description: 'The 404 page of nikgob.com. One HTML file, served by nginx in a Docker container.',
  },
];

const INGREDIENTS =
  'C#, .NET, Rust, Tauri, TypeScript, React, Next.js, Go, Flutter, Kotlin, Python, PostgreSQL, MongoDB, Docker.';

const C = {
  green: '#195F41',
  greenDeep: '#0E3A27',
  cream: '#EEF1EE',
  paper: '#FDFDFC',
  ink: '#1B1B1B',
  inkSoft: '#4A4F4C',
  yellow: '#F3B648',
};
const SANS = `Helvetica, Arial, 'Liberation Sans', 'Nimbus Sans', sans-serif`;

// The smiley, from the brand files. Drawn in a 2048 box.
const ART = {
  burst:
    'M1484,68 L1192,340 L1159,330 L1126,65 L1121,65 L945,277 L844,65 L838,63 L794,309 L467,56 L559,433 L264,366 L404,621 L44,948 L44,952 L335,955 L133,1155 L133,1159 L337,1113 L127,1499 L407,1313 L238,1596 L503,1459 L506,1460 L404,1677 L648,1549 L649,1961 L654,1960 L827,1617 L901,1781 L907,1778 L994,1624 L1095,1714 L1120,1585 L1195,1554 L1483,1672 L1407,1401 L1455,1346 L1661,1252 L1591,1115 L1718,1037 L1718,1032 L1627,894 L1948,561 L1948,557 L1533,637 L1514,603 L1720,275 L1386,437Z',
  eyeL: 'M910,418 L894,430 L883,453 L878,483 L880,538 L887,585 L901,647 L921,708 L946,768 L974,824 L1008,878 L1035,912 L1062,939 L1089,960 L1119,974 L1148,975 L1164,970 L1178,961 L1193,946 L1204,931 L1215,902 L1220,866 L1217,812 L1208,760 L1192,702 L1167,637 L1145,593 L1103,527 L1063,479 L1030,448 L1005,430 L969,415 L934,412Z',
  eyeR: 'M645,545 L626,555 L616,566 L611,576 L602,609 L600,643 L604,710 L614,779 L629,842 L643,886 L661,931 L684,978 L706,1015 L735,1055 L764,1085 L794,1105 L811,1109 L838,1106 L863,1091 L884,1066 L899,1032 L906,994 L907,931 L902,884 L895,846 L876,779 L853,721 L834,684 L809,643 L770,594 L738,565 L706,547 L685,542 L657,542Z',
  smile:
    'M1457,804 L1449,791 L1437,781 L1423,775 L1406,774 L1395,776 L1376,784 L1353,807 L1343,828 L1341,848 L1350,869 L1354,894 L1356,956 L1348,1008 L1340,1038 L1327,1072 L1309,1106 L1295,1127 L1274,1153 L1249,1178 L1195,1219 L1170,1234 L1131,1253 L1061,1278 L1017,1288 L972,1293 L932,1293 L882,1287 L844,1278 L789,1258 L733,1227 L708,1208 L679,1179 L662,1157 L655,1142 L650,1122 L642,1065 L630,1034 L611,1014 L591,1005 L571,1000 L553,1000 L534,1004 L511,1016 L500,1026 L491,1039 L479,1067 L474,1097 L476,1149 L486,1191 L500,1228 L518,1264 L540,1299 L566,1333 L608,1377 L651,1413 L706,1448 L759,1473 L815,1491 L863,1501 L912,1506 L954,1507 L1002,1503 L1048,1495 L1086,1485 L1143,1464 L1186,1443 L1225,1419 L1261,1392 L1299,1359 L1342,1315 L1371,1279 L1401,1234 L1424,1191 L1446,1139 L1461,1091 L1472,1041 L1477,1003 L1479,955 L1476,910 L1471,874 L1463,841 L1463,822Z',
};

const FACE_DEFS = `<linearGradient id="fg" x1="0.15" y1="0.05" x2="0.85" y2="0.95"><stop offset="0" stop-color="#F7D384"/><stop offset="0.55" stop-color="#F3B648"/><stop offset="1" stop-color="#EFA21F"/></linearGradient>
<linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0A85A"/><stop offset="1" stop-color="#DC7418"/></linearGradient>`;

const face = (eyeClass = '') => `<ellipse cx="974.6" cy="955.7" rx="619.3" ry="658.6" transform="rotate(24.5 974.6 955.7)" fill="url(#rg)"/>
<ellipse cx="957.6" cy="938.6" rx="591.2" ry="639.2" transform="rotate(8.3 957.6 938.6)" fill="url(#fg)"/>
<path class="${eyeClass && `${eyeClass}L`}" d="${ART.eyeL}" fill="#000"/>
<path class="${eyeClass && `${eyeClass}R`}" d="${ART.eyeR}" fill="#000"/>
<path d="${ART.smile}" fill="#000"/>`;

// Place art drawn in the 2048 box: centred on (x, y), `size` px across, turned by `rotate` degrees.
const place = (x, y, size, rotate, body, cx = 1024, cy = 1024, box = 2048) =>
  `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${(size / box).toFixed(5)}) translate(${-cx} ${-cy})">${body}</g>`;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Outlined lettering: `key` from outlines.json at `size` px, baseline at (x, y).
function word(key, x, y, size, fill, anchor = 'start') {
  const t = TYPE[key];
  if (!t) throw new Error(`No outline for "${key}" — add it to outline.py`);
  const k = size / TYPE.size;
  const left = anchor === 'end' ? x - t.width * k : anchor === 'middle' ? x - (t.width * k) / 2 : x;
  return `<path transform="translate(${left.toFixed(2)} ${y}) scale(${k.toFixed(4)})" d="${t.d}" fill="${fill}"/>`;
}
const wordWidth = (key, size) => (TYPE[key].width * size) / TYPE.size;

const text = (x, y, size, body, { weight = 400, fill = C.ink, anchor = 'start', spacing = 0, style = '' } = {}) =>
  `<text x="${x}" y="${y}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" fill="${fill}"${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}${spacing ? ` letter-spacing="${spacing}"` : ''}${style ? ` font-style="${style}"` : ''}>${esc(body)}</text>`;

const rule = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.ink}"/>`;

function wrap(str, maxChars) {
  const lines = [];
  let line = '';
  for (const w of str.split(/\s+/)) {
    if (line && `${line} ${w}`.length > maxChars) {
      lines.push(line);
      line = w;
    } else line = line ? `${line} ${w}` : w;
  }
  if (line) lines.push(line);
  return lines;
}

const svg = (w, h, label, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<title>${esc(label)}</title>
${body}
</svg>
`;

function header() {
  const W = 850;
  const H = 300;
  const stripY = 250;

  // The running strip: words and little yellow bursts, repeated until it covers the width twice.
  const size = 14;
  const gap = 18;
  const dot = 13;
  let x = 0;
  let one = '';
  for (const w of TYPE.strip) {
    one += word(`strip:${w}`, x, 0, size, C.cream);
    x += wordWidth(`strip:${w}`, size) + gap;
    one += place(x + dot / 2, -size * 0.36, dot, 0, `<path d="${ART.burst}" fill="${C.yellow}"/>`);
    x += dot + gap;
  }
  const period = x;
  const copies = Math.ceil((W + period) / period);
  const strip = Array.from({ length: copies }, (_, i) => `<g transform="translate(${(i * period).toFixed(2)} 0)">${one}</g>`).join('');

  const wmSize = 116;
  const wmX = 318;
  const wmRight = wmX + wordWidth('wordmark', wmSize);

  return svg(
    W,
    H,
    'NikGob, C# developer',
    `<defs>${FACE_DEFS}</defs>
<style>
  .run { animation: run ${(period / 38).toFixed(1)}s linear infinite; }
  @keyframes run { to { transform: translateX(-${period.toFixed(2)}px); } }
  .blinkL, .blinkR { transform-box: fill-box; transform-origin: center; animation: blinkL 6s infinite; }
  .blinkR { animation-name: blinkR; }
  @keyframes blinkL { 0%, 93%, 99%, 100% { transform: rotate(-21deg) scaleY(1) rotate(21deg); } 96% { transform: rotate(-21deg) scaleY(.1) rotate(21deg); } }
  @keyframes blinkR { 0%, 93%, 99%, 100% { transform: rotate(-15deg) scaleY(1) rotate(15deg); } 96% { transform: rotate(-15deg) scaleY(.1) rotate(15deg); } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
<rect width="${W}" height="${H}" fill="${C.green}"/>
${place(166, 146, 280, -8, `<path d="${ART.burst}" fill="${C.greenDeep}"/>`)}
<rect y="${stripY}" width="${W}" height="${H - stripY}" fill="${C.ink}"/>
<g transform="translate(0 ${stripY + (H - stripY) / 2 + (TYPE['strip:RUST'].cap * size) / TYPE.size / 2})"><g class="run">${strip}</g></g>
${place(160, 138, 280, -8, `<path d="${ART.burst}" fill="${C.paper}"/>${face('blink')}`)}
${word('est', wmRight, 40, 11, C.cream, 'end').replace('/>', ' opacity=".55"/>')}
${word('wordmark', wmX, 152, wmSize, C.cream)}
${word('tagline', wmX + 4, 196, 13, C.yellow)}`,
  );
}

function card(p, index) {
  const W = 420;
  const H = 210;
  const body = { x: 2, y: 2, w: 404, h: 194 };
  const pad = 20;
  const L = body.x + pad;
  const R = body.x + body.w - pad;
  const lines = wrap(p.description, 52).slice(0, 3);
  const host = p.homepage ? new URL(p.homepage).host.replace(/^www\./, '') : '';
  const no = String(index + 1).padStart(2, '0');
  const starW = 13;
  const count = String(p.stars);

  return svg(
    W,
    H,
    `${p.name}. ${p.description}`,
    `<rect x="${body.x + 8}" y="${body.y + 8}" width="${body.w}" height="${body.h}" fill="${C.green}"/>
<rect x="${body.x + 1}" y="${body.y + 1}" width="${body.w - 2}" height="${body.h - 2}" fill="${C.cream}" stroke="${C.ink}" stroke-width="2"/>
<rect x="${L}" y="20" width="34" height="20" fill="${C.green}"/>
${text(L + 17, 34.5, 12, no, { weight: 700, fill: C.cream, anchor: 'middle', spacing: 0.5 })}
${text(R, 35, 13, count, { weight: 700, anchor: 'end' })}
<path transform="translate(${R - count.length * 7.5 - starW - 5} 23.5) scale(${starW / 24})" d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6l-6.4 3.5L7 14l-5.3-5 7.2-.9Z" fill="${C.ink}"/>
${word(`title:${p.name}`, L, 82, 30, C.ink)}
${lines.map((l, i) => text(L, 110 + i * 19, 14, l, { fill: C.inkSoft })).join('\n')}
${rule(L, 164, R - L, 2)}
${text(L, 185, 11, p.tags, { weight: 700, spacing: 0.9 })}
${host ? text(R, 185, 11, host, { fill: C.inkSoft, anchor: 'end' }) : ''}`,
  );
}

function facts(s) {
  const W = 850;
  const H = 340;
  const body = { x: 2, y: 2, w: 838, h: 328 };
  const A = { l: 16, r: 284 };
  const B = { l: 312, r: 556 };
  const Cc = { l: 584, r: 826 };
  const row = (col, y, label, value, last = false, bold = false) =>
    `${text(col.l, y, 15, label, { weight: bold ? 700 : 400 })}
${text(col.r, y, 15, value, { weight: 700, anchor: 'end' })}
${last ? '' : rule(col.l, y + 10, col.r - col.l, 1)}`;

  const langs = s.langs.map((l, i) => row(B, 70 + i * 32, l.name, `${Math.round(l.pct)}%`, i === s.langs.length - 1)).join('\n');
  const activity = [
    ['Current streak', `${s.current} ${s.current === 1 ? 'day' : 'days'}`],
    ['Longest streak', `${s.longest} days`],
    ['Active days', String(s.activeDays)],
    ['Stars earned', String(s.stars)],
    ['Public repos', String(s.publicRepos)],
  ]
    .map(([label, value], i, all) => row(Cc, 70 + i * 32, label, value, i === all.length - 1))
    .join('\n');
  const ingredients = wrap(`INGREDIENTS: ${INGREDIENTS}`, 44);

  return svg(
    W,
    H,
    `Nikgob Facts. ${s.total} contributions in the last 12 months. Languages: ${s.langs.map((l) => `${l.name} ${Math.round(l.pct)}%`).join(', ')}.`,
    `<defs>${FACE_DEFS}</defs>
<rect x="${body.x + 8}" y="${body.y + 8}" width="${body.w}" height="${body.h}" fill="${C.green}"/>
<rect x="${body.x + 1}" y="${body.y + 1}" width="${body.w - 2}" height="${body.h - 2}" fill="${C.paper}" stroke="${C.ink}" stroke-width="2"/>
${rule(296, 14, 4, 304)}
${rule(568, 14, 4, 304)}

${word('facts1', A.l - 1, 60, 50, C.ink)}
${word('facts2', A.l - 1, 106, 50, C.ink)}
${rule(A.l, 118, A.r - A.l, 1.5)}
${text(A.l, 138, 13, '1 developer per account')}
${text(A.l, 160, 16, 'Serving size', { weight: 700 })}
${text(A.r, 160, 16, '12 months', { weight: 700, anchor: 'end' })}
${rule(A.l, 168, A.r - A.l, 10)}
${text(A.l, 195, 11.5, 'Amount per serving', { weight: 700 })}
${text(A.l, 229, 21, 'Contributions', { weight: 700 })}
${text(A.r, 231, 40, String(s.total), { weight: 700, anchor: 'end' })}
${rule(A.l, 241, A.r - A.l, 5)}
${ingredients.map((l, i) => text(A.l, 265 + i * 14.5, 11, l).replace('INGREDIENTS:', '<tspan font-weight="700">INGREDIENTS:</tspan>')).join('\n')}

${text(B.l, 32, 16, 'Languages', { weight: 700 })}
${text(B.r, 32, 11, '% by size*', { weight: 700, anchor: 'end' })}
${rule(B.l, 40, B.r - B.l, 5)}
${langs}
${rule(B.l, 282, B.r - B.l, 10)}
${text(B.l, 310, 10.5, `* Share of code by bytes, ${s.repoCount} repos.`)}

${text(Cc.l, 32, 16, 'Activity', { weight: 700 })}
${text(Cc.r, 32, 11, 'last 12 months', { weight: 700, anchor: 'end' })}
${rule(Cc.l, 40, Cc.r - Cc.l, 5)}
${activity}
${rule(Cc.l, 218, Cc.r - Cc.l, 10)}
${text(Cc.l, 248, 11.5, `Packed: ${s.packed}`)}
${text(Cc.l, 264, 11.5, `Best before: ${s.bestBefore}`)}
${text(Cc.l, 296, 11.5, 'May contain traces of JavaScript.', { style: 'italic' })}
${place(798, 288, 54, -8, face(), 966, 948, 1340)}`,
  );
}

async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': `${LOGIN}-profile` },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GitHub API: ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

const QUERY = `query($login: String!, $after: String) {
  user(login: $login) {
    contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } }
    publicRepos: repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
    repositories(first: 100, after: $after, ownerAffiliations: OWNER, isFork: false) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name isPrivate stargazerCount homepageUrl
        languages(first: 20, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name } } }
      }
    }
  }
}`;

async function fetchData() {
  const repos = [];
  let first;
  let after = null;
  do {
    const { user } = await graphql(QUERY, { login: LOGIN, after });
    first ??= user;
    repos.push(...user.repositories.nodes);
    after = user.repositories.pageInfo.hasNextPage ? user.repositories.pageInfo.endCursor : null;
  } while (after);
  return { repos, calendar: first.contributionsCollection.contributionCalendar, publicRepos: first.publicRepos.totalCount };
}

function languageShares(repos, top = 7) {
  const bytes = new Map();
  for (const r of repos)
    for (const { size, node } of r.languages.edges) bytes.set(node.name, (bytes.get(node.name) ?? 0) + size);
  const all = [...bytes].sort((a, b) => b[1] - a[1]);
  const total = all.reduce((n, [, v]) => n + v, 0) || 1;
  const shown = all.slice(0, top - 1).map(([name, v]) => ({ name, pct: (v / total) * 100 }));
  const rest = all.slice(top - 1).reduce((n, [, v]) => n + v, 0);
  if (rest) shown.push({ name: 'Other', pct: (rest / total) * 100 });
  return shown;
}

function summarize({ repos, calendar, publicRepos }, langs) {
  const days = calendar.weeks.flatMap((w) => w.contributionDays);
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.contributionCount ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Today still counts as part of the streak until it is over.
  let i = days.length - 1;
  if (days[i] && !days[i].contributionCount) i--;
  let current = 0;
  while (i >= 0 && days[i].contributionCount) current++, i--;
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  return {
    total: calendar.totalContributions,
    current,
    longest,
    activeDays: days.filter((d) => d.contributionCount).length,
    stars: repos.filter((r) => !r.isPrivate).reduce((n, r) => n + r.stargazerCount, 0),
    publicRepos,
    repoCount: repos.length,
    langs,
    packed: iso(today),
    bestBefore: iso(new Date(today.getTime() + 86400000)),
  };
}

const exists = (p) => access(p).then(() => true, () => false);

async function main() {
  await mkdir(OUT, { recursive: true });
  const files = { 'header.svg': header() };

  if (!TOKEN) {
    console.warn('No GITHUB_TOKEN: only the header was rebuilt.');
  } else {
    const data = await fetchData();
    // A token that can't see private repos would shrink the language mix to the public ones.
    // Keep the numbers from the last full run in that case.
    const saved = join(HERE, 'languages.json');
    let langs = languageShares(data.repos);
    let repoCount = data.repos.length;
    if (!data.repos.some((r) => r.isPrivate) && (await exists(saved))) {
      ({ langs, repoCount } = JSON.parse(await readFile(saved, 'utf8')));
    } else {
      await writeFile(saved, `${JSON.stringify({ langs, repoCount }, null, 1)}\n`);
    }
    const s = { ...summarize(data, langs), repoCount };
    files['facts.svg'] = facts(s);
    FEATURED.forEach((f, i) => {
      const r = data.repos.find((x) => x.name === f.repo);
      if (!r) throw new Error(`Featured repo not found: ${f.repo}`);
      files[`card-${f.repo.toLowerCase().replace(/\./g, '-')}.svg`] = card(
        { ...f, name: r.name, stars: r.stargazerCount, homepage: r.homepageUrl },
        i,
      );
    });
    console.log(`${s.total} contributions, streak ${s.current}/${s.longest}, ${s.stars} stars, ${repoCount} repos`);
  }

  await Promise.all(Object.entries(files).map(([f, body]) => writeFile(join(OUT, f), body)));
  console.log(`Wrote ${Object.keys(files).length} files`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
