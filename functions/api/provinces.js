export async function onRequest(context) {
    const { request, env } = context;
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }
    
    try {
        const { results } = await env.DB.prepare('SELECT DISTINCT province FROM economic_data ORDER BY province').all();
        
        return new Response(JSON.stringify({ success: true, data: results.map(r => r.province) }), { headers });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers });
    }
}
