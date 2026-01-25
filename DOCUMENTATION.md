# Proxy Converter Pro - 详细使用及功能说明文档

## 📋 项目概述

**Proxy Converter Pro** 是一个功能完整的代理节点/订阅链接双向转换工具，基于现代 Web 技术构建，支持部署到 Cloudflare Pages。

### 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 6 |
| 样式框架 | Tailwind CSS 3 |
| 路由管理 | React Router 6 |
| 部署平台 | Cloudflare Pages + Functions |
| 配置解析 | js-yaml |

---

## ✨ 核心功能

### 1. 节点 → 订阅转换

将代理节点链接转换为订阅链接或配置文件。

#### 支持的代理协议

| 协议 | 链接格式 | 说明 |
|------|----------|------|
| **VMess** | `vmess://base64编码JSON` | V2Ray 默认协议 |
| **VLESS** | `vless://uuid@server:port?参数#名称` | 轻量级 V2Ray 协议 |
| **Trojan** | `trojan://password@server:port?参数#名称` | 伪装 HTTPS 协议 |
| **Shadowsocks** | `ss://base64(method:password)@server:port#名称` | 支持 SIP002 和旧版格式 |
| **Hysteria2** | `hy2://auth@server:port?参数#名称` | 基于 QUIC 的高速协议 |
| **TUIC** | `tuic://uuid:password@server:port?参数#名称` | 低延迟 QUIC 协议 |

#### 支持的输出格式

- **Clash** - YAML 格式配置
- **Sing-box** - JSON 格式配置
- **Shadowrocket** - iOS 客户端格式
- **Surge** - macOS/iOS 客户端格式
- **Quantumult X** - iOS 客户端格式
- **其他主流客户端格式**

---

### 2. 订阅 → 节点解析

解析订阅链接，提取所有节点信息为原始链接格式。

#### 支持的订阅格式

| 格式 | 说明 |
|------|------|
| **Base64** | 标准或 URL-safe Base64 编码的节点链接列表 |
| **Clash YAML** | Clash 客户端配置格式 |
| **Sing-box JSON** | Sing-box 客户端配置格式 |
| **SIP008** | Shadowsocks 标准 JSON 格式 |

#### 输入方式

- 直接粘贴订阅 URL
- 直接粘贴订阅内容（Base64/YAML/JSON）

---

### 3. 节点测速功能

三种测速模式，从 Cloudflare 边缘节点发起测试。

| 模式 | 测试内容 | 耗时 | 适用场景 |
|------|----------|------|----------|
| **TCP 延迟** | TCP 握手时间 | 快速 (~10s) | 快速筛选可用节点 |
| **HTTP 响应** | HTTP 完整请求响应时间 | 中等 (~15s) | 测试代理完整性 |
| **下载速度** | 实际下载速度（KB/s） | 较慢 (~30s) | 测试带宽性能 |

#### 测速特点

- 最大并发测试数：5 个节点
- 支持批量测速和进度显示
- 延迟等级显示：
  - 🟢 优秀：< 200ms
  - 🟡 一般：200-500ms
  - 🔴 较差：> 500ms 或超时

---

## 🏗️ 项目结构

```
proxy-converter/
├── src/                          # 源代码目录
│   ├── components/               # React 组件
│   │   ├── Header.tsx           # 顶部导航栏（模式切换、暗色模式）
│   │   ├── InputPanel.tsx       # 节点输入面板（节点→订阅模式）
│   │   ├── SubInputPanel.tsx    # 订阅输入面板（订阅→节点模式）
│   │   ├── NodeList.tsx         # 节点列表显示
│   │   ├── NodeCard.tsx         # 单个节点卡片
│   │   ├── ResultBar.tsx        # 结果操作栏
│   │   ├── TutorialPanel.tsx    # 客户端使用教程
│   │   └── Toast.tsx            # 提示消息组件
│   │
│   ├── utils/                    # 工具函数
│   │   ├── parser.ts            # 节点链接解析器
│   │   ├── decoder.ts           # 订阅内容解码器
│   │   └── speedTest.ts         # 测速功能
│   │
│   ├── types/                    # TypeScript 类型定义
│   │   └── index.ts             # 所有类型接口
│   │
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 入口文件
│   └── index.css                # 全局样式
│
├── functions/                    # Cloudflare Functions (API)
│   └── api/
│       ├── sub.ts               # 订阅转换 API
│       ├── check.ts             # 节点测速 API
│       └── fetch.ts             # 订阅获取 API
│
├── public/                       # 静态资源
├── dist/                         # 构建输出
├── wrangler.toml                # Cloudflare 配置
├── tailwind.config.js           # Tailwind CSS 配置
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # 项目配置
```

---

## 📖 使用指南

### 环境要求

- **Node.js** 18 或更高版本
- **npm** 或其他包管理器

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
# 访问 http://localhost:5173

# 3. 构建生产版本
npm run build

# 4. 预览生产版本
npm run preview

