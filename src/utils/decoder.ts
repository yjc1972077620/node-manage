// 订阅链接解码工具
// 支持解码各种订阅格式转为节点链接

import { ProxyNode, SubscriptionFormat } from '../types';
import { parseNodes } from './parser';

/**
 * Base64 解码（支持标准和URL安全格式）
 */
export function base64Decode(input: string): string {
    try {
        // URL安全的 Base64 转标准 Base64
        let base64 = input
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        // 补齐 padding
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }

        return atob(base64);
    } catch (e) {
        console.error('Base64解码失败:', e);
        throw new Error('Base64 解码失败');
    }
}

/**
 * 检测订阅格式
 */
export function detectSubscriptionFormat(content: string): SubscriptionFormat {
    const trimmed = content.trim();

    // 尝试检测 YAML（Clash 格式）
    if (trimmed.includes('proxies:') || trimmed.startsWith('port:') || trimmed.startsWith('mixed-port:')) {
        return 'clash';
    }

    // 尝试检测 JSON
    if (trimmed.startsWith('{')) {
        try {
            const json = JSON.parse(trimmed);
            // Sing-box 格式
            if (json.outbounds || json.inbounds) {
                return 'singbox';
            }
            // SIP008 格式
            if (json.servers && Array.isArray(json.servers)) {
                return 'sip008';
            }
        } catch {
            // 不是有效 JSON
        }
    }

    // 尝试检测纯节点链接
    if (
        trimmed.includes('vmess://') ||
        trimmed.includes('vless://') ||
        trimmed.includes('trojan://') ||
        trimmed.includes('ss://') ||
        trimmed.includes('hy2://') ||
        trimmed.includes('hysteria2://')
    ) {
        return 'base64';
    }

    // 默认尝试作为 Base64 解码
    try {
        const decoded = base64Decode(trimmed);
        if (
            decoded.includes('vmess://') ||
            decoded.includes('vless://') ||
            decoded.includes('trojan://') ||
            decoded.includes('ss://') ||
            decoded.includes('hy2://') ||
            decoded.includes('hysteria2://')
        ) {
            return 'base64';
        }
    } catch {
        // 解码失败
    }

    return 'unknown';
}

/**
 * 解析 Clash YAML 格式订阅
 */
export async function parseClashSubscription(yaml: string): Promise<ProxyNode[]> {
    // 动态导入 js-yaml
    const { load } = await import('js-yaml');

    try {
        const config = load(yaml) as { proxies?: unknown[] };
        if (!config.proxies || !Array.isArray(config.proxies)) {
            return [];
        }

        return config.proxies.map((proxy: unknown, index) => {
            const p = proxy as Record<string, unknown>;
            const protocol = (p.type as string || 'unknown').toLowerCase();

            return {
                id: `clash-${index}-${Math.random().toString(36).substring(2, 7)}`,
                name: p.name as string || `Proxy-${index}`,
                protocol: protocol as ProxyNode['protocol'],
                server: p.server as string || '',
                port: p.port as number || 0,
                raw: generateRawLink(p),
                checked: true,
                visible: true,
                extra: p,
            };
        });
    } catch (e) {
        console.error('解析Clash配置失败:', e);
        throw new Error('Clash 配置格式错误');
    }
}

/**
 * 从 Clash 配置生成原始链接
 */
function generateRawLink(proxy: Record<string, unknown>): string {
    const type = (proxy.type as string || '').toLowerCase();
    const name = encodeURIComponent(proxy.name as string || '');

    switch (type) {
        case 'vmess': {
            const vmessConfig = {
                v: '2',
                ps: proxy.name,
                add: proxy.server,
                port: proxy.port,
                id: proxy.uuid,
                aid: proxy.alterId || 0,
                scy: proxy.cipher || 'auto',
                net: proxy.network || 'tcp',
                tls: proxy.tls ? 'tls' : '',
                host: (proxy['ws-opts'] as Record<string, unknown>)?.headers?.Host || '',
                path: (proxy['ws-opts'] as Record<string, unknown>)?.path || '',
            };
            return `vmess://${btoa(JSON.stringify(vmessConfig))}`;
        }

        case 'vless': {
            const params = new URLSearchParams();
            params.set('type', proxy.network as string || 'tcp');
            if (proxy.tls) params.set('security', 'tls');
            if (proxy.flow) params.set('flow', proxy.flow as string);
            if (proxy.servername) params.set('sni', proxy.servername as string);

            return `vless://${proxy.uuid}@${proxy.server}:${proxy.port}?${params.toString()}#${name}`;
        }

        case 'trojan': {
            const params = new URLSearchParams();
            if (proxy.sni) params.set('sni', proxy.sni as string);
            if (proxy.network) params.set('type', proxy.network as string);

            return `trojan://${proxy.password}@${proxy.server}:${proxy.port}?${params.toString()}#${name}`;
        }

        case 'ss':
        case 'shadowsocks': {
            const userInfo = btoa(`${proxy.cipher}:${proxy.password}`);
            return `ss://${userInfo}@${proxy.server}:${proxy.port}#${name}`;
        }

        case 'hysteria2':
        case 'hy2': {
            const params = new URLSearchParams();
            if (proxy.sni) params.set('sni', proxy.sni as string);
            if (proxy.obfs) params.set('obfs', proxy.obfs as string);

            return `hy2://${proxy.password || proxy.auth}@${proxy.server}:${proxy.port}?${params.toString()}#${name}`;
        }

        default:
            return `${type}://${proxy.server}:${proxy.port}#${name}`;
    }
}

