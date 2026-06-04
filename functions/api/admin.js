export async function onRequest(context) {
    const { request, env } = context;
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }
    
    // 验证管理员权限
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token || !await isAdmin(env, token)) {
        return new Response(JSON.stringify({ success: false, error: '需要管理员权限' }), { status: 403, headers });
    }
    
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    try {
        if (request.method === 'GET' && action === 'list') {
            const { results } = await env.DB.prepare('SELECT * FROM economic_data ORDER BY year, gdp DESC').all();
            return new Response(JSON.stringify({ success: true, data: results }), { headers });
        }
        
        if (request.method === 'POST' && action === 'add') {
            const data = await request.json();
            await env.DB.prepare('INSERT INTO economic_data (year, province, gdp, population, gdpPerCapita) VALUES (?, ?, ?, ?, ?)')
                .bind(data.year, data.province, data.gdp, data.population, data.gdpPerCapita).run();
            return new Response(JSON.stringify({ success: true }), { headers });
        }
        
        if (request.method === 'PUT' && action === 'update') {
            const data = await request.json();
            await env.DB.prepare('UPDATE economic_data SET gdp = ?, population = ?, gdpPerCapita = ? WHERE year = ? AND province = ?')
                .bind(data.gdp, data.population, data.gdpPerCapita, data.year, data.province).run();
            return new Response(JSON.stringify({ success: true }), { headers });
        }
        
        if (request.method === 'DELETE' && action === 'delete') {
            const { year, province } = await request.json();
            await env.DB.prepare('DELETE FROM economic_data WHERE year = ? AND province = ?')
                .bind(year, province).run();
            return new Response(JSON.stringify({ success: true }), { headers });
        }
        
        return new Response(JSON.stringify({ success: false, error: '无效操作' }), { status: 400, headers });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers });
    }
}

async function isAdmin(env, token) {
    const { results } = await env.DB.prepare(`
        SELECT u.is_admin FROM sessions s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.token = ? AND s.expires_at > ?
    `).bind(token, Date.now()).all();
    return results.length > 0 && results[0].is_admin === 1;
}
