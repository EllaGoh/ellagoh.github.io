# ellagoh.github.io (Hugo 站点)

这是 Ella 的个人主页仓库，使用 **Hugo + hugo-coder 主题** 部署在 GitHub Pages 上。

站点的页面和内容现在都通过 Hugo 的约定式目录来组织，而不是根目录下的手写 `index.html` / `writing.html` 之类文件。

## 结构总览

- `hugo.toml`：Hugo 站点配置（主题、导航、社交链接等）。
- `content/`：所有内容页面。
  - `_index.md`：主页（About + Contact 等）。
  - `notes/`：短记（Notes）。
  - `writing/`：长文（Writing）。
  - `projects/`：项目（Projects）。
- `themes/hugo-coder/`：hugo-coder 主题源码（通过 Git 克隆）。
- `assets/custom.scss`：在 hugo-coder 的基础上做的一点样式定制。

> 说明：旧的 `index.html`、`writing.html`、`projects.html`、`notes.html`、`post.html`、`styles.css` 等静态文件已经移除，它们的内容已经迁移到 Hugo 的 `content/` 和主题模板中。

## 本地开发

确保已经安装 **Hugo extended** 版本（Homebrew 安装的就是 extended）：

```bash
hugo version
```

在仓库根目录启动本地开发服务器：

```bash
cd /Users/robingoh/Documents/ellagoh.github.io
hugo server -D
```

然后访问：

```text
http://localhost:1313/
```

保存 `content/` 或 `hugo.toml` 的改动后，浏览器会自动刷新。

## 生成静态文件（用于 GitHub Pages）

在根目录执行：

```bash
hugo
```

Hugo 会在 `public/` 目录生成静态页面，把这个目录部署到 GitHub Pages 即可。

## 修改内容的方式

- 修改主页介绍和联系方式：编辑 `content/_index.md`。
- 修改 Notes / Writing / Projects 的文案：分别编辑 `content/notes/`、`content/writing/`、`content/projects/` 下的 Markdown 文件或新增文件。
- 修改导航和社交链接：编辑根目录的 `hugo.toml` 中对应的 `[[menu.main]]` 和 `[[params.social]]` 配置。
- 调整样式（在 hugo-coder 基础上的微调）：编辑 `assets/custom.scss`。
