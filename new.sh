#!/usr/bin/env bash
# new.sh — 快速创建新随笔
# 用法: ./new.sh           (交互模式)
#       ./new.sh "标题"     (指定标题)

set -e

# ── 获取标题 ──────────────────────────────────────────────
if [ -n "$*" ]; then
  TITLE="$*"
else
  printf "标题: "
  read -r TITLE
fi
[ -z "$TITLE" ] && { echo "错误：标题不能为空" >&2; exit 1; }

# ── 获取标签 ──────────────────────────────────────────────
printf "标签 (逗号分隔，可留空，例: 生活,思考): "
read -r TAGS_INPUT

# ── 生成文件名 ────────────────────────────────────────────
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# 用标题生成 slug（保留中文；英文转小写、空格变连字符）
SLUG=$(python3 -c "
import re, sys
title = sys.argv[1]
slug = re.sub(r'\s+', '-', title.strip().lower())
slug = re.sub(r'[^\w\-]', '', slug, flags=re.UNICODE)
slug = re.sub(r'_', '-', slug)
slug = re.sub(r'-+', '-', slug).strip('-')
print(slug)
" "$TITLE")
[ -z "$SLUG" ] && SLUG="$TIMESTAMP"

ID="${DATE}-${SLUG}"
FILENAME="posts/${ID}.md"
[ -f "$FILENAME" ] && FILENAME="posts/${DATE}-${SLUG}-${TIMESTAMP}.md" && ID="${DATE}-${SLUG}-${TIMESTAMP}"

# ── 格式化 tags 为 YAML 数组 ──────────────────────────────
TAGS_YAML=$(python3 -c "
raw = '''${TAGS_INPUT}'''.replace('，', ',')
tags = [t.strip() for t in raw.split(',') if t.strip()]
print('[' + ', '.join(tags) + ']' if tags else '[]')
")

# ── 创建 Markdown 文件 ────────────────────────────────────
cat > "$FILENAME" <<MDEOF
---
title: ${TITLE}
date: ${DATE}
time: ${TIME}
tags: ${TAGS_YAML}
---

MDEOF

echo "✓ 已创建 ${FILENAME}"

# ── 更新 posts.json（路径列表，最新在前）────────────────────
python3 - <<PYEOF
import json

posts_file = 'data/posts.json'
new_file   = '${FILENAME}'

try:
    with open(posts_file, encoding='utf-8') as f:
        files = json.load(f)
except Exception:
    files = []

if new_file not in files:
    files.insert(0, new_file)

with open(posts_file, 'w', encoding='utf-8') as f:
    json.dump(files, f, ensure_ascii=False, indent=2)

print('✓ data/posts.json 已更新')
PYEOF

# ── 提示 ──────────────────────────────────────────────────
echo ""
echo "开始写作："
echo "  \${EDITOR:-open} ${FILENAME}"
echo ""
echo "写完后发布："
echo "  git add . && git commit -m '随笔: ${TITLE}' && git push"

# python3 -m http.server 8000