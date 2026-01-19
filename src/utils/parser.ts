// 节点解析工具
// 支持解析各种代理协议链接

import { ProxyNode, ProtocolType } from '../types';

/**
 * 生成唯一 ID
 */
function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}

/**
 * 解析 VMess 链接
 * 格式: vmess://base64编码的JSON
 */
export function parseVmessLink(link: string): ProxyNode | null {
    try {
        const base64Part = link.replace('vmess://', '');
        const jsonStr = atob(base64Part);
        const config = JSON.parse(jsonStr);

        return {
            id: generateId(),
            name: config.ps || config.remarks || `VMess-${config.add}`,
            protocol: 'vmess',
            server: config.add || '',
            port: parseInt(config.port) || 443,
            raw: link,
            checked: true,
            visible: true,
            extra: {
                uuid: config.id,
                alterId: config.aid || 0,
                cipher: config.scy || 'auto',
                network: config.net || 'tcp',
                tls: config.tls === 'tls',
                host: config.host,
                path: config.path,
            },
        };
    } catch (e) {
        console.error('解析VMess链接失败:', e);
        return null;
    }
}

/**
 * 解析 VLESS 链接
 * 格式: vless://uuid@server:port?参数#名称
 */
export function parseVlessLink(link: string): ProxyNode | null {
    try {
        const url = new URL(link);
        const name = decodeURIComponent(url.hash.substring(1)) || `VLESS-${url.hostname}`;

        return {
            id: generateId(),
            name,
            protocol: 'vless',
            server: url.hostname,
            port: parseInt(url.port) || 443,
            raw: link,
            checked: true,
            visible: true,
            extra: {
                uuid: url.username,
                encryption: url.searchParams.get('encryption') || 'none',
                flow: url.searchParams.get('flow'),
                security: url.searchParams.get('security') || 'none',
                type: url.searchParams.get('type') || 'tcp',
                host: url.searchParams.get('host'),
                path: url.searchParams.get('path'),
                sni: url.searchParams.get('sni'),
                fp: url.searchParams.get('fp'),
                pbk: url.searchParams.get('pbk'),
                sid: url.searchParams.get('sid'),
            },
        };
    } catch (e) {
        console.error('解析VLESS链接失败:', e);
        return null;
    }
}

/**
 * 解析 Trojan 链接
 * 格式: trojan://password@server:port?参数#名称
 */
export function parseTrojanLink(link: string): ProxyNode | null {
    try {
        const url = new URL(link);
        const name = decodeURIComponent(url.hash.substring(1)) || `Trojan-${url.hostname}`;

        return {
            id: generateId(),
            name,
            protocol: 'trojan',
            server: url.hostname,
            port: parseInt(url.port) || 443,
            raw: link,
            checked: true,
            visible: true,
            extra: {
                password: url.username,
                sni: url.searchParams.get('sni') || url.hostname,
                allowInsecure: url.searchParams.get('allowInsecure') === '1',
                type: url.searchParams.get('type') || 'tcp',
                host: url.searchParams.get('host'),
                path: url.searchParams.get('path'),
            },
        };
    } catch (e) {
        console.error('解析Trojan链接失败:', e);
        return null;
    }
}

/**
 * 解析 Shadowsocks 链接
 * 格式1(SIP002): ss://base64(method:password)@server:port#名称
 * 格式2(旧版): ss://base64(method:password@server:port)#名称
 */
export function parseShadowsocksLink(link: string): ProxyNode | null {
    try {
        const url = new URL(link);
        let server = url.hostname;
        let port = parseInt(url.port) || 443;
        let method = '';
        let password = '';
        const name = decodeURIComponent(url.hash.substring(1)) || `SS-${server}`;

        if (server && port) {
            // SIP002 格式
            const userInfo = atob(url.username);
            const [m, p] = userInfo.split(':');
            method = m;
            password = p;
        } else {
            // 旧版格式
            const base64Part = link.replace('ss://', '').split('#')[0];
            const decoded = atob(base64Part);
            const match = decoded.match(/^(.+?):(.+?)@(.+?):(\d+)$/);
            if (match) {
                method = match[1];
                password = match[2];
                server = match[3];
                port = parseInt(match[4]);
            }
        }

        if (!server || !port) return null;

        return {
            id: generateId(),
            name,
            protocol: 'ss',
            server,
            port,
            raw: link,
            checked: true,
            visible: true,
            extra: {
                method,
                password,
            },
        };
    } catch (e) {
        console.error('解析Shadowsocks链接失败:', e);
        return null;
    }
}

/**
 * 解析 Hysteria2 链接
 * 格式: hy2://auth@server:port?参数#名称
 * 或: hysteria2://auth@server:port?参数#名称
 */
