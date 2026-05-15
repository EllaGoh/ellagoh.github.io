let posts = [];

// ── Frontmatter parser ────────────────────────────────────
function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { meta: {}, content: raw };
  const after = raw.slice(3);
  const close = after.search(/\n---/);
  if (close === -1) return { meta: {}, content: raw };

  const yaml = after.slice(0, close);
  const content = after.slice(close + 4).replace(/^\n/, '');

  const meta = {};
  yaml.split('\n').forEach(line => {
    const ci = line.indexOf(':');
    if (ci === -1) return;
    const key = line.slice(0, ci).trim();
    const val = line.slice(ci + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      meta[key] = val.slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else {
      meta[key] = val.replace(/^['"]|['"]$/g, '');
    }
  });

  return { meta, content };
}

// ── Routing ───────────────────────────────────────────────
function getRoute() {
  const hash = location.hash.slice(1) || '/';
  if (hash === '/' || hash === '') return { view: 'timeline' };
  if (hash === '/tags') return { view: 'tags' };
  if (hash.startsWith('/tag/')) return { view: 'tag', tag: decodeURIComponent(hash.slice(5)) };
  if (hash.startsWith('/post/')) return { view: 'post', id: decodeURIComponent(hash.slice(6)) };
  return { view: 'timeline' };
}

function navigate(hash) { location.hash = hash; }

// ── Sidebar ───────────────────────────────────────────────
function updateSidebar() {
  const el = document.getElementById('sidebar-tags');
  if (!el) return;

  const route = getRoute();
  const activeTag = route.view === 'tag' ? route.tag : null;

  const count = {};
  posts.forEach(p => p.tags.forEach(t => { count[t] = (count[t] || 0) + 1; }));
  const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);

  el.innerHTML = sorted.map(([tag, n]) =>
    `<a class="sidebar-tag${activeTag === tag ? ' active' : ''}"
        href="#/tag/${encodeURIComponent(tag)}">
      <span>${tag}</span>
      <span class="sidebar-count">${n}</span>
    </a>`
  ).join('') || '<div style="color:var(--muted);font-size:0.82rem;padding-top:8px">暂无</div>';
}

// ── Tag helpers ───────────────────────────────────────────
function tagHtml(tag) {
  return `<a class="tag" href="#/tag/${encodeURIComponent(tag)}">${tag}</a>`;
}

// ── Timeline view ─────────────────────────────────────────
function renderTimeline(list, activeTag) {
  const groups = {};
  list.forEach(p => {
    const key = p.date.slice(0, 7);
    (groups[key] = groups[key] || []).push(p);
  });

  const monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];

  let html = '<div class="section-tab">时间轴</div>';

  if (!list.length) {
    html += '<div class="empty">还没有随笔</div>';
    return html;
  }

  Object.keys(groups).sort().reverse().forEach(key => {
    const [year, month] = key.split('-');
    html += `<div class="timeline-group">
      <div class="month-label">${year} · ${monthNames[parseInt(month, 10) - 1]}</div>
      ${groups[key].map(postCard).join('')}
    </div>`;
  });

  return html;
}

function postCard(p) {
  const tags = p.tags.length
    ? `<div class="post-tags">${p.tags.map(tagHtml).join('')}</div>` : '';
  return `<article class="post-card">
    <div class="post-meta">${p.date}</div>
    <div class="post-title"><a href="#/post/${encodeURIComponent(p.id)}">${p.title}</a></div>
    ${tags}
  </article>`;
}

// ── Tags view ─────────────────────────────────────────────
function renderTagsView() {
  const count = {};
  posts.forEach(p => p.tags.forEach(t => { count[t] = (count[t] || 0) + 1; }));
  const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);

  const cards = sorted.map(([tag, n]) =>
    `<div class="tag-card" onclick="navigate('#/tag/${encodeURIComponent(tag)}')">
      <span>${tag}</span><span class="tag-count">${n}</span>
    </div>`
  ).join('');

  return tabs('tags') +
    (sorted.length
      ? `<div class="tags-grid">${cards}</div>`
      : '<div class="empty">还没有标签</div>');
}

function tabs(active) {
  return `<div class="view-tabs">
    <button class="tab-btn${active === 'timeline' ? ' active' : ''}" onclick="navigate('#/')">时间轴</button>
    <button class="tab-btn${active === 'tags' ? ' active' : ''}" onclick="navigate('#/tags')">按标签</button>
  </div>`;
}

// ── Single post ───────────────────────────────────────────
async function renderPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return '<div class="empty">找不到该随笔</div>';

  let content = '';
  try {
    const res = await fetch(post.file);
    const raw = await res.text();
    const { content: md } = parseFrontmatter(raw);
    content = marked.parse(md);
  } catch {
    content = '<p style="color:var(--muted)">内容加载失败</p>';
  }

  const tagList = post.tags.map(tagHtml).join('');

  return `<div class="post-full">
    <a class="back-link" onclick="history.length > 1 ? history.back() : navigate('#/')">← 返回</a>
    <div class="post-full-meta">
      <span>${post.date}</span>
      ${tagList}
    </div>
    <h1 class="post-full-title">${post.title}</h1>
    <hr class="post-divider">
    <div class="md">${content}</div>
  </div>`;
}

// ── Main render ───────────────────────────────────────────
async function render() {
  const route = getRoute();
  const app = document.getElementById('app');

  document.querySelectorAll('.nav-link').forEach(el =>
    el.classList.toggle('active', el.dataset.section === 'sui')
  );

  switch (route.view) {
    case 'timeline':
      app.innerHTML = renderTimeline(posts, null);
      break;
    case 'tag':
      app.innerHTML = renderTimeline(posts.filter(p => p.tags.includes(route.tag)), route.tag);
      break;
    case 'tags':
      app.innerHTML = renderTagsView();
      break;
    case 'post':
      app.innerHTML = '<div class="loading">加载中…</div>';
      app.innerHTML = await renderPost(route.id);
      break;
    default:
      app.innerHTML = renderTimeline(posts, null);
  }

  updateSidebar();
}

// ── Init ──────────────────────────────────────────────────
async function init() {
  document.getElementById('app').innerHTML = '<div class="loading">加载中…</div>';

  try {
    const indexRes = await fetch('data/posts.json');
    const files = await indexRes.json();

    const results = await Promise.all(files.map(async file => {
      try {
        const res = await fetch(file);
        const raw = await res.text();
        const { meta } = parseFrontmatter(raw);
        const id = file.replace(/^posts\//, '').replace(/\.md$/, '');
        return {
          id,
          file,
          title: meta.title || '无标题',
          date:  meta.date  || '',
          time:  meta.time  || '',
          tags:  Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
        };
      } catch { return null; }
    }));

    posts = results.filter(Boolean);
  } catch {
    posts = [];
  }

  window.addEventListener('hashchange', render);
  render();
}

init();
