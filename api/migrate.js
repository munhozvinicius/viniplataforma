import { ensureSchema } from './_lib/db.js';
export default async function handler(req,res){try{await ensureSchema();res.statusCode=200;res.end('ok')}catch(e){console.error(e);res.statusCode=500;res.end('error')}}
