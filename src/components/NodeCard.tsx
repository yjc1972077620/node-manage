// 节点卡片组件
import { ProxyNode } from '../types';
import { getPingLevel, formatLatency, formatSpeed } from '../utils/speedTest';

interface NodeCardProps {
    node: ProxyNode;
    onToggle: (id: string) => void;
}

// 协议图标映射
const protocolIcons: Record<string, string> = {
    vmess: 'fa-v',
    vless: 'fa-bolt',
    trojan: 'fa-horse',
    ss: 'fa-shield-halved',
    ssr: 'fa-shield',
    hysteria: 'fa-wind',
    hysteria2: 'fa-wind',
    hy2: 'fa-wind',
    tuic: 'fa-rocket',
    http: 'fa-globe',
    socks5: 'fa-socks',
    unknown: 'fa-question',
};

export default function NodeCard({ node, onToggle }: NodeCardProps) {
    // 延迟显示
    const renderPing = () => {
        if (!node.speedTest) {
            return <span className="text-gray-300 dark:text-gray-600 text-[10px]">-</span>;
        }

        if (node.speedTest.tcpLatency === null && node.speedTest.httpLatency === null) {
            return (
                <span className="text-gray-300 dark:text-gray-600 text-[10px]">
                    <i className="fas fa-circle-notch fa-spin"></i>
                </span>
            );
        }

        const latency = node.speedTest.tcpLatency ?? node.speedTest.httpLatency;
        const level = getPingLevel(latency);

        return (
            <span className={`ping-${level} px-1.5 py-0.5 rounded text-[10px] font-medium`}>
                {formatLatency(latency)}
            </span>
        );
    };

    // 额外信息显示（下载速度等）
    const renderExtraInfo = () => {
        if (!node.speedTest?.downloadSpeed) return null;

        return (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">
                {formatSpeed(node.speedTest.downloadSpeed)}
            </span>
        );
    };

    // 协议标签样式
    const protocolClass = `protocol-${node.protocol}`;

    return (
        <div
            onClick={() => onToggle(node.id)}
            className={`
        bg-white dark:bg-gray-800 
        border ${node.checked
                    ? 'border-primary-500 ring-1 ring-primary-100 dark:ring-primary-900'
                    : 'border-gray-200 dark:border-gray-700'
                } 
        rounded-xl p-3 
        hover:shadow-md dark:hover:shadow-gray-900/30
        transition-all duration-200 
        cursor-pointer 
        relative group
        animate-fade-in
      `}
        >
            {/* 顶部：选中状态 + 名称 + 延迟 */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 overflow-hidden w-full">
                    <input
                        type="checkbox"
                        checked={node.checked}
                        readOnly
                        className="text-primary-600 focus:ring-0 rounded border-gray-300 dark:border-gray-600 pointer-events-none"
                    />
                    <div
                        className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate flex-1"
                        title={node.name}
                    >
                        {node.name}
                    </div>
                </div>
                <div className="flex items-center">
                    {renderPing()}
                    {renderExtraInfo()}
                </div>
            </div>

            {/* 底部：协议 + 服务器 */}
            <div className="flex justify-between items-center">
                <span className={`text-[10px] ${protocolClass} px-1.5 py-0.5 rounded border border-current/10 uppercase font-medium`}>
                    <i className={`fas ${protocolIcons[node.protocol] || 'fa-question'} mr-1`}></i>
                    {node.protocol}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono truncate max-w-[100px]">
                    {node.server || 'N/A'}:{node.port || '-'}
                </span>
            </div>

            {/* CF区域标识（测速后显示） */}
            {node.speedTest?.cfRegion && node.speedTest.cfRegion !== 'Unknown' && (
                <div className="absolute top-1 right-1 text-[8px] text-gray-300 dark:text-gray-600 font-mono">
                    {node.speedTest.cfRegion}
                </div>
            )}
        </div>
    );
}
