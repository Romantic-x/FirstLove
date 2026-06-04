// Cloudflare Workers API - 数据查询接口
export async function onRequest(context) {
    const { request, env } = context;
    
    // CORS 处理
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }
    
    // 验证Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !await verifyToken(env, token)) {
        return new Response(JSON.stringify({ success: false, error: '未授权' }), { status: 401, headers });
    }
    
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    
    try {
        let query = 'SELECT province, gdp, population, gdpPerCapita FROM economic_data';
        const params = [];
        
        if (year) {
            query += ' WHERE year = ?';
            params.push(parseInt(year));
        }
        query += ' ORDER BY gdp DESC';
        
        const { results } = await env.DB.prepare(query).bind(...params).all();
        
        return new Response(JSON.stringify({ success: true, data: results }), { headers });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers });
    }
}

async function verifyToken(env, token) {
    try {
        const { results } = await env.DB.prepare('SELECT * FROM sessions WHERE token = ? AND expires_at > ?')
            .bind(token, Date.now()).all();
        return results.length > 0;
    } catch {
        return token === 'mock-token'; // 开发模式
    }
}
