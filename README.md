# Proxy Converter Pro

功能完整的代理节点/订阅链接双向转换工具，支持部署到 Cloudflare Pages。

## ✨ 功能特性

### 节点 → 订阅
- 输入各种代理节点链接，生成订阅链接或下载配置文件
- 支持协议：VMess、VLESS、Trojan、Shadowsocks、Hysteria2、TUIC
- 支持输出：Clash、Sing-box、Shadowrocket、Surge 等主流客户端格式

### 订阅 → 节点
- 解析订阅链接，提取所有节点信息
- 支持格式：Base64、Clash YAML、Sing-box JSON、SIP008
- 可批量复制节点链接

### 节点测速
- **TCP 延迟测试**：测量 TCP 握手时间（快速）
- **HTTP 响应测试**：测量 HTTP 请求响应时间
- **下载速度测试**：测量实际下载速度（耗时较长）

### UI/UX
- 响应式设计，支持移动端
- 暗色模式支持
- 详细的客户端使用教程

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 项目结构

```
proxy-converter/
├── src/
│   ├── components/     # React 组件
│   ├── utils/          # 工具函数
│   │   ├── parser.ts   # 节点解析
│   │   ├── decoder.ts  # 订阅解码
│   │   └── speedTest.ts # 测速功能
│   ├── types/          # TypeScript 类型
│   ├── App.tsx         # 主应用
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式
├── functions/          # Cloudflare Functions
│   └── api/
│       ├── sub.ts      # 订阅转换 API
│       ├── check.ts    # 节点测速 API
│       └── fetch.ts    # 订阅获取 API
├── public/             # 静态资源
├── wrangler.toml       # Cloudflare 配置
└── package.json
```

## 📦 部署到 Cloudflare Pages

详细部署步骤请参考 [DEPLOY.md](./DEPLOY.md)

### 快速部署

1. Fork 或 Clone 本仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 Pages → 创建项目 → 连接 Git
4. 选择仓库，配置构建：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
5. 点击部署

## 🔧 配置说明

### 环境变量

可以在 `wrangler.toml` 或 Cloudflare Dashboard 中配置：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DEFAULT_BACKEND | Subconverter 后端地址 | https://api.v1.mk |

### 自定义后端

如需使用自建 Subconverter 后端，修改以下位置：
- `functions/api/sub.ts` 中的 `DEFAULT_BACKEND`
- 或在 Cloudflare Dashboard 设置环境变量

## 📝 使用指南

### 节点转订阅

1. 在输入框粘贴节点链接（每行一个）
2. 点击"解析节点"
3. 选择需要的节点
4. 选择目标客户端格式
5. 点击"生成订阅"或"下载配置"

### 订阅转节点

1. 切换到"订阅 → 节点"模式
2. 粘贴订阅链接 或 直接粘贴订阅内容
3. 点击"解析订阅"
4. 选择需要的节点
5. 点击"导出节点"复制链接

### 节点测速

1. 解析节点后，选择测速模式（TCP/HTTP/下载）
2. 点击"测速"按钮
3. 等待测速完成
4. 可按延迟排序

## ⚠️ 注意事项

1. **测速说明**：测速是从 Cloudflare 边缘节点发起的，延迟数值与本地实际使用可能有差异
2. **隐私安全**：建议部署自己的实例，避免使用公共服务传递敏感信息
3. **后端依赖**：订阅转换功能依赖 Subconverter 后端

## 📄 开源协议

MIT License

## 🙏 致谢

- [Subconverter](https://github.com/tindy2013/subconverter) - 订阅转换后端
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Cloudflare Pages](https://pages.cloudflare.com/) - 部署平台
