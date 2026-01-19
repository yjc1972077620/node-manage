// Toast 通知组件
import { useEffect, useState } from 'react';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

interface ToastProps {
    messages: ToastMessage[];
    onRemove: (id: string) => void;
}

// 图标映射
const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
};

// 颜色映射
const colors = {
    success: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
};

function ToastItem({ message, onRemove }: { message: ToastMessage; onRemove: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 触发进入动画
        requestAnimationFrame(() => setIsVisible(true));

        // 自动消失
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onRemove, 300);
        }, message.duration || 3000);

        return () => clearTimeout(timer);
    }, [message.duration, onRemove]);

    return (
        <div
            className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm
        transition-all duration-300 transform
        ${colors[message.type]}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
        >
            <i className={`fas ${icons[message.type]}`}></i>
            <span className="text-sm font-medium">{message.message}</span>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onRemove, 300);
                }}
                className="ml-2 opacity-50 hover:opacity-100 transition"
            >
                <i className="fas fa-times text-xs"></i>
            </button>
        </div>
    );
}

export default function Toast({ messages, onRemove }: ToastProps) {
    if (messages.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
            {messages.map((msg) => (
                <ToastItem key={msg.id} message={msg} onRemove={() => onRemove(msg.id)} />
            ))}
        </div>
    );
}

// 创建 toast 的辅助函数
let toastId = 0;
export function createToast(
    type: ToastMessage['type'],
    message: string,
    duration = 3000
): ToastMessage {
    return {
        id: `toast-${++toastId}`,
        type,
        message,
        duration,
    };
}
