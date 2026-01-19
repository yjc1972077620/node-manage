// 输入面板组件（节点转订阅模式）
import { OutputMode, ClientOption } from '../types';

interface InputPanelProps {
    sourceText: string;
    onSourceTextChange: (text: string) => void;
    onParse: () => void;
    onGenerate: () => void;
    outputMode: OutputMode;
    onOutputModeChange: (mode: OutputMode) => void;
    targetClient: string;
    onTargetClientChange: (client: string) => void;
    pureMode: boolean;
    onPureModeChange: (pure: boolean) => void;
    customFilename: string;
    onCustomFilenameChange: (name: string) => void;
    useCustomFilename: boolean;
    onUseCustomFilenameChange: (use: boolean) => void;
    selectedCount: number;
    isGenerating: boolean;
}

// 目标客户端选项
const clientOptions: ClientOption[] = [
    { value: 'clash&new_name=true', label: 'Clash Meta / Verge (推荐)', description: '支持最新协议' },
    { value: 'clash', label: 'Clash 标准版', description: '经典版本' },
    { value: 'singbox', label: 'Sing-box', description: '新一代内核' },
    { value: 'shadowrocket', label: 'Shadowrocket', description: 'iOS 小火箭' },
    { value: 'surge&ver=4', label: 'Surge 4+', description: 'macOS/iOS' },
    { value: 'mixed', label: 'Mixed (Base64)', description: '通用格式' },
];

export default function InputPanel({
    sourceText,
    onSourceTextChange,
    onParse,
    onGenerate,
    outputMode,
    onOutputModeChange,
    targetClient,
    onTargetClientChange,
    pureMode,
    onPureModeChange,
    customFilename,
    onCustomFilenameChange,
    useCustomFilename,
    onUseCustomFilenameChange,
    selectedCount,
    isGenerating,
}: InputPanelProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 左侧：输入区域 */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <i className="fas fa-link text-primary-500"></i>
                            节点资源输入
                        </label>
                        <button
                            onClick={() => onSourceTextChange('')}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                        >
                            清空内容
                        </button>
                    </div>
                    <div className="relative group">
                        <textarea
                            value={sourceText}
                            onChange={(e) => onSourceTextChange(e.target.value)}
                            className="w-full h-40 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-800 focus:border-transparent transition text-xs font-mono resize-none leading-relaxed"
                            placeholder={`在此粘贴节点链接：
vmess://...
vless://...
trojan://...
ss://...
hy2://...

支持混合多行输入`}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none group-focus-within:text-primary-400">
                            支持 VMess / VLESS / Trojan / SS / Hysteria2 / TUIC
                        </div>
                    </div>
                </div>

                {/* 右侧：配置选项 */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                    {/* 输出模式切换 */}
                    <div className="bg-gray-200/60 dark:bg-gray-700/60 p-1 rounded-lg flex text-center">
                        <button
                            onClick={() => onOutputModeChange('url')}
                            className={`flex-1 py-2 text-xs rounded-md transition-all ${outputMode === 'url'
                                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm font-semibold'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                                }`}
                        >
                            <i className="fas fa-link mr-1"></i>
                            生成链接
                        </button>
                        <button
                            onClick={() => onOutputModeChange('file')}
                            className={`flex-1 py-2 text-xs rounded-md transition-all ${outputMode === 'file'
                                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm font-semibold'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                                }`}
                        >
                            <i className="fas fa-download mr-1"></i>
                            下载文件
                        </button>
                    </div>

                    {/* 目标客户端选择 */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block">
                            目标客户端
                        </label>
                        <div className="relative">
                            <select
                                value={targetClient}
                                onChange={(e) => onTargetClientChange(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                            >
                                {clientOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <i className="fas fa-chevron-down absolute right-3 top-3.5 text-xs text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    {/* 选项 */}
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 transition shadow-sm">
                            <input
                                type="checkbox"
                                checked={pureMode}
                                onChange={(e) => onPureModeChange(e.target.checked)}
                                className="text-primary-600 focus:ring-primary-500 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                                纯净模式 (仅节点)
                            </span>
                        </label>
                        <label className="flex items-center p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 transition shadow-sm">
                            <input
                                type="checkbox"
                                checked={useCustomFilename}
                                onChange={(e) => onUseCustomFilenameChange(e.target.checked)}
                                className="text-primary-600 focus:ring-primary-500 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                                自定义文件名
                            </span>
                        </label>
                    </div>

                    {/* 自定义文件名输入 */}
                    {useCustomFilename && (
                        <input
                            type="text"
                            value={customFilename}
                            onChange={(e) => onCustomFilenameChange(e.target.value)}
                            placeholder="config"
                            className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs transition animate-fade-in"
                        />
                    )}

                    {/* 操作按钮 */}
                    <div className="flex gap-3">
                        <button
                            onClick={onParse}
                            className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold text-sm transition shadow-sm"
                        >
                            解析节点
                        </button>
                        <button
                            onClick={onGenerate}
                            disabled={selectedCount === 0 || isGenerating}
                            className={`flex-[2] py-3 rounded-xl font-bold text-sm transition shadow-md flex items-center justify-center ${selectedCount > 0 && !isGenerating
                                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200 dark:shadow-none'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                                    处理中...
                                </>
                            ) : selectedCount > 0 ? (
                                <>
                                    <i className={`fas ${outputMode === 'url' ? 'fa-link' : 'fa-file-download'} mr-2`}></i>
                                    {outputMode === 'url' ? '生成订阅' : '下载配置'} ({selectedCount})
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-mouse-pointer mr-2"></i>
                                    请选择节点
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
