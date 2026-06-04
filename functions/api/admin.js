export async function onRequestPost({env,request}){
  const d = await request.json();
  if(d.action=='add'){
    await env.D1.prepare(`INSERT INTO city_data VALUES(NULL,?,?,?,?,?,?,?)`).bind(
      d.year,d.province,d.city,d.population,d.urban_population,d.gdp,d.urbanization_rate
    ).run();
  }
  if(d.action=='edit'){
    await env.D1.prepare(`UPDATE city_data SET year=?,province=?,city=?,population=?,urban_population=?,gdp=?,urbanization_rate=? WHERE id=?`).bind(
      d.year,d.province,d.city,d.population,d.urban_population,d.gdp,d.urbanization_rate,d.id
    ).run();
  }
  if(d.action=='del'){
    await env.D1.prepare(`DELETE FROM city_data WHERE id=?`).bind(d.id).run();
  }
  return Response.json({ok:1})
}
