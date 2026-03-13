# ellagoh.github.io

这是 Ella 的个人主页仓库，使用 GitHub Pages 提供静态托管。

当前结构：

- `index.html`：主页入口文件。
- `styles.css`：样式文件，包含偏简约、略带复古风格的排版和配色。

## 本地预览

在仓库根目录下执行：

```bash
python -m http.server 8000
```

然后在浏览器访问 `http://localhost:8000`。

（你也可以使用任意静态服务器工具，例如 `live-server`、`npx serve` 等。）

## 可以修改的地方

- **文案**：在 `index.html` 中，把「关于我 / 小项目 / 记事 / 联系」里的示例文字替换成你自己的内容。
- **社交链接**：在 `index.html` 中，把邮箱、GitHub 链接替换成你自己的。
- **配色与字体**：在 `styles.css` 文件顶部的 `:root` 里调整颜色和字体变量，即可快速改整体风格。

