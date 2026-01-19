# 部署指南 - Cloudflare Pages

本文档详细介绍如何将 Proxy Converter 部署到 Cloudflare Pages。

## 前置条件

1. **Cloudflare 账户** - 免费账户即可
2. **Node.js 18+** - 本地开发需要
3. **Git** - 版本控制

## 方法一：通过 Git 连接部署（推荐）

### 步骤 1：准备代码仓库

将项目推送到 GitHub/GitLab：

```bash
cd proxy-converter
git init
git add .
git commit -m "Initial commit"
git remote add origin <你的仓库地址>
git push -u origin main
```

### 步骤 2：连接 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单选择 **Workers & Pages**
3. 点击 **创建应用程序** → **Pages** → **连接到 Git**
4. 授权并选择你的仓库

### 步骤 3：配置构建设置

| 配置项 | 值 |
|--------|-----|
| 项目名称 | proxy-converter（或自定义） |
| 生产分支 | main |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| 根目录 | `/`（留空） |

### 步骤 4：环境变量（可选）

点击 **环境变量** 添加：
- `NODE_VERSION` = `18`

### 步骤 5：点击部署

等待构建完成，获取访问地址：`https://proxy-converter.pages.dev`

---

## 方法二：通过 Wrangler CLI 部署

### 步骤 1：安装 Wrangler

```bash
npm install -g wrangler
```

### 步骤 2：登录 Cloudflare

```bash
wrangler login
```

### 步骤 3：构建项目

```bash
npm run build
```

### 步骤 4：部署

```bash
npx wrangler pages deploy dist
```

首次运行会提示输入项目名称，之后会自动部署。

---

## 绑定自定义域名

1. 在 Cloudflare Dashboard 进入你的 Pages 项目
2. 点击 **自定义域** 标签
3. 点击 **设置自定义域**
4. 输入你的域名（如 `converter.example.com`）
5. 按提示添加 DNS 记录（如域名已在 Cloudflare，会自动配置）

---

## 本地开发

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 本地测试 Functions

```bash
npx wrangler pages dev dist
```

这会启动一个本地服务器，模拟 Cloudflare Pages 环境。

---

## 常见问题

### Q: 构建失败，提示 node 版本问题

设置环境变量 `NODE_VERSION` = `18`

### Q: Functions 不生效

确保 `functions/` 目录在项目根目录，且文件扩展名为 `.ts`

### Q: 如何更新部署

推送代码到 Git 仓库会自动触发重新部署。或手动运行：

```bash
npm run build && npx wrangler pages deploy dist
```

### Q: 如何查看日志

在 Cloudflare Dashboard → Pages → 你的项目 → Functions → 查看日志

---

## 高级配置

### 自定义 Subconverter 后端

编辑 `functions/api/sub.ts`，修改 `DEFAULT_BACKEND`：

```typescript
const DEFAULT_BACKEND = 'https://你的后端地址';
```

### 启用访问控制

可以在 Cloudflare Dashboard 配置访问策略，限制特定 IP 或添加认证。

---

## 资源链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Subconverter 项目](https://github.com/tindy2013/subconverter)
