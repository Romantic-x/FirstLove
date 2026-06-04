export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const year = url.searchParams.get('year')||"2026";
  const province = url.searchParams.get('province')||'';
  const search = url.searchParams.get('search')||'';

  let query = `SELECT * FROM city_data WHERE year=?`;
  let params = [year];

  if(province){ query+=" AND province=?"; params.push(province); }
  if(search){ query+=" AND city LIKE ?"; params.push(`%${search}%`); }

  const {results} = await env.D1.prepare(query).bind(...params).all();

  // 只返回图表需要的5个数组，provinces删掉，前端不需要在这里拿省份
  return Response.json({
    cities: results.map(i=>i.city),
    population: results.map(i=>i.population),
    urban_population: results.map(i=>i.urban_population),
    gdp: results.map(i=>i.gdp),
    urbanization_rate: results.map(i=>i.urbanization_rate)
  })
}
