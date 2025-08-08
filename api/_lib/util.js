export async function getJsonBody(req){try{const c=[];for await (const ch of req)c.push(ch);const raw=Buffer.concat(c).toString('utf8')||'{}';return JSON.parse(raw)}catch{return{}}}
export function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data))}
