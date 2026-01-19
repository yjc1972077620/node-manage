// Cloudflare Pages Function: 订阅内容获取 API
// 路由: /api/fetch
// 用于获取订阅链接内容，避免 CORS 问题

interface Env { }

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request } = context;
    const url = new URL(request.url);

    const targetUrl = url.searchParams.get('url');

    // CORS 头
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // 验证参数
    if (!targetUrl) {
        return new Response(
            JSON.stringify({ error: 'Missing url parameter' }),
            {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }

    // 验证 URL 格式
    try {
        new URL(targetUrl);
    } catch {
        return new Response(
            JSON.stringify({ error: 'Invalid URL format' }),
            {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        // 获取订阅内容
        const response = await fetch(targetUrl, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'ClashForAndroid/2.5.12 Clash/1.18.0 Mihomo/1.18.0',
                'Accept': '*/*',
            },
        });

        clearTimeout(timeout);

        if (!response.ok) {
            return new Response(
                JSON.stringify({
                    error: `HTTP ${response.status}`,
                    message: response.statusText,
                }),
                {
                    status: response.status,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        // 获取内容
        const content = await response.text();

        // 返回原始内容
        return new Response(content, {
            status: 200,
            headers: {
                ...corsHeaders,
                'Content-Type': response.headers.get('Content-Type') || 'text/plain',
                // 转发一些有用的头信息
                'X-Original-Content-Type': response.headers.get('Content-Type') || '',
                'X-Subscription-Userinfo': response.headers.get('Subscription-Userinfo') || '',
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const isTimeout = message.includes('abort');

        return new Response(
            JSON.stringify({
                error: isTimeout ? 'Request timeout' : 'Fetch failed',
                message,
            }),
            {
                status: isTimeout ? 504 : 502,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
};
