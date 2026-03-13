# ellagoh.github.io (Hugo 站点)

这是 Ella 的个人主页仓库，使用 **Hugo + hugo-coder 主题** 部署在 GitHub Pages 上。
有稍微改动。
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
