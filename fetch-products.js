import fs from "fs/promises";
import crypto from "crypto";

const { ONEC_URL, ONEC_LOGIN, ONEC_PASS } = process.env;

const res = await fetch(ONEC_URL, {
  headers: ONEC_LOGIN ? {
    Authorization: 'Basic ' + Buffer.from(`${ONEC_LOGIN}:${ONEC_PASS}`).toString('base64')
  } : {}
});
if (!res.ok) throw new Error(`1C answered ${res.status}`);
const json = await res.json();

const body = JSON.stringify(json, null, 2);
await fs.writeFile("export_fixed.json", body);

// чтобы не коммитить пустяков
const hash = crypto.createHash("sha1").update(body).digest("hex");
console.log("new hash", hash);
