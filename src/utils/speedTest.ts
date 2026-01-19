// 节点测速工具
// 三种测速模式：TCP连接、HTTP响应、下载速度

import { ProxyNode, SpeedTestResult, SpeedTestMode } from '../types';

// 最大并发测试数
const MAX_CONCURRENT = 5;

// API 基础路径
const API_BASE = '/api';

/**
 * TCP 连接测速
 * 测量TCP握手时间，由Cloudflare边缘发起
 */
async function tcpSpeedTest(node: ProxyNode): Promise<SpeedTestResult> {
    const start = Date.now();

    try {
        const response = await fetch(
            `${API_BASE}/check?ip=${encodeURIComponent(node.server)}&port=${node.port}&mode=tcp`,
            { signal: AbortSignal.timeout(10000) }
        );

        const elapsed = Date.now() - start;
        const cfRegion = response.headers.get('cf-ray')?.split('-')[1] || 'Unknown';

        if (response.ok) {
            return {
                tcpLatency: elapsed,
                httpLatency: null,
                downloadSpeed: null,
                cfRegion,
                timestamp: Date.now(),
                success: true,
            };
        } else {
            return {
                tcpLatency: -1,
                httpLatency: null,
                downloadSpeed: null,
                cfRegion,
                timestamp: Date.now(),
                success: false,
                error: 'TCP连接失败',
            };
        }
    } catch (e) {
        return {
            tcpLatency: -1,
            httpLatency: null,
            downloadSpeed: null,
            cfRegion: 'Unknown',
            timestamp: Date.now(),
            success: false,
            error: e instanceof Error ? e.message : '连接超时',
        };
    }
}

/**
 * HTTP 响应测速
 * 通过代理请求一个轻量级HTTP端点，测量完整响应时间
 */
async function httpSpeedTest(node: ProxyNode): Promise<SpeedTestResult> {
    const start = Date.now();

    try {
        const response = await fetch(
            `${API_BASE}/check?ip=${encodeURIComponent(node.server)}&port=${node.port}&mode=http`,
            { signal: AbortSignal.timeout(15000) }
        );

        const elapsed = Date.now() - start;
        const cfRegion = response.headers.get('cf-ray')?.split('-')[1] || 'Unknown';
        const tcpLatency = parseInt(response.headers.get('x-tcp-latency') || '0');

        if (response.ok) {
            return {
                tcpLatency: tcpLatency || null,
                httpLatency: elapsed,
                downloadSpeed: null,
                cfRegion,
                timestamp: Date.now(),
                success: true,
            };
        } else {
            return {
                tcpLatency: null,
                httpLatency: -1,
                downloadSpeed: null,
                cfRegion,
                timestamp: Date.now(),
                success: false,
                error: 'HTTP请求失败',
            };
        }
    } catch (e) {
        return {
            tcpLatency: null,
            httpLatency: -1,
            downloadSpeed: null,
            cfRegion: 'Unknown',
            timestamp: Date.now(),
            success: false,
            error: e instanceof Error ? e.message : '请求超时',
        };
    }
}

/**
 * 下载速度测速
 * 通过代理下载一个小文件，测量下载速度
 */
async function downloadSpeedTest(node: ProxyNode): Promise<SpeedTestResult> {
    try {
        const response = await fetch(
            `${API_BASE}/check?ip=${encodeURIComponent(node.server)}&port=${node.port}&mode=download`,
            { signal: AbortSignal.timeout(30000) }
        );

        const cfRegion = response.headers.get('cf-ray')?.split('-')[1] || 'Unknown';

        if (response.ok) {
            const data = await response.json();

            return {
                tcpLatency: data.tcpLatency || null,
                httpLatency: data.httpLatency || null,
                downloadSpeed: data.downloadSpeed || null,
                cfRegion,
                timestamp: Date.now(),
                success: true,
            };
        } else {
            return {
                tcpLatency: null,
                httpLatency: null,
                downloadSpeed: -1,
                cfRegion,
                timestamp: Date.now(),
                success: false,
                error: '下载测速失败',
            };
        }
    } catch (e) {
        return {
            tcpLatency: null,
            httpLatency: null,
            downloadSpeed: -1,
            cfRegion: 'Unknown',
            timestamp: Date.now(),
            success: false,
            error: e instanceof Error ? e.message : '测速超时',
        };
    }
}

/**
 * 执行单节点测速
 */
export async function speedTestNode(
    node: ProxyNode,
    mode: SpeedTestMode = 'tcp'
): Promise<SpeedTestResult> {
    // 验证节点有效性
    if (!node.server || !node.port) {
        return {
            tcpLatency: -1,
            httpLatency: null,
            downloadSpeed: null,
            cfRegion: 'Unknown',
            timestamp: Date.now(),
            success: false,
            error: '节点信息不完整',
        };
    }

    switch (mode) {
        case 'tcp':
            return tcpSpeedTest(node);
        case 'http':
            return httpSpeedTest(node);
        case 'download':
            return downloadSpeedTest(node);
        default:
            return tcpSpeedTest(node);
    }
}

/**
 * 批量测速
 * @param nodes 节点列表
 * @param mode 测速模式
 * @param onProgress 进度回调
 */
export async function batchSpeedTest(
    nodes: ProxyNode[],
    mode: SpeedTestMode = 'tcp',
    onProgress?: (node: ProxyNode, result: SpeedTestResult, completed: number, total: number) => void
): Promise<Map<string, SpeedTestResult>> {
    const results = new Map<string, SpeedTestResult>();
    const validNodes = nodes.filter(n => n.visible && n.server);

    if (validNodes.length === 0) {
        return results;
    }

    // 使用队列控制并发
    const queue = [...validNodes];
    let completed = 0;

    const runWorker = async () => {
        while (queue.length > 0) {
            const node = queue.shift();
            if (!node) break;

            const result = await speedTestNode(node, mode);
            results.set(node.id, result);
            completed++;

            if (onProgress) {
                onProgress(node, result, completed, validNodes.length);
            }
        }
    };

    // 启动多个 worker 并行测试
    const workers = Array(Math.min(MAX_CONCURRENT, validNodes.length))
        .fill(null)
        .map(() => runWorker());

    await Promise.all(workers);

    return results;
}

/**
 * 获取延迟等级（用于显示颜色）
 */
export function getPingLevel(latency: number | null): 'good' | 'avg' | 'bad' | 'unknown' {
    if (latency === null || latency === undefined) return 'unknown';
    if (latency < 0) return 'bad';
    if (latency < 200) return 'good';
    if (latency < 500) return 'avg';
    return 'bad';
}

/**
 * 格式化延迟显示
 */
export function formatLatency(latency: number | null): string {
    if (latency === null || latency === undefined) return '-';
    if (latency < 0) return 'Timeout';
    return `${latency}ms`;
}

/**
 * 格式化下载速度显示
 */
export function formatSpeed(speedKBps: number | null): string {
    if (speedKBps === null || speedKBps === undefined) return '-';
    if (speedKBps < 0) return 'Error';
    if (speedKBps < 1024) return `${speedKBps.toFixed(1)} KB/s`;
    return `${(speedKBps / 1024).toFixed(2)} MB/s`;
}
