#!/usr/bin/env node
// Recupera el HTML exacto de la versión IFLUTECH publicada en Vercel.
const fs=require('fs'),zlib=require('zlib'),crypto=require('crypto');
const path=process.argv[2]||'respaldo/produccion_20261119.brotli.parts.json';
const out=process.argv[3]||'iflutech_web_produccion_20261119.html';
const archive=JSON.parse(fs.readFileSync(path,'utf8'));
if(archive.format!=='brotli-base64-chunks'||!Array.isArray(archive.parts)) throw new Error('Archivo de respaldo inválido');
const bytes=zlib.brotliDecompressSync(Buffer.concat(archive.parts.map(x=>Buffer.from(x,'base64'))));
const hash=crypto.createHash('sha256').update(bytes).digest('hex');
if(hash!==archive.sha256||bytes.length!==archive.uncompressed_bytes)throw new Error('Fallo en comprobación de integridad SHA256');
fs.writeFileSync(out,bytes);
console.log('Código fuente restaurado:',out,'bytes:',bytes.length,'sha256:',hash);
