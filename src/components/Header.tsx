// 头部导航组件
import { ConvertMode } from '../types';

interface HeaderProps {
    mode: ConvertMode;
    onModeChange: (mode: ConvertMode) => void;
    darkMode: boolean;
    onDarkModeChange: (dark: boolean) => void;
}

export default function Header({ mode, onModeChange, darkMode, onDarkModeChange }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo 和标题 */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 dark:shadow-none">
                        <i className="fas fa-shuffle"></i>
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight">
                            Proxy Converter
                        </h1>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono hidden sm:block">
                            节点/订阅 双向转换工具
                        </p>
                    </div>
                </div>

                {/* 模式切换标签 */}
                <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => onModeChange('nodeToSub')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'nodeToSub'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <i className="fas fa-arrow-right mr-2"></i>
                        节点 → 订阅
                    </button>
                    <button
                        onClick={() => onModeChange('subToNode')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'subToNode'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        订阅 → 节点
                    </button>
                </div>

                {/* 右侧工具栏 */}
                <div className="flex items-center gap-3">
                    {/* 暗色模式切换 */}
                    <button
                        onClick={() => onDarkModeChange(!darkMode)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
                    >
                        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>

                    {/* GitHub 链接 */}
                    <a
                        href="https://github.com/tindy2013/subconverter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title="GitHub"
                    >
                        <i className="fab fa-github text-xl"></i>
                    </a>
                </div>
            </div>

            {/* 移动端模式切换 */}
            <div className="md:hidden flex border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => onModeChange('nodeToSub')}
                    className={`flex-1 py-3 text-sm font-medium transition-all ${mode === 'nodeToSub'
                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    <i className="fas fa-arrow-right mr-1"></i>
                    节点 → 订阅
                </button>
                <button
                    onClick={() => onModeChange('subToNode')}
                    className={`flex-1 py-3 text-sm font-medium transition-all ${mode === 'subToNode'
                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    <i className="fas fa-arrow-left mr-1"></i>
                    订阅 → 节点
                </button>
            </div>
        </header>
    );
}
