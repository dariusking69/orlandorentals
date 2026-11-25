// Run from the repo root: node --test
// V2's filters and ordering (v2/index.html). Reads the functions between the
// pure:start and pure:end markers straight out of the page, so there is nothing to build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const v2 = read('v2/index.html');
const block = v2.slice(v2.indexOf('/* pure:start'), v2.indexOf('/* pure:end */'));
const { livePicks, cityName, sizeOf, matches, homeOrder, sortHomes } = new Function(
  block + '; return { livePicks, cityName, sizeOf, matches, homeOrder, sortHomes };'
)();

const fnSource = (src, name) => {
  const start = src.indexOf('function ' + name);
  let depth = 0;
  for (let i = src.indexOf('{', start); i < src.length; i++) {
    if (src[i] === '{') depth++;
    if (src[i] === '}' && --depth === 0) return src.slice(start, i + 1);
  }
};

const home = (id, o = {}) => ({ id, rent_val: 1500, beds: 2, mf: true, city: 'Orlando', community: 'Lakeside', available: 'NOW', photo: 'p' + id, ...o });
const any = { size: 'any', type: 'any', area: '', max: '' };
const ids = rows => rows.map(x => x.id);

test('featured picks follow the same rule as the live page', () => {
  assert.equal(fnSource(v2, 'livePicks'), fnSource(read('index.html'), 'livePicks'));
});

test('size buckets: studio is 0, four or more bedrooms share one bucket', () => {
  assert.deepEqual([0, 1, 2.0, 3, 4, 5].map(b => sizeOf({ beds: b })), ['0', '1', '2', '3', '4', '4']);
});

test('type: apartments are community units, houses & condos are everything else', () => {
  const apt = home(1), sf = home(2, { mf: false, community: 'Atrium Management Company' });
  assert.ok(matches(apt, { ...any, type: 'apartment' }) && !matches(sf, { ...any, type: 'apartment' }));
  assert.ok(matches(sf, { ...any, type: 'house' }) && !matches(apt, { ...any, type: 'house' }));
});

test('area treats the two spellings of a town as one', () => {
  assert.equal(cityName('Saint Cloud'), 'St. Cloud');
  assert.ok(matches(home(1, { city: 'Saint Cloud' }), { ...any, area: 'St. Cloud' }));
});

test('max rent includes a home priced exactly at the limit', () => {
  assert.ok(matches(home(1, { rent_val: 2000 }), { ...any, max: '2000' }));
  assert.ok(!matches(home(1, { rent_val: 2001 }), { ...any, max: '2000' }));
});

test('the price list counts every size under the other filters', () => {
  const s = { ...any, size: '3', area: 'Orlando' };
  assert.ok(!matches(home(1), s));
  assert.ok(matches(home(1), s, true));
  assert.ok(!matches(home(1, { city: 'Kissimmee' }), s, true));
});

test('default order: live picks first in file order, then one per community per round', () => {
  const units = [10, 11, 12, 13].map(id => home(id));
  const houses = [20, 21, 22].map(id => home(id, { mf: false, community: 'Atrium Management Company', available: '12/1/26' }));
  const pool = [...units, ...houses];
  const order = homeOrder(pool, [houses[2], home(99), units[3]]);
  assert.deepEqual(ids(order.slice(0, 2)), [22, 13]);
  // after the picks, the complex gets one slot per round, so every house comes before its second unit
  assert.deepEqual(ids(order.slice(2)), [10, 20, 21, 11, 12]);
});

test('sorts: lowest rent, and soonest available with unknown dates last', () => {
  const rows = [home(1, { rent_val: 1800, available: '' }), home(2, { rent_val: 1200, available: '1/5/27' }), home(3, { rent_val: 1500, available: 'NOW' })];
  const rank = { 1: 0, 2: 1, 3: 2 };
  assert.deepEqual(ids(sortHomes(rows, 'rent', rank)), [2, 3, 1]);
  assert.deepEqual(ids(sortHomes(rows, 'soon', rank)), [3, 2, 1]);
  assert.deepEqual(ids(sortHomes(rows, 'featured', rank)), [1, 2, 3]);
});
