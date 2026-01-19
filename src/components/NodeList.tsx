// 节点列表组件
import { ProxyNode, SpeedTestMode } from '../types';
import NodeCard from './NodeCard';

interface NodeListProps {
    nodes: ProxyNode[];
    onToggle: (id: string) => void;
    onSearch: (keyword: string) => void;
    onSpeedTest: (mode: SpeedTestMode) => void;
    onRemoveDuplicates: () => void;
    onSortByPing: () => void;
    onSortByName: () => void;
    onToggleAll: () => void;
    speedTestMode: SpeedTestMode;
    onSpeedTestModeChange: (mode: SpeedTestMode) => void;
    isSpeedTesting: boolean;
    searchKeyword: string;
}

export default function NodeList({
    nodes,
    onToggle,
    onSearch,
    onSpeedTest,
    onRemoveDuplicates,
    onSortByPing,
    onSortByName,
    onToggleAll,
    speedTestMode,
    onSpeedTestModeChange,
    isSpeedTesting,
    searchKeyword,
}: NodeListProps) {
    const visibleNodes = nodes.filter(n => n.visible);
    const selectedCount = nodes.filter(n => n.checked).length;

    return (
        <div className="flex flex-col space-y-4">
            {/* 工具栏 */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* 搜索和计数 */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-48">
                        <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => onSearch(e.target.value)}
                            placeholder="搜索节点..."
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:ring-1 focus:ring-primary-500 transition"
                        />
                    </div>
                    <span className="text-xs font-bold bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-md whitespace-nowrap">
                        {selectedCount}/{nodes.length} 个
                    </span>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                    {/* 测速按钮组 */}
                    <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-lg p-0.5">
                        <select
                            value={speedTestMode}
                            onChange={(e) => onSpeedTestModeChange(e.target.value as SpeedTestMode)}
                            className="text-xs bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-400 pr-6"
                        >
                            <option value="tcp">TCP</option>
                            <option value="http">HTTP</option>
                            <option value="download">下载</option>
                        </select>
                        <button
                            onClick={() => onSpeedTest(speedTestMode)}
                            disabled={isSpeedTesting || visibleNodes.length === 0}
                            className={`tool-btn ${isSpeedTesting
                                ? 'text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-wait'
                                : 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 border-primary-100 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                                }`}
                        >
                            <i className={`fas ${isSpeedTesting ? 'fa-spinner fa-spin' : 'fa-bolt'} mr-1.5`}></i>
                            测速
                        </button>
                    </div>

                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                    {/* 其他工具按钮 */}
                    <button
                        onClick={onRemoveDuplicates}
                        className="tool-btn text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800"
                        title="去重"
                    >
                        <i className="fas fa-broom"></i>
                    </button>
                    <button
                        onClick={onSortByPing}
                        className="tool-btn text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800"
                        title="按延迟排序"
                    >
                        <i className="fas fa-sort-numeric-down"></i>
                    </button>
                    <button
                        onClick={onSortByName}
                        className="tool-btn text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800"
                        title="按名称排序"
                    >
                        <i className="fas fa-font"></i>
                    </button>
                    <button
                        onClick={onToggleAll}
                        className="tool-btn text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        title="全选/取消全选"
                    >
                        <i className="fas fa-check-double"></i>
                    </button>
                </div>
            </div>

            {/* 节点网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 content-start min-h-[300px]">
                {visibleNodes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600 bg-white/50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <i className="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                        <p className="text-sm">
                            {nodes.length === 0 ? '暂无数据，请在上方解析节点' : '没有匹配的节点'}
                        </p>
                    </div>
                ) : (
                    visibleNodes.map(node => (
                        <NodeCard
                            key={node.id}
                            node={node}
                            onToggle={onToggle}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
