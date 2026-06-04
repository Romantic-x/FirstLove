export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const year = url.searchParams.get("year") || "2026";
    const { results } = await env.D1.prepare(`
      SELECT city,population,urban_population,gdp,urbanization_rate FROM city_data WHERE year=?
    `).bind(year).all();

    return Response.json({
      cities: results.map(item => item.city),
      population: results.map(item => item.population),
      urban_population: results.map(item => item.urban_population),
      gdp: results.map(item => item.gdp),
      urbanization_rate: results.map(item => item.urbanization_rate)
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
