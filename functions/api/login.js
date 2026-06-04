export async function onRequest(context) {
    const { request, env } = context;
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }
    
    try {
        const { username, password } = await request.json();
        
        // 查询用户
        const { results } = await env.DB.prepare('SELECT * FROM users WHERE username = ?')
            .bind(username).all();
        
        const user = results[0];
        
        if (!user || user.password !== password) {
            return new Response(JSON.stringify({ success: false, error: '用户名或密码错误' }), { headers });
        }
        
        // 生成Token
        const token = generateToken();
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24小时
        
        await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
            .bind(token, user.id, expiresAt).run();
        
        return new Response(JSON.stringify({ success: true, token, username }), { headers });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers });
    }
}

function generateToken() {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2);
}
