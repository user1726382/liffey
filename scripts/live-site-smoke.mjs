import assert from 'node:assert/strict';

const base = 'https://www.liffey-consulting.com';
const checks = [];
async function get(path, options = {}) {
  return fetch(base + path, {signal: AbortSignal.timeout(15000), redirect: 'manual', ...options});
}
async function check(name, fn) {
  try {
    await fn();
    checks.push({name, status: 'PASS'});
    console.log('PASS ' + name);
  } catch (error) {
    checks.push({name, status: 'FAIL'});
    console.error('FAIL ' + name + ': ' + error.message);
    process.exitCode = 1;
  }
}
await check('HTTPS homepage and favicon reference', async () => {
  const response = await get('/');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<link rel="icon"[^>]*href="\/favicon\.png"/);
  assert.match(html, /<meta name="robots" content="index,follow">/);
});
await check('Apex canonical redirect preserves query', async () => {
  const response = await fetch('https://liffey-consulting.com/?liffey_smoke=1', {
    redirect: 'manual', signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), base + '/?liffey_smoke=1');
});
await check('Branded favicon', async () => {
  const response = await get('/favicon.png');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /^image\/png/i);
  const data = new Uint8Array(await response.arrayBuffer());
  assert.ok(data.byteLength > 500);
  assert.deepEqual(Array.from(data.slice(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
});
await check('Canonical robots and sitemap', async () => {
  const robots = await get('/robots.txt');
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /https:\/\/www\.liffey-consulting\.com\/sitemap\.xml/);
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /https:\/\/www\.liffey-consulting\.com/);
  assert.doesNotMatch(xml, /user1726382\.github\.io/);
});
await check('Security disclosure', async () => {
  const response = await get('/.well-known/security.txt');
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Contact: mailto:security@liffey-consulting\.com/);
});
await check('English and German contact forms remain present', async () => {
  for (const path of ['/contact/', '/de/kontakt/']) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /id="liffey-enquiry"/, path);
    assert.match(html, /liffey-contact-form\.leoedwalshe\.workers\.dev/, path);
    assert.match(html, /0x4AAAAA/, path);
  }
});
await check('Internal audit documents not served from Cloudflare Pages', async () => {
  const response = await get('/compliance/ICT-AUDIT-REMEDIATION-REGISTER.md');
  assert.equal(response.status, 404);
});
console.log(checks.filter(x => x.status === 'PASS').length + '/' + checks.length + ' live-site checks passed');
