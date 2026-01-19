// Cloudflare Pages Function: 订阅转换 API
// 路由: /api/sub

// 默认后端
const DEFAULT_BACKEND = 'https://api.v1.mk';

interface Env {
    // 可在 wrangler.toml 中配置环境变量
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request } = context;
    const url = new URL(request.url);
    const params = url.searchParams;

    // 获取后端地址
    const backend = params.get('backend') || DEFAULT_BACKEND;

    // 构建 subconverter URL
    const subconverterUrl = new URL(`${backend}/sub`);

    // 转发所有参数（除了 backend）
    params.forEach((value, key) => {
        if (key !== 'backend') {
            subconverterUrl.searchParams.set(key, value);
        }
    });

    try {
        // 请求 subconverter 后端
        const response = await fetch(subconverterUrl.toString(), {
            headers: {
                'User-Agent': request.headers.get('User-Agent') || 'ProxyConverter/1.0',
            },
        });

        // 构建响应头
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type');

        // 处理下载模式
        if (params.get('download') === 'true') {
            const filename = params.get('filename') || 'config';
            headers.set('Content-Disposition', `attachment; filename="${filename}.yaml"`);
        }

        return new Response(response.body, {
            status: response.status,
            headers,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: '后端服务不可用',
                message: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 502,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
};
