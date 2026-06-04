export async function onRequestPost({env,request}){
  const data=await request.json();
  const {action,id,year,province,city,population,urban_population,gdp,urbanization_rate}=data;

  if(action=='add'){
    return await env.D1.prepare(`INSERT INTO city_data VALUES(NULL,?,?,?,?,?,?,?)`).bind(year,province,city,population,urban_population,gdp,urbanization_rate).run();
  }

  if(action=='edit'){
    return await env.D1.prepare(`UPDATE city_data SET year=?,province=?,city=?,population=?,urban_population=?,gdp=?,urbanization_rate=? WHERE id=?`).bind(year,province,city,population,urban_population,gdp,urbanization_rate,id).run();
  }

  if(action=='del'){
    return await env.D1.prepare(`DELETE FROM city_data WHERE id=?`).bind(id).run();
  }

  return Response.json({ok:0})
}