export function parseHysteria2Link(link: string): ProxyNode | null {
    try {
        const url = new URL(link);
        const name = decodeURIComponent(url.hash.substring(1)) || `HY2-${url.hostname}`;

        return {
            id: generateId(),
            name,
            protocol: link.startsWith('hy2://') ? 'hy2' : 'hysteria2',
            server: url.hostname,
            port: parseInt(url.port) || 443,
            raw: link,
            checked: true,
            visible: true,
            extra: {
                auth: url.username,
                sni: url.searchParams.get('sni'),
                insecure: url.searchParams.get('insecure') === '1',
                obfs: url.searchParams.get('obfs'),
                obfsPassword: url.searchParams.get('obfs-password'),
            },
        };
    } catch (e) {
        console.error('解析Hysteria2链接失败:', e);
        return null;
    }
}

/**
 * 解析 TUIC 链接
 * 格式: tuic://uuid:password@server:port?参数#名称
 */
export function parseTuicLink(link: string): ProxyNode | null {
    try {
        const url = new URL(link);
        const name = decodeURIComponent(url.hash.substring(1)) || `TUIC-${url.hostname}`;

        return {
            id: generateId(),
            name,
            protocol: 'tuic',
            server: url.hostname,
            port: parseInt(url.port) || 443,
            raw: link,
            checked: true,
            visible: true,
            extra: {
                uuid: url.username,
                password: url.password,
                congestionControl: url.searchParams.get('congestion_control') || 'bbr',
                alpn: url.searchParams.get('alpn'),
                sni: url.searchParams.get('sni'),
                udpRelayMode: url.searchParams.get('udp_relay_mode'),
            },
        };
    } catch (e) {
        console.error('解析TUIC链接失败:', e);
        return null;
    }
}

/**
 * 检测协议类型
 */
export function detectProtocol(link: string): ProtocolType {
    const trimmed = link.trim().toLowerCase();
    if (trimmed.startsWith('vmess://')) return 'vmess';
    if (trimmed.startsWith('vless://')) return 'vless';
    if (trimmed.startsWith('trojan://')) return 'trojan';
    if (trimmed.startsWith('ss://')) return 'ss';
    if (trimmed.startsWith('ssr://')) return 'ssr';
    if (trimmed.startsWith('hysteria2://')) return 'hysteria2';
    if (trimmed.startsWith('hy2://')) return 'hy2';
    if (trimmed.startsWith('hysteria://')) return 'hysteria';
    if (trimmed.startsWith('tuic://')) return 'tuic';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return 'http';
    if (trimmed.startsWith('socks5://') || trimmed.startsWith('socks://')) return 'socks5';
    return 'unknown';
}

/**
 * 解析单个节点链接
 */
export function parseNodeLink(link: string): ProxyNode | null {
    const trimmed = link.trim();
    if (!trimmed) return null;

    const protocol = detectProtocol(trimmed);

    switch (protocol) {
        case 'vmess':
            return parseVmessLink(trimmed);
        case 'vless':
            return parseVlessLink(trimmed);
        case 'trojan':
            return parseTrojanLink(trimmed);
        case 'ss':
            return parseShadowsocksLink(trimmed);
        case 'hy2':
        case 'hysteria2':
            return parseHysteria2Link(trimmed);
        case 'tuic':
            return parseTuicLink(trimmed);
        default:
            // 无法解析的链接，仍然创建节点对象
            return {
                id: generateId(),
                name: `Unknown-${generateId().substring(0, 4)}`,
                protocol: 'unknown',
                server: '',
                port: 0,
                raw: trimmed,
                checked: true,
                visible: true,
            };
    }
}

/**
 * 批量解析节点链接
 * @param input 包含多个节点链接的文本（换行/空格分隔）
 */
export function parseNodes(input: string): ProxyNode[] {
    const lines = input.split(/[\n\s]+/).filter(line => line.trim());
    const nodes: ProxyNode[] = [];

    for (const line of lines) {
        const node = parseNodeLink(line);
        if (node) {
            nodes.push(node);
        }
    }

    return nodes;
}

/**
 * 去重节点
 */
export function removeDuplicateNodes(nodes: ProxyNode[]): ProxyNode[] {
    const seen = new Set<string>();
    return nodes.filter(node => {
        const key = node.server
            ? `${node.protocol}:${node.server}:${node.port}`
            : node.raw;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

/**
 * 按延迟排序节点
 */
export function sortNodesByPing(nodes: ProxyNode[]): ProxyNode[] {
    return [...nodes].sort((a, b) => {
        const pingA = a.speedTest?.tcpLatency ?? Infinity;
        const pingB = b.speedTest?.tcpLatency ?? Infinity;
        // 失败的放最后
        const failA = a.speedTest?.success === false ? 1 : 0;
        const failB = b.speedTest?.success === false ? 1 : 0;
        if (failA !== failB) return failA - failB;
        return pingA - pingB;
    });
}

/**
 * 按名称排序节点
 */
export function sortNodesByName(nodes: ProxyNode[]): ProxyNode[] {
    return [...nodes].sort((a, b) => a.name.localeCompare(b.name));
}
