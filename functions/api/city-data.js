// D1绑定变量名必须大写D1（前面CF后台绑定的变量名）
export async function onRequestGet(context) {
  const { D1 } = context.env;
  // 获取前端传来的年份参数 ?year=2026
  const year = context.request.url.searchParams.get('year') || "2026";

  // 查询指定年份全量城市数据
  const res = await D1.prepare(`
    SELECT year,city,population,urban_population,gdp,urbanization_rate 
    FROM city_data WHERE year=?
  `).bind(year).all();

  return Response.json({
    code:200,
    year:year,
    data:res.results
  })
}