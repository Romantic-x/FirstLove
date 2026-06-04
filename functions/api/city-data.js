export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const year = url.searchParams.get("year") || "2026";
    // D1查询语句
    const { results } = await env.D1.prepare(`
      SELECT city,population,urban_population,gdp,urbanization_rate FROM city_data WHERE year=?
    `).bind(year).all();

    return Response.json({
      cities: results.map(i=>i.city),
      population: results.map(i=>i.population),
      urban_population: results.map(i=>i.urban_population),
      gdp: results.map(i=>i.gdp),
      urbanization_rate: results.map(i=>i.urbanization_rate)
    })
  } catch (e) {
    return Response.json({err:e.message}, {status:500})
  }
}
