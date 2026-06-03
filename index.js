const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,POST"
};
export default {
  async fetch(req) {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    return Response.json({ code:200, info:"后端接口部署成功！城市API就绪" },{headers:corsHeaders})
  }
}
