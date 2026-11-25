// Run from the repo root: node --test
// The page's livePicks() must follow the listings widget's rule for featured.json
// (atrium-listings widget.html featuredFirst(), check_featured.py live_picks()).
// Reads the function straight out of index.html, so there is nothing to build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const fn = src.slice(src.indexOf('function livePicks'), src.indexOf('var feedModified=null;'));
const livePicks = new Function(fn + '; return livePicks;')();

const photo = id => `https://images.cdn.appfolio.com/atriummanagement/images/${id}/large.jpg`;
const listings = Array.from({ length: 30 }, (_, i) => ({ id: 100 + i, rent_val: 1500, photo: photo(100 + i) }));
const file = (n = 20, min_live = 12) => ({
  min_live,
  homes: Array.from({ length: n }, (_, i) => ({ id: 100 + i, address: 'x', photo: photo(100 + i) })),
});
const ids = rows => rows.map(x => x.id);

test('every pick still listed: all of them, in the file order', () => {
  const f = file();
  f.homes.reverse();
  assert.deepEqual(ids(livePicks(f, listings)), ids(f.homes));
});

test('a leased pick (gone from listings.json) is skipped', () => {
  const f = file();
  f.homes[0].id = 999;
  assert.equal(livePicks(f, listings).length, 19);
});

test('a pick with rent_val 0 is skipped', () => {
  const rows = listings.map(x => (x.id === 101 ? { ...x, rent_val: 0 } : x));
  assert.ok(!ids(livePicks(file(), rows)).includes(101));
});

test('a pick whose first photo changed (say, a floor plan moved up) is skipped', () => {
  const rows = listings.map(x => (x.id === 102 ? { ...x, photo: photo('floorplan') } : x));
  assert.ok(!ids(livePicks(file(), rows)).includes(102));
});

test('fewer than min_live live picks: nothing is featured', () => {
  assert.equal(livePicks(file(11), listings).length, 0);
  assert.equal(livePicks(file(12), listings).length, 12);
  assert.equal(livePicks(file(5, 5), listings).length, 5);
});

test('no file, or a malformed one: nothing is featured', () => {
  assert.deepEqual(livePicks(null, listings), []);
  assert.deepEqual(livePicks({ homes: 'nope' }, listings), []);
});

test('a duplicate id counts once', () => {
  const f = file();
  f.homes.push({ ...f.homes[0] });
  assert.equal(livePicks(f, listings).length, 20);
});
