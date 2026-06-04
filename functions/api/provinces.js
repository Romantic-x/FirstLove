export async function onRequestGet({env}){
  const {results} = await env.D1.prepare("SELECT DISTINCT province FROM city_data").all();
  return Response.json(results.map(i=>i.province));
}
