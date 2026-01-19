// 订阅解码输入面板组件（订阅转节点模式）

interface SubInputPanelProps {
    sourceText: string;
    onSourceTextChange: (text: string) => void;
    subscriptionUrl: string;
    onSubscriptionUrlChange: (url: string) => void;
    onDecode: () => void;
    onExport: () => void;
    isDecoding: boolean;
    selectedCount: number;
    inputMode: 'url' | 'content';
    onInputModeChange: (mode: 'url' | 'content') => void;
}

export default function SubInputPanel({
    sourceText,
    onSourceTextChange,
    subscriptionUrl,
    onSubscriptionUrlChange,
    onDecode,
    onExport,
    isDecoding,
    selectedCount,
    inputMode,
    onInputModeChange,
}: SubInputPanelProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 左侧：输入区域 */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <i className="fas fa-file-import text-primary-500"></i>
                            订阅内容输入
                        </label>
                        {/* 输入模式切换 */}
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                            <button
                                onClick={() => onInputModeChange('url')}
                                className={`px-3 py-1 text-xs rounded-md transition ${inputMode === 'url'
                                        ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                <i className="fas fa-link mr-1"></i>URL
                            </button>
                            <button
                                onClick={() => onInputModeChange('content')}
                                className={`px-3 py-1 text-xs rounded-md transition ${inputMode === 'content'
                                        ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                <i className="fas fa-code mr-1"></i>内容
                            </button>
                        </div>
                    </div>

                    {inputMode === 'url' ? (
                        // URL 输入
                        <div className="space-y-3">
                            <div className="relative">
                                <i className="fas fa-link absolute left-4 top-3.5 text-gray-400"></i>
                                <input
                                    type="url"
                                    value={subscriptionUrl}
                                    onChange={(e) => onSubscriptionUrlChange(e.target.value)}
                                    placeholder="粘贴订阅链接 https://..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-800 focus:border-transparent transition text-sm font-mono"
                                />
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-4">
                                <span><i className="fas fa-info-circle mr-1"></i>支持各种机场订阅链接</span>
                            </div>
                        </div>
                    ) : (
                        // 内容直接粘贴
                        <div className="relative group">
                            <textarea
                                value={sourceText}
                                onChange={(e) => onSourceTextChange(e.target.value)}
                                className="w-full h-40 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-800 focus:border-transparent transition text-xs font-mono resize-none leading-relaxed"
                                placeholder={`直接粘贴订阅内容：
                
• Base64 编码内容
• Clash YAML 配置
• Sing-box JSON 配置
• 节点链接列表`}
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">
                                自动识别格式
                            </div>
                        </div>
                    )}
                </div>

                {/* 右侧：操作和说明 */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                    {/* 支持格式说明 */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">
                            <i className="fas fa-check-circle mr-1 text-green-500"></i>
                            支持的订阅格式
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { icon: 'fa-file-code', name: 'Base64 节点列表' },
                                { icon: 'fa-file-alt', name: 'Clash YAML' },
                                { icon: 'fa-cubes', name: 'Sing-box JSON' },
                                { icon: 'fa-shield-alt', name: 'SIP008 JSON' },
                            ].map((format) => (
                                <div
                                    key={format.name}
                                    className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400"
                                >
                                    <i className={`fas ${format.icon} text-primary-400`}></i>
                                    {format.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 支持的协议 */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">
                            <i className="fas fa-bolt mr-1 text-yellow-500"></i>
                            支持的协议
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {['VMess', 'VLESS', 'Trojan', 'SS', 'SSR', 'Hysteria2', 'TUIC'].map((proto) => (
                                <span
                                    key={proto}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-[10px] font-medium"
                                >
                                    {proto}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-3">
                        <button
                            onClick={onDecode}
                            disabled={isDecoding || (!subscriptionUrl && !sourceText)}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition shadow-md flex items-center justify-center ${!isDecoding && (subscriptionUrl || sourceText)
                                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200 dark:shadow-none'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                                }`}
                        >
                            {isDecoding ? (
                                <>
                                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                                    解析中...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-file-import mr-2"></i>
                                    解析订阅
                                </>
                            )}
                        </button>
                        <button
                            onClick={onExport}
                            disabled={selectedCount === 0}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center ${selectedCount > 0
                                    ? 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            <i className="fas fa-copy mr-2"></i>
                            导出节点 ({selectedCount})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
