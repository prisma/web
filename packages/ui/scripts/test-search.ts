import assert from 'node:assert/strict';
import { GET, searchPages } from '../src/lib/unified-search';
assert.deepEqual(await searchPages('   '), []);
assert.deepEqual(await searchPages('🦄'), []);
assert.deepEqual(await searchPages('zz_nonexistent_unified_search_12345'), []);
for (const source of ['website','docs','blog']) {
 const results=await searchPages('postgres',source);
 assert.ok(results.length>0);
 assert.ok(results.every(item=> source==='website' ? !/^\/(docs|blog)(\/|$)/.test(item.url) : item.url.startsWith('/'+source+'/')));
 assert.equal(new Set(results.map(item=>item.url)).size,results.length);
}
assert.ok((await searchPages('postgrez','website')).some(item=>item.url==='/postgres'));
const all=await searchPages('postgres');
assert.ok(all.some(item=>item.url.startsWith('/docs/')));
assert.ok(all.some(item=>item.url.startsWith('/blog/')));
assert.ok(all.some(item=>item.url==='/postgres'));
const response=await GET(new Request('http://localhost:3001/docs/api/search?query=postgres&tag=website'));
assert.equal(response.status,200);
for(const item of await response.json()) assert.equal(new URL(item.url).port,'3000');
assert.equal((await GET(new Request('http://localhost/api/search?query=test&tag=bad'))).status,400);
console.log('Orama results, typo tolerance, filters, deduplication, and cross-app URLs passed.');
