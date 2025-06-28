import fs   from 'fs/promises';
import https from 'https';

const { ONEC_URL, ONEC_LOGIN, ONEC_PASS } = process.env;

const authHdr = ONEC_LOGIN
  ? { Authorization: 'Basic '+Buffer.from(`${ONEC_LOGIN}:${ONEC_PASS}`).toString('base64') }
  : {};

const res = await fetch(ONEC_URL, { headers: authHdr, agent: new https.Agent({ rejectUnauthorized:false }) });
if (!res.ok) throw new Error(`1С ответила ${res.status}`);
const data = await res.json();

await fs.writeFile('export_fixed.json', JSON.stringify(data,null,2));
console.log('export_fixed.json обновлён:', new Date().toISOString());
