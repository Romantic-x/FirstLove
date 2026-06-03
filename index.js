const cityData = {
  cities: ["上海","北京","深圳","重庆","广州","成都","天津","武汉","西安","南京","杭州","长沙","青岛","郑州","苏州"],
  population: [2487,2184,1766,3212,1881,2126,1386,1377,1299,949,1237,1042,1026,1260,1275],
  urban_population: [2158,1916,1723,1634,1619,1334,1093,1092,928,825,874,652,601,718,585],
  gdp: [44652,41610,34606,29129,30355,20817,16311,18866,11486,17421,20059,14332,14920,13506,23958],
  urbanization_rate: [88.1,86.6,99.8,70.3,84.5,79.8,84.7,84.0,79.2,86.9,83.6,79.4,79.1,78.4,78.5]
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request) {
    // 处理预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const city = url.searchParams.get("city");

    // 单个城市查询
    if (city) {
      const idx = cityData.cities.findIndex(c => c === city);
      if (idx === -1) {
        return new Response(JSON.stringify({ error: `未找到城市: ${city}` }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const result = {
        city: cityData.cities[idx],
        population: cityData.population[idx],
        urban_population: cityData.urban_population[idx],
        gdp: cityData.gdp[idx],
        urbanization_rate: cityData.urbanization_rate[idx],
      };
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // 返回全部数据
    return new Response(JSON.stringify(cityData), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};