# 5. 本地测试 Cloudflare Functions
npx wrangler pages dev dist
```

### 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | TypeScript 编译 + Vite 构建 |
| `npm run lint` | ESLint 代码检查 |
| `npm run preview` | 预览生产构建 |
| `npm run deploy` | 部署到 Cloudflare Pages |

---

## 🔧 功能模块详解

### 1. 节点解析器 (`parser.ts`)

负责解析各种代理协议链接。

#### 核心函数

| 函数 | 说明 |
|------|------|
| `parseNodes(input)` | 批量解析节点链接（主入口） |
| `parseNodeLink(link)` | 解析单个节点链接 |
| `detectProtocol(link)` | 检测协议类型 |
| `parseVmessLink(link)` | 解析 VMess 链接 |
| `parseVlessLink(link)` | 解析 VLESS 链接 |
| `parseTrojanLink(link)` | 解析 Trojan 链接 |
| `parseShadowsocksLink(link)` | 解析 Shadowsocks 链接 |
| `parseHysteria2Link(link)` | 解析 Hysteria2 链接 |
| `parseTuicLink(link)` | 解析 TUIC 链接 |
| `removeDuplicateNodes(nodes)` | 节点去重 |
| `sortNodesByPing(nodes)` | 按延迟排序 |
| `sortNodesByName(nodes)` | 按名称排序 |

---

### 2. 订阅解码器 (`decoder.ts`)

负责解码和解析各种订阅格式。

#### 核心函数

| 函数 | 说明 |
|------|------|
| `decodeSubscription(content)` | 解码订阅内容（主入口） |
| `fetchSubscription(url)` | 获取远程订阅内容 |
| `detectSubscriptionFormat(content)` | 检测订阅格式 |
| `base64Decode(input)` | Base64 解码 |
| `parseClashSubscription(yaml)` | 解析 Clash 格式 |
| `parseSingboxSubscription(json)` | 解析 Sing-box 格式 |
| `parseSIP008Subscription(json)` | 解析 SIP008 格式 |
| `exportNodesToText(nodes)` | 导出为文本格式 |
| `exportNodesToBase64(nodes)` | 导出为 Base64 |

---

### 3. 测速模块 (`speedTest.ts`)

提供节点连通性和速度测试功能。

#### 核心函数

| 函数 | 说明 |
|------|------|
| `speedTestNode(node, mode)` | 单节点测速 |
| `batchSpeedTest(nodes, mode, onProgress)` | 批量测速（带进度回调） |
| `getPingLevel(latency)` | 获取延迟等级 |
| `formatLatency(latency)` | 格式化延迟显示 |
| `formatSpeed(speedKBps)` | 格式化速度显示 |

---

### 4. Cloudflare Functions API

#### `/api/sub` - 订阅转换

调用 Subconverter 后端进行格式转换。

**参数：**
- `nodes` - Base64 编码的节点链接
- `target` - 目标客户端格式

#### `/api/check` - 节点测速

从 Cloudflare 边缘发起节点可用性检测。

**参数：**
- `ip` - 服务器地址
- `port` - 端口
- `mode` - 测速模式（tcp/http/download）

#### `/api/fetch` - 订阅获取

通过 Cloudflare 代理获取远程订阅内容（解决 CORS 问题）。

**参数：**
- `url` - 订阅链接

---

## 🎨 UI/UX 特性

- ✅ **响应式设计** - 完美适配桌面端和移动端
- ✅ **暗色模式** - 一键切换明暗主题
- ✅ **节点搜索** - 快速过滤节点
- ✅ **批量选择** - 全选/反选节点
- ✅ **进度显示** - 测速进度实时更新
- ✅ **客户端教程** - 详细的各客户端使用说明
- ✅ **一键复制** - 快速复制订阅链接或节点

---

## ☁️ 部署说明

### Cloudflare Pages 部署

详细步骤请参考 [DEPLOY.md](./DEPLOY.md)

#### 快速部署

1. Fork 或 Clone 仓库到 GitHub/GitLab
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 创建 Pages 项目并连接 Git 仓库
4. 配置构建：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
5. 点击部署

### 环境变量配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NODE_VERSION` | Node.js 版本 | 18 |
| `DEFAULT_BACKEND` | Subconverter 后端地址 | https://api.v1.mk |

---

## ⚠️ 注意事项

1. **测速说明**：测速从 Cloudflare 边缘节点发起，延迟数值与本地实际使用可能有差异
2. **隐私安全**：建议自行部署实例，避免通过公共服务传递敏感节点信息
3. **后端依赖**：订阅转换功能依赖 Subconverter 后端服务
4. **协议限制**：部分协议（如 SSR）暂未支持

---

## 📦 类型定义

### ProxyNode - 代理节点

```typescript
interface ProxyNode {
    id: string;           // 唯一标识符
    name: string;         // 节点名称
    protocol: ProtocolType; // 协议类型
    server: string;       // 服务器地址
    port: number;         // 端口
    raw: string;          // 原始链接
    checked: boolean;     // 是否选中
    visible: boolean;     // 是否可见
    speedTest?: SpeedTestResult; // 测速结果
    extra?: Record<string, unknown>; // 额外参数
}
```

### SpeedTestResult - 测速结果

```typescript
interface SpeedTestResult {
    tcpLatency: number | null;    // TCP延迟(ms)
    httpLatency: number | null;   // HTTP延迟(ms)
    downloadSpeed: number | null; // 下载速度(KB/s)
    cfRegion: string;            // CF区域
    timestamp: number;           // 时间戳
    success: boolean;            // 是否成功
    error?: string;              // 错误信息
}
```

---

## 📄 开源协议

MIT License

---

## 🙏 致谢

- [Subconverter](https://github.com/tindy2013/subconverter) - 订阅转换后端
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Cloudflare Pages](https://pages.cloudflare.com/) - 部署平台
- [React](https://react.dev/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
