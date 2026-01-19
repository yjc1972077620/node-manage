// 主应用组件
import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import SubInputPanel from './components/SubInputPanel';
import NodeList from './components/NodeList';
import TutorialPanel from './components/TutorialPanel';
import ResultBar from './components/ResultBar';
import Toast, { ToastMessage, createToast } from './components/Toast';
import { ConvertMode, OutputMode, ProxyNode, SpeedTestMode } from './types';
import { parseNodes, removeDuplicateNodes, sortNodesByPing, sortNodesByName } from './utils/parser';
import { decodeSubscription, fetchSubscription, exportNodesToText } from './utils/decoder';
import { batchSpeedTest } from './utils/speedTest';

// 默认后端地址
const DEFAULT_BACKEND = 'https://api.v1.mk';

function App() {
    // 暗色模式
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('darkMode') === 'true' ||
                window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    // 转换模式
    const [convertMode, setConvertMode] = useState<ConvertMode>('nodeToSub');

    // 输出模式
    const [outputMode, setOutputMode] = useState<OutputMode>('url');

    // 节点列表
    const [nodes, setNodes] = useState<ProxyNode[]>([]);

    // 输入文本
    const [sourceText, setSourceText] = useState('');

    // 订阅URL
    const [subscriptionUrl, setSubscriptionUrl] = useState('');

    // 订阅输入模式
    const [subInputMode, setSubInputMode] = useState<'url' | 'content'>('url');

    // 目标客户端
    const [targetClient, setTargetClient] = useState('clash&new_name=true');

    // 纯净模式
    const [pureMode, setPureMode] = useState(true);

    // 自定义文件名
    const [customFilename, setCustomFilename] = useState('');
    const [useCustomFilename, setUseCustomFilename] = useState(false);

    // 搜索关键词
    const [searchKeyword, setSearchKeyword] = useState('');

    // 测速模式
    const [speedTestMode, setSpeedTestMode] = useState<SpeedTestMode>('tcp');

    // 状态
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDecoding, setIsDecoding] = useState(false);
    const [isSpeedTesting, setIsSpeedTesting] = useState(false);

    // 结果URL
    const [resultUrl, setResultUrl] = useState('');

    // Toast 消息
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // 暗色模式切换
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', String(darkMode));
    }, [darkMode]);

    // 添加 Toast
    const addToast = useCallback((type: ToastMessage['type'], message: string) => {
        const toast = createToast(type, message);
        setToasts(prev => [...prev, toast]);
    }, []);

    // 移除 Toast
    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // 搜索过滤
    useEffect(() => {
        setNodes(prev => prev.map(node => ({
            ...node,
            visible: node.name.toLowerCase().includes(searchKeyword.toLowerCase()),
        })));
    }, [searchKeyword]);

    // 选中节点数量
    const selectedCount = nodes.filter(n => n.checked).length;

    // 解析节点（节点转订阅模式）
    const handleParse = useCallback(() => {
        if (!sourceText.trim()) {
            addToast('warning', '请输入节点内容');
            return;
        }

        const parsedNodes = parseNodes(sourceText);
        if (parsedNodes.length === 0) {
            addToast('error', '未能解析出有效节点');
            return;
        }

        setNodes(parsedNodes);
        addToast('success', `成功解析 ${parsedNodes.length} 个节点`);

        // 智能切换客户端
        const hasAdvanced = parsedNodes.some(n =>
            ['vless', 'hysteria', 'hysteria2', 'hy2', 'tuic'].includes(n.protocol)
        );
        if (hasAdvanced && targetClient === 'clash') {
            setTargetClient('clash&new_name=true');
            addToast('info', '检测到新协议，已切换到 Clash Meta');
        }
    }, [sourceText, targetClient, addToast]);

    // 解析订阅（订阅转节点模式）
    const handleDecodeSubscription = useCallback(async () => {
        setIsDecoding(true);
        try {
            let content = '';

            if (subInputMode === 'url') {
                if (!subscriptionUrl.trim()) {
                    addToast('warning', '请输入订阅链接');
                    return;
                }
                content = await fetchSubscription(subscriptionUrl);
            } else {
                if (!sourceText.trim()) {
                    addToast('warning', '请输入订阅内容');
                    return;
                }
                content = sourceText;
            }

            const decodedNodes = await decodeSubscription(content);
            if (decodedNodes.length === 0) {
                addToast('error', '未能解析出有效节点');
                return;
            }

            setNodes(decodedNodes);
            addToast('success', `成功解析 ${decodedNodes.length} 个节点`);
        } catch (error) {
            addToast('error', error instanceof Error ? error.message : '解析失败');
        } finally {
            setIsDecoding(false);
        }
    }, [subInputMode, subscriptionUrl, sourceText, addToast]);

    // 生成订阅链接/下载文件
    const handleGenerate = useCallback(async () => {
        const selected = nodes.filter(n => n.checked).map(n => n.raw);
        if (selected.length === 0) {
            addToast('warning', '请选择至少一个节点');
            return;
        }

        setIsGenerating(true);

        try {
            // 构建订阅URL
            const params = new URLSearchParams();
            params.set('target', targetClient);
            params.set('url', selected.join('|'));
            params.set('backend', DEFAULT_BACKEND);
            if (pureMode) params.set('list', 'true');
            params.set('udp', 'true');
            params.set('scv', 'true');

            const subUrl = `/api/sub?${params.toString()}`;

            if (outputMode === 'url') {
                // 生成完整URL
                const fullUrl = `${window.location.origin}${subUrl}`;
                setResultUrl(fullUrl);
                addToast('success', '订阅链接已生成');
            } else {
                // 下载文件
                const filename = useCustomFilename && customFilename ? customFilename : 'config';
                const response = await fetch(`${subUrl}&download=true&filename=${encodeURIComponent(filename)}`);

                if (!response.ok) throw new Error('下载失败');

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename}.yaml`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                addToast('success', '配置文件下载已开始');
            }
        } catch (error) {
            addToast('error', error instanceof Error ? error.message : '生成失败');
        } finally {
            setIsGenerating(false);
        }
    }, [nodes, targetClient, pureMode, outputMode, useCustomFilename, customFilename, addToast]);

    // 导出节点链接
    const handleExportNodes = useCallback(() => {
        const selected = nodes.filter(n => n.checked);
        if (selected.length === 0) {
            addToast('warning', '请选择至少一个节点');
            return;
        }

        const text = exportNodesToText(selected);
        navigator.clipboard.writeText(text).then(() => {
            addToast('success', `已复制 ${selected.length} 个节点链接`);
        }).catch(() => {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            addToast('success', `已复制 ${selected.length} 个节点链接`);
        });
    }, [nodes, addToast]);

    // 节点选中切换
    const handleToggleNode = useCallback((id: string) => {
        setNodes(prev => prev.map(node =>
            node.id === id ? { ...node, checked: !node.checked } : node
        ));
    }, []);

    // 全选/取消全选
    const handleToggleAll = useCallback(() => {
        const visibleNodes = nodes.filter(n => n.visible);
        const allChecked = visibleNodes.every(n => n.checked);
        setNodes(prev => prev.map(node =>
            node.visible ? { ...node, checked: !allChecked } : node
        ));
    }, [nodes]);

    // 去重
    const handleRemoveDuplicates = useCallback(() => {
        const before = nodes.length;
        const unique = removeDuplicateNodes(nodes);
        setNodes(unique);
        const removed = before - unique.length;
        addToast('success', `已清理 ${removed} 个重复节点`);
    }, [nodes, addToast]);

    // 按延迟排序
    const handleSortByPing = useCallback(() => {
        setNodes(prev => sortNodesByPing(prev));
        addToast('info', '已按延迟排序');
    }, [addToast]);

    // 按名称排序
    const handleSortByName = useCallback(() => {
        setNodes(prev => sortNodesByName(prev));
        addToast('info', '已按名称排序');
    }, [addToast]);

    // 测速
    const handleSpeedTest = useCallback(async (mode: SpeedTestMode) => {
        const validNodes = nodes.filter(n => n.visible && n.server);
        if (validNodes.length === 0) {
            addToast('warning', '没有可测速的节点');
            return;
        }

        setIsSpeedTesting(true);

        // 标记所有节点为测试中
        setNodes(prev => prev.map(node => ({
            ...node,
            speedTest: node.server ? {
                tcpLatency: null,
                httpLatency: null,
                downloadSpeed: null,
                cfRegion: 'Unknown',
                timestamp: Date.now(),
                success: false,
            } : node.speedTest,
        })));

        try {
            await batchSpeedTest(validNodes, mode, (node, result) => {
                setNodes(prev => prev.map(n =>
                    n.id === node.id ? { ...n, speedTest: result } : n
                ));
            });
            addToast('success', '测速完成');
        } catch (error) {
            addToast('error', '测速过程中发生错误');
        } finally {
            setIsSpeedTesting(false);
        }
    }, [nodes, addToast]);

    // 复制结果URL
    const handleCopyResult = useCallback(() => {
        navigator.clipboard.writeText(resultUrl).then(() => {
            addToast('success', '链接已复制');
        });
    }, [resultUrl, addToast]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
            {/* 头部导航 */}
            <Header
                mode={convertMode}
                onModeChange={setConvertMode}
                darkMode={darkMode}
                onDarkModeChange={setDarkMode}
            />

            {/* 主内容 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
                {/* 输入面板 */}
                {convertMode === 'nodeToSub' ? (
                    <div>
                        <InputPanel
                            sourceText={sourceText}
                            onSourceTextChange={setSourceText}
                            onParse={handleParse}
                            onGenerate={handleGenerate}
                            outputMode={outputMode}
                            onOutputModeChange={setOutputMode}
                            targetClient={targetClient}
                            onTargetClientChange={setTargetClient}
                            pureMode={pureMode}
                            onPureModeChange={setPureMode}
                            customFilename={customFilename}
                            onCustomFilenameChange={setCustomFilename}
                            useCustomFilename={useCustomFilename}
                            onUseCustomFilenameChange={setUseCustomFilename}
                            selectedCount={selectedCount}
                            isGenerating={isGenerating}
                        />
                        {/* 结果栏 */}
                        <ResultBar
                            url={resultUrl}
                            visible={outputMode === 'url' && !!resultUrl}
                            onCopy={handleCopyResult}
                        />
                    </div>
                ) : (
                    <SubInputPanel
                        sourceText={sourceText}
                        onSourceTextChange={setSourceText}
                        subscriptionUrl={subscriptionUrl}
                        onSubscriptionUrlChange={setSubscriptionUrl}
                        onDecode={handleDecodeSubscription}
                        onExport={handleExportNodes}
                        isDecoding={isDecoding}
                        selectedCount={selectedCount}
                        inputMode={subInputMode}
                        onInputModeChange={setSubInputMode}
                    />
                )}

                {/* 节点列表和教程 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 节点列表 */}
                    <div className="lg:col-span-2">
                        <NodeList
                            nodes={nodes}
                            onToggle={handleToggleNode}
                            onSearch={setSearchKeyword}
                            onSpeedTest={handleSpeedTest}
                            onRemoveDuplicates={handleRemoveDuplicates}
                            onSortByPing={handleSortByPing}
                            onSortByName={handleSortByName}
                            onToggleAll={handleToggleAll}
                            speedTestMode={speedTestMode}
                            onSpeedTestModeChange={setSpeedTestMode}
                            isSpeedTesting={isSpeedTesting}
                            searchKeyword={searchKeyword}
                        />
                    </div>

                    {/* 教程面板 */}
                    <div className="lg:col-span-1">
                        <TutorialPanel
                            client={targetClient}
                            mode={outputMode}
                        />
                    </div>
                </div>
            </main>

            {/* Toast 通知 */}
            <Toast messages={toasts} onRemove={removeToast} />
        </div>
    );
}

export default App;
