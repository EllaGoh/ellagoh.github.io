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
- 修改内容列表引导文案：分别编辑 `content/notes/_index.md`、`content/writing/_index.md`、`content/projects/_index.md`。
- 修改导航和社交链接：编辑根目录的 `hugo.toml` 中对应的 `[[menu.main]]` 和 `[[params.social]]` 配置。
- 调整排版样式（已与原主题高度融合）：目前所有的“复古 + 禅”样式已被内置进 `themes/hugo-coder/assets/scss/` 中进行魔改，不再依赖外置独立 customCSS。

## 常用 Hugo 命令指南

### 1. 新建一篇文章 (Writing / Notes / Projects)

如果你想写一篇新的长文，可以直接使用 `hugo new` 命令，它会帮你自动生成带有标准格式（如时间和标题）的文件：

```bash
# 新建一篇长文 (Writing)
hugo new content/writing/my-new-post.md

# 新建一条短记 (Notes)
hugo new content/notes/my-new-note.md

# 新建一个项目展示 (Projects)
hugo new content/projects/my-new-project.md
```

执行后，你去打开生成的文件，只需完善正文以及顶部的 `title` 和 `description` 即可。

### 2. 启动本地预览服务器

如果你想一边写一边看网页效果，运行这个命令并保持终端不要关闭：

```bash
hugo server -D
```

> `-D` (或 `--buildDrafts`) 参数的作用是：同时渲染并显示你标记为草稿 (`draft: true`) 的文章。一旦文章写好了，切记把顶部信息的 `draft: true` 删除掉。

### 3. 打包并生成最终静态网页

当你写完文章，觉得完全没问题并准备发布时，执行打包命令：

```bash
hugo --gc --cleanDestinationDir
```

这会帮你把所有最新内容转化为 HTML 文件并放进 `public/` 目录下（同时自动清空旧版本的废弃垃圾）。直接把这个被打包好的项目推送给 GitHub Pages 就可以上线了。
