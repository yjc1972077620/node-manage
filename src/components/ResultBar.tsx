// 结果展示栏组件

interface ResultBarProps {
    url: string;
    visible: boolean;
    onCopy: () => void;
}

export default function ResultBar({ url, visible, onCopy }: ResultBarProps) {
    if (!visible || !url) return null;

    return (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-primary-50/50 dark:bg-primary-900/20 p-4 md:px-8 flex flex-col md:flex-row items-center gap-4 transition-all animate-slide-up">
            <div className="flex-1 w-full relative">
                <i className="fas fa-check-circle absolute left-3 top-3.5 text-green-500"></i>
                <input
                    type="text"
                    value={url}
                    readOnly
                    className="w-full pl-10 pr-24 py-3 bg-white dark:bg-gray-800 border border-primary-100 dark:border-primary-800 rounded-xl text-sm text-primary-800 dark:text-primary-200 shadow-sm focus:outline-none font-mono"
                />
                <button
                    onClick={onCopy}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200 rounded-lg text-xs font-bold hover:bg-primary-200 dark:hover:bg-primary-700 transition"
                >
                    <i className="fas fa-copy mr-1"></i>
                    复制
                </button>
            </div>

            {/* 快速导入按钮 */}
            <div className="hidden md:flex gap-2">
                <a
                    href={`clash://install-config?url=${encodeURIComponent(url)}`}
                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-600 transition"
                >
                    <i className="fas fa-bolt mr-1"></i>
                    一键导入 Clash
                </a>
            </div>
        </div>
    );
}