/**
 * 解析 SIP008 JSON 格式订阅
 */
export function parseSIP008Subscription(jsonStr: string): ProxyNode[] {
    try {
        const config = JSON.parse(jsonStr);
        if (!config.servers || !Array.isArray(config.servers)) {
            return [];
        }

        return config.servers.map((server: Record<string, unknown>, index: number) => {
            const userInfo = btoa(`${server.method}:${server.password}`);
            const name = encodeURIComponent(server.remarks as string || `SS-${index}`);
            const raw = `ss://${userInfo}@${server.server}:${server.server_port}#${name}`;

            return {
                id: `sip008-${index}-${Math.random().toString(36).substring(2, 7)}`,
                name: server.remarks as string || `SS-${index}`,
                protocol: 'ss' as const,
                server: server.server as string,
                port: server.server_port as number,
                raw,
                checked: true,
                visible: true,
                extra: server,
            };
        });
    } catch (e) {
        console.error('解析SIP008配置失败:', e);
        throw new Error('SIP008 配置格式错误');
    }
}

/**
 * 解析 Sing-box JSON 格式订阅
 */
export function parseSingboxSubscription(jsonStr: string): ProxyNode[] {
    try {
        const config = JSON.parse(jsonStr);
        if (!config.outbounds || !Array.isArray(config.outbounds)) {
            return [];
        }

        // 过滤掉内置类型
        const builtinTypes = ['direct', 'block', 'dns', 'selector', 'urltest'];
        const proxies = config.outbounds.filter(
            (o: Record<string, unknown>) => !builtinTypes.includes(o.type as string)
        );

        return proxies.map((proxy: Record<string, unknown>, index: number) => {
            const type = (proxy.type as string || 'unknown').toLowerCase();

            return {
                id: `singbox-${index}-${Math.random().toString(36).substring(2, 7)}`,
                name: proxy.tag as string || `Proxy-${index}`,
                protocol: type as ProxyNode['protocol'],
                server: proxy.server as string || '',
                port: proxy.server_port as number || 0,
                raw: JSON.stringify(proxy),
                checked: true,
                visible: true,
                extra: proxy,
            };
        });
    } catch (e) {
        console.error('解析Sing-box配置失败:', e);
        throw new Error('Sing-box 配置格式错误');
    }
}

/**
 * 解码订阅内容
 * @param content 订阅内容（可能是Base64编码或原始格式）
 */
export async function decodeSubscription(content: string): Promise<ProxyNode[]> {
    const trimmed = content.trim();

    // 检测格式
    const format = detectSubscriptionFormat(trimmed);

    switch (format) {
        case 'clash':
            return parseClashSubscription(trimmed);

        case 'singbox':
            return parseSingboxSubscription(trimmed);

        case 'sip008':
            return parseSIP008Subscription(trimmed);

        case 'base64': {
            // 尝试直接解析
            let decoded = trimmed;

            // 如果不包含协议前缀，尝试 Base64 解码
            if (!trimmed.includes('://')) {
                try {
                    decoded = base64Decode(trimmed);
                } catch {
                    throw new Error('无法解码订阅内容');
                }
            }

            return parseNodes(decoded);
        }

        default:
            throw new Error('无法识别的订阅格式');
    }
}

/**
 * 获取订阅内容（通过URL）
 */
export async function fetchSubscription(url: string): Promise<string> {
    try {
        // 使用代理 API 获取订阅内容，避免 CORS 问题
        const apiUrl = `/api/fetch?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.text();
    } catch (e) {
        console.error('获取订阅失败:', e);
        throw new Error('获取订阅失败，请检查链接是否正确');
    }
}

/**
 * 将节点列表导出为文本（每行一个链接）
 */
export function exportNodesToText(nodes: ProxyNode[]): string {
    return nodes
        .filter(n => n.checked)
        .map(n => n.raw)
        .join('\n');
}

/**
 * 将节点列表导出为 Base64
 */
export function exportNodesToBase64(nodes: ProxyNode[]): string {
    const text = exportNodesToText(nodes);
    return btoa(text);
}
