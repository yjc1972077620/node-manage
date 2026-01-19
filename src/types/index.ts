// 代理节点类型定义

/**
 * 代理节点协议类型
 */
export type ProtocolType =
    | 'vmess'
    | 'vless'
    | 'trojan'
    | 'ss'
    | 'ssr'
    | 'hysteria'
    | 'hysteria2'
    | 'hy2'
    | 'tuic'
    | 'http'
    | 'socks5'
    | 'unknown';

/**
 * 测速模式
 */
export type SpeedTestMode = 'tcp' | 'http' | 'download';

/**
 * 测速结果
 */
export interface SpeedTestResult {
    // TCP连接延迟（毫秒）
    tcpLatency: number | null;
    // HTTP响应延迟（毫秒）
    httpLatency: number | null;
    // 下载速度（KB/s）
    downloadSpeed: number | null;
    // 测试发起的CF区域
    cfRegion: string;
    // 测试时间戳
    timestamp: number;
    // 是否成功
    success: boolean;
    // 错误信息
    error?: string;
}

/**
 * 代理节点
 */
export interface ProxyNode {
    // 唯一标识符
    id: string;
    // 节点名称
    name: string;
    // 协议类型
    protocol: ProtocolType;
    // 服务器地址
    server: string;
    // 端口
    port: number;
    // 原始链接
    raw: string;
    // 是否选中
    checked: boolean;
    // 是否可见（搜索过滤）
    visible: boolean;
    // 测速结果
    speedTest?: SpeedTestResult;
    // 额外信息（各协议特有参数）
    extra?: Record<string, unknown>;
}

/**
 * 转换模式
 */
export type ConvertMode = 'nodeToSub' | 'subToNode';

/**
 * 输出模式
 */
export type OutputMode = 'url' | 'file';

/**
 * 目标客户端类型
 */
export interface ClientOption {
    value: string;
    label: string;
    description?: string;
}

/**
 * 应用状态
 */
export interface AppState {
    // 当前模式
    convertMode: ConvertMode;
    // 输出模式
    outputMode: OutputMode;
    // 目标客户端
    targetClient: string;
    // 节点列表
    nodes: ProxyNode[];
    // 是否加载中
    loading: boolean;
    // 错误信息
    error: string | null;
    // 生成的URL
    resultUrl: string | null;
    // 暗色模式
    darkMode: boolean;
    // 测速模式
    speedTestMode: SpeedTestMode;
}

/**
 * 订阅格式
 */
export type SubscriptionFormat =
    | 'base64'      // 纯Base64编码的节点链接列表
    | 'clash'       // Clash YAML格式
    | 'singbox'     // Sing-box JSON格式
    | 'sip008'      // SIP008 JSON格式
    | 'unknown';

/**
 * 教程步骤
 */
export interface TutorialStep {
    // 步骤序号
    step: number;
    // 步骤内容
    content: string;
    // 可选的图标
    icon?: string;
}

/**
 * 教程数据
 */
export interface TutorialData {
    // 客户端名称
    title: string;
    // 链接模式步骤
    urlSteps: TutorialStep[];
    // 文件模式步骤
    fileSteps: TutorialStep[];
    // 下载链接
    downloadLinks?: {
        platform: string;
        url: string;
    }[];
}

/**
 * API 响应
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
