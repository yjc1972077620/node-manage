// 操作教程面板组件
import { TutorialData } from '../types';

interface TutorialPanelProps {
    client: string;
    mode: 'url' | 'file';
}

// 各客户端教程数据
const tutorials: Record<string, TutorialData> = {
    clash: {
        title: 'Clash / Clash Verge',
        urlSteps: [
            { step: 1, content: '点击"生成订阅"按钮，复制生成的链接', icon: 'fa-copy' },
            { step: 2, content: '打开 Clash 客户端，进入"配置"页面', icon: 'fa-cog' },
            { step: 3, content: '点击"导入"或"Remote"按钮，粘贴链接', icon: 'fa-paste' },
            { step: 4, content: '等待配置下载完成，点击启用', icon: 'fa-check' },
            { step: 5, content: '在"代理"页面选择节点，开启"系统代理"', icon: 'fa-globe' },
        ],
        fileSteps: [
            { step: 1, content: '点击"下载配置"按钮，保存 .yaml 文件', icon: 'fa-download' },
            { step: 2, content: '打开 Clash 客户端，进入"配置"页面', icon: 'fa-cog' },
            { step: 3, content: '将文件拖入窗口，或点击"导入本地文件"', icon: 'fa-file-import' },
            { step: 4, content: '点击配置卡片右侧的"√"启用', icon: 'fa-check' },
            { step: 5, content: '在"代理"页面选择节点，开启"系统代理"', icon: 'fa-globe' },
        ],
        downloadLinks: [
            { platform: 'Windows', url: 'https://github.com/zzzgydi/clash-verge/releases' },
            { platform: 'macOS', url: 'https://github.com/zzzgydi/clash-verge/releases' },
            { platform: 'Linux', url: 'https://github.com/zzzgydi/clash-verge/releases' },
        ],
    },
    shadowrocket: {
        title: 'Shadowrocket (小火箭)',
        urlSteps: [
            { step: 1, content: '复制生成的订阅链接', icon: 'fa-copy' },
            { step: 2, content: '打开 Shadowrocket，点击右上角"+"', icon: 'fa-plus' },
            { step: 3, content: '选择"类型"为"Subscribe"', icon: 'fa-list' },
            { step: 4, content: '在 URL 处粘贴链接，点击"完成"', icon: 'fa-paste' },
            { step: 5, content: '回到首页，选择节点并开启连接', icon: 'fa-toggle-on' },
        ],
        fileSteps: [
            { step: 1, content: '在 Safari 中下载配置文件', icon: 'fa-download' },
            { step: 2, content: '选择"用 Shadowrocket 打开"', icon: 'fa-share' },
            { step: 3, content: '确认导入配置', icon: 'fa-check' },
            { step: 4, content: '回到首页选择节点使用', icon: 'fa-toggle-on' },
        ],
        downloadLinks: [
            { platform: 'iOS', url: 'https://apps.apple.com/app/shadowrocket/id932747118' },
        ],
    },
    singbox: {
        title: 'Sing-box',
        urlSteps: [
            { step: 1, content: '复制生成的订阅链接', icon: 'fa-copy' },
            { step: 2, content: '打开 Sing-box，进入 Profiles 页面', icon: 'fa-list' },
            { step: 3, content: '点击"New Profile" → 选择 Remote', icon: 'fa-cloud' },
            { step: 4, content: '粘贴 URL，设置名称，点击 Create', icon: 'fa-paste' },
            { step: 5, content: '在 Dashboard 选择配置，点击启动', icon: 'fa-play' },
        ],
        fileSteps: [
            { step: 1, content: '下载配置文件到本地', icon: 'fa-download' },
            { step: 2, content: '打开 Sing-box，进入 Profiles 页面', icon: 'fa-list' },
            { step: 3, content: '点击"New Profile" → 选择 Local', icon: 'fa-file' },
            { step: 4, content: '选择下载的文件，点击 Import', icon: 'fa-file-import' },
            { step: 5, content: '在 Dashboard 选择配置，点击启动', icon: 'fa-play' },
        ],
        downloadLinks: [
            { platform: 'Windows/macOS/Linux', url: 'https://github.com/SagerNet/sing-box/releases' },
            { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=io.nekohasekai.sfa' },
            { platform: 'iOS', url: 'https://apps.apple.com/app/sing-box/id6451272673' },
        ],
    },
    v2rayn: {
        title: 'V2RayN',
        urlSteps: [
            { step: 1, content: '复制生成的订阅链接', icon: 'fa-copy' },
            { step: 2, content: '右键系统托盘图标 → 订阅设置', icon: 'fa-cog' },
            { step: 3, content: '点击"添加"，粘贴订阅地址', icon: 'fa-paste' },
            { step: 4, content: '保存后，点击"更新所有订阅"', icon: 'fa-sync' },
            { step: 5, content: '选择节点，设置系统代理模式', icon: 'fa-globe' },
        ],
        fileSteps: [
            { step: 1, content: '下载配置文件', icon: 'fa-download' },
            { step: 2, content: '打开 V2RayN 主界面', icon: 'fa-window-maximize' },
            { step: 3, content: '菜单 → 服务器 → 从剪贴板导入批量URL', icon: 'fa-paste' },
            { step: 4, content: '或直接编辑配置文件', icon: 'fa-edit' },
        ],
        downloadLinks: [
            { platform: 'Windows', url: 'https://github.com/2dust/v2rayN/releases' },
        ],
    },
    surge: {
        title: 'Surge',
        urlSteps: [
            { step: 1, content: '复制生成的订阅链接', icon: 'fa-copy' },
            { step: 2, content: '打开 Surge → 配置 → 从URL安装', icon: 'fa-cloud-download' },
            { step: 3, content: '粘贴链接，确认安装', icon: 'fa-paste' },
            { step: 4, content: '在主界面开启代理', icon: 'fa-toggle-on' },
        ],
        fileSteps: [
            { step: 1, content: '下载配置文件', icon: 'fa-download' },
            { step: 2, content: '在 Surge 中选择"从文件安装配置"', icon: 'fa-file-import' },
            { step: 3, content: '选择下载的文件', icon: 'fa-folder-open' },
            { step: 4, content: '开启代理使用', icon: 'fa-toggle-on' },
        ],
        downloadLinks: [
            { platform: 'macOS', url: 'https://nssurge.com/' },
            { platform: 'iOS', url: 'https://apps.apple.com/app/surge-5/id1442620678' },
        ],
    },
};

// 根据客户端值获取教程key
function getClientKey(client: string): string {
    if (client.includes('clash')) return 'clash';
    if (client.includes('shadowrocket')) return 'shadowrocket';
    if (client.includes('singbox')) return 'singbox';
    if (client.includes('surge')) return 'surge';
    if (client.includes('mixed')) return 'v2rayn';
    return 'clash';
}

export default function TutorialPanel({ client, mode }: TutorialPanelProps) {
    const key = getClientKey(client);
    const tutorial = tutorials[key] || tutorials.clash;
    const steps = mode === 'url' ? tutorial.urlSteps : tutorial.fileSteps;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            {/* 标题 */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 dark:from-gray-800 to-white dark:to-gray-750 rounded-t-xl">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center">
                    <i className="fas fa-book-reader mr-2 text-primary-500"></i>
                    {tutorial.title}
                    <span className="ml-2 text-xs font-normal text-gray-400">
                        ({mode === 'url' ? '链接模式' : '文件模式'})
                    </span>
                </h3>
            </div>

            {/* 步骤列表 */}
            <div className="p-5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
                {steps.map((step) => (
                    <div key={step.step} className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-bold text-[10px]">
                            {step.step}
                        </span>
                        <div className="flex-1 pt-0.5">
                            {step.icon && (
                                <i className={`fas ${step.icon} text-gray-400 dark:text-gray-500 mr-1.5`}></i>
                            )}
                            <span>{step.content}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 下载链接 */}
            {tutorial.downloadLinks && tutorial.downloadLinks.length > 0 && (
                <div className="px-5 pb-4">
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 font-medium">
                        <i className="fas fa-download mr-1"></i>
                        客户端下载
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tutorial.downloadLinks.map((link) => (
                            <a
                                key={link.platform}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition"
                            >
                                {link.platform}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* 底部 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl border-t border-gray-100 dark:border-gray-700 text-[10px] text-gray-400 dark:text-gray-500 text-center">
                Powered by Cloudflare Workers & Subconverter
            </div>
        </div>
    );
}
