import type { Project, Service, Profile } from "../lib/db.js";

const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet" />`;

const baseCSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--black:#000;--surface:#0D0D0D;--sidebar:#0A0A0A;--border:#1A1A1A;--border2:#222;--silver:#C0C0C0;--white:#FFF;--dim:#666;--muted:#333;--red:#ff4444;--green:#44cc88;--heading:'Bebas Neue',sans-serif;--body:'DM Sans',sans-serif;}
html{scroll-behavior:smooth;}
body{background:var(--black);color:var(--silver);font-family:var(--body);font-size:14px;line-height:1.5;overflow-x:hidden;min-height:100vh;}
::selection{background:var(--silver);color:var(--black);}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:var(--black);}::-webkit-scrollbar-thumb{background:var(--muted);}
input,textarea,select{background:var(--surface);border:1px solid var(--border2);color:var(--silver);font-family:var(--body);font-size:14px;padding:10px 14px;width:100%;outline:none;transition:border-color .2s;}
input:focus,textarea:focus,select:focus{border-color:var(--silver);}
select option{background:var(--surface);}
label{display:block;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
.field{margin-bottom:20px;}
.btn{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:10px 24px;border:none;cursor:pointer;transition:opacity .2s;}
.btn-silver{background:var(--silver);color:var(--black);}
.btn-silver:hover{opacity:.85;}
.btn-outline{background:transparent;color:var(--silver);border:1px solid var(--silver);}
.btn-outline:hover{background:var(--silver);color:var(--black);}
.btn-danger{background:transparent;color:var(--red);border:1px solid var(--red);}
.btn-danger:hover{background:var(--red);color:var(--white);}
.btn-sm{padding:6px 14px;font-size:10px;}
/* LAYOUT */
.admin-layout{display:flex;min-height:100vh;}
.sidebar{width:220px;background:var(--sidebar);border-right:1px solid var(--border);position:fixed;top:0;left:0;bottom:0;display:flex;flex-direction:column;z-index:100;}
.sidebar-logo{padding:28px 24px 24px;border-bottom:1px solid var(--border);}
.sidebar-logo a{font-family:var(--heading);font-size:28px;letter-spacing:5px;color:var(--white);text-decoration:none;}
.sidebar-logo a em{color:var(--silver);font-style:normal;}
.sidebar-logo span{display:block;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-top:4px;}
.sidebar-nav{flex:1;padding:20px 0;}
.sidebar-nav a{display:flex;align-items:center;gap:12px;padding:12px 24px;color:var(--dim);text-decoration:none;font-size:13px;letter-spacing:.5px;transition:color .2s,background .2s;position:relative;}
.sidebar-nav a:hover{color:var(--white);background:rgba(255,255,255,.03);}
.sidebar-nav a.active{color:var(--white);}
.sidebar-nav a.active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--silver);}
.sidebar-nav a .nav-icon{font-size:15px;width:20px;text-align:center;}
.sidebar-logout{padding:20px 24px;border-top:1px solid var(--border);}
.sidebar-logout a{display:flex;align-items:center;gap:10px;color:var(--muted);text-decoration:none;font-size:12px;letter-spacing:1px;transition:color .2s;}
.sidebar-logout a:hover{color:var(--red);}
.admin-main{margin-left:220px;flex:1;min-height:100vh;}
.admin-topbar{padding:20px 36px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,.6);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50;}
.admin-topbar h1{font-family:var(--heading);font-size:28px;letter-spacing:3px;color:var(--white);}
.admin-content{padding:36px;}
/* STAT CARDS */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:36px;}
.stat-card{background:var(--surface);border:1px solid var(--border);padding:28px 24px;}
.stat-val{font-family:var(--heading);font-size:48px;color:var(--silver);line-height:1;margin-bottom:8px;}
.stat-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);}
/* TABLE */
.table-wrap{background:var(--surface);border:1px solid var(--border);overflow:hidden;}
table{width:100%;border-collapse:collapse;}
th{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);text-align:left;padding:12px 16px;border-bottom:1px solid var(--border);}
td{padding:14px 16px;border-bottom:1px solid var(--border);vertical-align:middle;color:var(--silver);}
tr:last-child td{border-bottom:none;}
tr:hover td{background:rgba(255,255,255,.02);}
.thumb-preview{width:44px;height:44px;border-radius:3px;display:inline-block;flex-shrink:0;}
.pill{display:inline-block;font-size:9px;letter-spacing:2px;text-transform:uppercase;padding:4px 10px;border:1px solid var(--border);color:var(--muted);}
.pill-active{border-color:var(--silver);color:var(--silver);}
/* TOGGLE */
.toggle{position:relative;display:inline-block;width:40px;height:22px;}
.toggle input{opacity:0;width:0;height:0;}
.toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:var(--muted);border-radius:22px;transition:.2s;}
.toggle-slider::before{position:absolute;content:"";height:16px;width:16px;left:3px;bottom:3px;background:var(--black);border-radius:50%;transition:.2s;}
input:checked + .toggle-slider{background:var(--silver);}
input:checked + .toggle-slider::before{transform:translateX(18px);}
/* FORM */
.form-card{background:var(--surface);border:1px solid var(--border);padding:32px;margin-bottom:24px;}
.form-section-title{font-family:var(--heading);font-size:22px;letter-spacing:3px;color:var(--white);margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border);}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;}
.tag-input-wrap{display:flex;flex-wrap:wrap;gap:8px;padding:8px;border:1px solid var(--border2);min-height:44px;cursor:text;}
.tag-input-wrap:focus-within{border-color:var(--silver);}
.tag-item{background:var(--border);color:var(--silver);font-size:12px;padding:3px 10px;display:flex;align-items:center;gap:6px;}
.tag-item button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;line-height:1;padding:0;}
.tag-item button:hover{color:var(--white);}
.tag-input-inner{background:none;border:none;color:var(--silver);font-size:13px;padding:0;outline:none;min-width:80px;}
/* TABS */
.tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:28px;}
.tab{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);padding:12px 20px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s;}
.tab.active{color:var(--white);border-bottom-color:var(--silver);}
.tab-panel{display:none;}
.tab-panel.active{display:block;}
/* DYNAMIC LIST */
.dyn-item{display:flex;align-items:flex-start;gap:12px;padding:12px;background:var(--black);border:1px solid var(--border);margin-bottom:8px;}
.dyn-item input,.dyn-item textarea{flex:1;}
.dyn-item .remove-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;line-height:1;padding:4px;flex-shrink:0;transition:color .2s;}
.dyn-item .remove-btn:hover{color:var(--red);}
.add-btn{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--silver);background:none;border:1px dashed var(--muted);padding:8px 20px;cursor:pointer;width:100%;transition:border-color .2s,color .2s;margin-top:8px;}
.add-btn:hover{border-color:var(--silver);color:var(--white);}
/* GRADIENT PREVIEW */
.grad-preview{width:100%;height:100px;border:1px solid var(--border);margin-top:10px;border-radius:2px;}
/* SAVE BAR */
.save-bar{position:fixed;bottom:0;left:220px;right:0;padding:16px 36px;background:var(--sidebar);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:flex-end;gap:12px;z-index:200;}
/* TOAST */
#toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--surface);border:1px solid var(--silver);color:var(--silver);font-size:12px;letter-spacing:1px;padding:14px 32px;z-index:999;opacity:0;pointer-events:none;transition:opacity .3s,bottom .3s;}
#toast.show{opacity:1;bottom:90px;}
/* QUICK ACTIONS */
.actions-row{display:flex;gap:12px;margin-bottom:28px;}
/* ORDER INPUT */
.order-input{width:52px;background:var(--black);border:1px solid var(--border);color:var(--silver);font-size:14px;padding:4px 8px;text-align:center;}
/* SECTION FORM CARDS (services/profile) */
.s-form-card{background:var(--surface);border:1px solid var(--border);padding:28px;margin-bottom:16px;}
`;

function layout(page: string, activeNav: string, content: string): string {
  const navItems = [
    { id: "dashboard", icon: "⬡", label: "Dashboard", href: "/admin/dashboard" },
    { id: "projects", icon: "◈", label: "Projects", href: "/admin/projects" },
    { id: "services", icon: "◇", label: "Services", href: "/admin/services" },
    { id: "profile", icon: "◉", label: "Profile", href: "/admin/profile" },
    { id: "settings", icon: "◌", label: "Settings", href: "/admin/settings" },
  ];
  const navHTML = navItems.map(n => `
    <a href="${n.href}" class="${n.id === activeNav ? "active" : ""}">
      <span class="nav-icon">${n.icon}</span> ${n.label}
    </a>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${page} — Admin · SR</title>
  ${fonts}
  <style>${baseCSS}</style>
</head>
<body>
<div class="admin-layout">
  <aside class="sidebar">
    <div class="sidebar-logo">
      <a href="/admin/dashboard">S<em>R</em></a>
      <span>Admin Panel</span>
    </div>
    <nav class="sidebar-nav">${navHTML}</nav>
    <div class="sidebar-logout"><a href="/admin/logout">⎋ &nbsp;Logout</a></div>
  </aside>
  <div class="admin-main">
    <div class="admin-topbar">
      <h1>${page.toUpperCase()}</h1>
    </div>
    <div class="admin-content">${content}</div>
  </div>
</div>
<div id="toast"></div>
<script>
function showToast(msg,ok){var t=document.getElementById('toast');t.textContent=(ok?'✓ ':'✕ ')+msg;t.style.borderColor=ok?'var(--silver)':'var(--red)';t.style.color=ok?'var(--silver)':'var(--red)';t.classList.add('show');setTimeout(function(){t.classList.remove('show');},3200);}
</script>
</body>
</html>`;
}

export function loginPage(error?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Admin Login · SR</title>
  ${fonts}
  <style>
  ${baseCSS}
  body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--black);}
  .login-card{width:380px;background:var(--surface);border:1px solid var(--border);padding:48px 40px;text-align:center;}
  .login-card.shake{animation:shake .4s ease;}
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
  .login-mono{font-family:var(--heading);font-size:72px;letter-spacing:8px;color:var(--white);margin-bottom:8px;line-height:1;}
  .login-mono em{color:var(--silver);font-style:normal;}
  .login-title{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--muted);margin-bottom:36px;}
  .login-form{text-align:left;}
  .login-form input[type=password]{background:var(--black);border:1px solid var(--border2);color:var(--white);font-size:15px;padding:14px 16px;width:100%;letter-spacing:2px;margin-bottom:16px;outline:none;transition:border-color .2s;}
  .login-form input[type=password]:focus{border-color:var(--silver);}
  .login-submit{width:100%;background:var(--silver);color:var(--black);font-family:var(--body);font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:16px;border:none;cursor:pointer;transition:opacity .2s;}
  .login-submit:hover{opacity:.85;}
  .login-error{background:rgba(255,68,68,.08);border:1px solid rgba(255,68,68,.3);color:var(--red);font-size:12px;letter-spacing:1px;padding:10px 14px;margin-bottom:16px;text-align:center;}
  </style>
</head>
<body>
<div class="login-card${error ? " shake" : ""}">
  <div class="login-mono">S<em>R</em></div>
  <div class="login-title">Admin Access</div>
  <form class="login-form" method="POST" action="/admin/login">
    ${error ? `<div class="login-error">✕ &nbsp;${error}</div>` : ""}
    <input type="password" name="password" placeholder="Enter password" autofocus />
    <button class="login-submit" type="submit">Enter</button>
  </form>
</div>
</body>
</html>`;
}

export function dashboardPage(stats: { total: number; visible: number; lastUpdated: string }): string {
  const content = `
<div class="stats-grid">
  <div class="stat-card"><div class="stat-val">${stats.total}</div><div class="stat-label">Total Projects</div></div>
  <div class="stat-card"><div class="stat-val">${stats.visible}</div><div class="stat-label">Visible Projects</div></div>
  <div class="stat-card"><div class="stat-val">${stats.total}</div><div class="stat-label">Case Studies</div></div>
  <div class="stat-card"><div class="stat-val" style="font-size:18px;padding-top:8px;">${stats.lastUpdated}</div><div class="stat-label">Last Updated</div></div>
</div>
<div class="actions-row">
  <a href="/admin/projects/new" class="btn btn-silver">+ Add New Project</a>
  <a href="/" target="_blank" class="btn btn-outline">↗ View Portfolio</a>
</div>
<div style="margin-top:12px;padding:20px 24px;background:var(--surface);border:1px solid var(--border);font-size:13px;color:var(--dim);line-height:1.8;">
  <strong style="color:var(--silver);letter-spacing:1px;">Quick Links:</strong>
  &nbsp;&nbsp;<a href="/admin/projects" style="color:var(--silver);text-decoration:none;">Manage Projects</a>
  &nbsp;·&nbsp;<a href="/admin/services" style="color:var(--silver);text-decoration:none;">Edit Services</a>
  &nbsp;·&nbsp;<a href="/admin/profile" style="color:var(--silver);text-decoration:none;">Update Profile</a>
  &nbsp;·&nbsp;<a href="/admin/settings" style="color:var(--silver);text-decoration:none;">Settings</a>
</div>`;
  return layout("Dashboard", "dashboard", content);
}

export function projectsListPage(projects: Project[]): string {
  const rows = projects.map(p => `
    <tr data-id="${p.id}" draggable="true">
      <td><div class="thumb-preview" style="background:${p.thumbnail_gradient};"></div></td>
      <td>
        <div style="color:var(--white);font-weight:500;">${p.title}</div>
        <div style="color:var(--muted);font-size:11px;margin-top:2px;">/project/${p.slug}</div>
      </td>
      <td><span class="pill ${p.visible ? "pill-active" : ""}">${p.category}</span></td>
      <td>
        <label class="toggle">
          <input type="checkbox" ${p.visible ? "checked" : ""} onchange="toggleVisible('${p.id}',this.checked)" />
          <span class="toggle-slider"></span>
        </label>
      </td>
      <td><input class="order-input" type="number" value="${p.order}" onblur="updateOrder('${p.id}',this.value)" /></td>
      <td>
        <a href="/admin/projects/${p.id}/edit" class="btn btn-outline btn-sm" style="margin-right:8px;">Edit</a>
        <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}','${p.title}')">Delete</button>
      </td>
    </tr>`).join("");

  const content = `
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
  <p style="color:var(--muted);font-size:13px;">${projects.length} project${projects.length !== 1 ? "s" : ""} · drag rows to reorder</p>
  <a href="/admin/projects/new" class="btn btn-silver">+ Add New Project</a>
</div>
<div class="table-wrap">
  <table>
    <thead><tr>
      <th style="width:60px;">Thumb</th>
      <th>Title</th>
      <th>Category</th>
      <th style="width:80px;">Visible</th>
      <th style="width:80px;">Order</th>
      <th style="width:160px;">Actions</th>
    </tr></thead>
    <tbody id="projects-tbody">${rows}</tbody>
  </table>
</div>
<script>
function toggleVisible(id,val){
  fetch('/api/projects/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({visible:val})})
    .then(r=>r.json()).then(()=>showToast('Visibility updated',true)).catch(()=>showToast('Error updating',false));
}
function updateOrder(id,val){
  fetch('/api/projects/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({order:parseInt(val)})})
    .then(r=>r.json()).then(()=>showToast('Order updated',true)).catch(()=>showToast('Error updating',false));
}
function deleteProject(id,title){
  if(!confirm('Delete "'+title+'"? This cannot be undone.'))return;
  fetch('/api/projects/'+id,{method:'DELETE'}).then(r=>r.json()).then(function(){
    showToast('Project deleted',true);
    setTimeout(function(){location.reload();},1200);
  }).catch(()=>showToast('Error deleting',false));
}
// Drag to reorder
var tbody=document.getElementById('projects-tbody');
var dragged=null;
tbody.addEventListener('dragstart',function(e){dragged=e.target.closest('tr');dragged.style.opacity='.5';});
tbody.addEventListener('dragend',function(e){dragged.style.opacity='1';});
tbody.addEventListener('dragover',function(e){e.preventDefault();var row=e.target.closest('tr');if(row&&row!==dragged){var rect=row.getBoundingClientRect();var mid=rect.top+rect.height/2;if(e.clientY<mid)tbody.insertBefore(dragged,row);else tbody.insertBefore(dragged,row.nextSibling);}});
tbody.addEventListener('drop',function(e){e.preventDefault();var rows=Array.from(tbody.querySelectorAll('tr'));var order={};rows.forEach(function(r,i){var id=r.getAttribute('data-id');order[id]=i+1;r.querySelector('.order-input').value=i+1;});fetch('/api/projects/reorder',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({order:order})}).then(()=>showToast('Order saved',true));});
</script>`;
  return layout("Projects", "projects", content);
}

function projectFormContent(p: Partial<Project> | null, isEdit: boolean): string {
  const v = (key: string, def = "") => {
    if (!p) return def;
    return String((p as Record<string, unknown>)[key] ?? def).replace(/"/g, "&quot;");
  };
  const tools = p?.tools ?? [];
  const research = p?.research ?? [
    { number: "01", heading: "", description: "" },
    { number: "02", heading: "", description: "" },
    { number: "03", heading: "", description: "" },
  ];
  const results = p?.results ?? [
    { number: "", label: "" },
    { number: "", label: "" },
    { number: "", label: "" },
  ];
  const features = p?.solution_features ?? [{ title: "", description: "", image_url: "" }];
  const workedItems = p?.learnings?.worked ?? [""];
  const improveItems = p?.learnings?.improve ?? [""];
  const myRole = p?.overview?.my_role ?? [""];

  const gradStart = (p?.thumbnail_gradient ?? "linear-gradient(135deg, #1a1a1a, #2d2d2d)")
    .match(/#[0-9a-fA-F]{3,6}/g)?.[0] ?? "#1a1a1a";
  const gradEnd = (p?.thumbnail_gradient ?? "linear-gradient(135deg, #1a1a1a, #2d2d2d)")
    .match(/#[0-9a-fA-F]{3,6}/g)?.[1] ?? "#2d2d2d";

  const researchHTML = research.map((r, i) => `
    <div class="s-form-card" style="margin-bottom:12px;">
      <div style="font-family:var(--heading);font-size:18px;letter-spacing:2px;color:var(--muted);margin-bottom:16px;">INSIGHT ${r.number || String(i + 1).padStart(2, "0")}</div>
      <div class="form-row">
        <div class="field"><label>Number</label><input type="text" name="research_number_${i}" value="${r.number}" /></div>
        <div class="field"><label>Heading</label><input type="text" name="research_heading_${i}" value="${r.heading.replace(/"/g, "&quot;")}" /></div>
      </div>
      <div class="field"><label>Description</label><textarea name="research_desc_${i}" rows="2">${r.description}</textarea></div>
    </div>`).join("");

  const resultsHTML = results.map((r, i) => `
    <div class="s-form-card" style="margin-bottom:12px;">
      <div class="form-row">
        <div class="field"><label>Number (e.g. 3x, 40%, 92%)</label><input type="text" name="result_num_${i}" value="${r.number.replace(/"/g, "&quot;")}" /></div>
        <div class="field"><label>Label</label><input type="text" name="result_label_${i}" value="${r.label.replace(/"/g, "&quot;")}" /></div>
      </div>
    </div>`).join("");

  const featuresHTML = features.map((f, i) => `
    <div class="s-form-card dyn-feature" data-idx="${i}" style="margin-bottom:12px;">
      <div class="field"><label>Feature Title</label><input type="text" name="feat_title_${i}" value="${f.title.replace(/"/g, "&quot;")}" /></div>
      <div class="field"><label>Description</label><textarea name="feat_desc_${i}" rows="3">${f.description}</textarea></div>
    </div>`).join("");

  const roleHTML = myRole.map((r, i) => `
    <div class="dyn-item">
      <input type="text" name="role_item_${i}" value="${r.replace(/"/g, "&quot;")}" placeholder="Bullet point..." />
      <button type="button" class="remove-btn" onclick="removeItem(this)">×</button>
    </div>`).join("");

  const workedHTML = workedItems.map((w, i) => `
    <div class="dyn-item">
      <input type="text" name="worked_item_${i}" value="${w.replace(/"/g, "&quot;")}" placeholder="What worked..." />
      <button type="button" class="remove-btn" onclick="removeItem(this)">×</button>
    </div>`).join("");

  const improveHTML = improveItems.map((w, i) => `
    <div class="dyn-item">
      <input type="text" name="improve_item_${i}" value="${w.replace(/"/g, "&quot;")}" placeholder="What to improve..." />
      <button type="button" class="remove-btn" onclick="removeItem(this)">×</button>
    </div>`).join("");

  const toolTagsHTML = tools.map(t => `<span class="tag-item">${t}<button type="button" onclick="removeTag(this)">×</button></span>`).join("");

  const categories = ["E-Commerce", "FinTech", "Landing Page", "Brand Website", "Mobile App", "Dashboard"];
  const catOptions = categories.map(c => `<option value="${c}" ${v("category") === c ? "selected" : ""}>${c}</option>`).join("");

  return `
<form id="project-form">
<div class="form-card">
  <div class="form-section-title">Basic Info</div>
  <div class="form-row">
    <div class="field"><label>Title</label><input type="text" name="title" value="${v("title")}" required id="title-input" /></div>
    <div class="field"><label>Slug</label><input type="text" name="slug" value="${v("slug")}" id="slug-input" /></div>
  </div>
  <div class="field"><label>Tagline</label><input type="text" name="tagline" value="${v("tagline")}" /></div>
  <div class="form-row-3">
    <div class="field"><label>Category</label><select name="category">${catOptions}</select></div>
    <div class="field"><label>Type</label><input type="text" name="type" value="${v("type")}" /></div>
    <div class="field"><label>Timeline</label><input type="text" name="timeline" value="${v("timeline")}" /></div>
  </div>
  <div class="form-row">
    <div class="field"><label>Role</label><input type="text" name="role" value="${v("role")}" /></div>
    <div class="field"><label>Order</label><input type="number" name="order" value="${v("order", "1")}" /></div>
  </div>
  <div class="form-row">
    <div class="field">
      <label>Tools (press Enter to add)</label>
      <div class="tag-input-wrap" id="tools-wrap">
        ${toolTagsHTML}
        <input class="tag-input-inner" id="tools-input" placeholder="e.g. Figma" />
      </div>
      <input type="hidden" name="tools" id="tools-hidden" value="${tools.join(",")}" />
    </div>
    <div class="field" style="display:flex;align-items:flex-end;gap:16px;padding-bottom:0;">
      <label style="display:flex;align-items:center;gap:12px;cursor:pointer;">
        <span>Visible on Portfolio</span>
        <label class="toggle" style="margin:0;">
          <input type="checkbox" name="visible" ${p?.visible !== false ? "checked" : ""} />
          <span class="toggle-slider"></span>
        </label>
      </label>
    </div>
  </div>
</div>

<div class="form-card">
  <div class="form-section-title">Thumbnail</div>
  <div class="form-row">
    <div>
      <label>Gradient Start</label><input type="color" name="grad_start" value="${gradStart}" id="grad-start" />
      <label style="margin-top:12px;">Gradient End</label><input type="color" name="grad_end" value="${gradEnd}" id="grad-end" />
    </div>
    <div>
      <label>Preview</label>
      <div class="grad-preview" id="grad-preview" style="background:linear-gradient(135deg,${gradStart},${gradEnd});"></div>
    </div>
  </div>
  <div class="field" style="margin-top:16px;">
    <label>Or Image URL</label>
    <input type="text" name="thumbnail_url" value="${v("thumbnail_url")}" placeholder="https://..." />
  </div>
</div>

<div class="form-card">
  <div class="form-section-title">Case Study Content</div>
  <div class="tabs">
    <div class="tab active" onclick="switchTab(this,'tab-overview')">Overview</div>
    <div class="tab" onclick="switchTab(this,'tab-research')">Research</div>
    <div class="tab" onclick="switchTab(this,'tab-solution')">Solution</div>
    <div class="tab" onclick="switchTab(this,'tab-results')">Results</div>
    <div class="tab" onclick="switchTab(this,'tab-learnings')">Learnings</div>
  </div>
  <div id="tab-overview" class="tab-panel active">
    <div class="field"><label>Challenge</label><textarea name="challenge" rows="5">${p?.overview?.challenge ?? ""}</textarea></div>
    <div class="field">
      <label>My Role (bullets)</label>
      <div id="role-list">${roleHTML}</div>
      <button type="button" class="add-btn" onclick="addItem('role-list','role_item')">+ Add bullet</button>
    </div>
  </div>
  <div id="tab-research" class="tab-panel">${researchHTML}</div>
  <div id="tab-solution" class="tab-panel">
    <div id="features-list">${featuresHTML}</div>
    <button type="button" class="add-btn" onclick="addFeature()">+ Add Feature</button>
  </div>
  <div id="tab-results" class="tab-panel">${resultsHTML}</div>
  <div id="tab-learnings" class="tab-panel">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
      <div>
        <label style="margin-bottom:12px;">What Worked</label>
        <div id="worked-list">${workedHTML}</div>
        <button type="button" class="add-btn" onclick="addItem('worked-list','worked_item')">+ Add point</button>
      </div>
      <div>
        <label style="margin-bottom:12px;">What to Improve</label>
        <div id="improve-list">${improveHTML}</div>
        <button type="button" class="add-btn" onclick="addItem('improve-list','improve_item')">+ Add point</button>
      </div>
    </div>
  </div>
</div>

<div class="save-bar">
  <a href="/admin/projects" class="btn btn-outline">Cancel</a>
  <button type="button" class="btn btn-silver" onclick="saveProject()">Save Project</button>
</div>
</form>

<script>
// Slug auto-gen
document.getElementById('title-input').addEventListener('input',function(){
  var slug=this.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if(!document.getElementById('slug-input').dataset.manual) document.getElementById('slug-input').value=slug;
});
document.getElementById('slug-input').addEventListener('input',function(){this.dataset.manual='1';});

// Gradient preview
function updateGrad(){
  var s=document.getElementById('grad-start').value;
  var e=document.getElementById('grad-end').value;
  document.getElementById('grad-preview').style.background='linear-gradient(135deg,'+s+','+e+')';
}
document.getElementById('grad-start').addEventListener('input',updateGrad);
document.getElementById('grad-end').addEventListener('input',updateGrad);

// Tags
var toolsInput=document.getElementById('tools-input');
toolsInput.addEventListener('keydown',function(e){
  if(e.key==='Enter'){e.preventDefault();addTag(this.value.trim());this.value='';}
});
function addTag(val){
  if(!val)return;
  var wrap=document.getElementById('tools-wrap');
  var span=document.createElement('span');span.className='tag-item';
  span.innerHTML=val+'<button type="button" onclick="removeTag(this)">×</button>';
  wrap.insertBefore(span,toolsInput);
  updateToolsHidden();
}
function removeTag(btn){btn.parentElement.remove();updateToolsHidden();}
function updateToolsHidden(){
  var tags=Array.from(document.querySelectorAll('#tools-wrap .tag-item')).map(function(el){return el.textContent.replace('×','').trim();});
  document.getElementById('tools-hidden').value=tags.join(',');
}

// Tabs
function switchTab(el,id){
  document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active');});
  el.classList.add('active');
  document.getElementById(id).classList.add('active');
}

// Dynamic lists
var itemCounters={};
function addItem(listId,prefix){
  var list=document.getElementById(listId);
  var idx=(itemCounters[prefix]=(itemCounters[prefix]||list.children.length));
  var div=document.createElement('div');div.className='dyn-item';
  div.innerHTML='<input type="text" name="'+prefix+'_'+idx+'" placeholder="Enter text..." /><button type="button" class="remove-btn" onclick="removeItem(this)">×</button>';
  list.appendChild(div);itemCounters[prefix]++;
}
function removeItem(btn){btn.closest('.dyn-item').remove();}

// Add feature
var featCount=${features.length};
function addFeature(){
  var list=document.getElementById('features-list');
  var div=document.createElement('div');div.className='s-form-card dyn-feature';div.dataset.idx=featCount;
  div.innerHTML='<div class="field"><label>Feature Title</label><input type="text" name="feat_title_'+featCount+'" /></div><div class="field"><label>Description</label><textarea name="feat_desc_'+featCount+'" rows="3"></textarea></div>';
  list.appendChild(div);featCount++;
}

// Save project
function saveProject(){
  var form=document.getElementById('project-form');
  var data=new FormData(form);
  var obj={};
  for(var[k,v] of data.entries()){obj[k]=v;}

  // Parse tools
  obj.tools=(obj.tools||'').split(',').map(function(t){return t.trim();}).filter(Boolean);

  // Parse overview
  var myRole=[];
  form.querySelectorAll('[name^="role_item_"]').forEach(function(inp){if(inp.value.trim())myRole.push(inp.value.trim());});
  obj.overview={challenge:obj.challenge||'',my_role:myRole};
  delete obj.challenge;

  // Parse research
  var research=[];
  for(var i=0;i<3;i++){
    research.push({number:obj['research_number_'+i]||String(i+1).padStart(2,'0'),heading:obj['research_heading_'+i]||'',description:obj['research_desc_'+i]||''});
    delete obj['research_number_'+i];delete obj['research_heading_'+i];delete obj['research_desc_'+i];
  }
  obj.research=research;

  // Parse features
  var features=[];
  form.querySelectorAll('.dyn-feature').forEach(function(el){
    var idx=el.dataset.idx;
    var t=(obj['feat_title_'+idx]||'').trim();
    var d=(obj['feat_desc_'+idx]||'').trim();
    if(t||d)features.push({title:t,description:d,image_url:''});
    delete obj['feat_title_'+idx];delete obj['feat_desc_'+idx];
  });
  obj.solution_features=features;

  // Parse results
  var results=[];
  for(var i=0;i<3;i++){
    results.push({number:obj['result_num_'+i]||'',label:obj['result_label_'+i]||''});
    delete obj['result_num_'+i];delete obj['result_label_'+i];
  }
  obj.results=results;

  // Parse learnings
  var worked=[],improve=[];
  form.querySelectorAll('[name^="worked_item_"]').forEach(function(inp){if(inp.value.trim())worked.push(inp.value.trim());});
  form.querySelectorAll('[name^="improve_item_"]').forEach(function(inp){if(inp.value.trim())improve.push(inp.value.trim());});
  obj.learnings={worked:worked,improve:improve};

  // Gradient
  var gs=obj.grad_start,ge=obj.grad_end;
  obj.thumbnail_gradient='linear-gradient(135deg, '+gs+', '+ge+')';
  delete obj.grad_start;delete obj.grad_end;

  // Booleans
  obj.visible=form.querySelector('[name=visible]').checked;
  obj.order=parseInt(obj.order)||1;

  var isEdit=${isEdit};
  var id='${p?.id ?? ""}';
  var url=isEdit?'/api/projects/'+id:'/api/projects';
  var method=isEdit?'PUT':'POST';

  fetch(url,{method:method,headers:{'Content-Type':'application/json'},body:JSON.stringify(obj)})
    .then(function(r){return r.json();})
    .then(function(){showToast('Project saved successfully',true);setTimeout(function(){window.location.href='/admin/projects';},1400);})
    .catch(function(){showToast('Error saving project',false);});
}
</script>`;
}

export function projectFormPage(project?: Project): string {
  const isEdit = !!project;
  const title = isEdit ? `Edit: ${project!.title}` : "New Project";
  return layout(title, "projects", projectFormContent(project ?? null, isEdit));
}

export function servicesPage(services: Service[]): string {
  const cardsHTML = services.map((s, i) => `
    <div class="s-form-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <div style="font-family:var(--heading);font-size:20px;letter-spacing:2px;color:var(--white);">Service ${i + 1}</div>
        <label class="toggle"><input type="checkbox" name="visible_${i}" ${s.visible ? "checked" : ""} /><span class="toggle-slider"></span></label>
      </div>
      <input type="hidden" name="id_${i}" value="${s.id}" />
      <div class="form-row">
        <div class="field"><label>Icon (emoji)</label><input type="text" name="icon_${i}" value="${s.icon}" /></div>
        <div class="field"><label>Title</label><input type="text" name="title_${i}" value="${s.title.replace(/"/g, "&quot;")}" /></div>
      </div>
      <div class="field"><label>Description</label><textarea name="desc_${i}" rows="3">${s.description}</textarea></div>
      <div class="field"><label>Starting Price</label><input type="text" name="price_${i}" value="${s.price.replace(/"/g, "&quot;")}" /></div>
    </div>`).join("");

  const content = `
<form id="services-form">
  ${cardsHTML}
  <div class="save-bar">
    <button type="button" class="btn btn-silver" onclick="saveServices()">Save Services</button>
  </div>
</form>
<script>
function saveServices(){
  var form=document.getElementById('services-form');
  var count=${services.length};
  var services=[];
  for(var i=0;i<count;i++){
    services.push({
      id:form.querySelector('[name=id_'+i+']').value,
      icon:form.querySelector('[name=icon_'+i+']').value,
      title:form.querySelector('[name=title_'+i+']').value,
      description:form.querySelector('[name=desc_'+i+']').value,
      price:form.querySelector('[name=price_'+i+']').value,
      visible:form.querySelector('[name=visible_'+i+']').checked
    });
  }
  fetch('/api/services',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({services:services})})
    .then(r=>r.json()).then(()=>showToast('Services saved',true)).catch(()=>showToast('Error saving',false));
}
</script>`;
  return layout("Services", "services", content);
}

export function profilePage(profile: Profile): string {
  const skillTagsHTML = profile.skills.map(s => `<span class="tag-item">${s}<button type="button" onclick="removeTag(this)">×</button></span>`).join("");

  const content = `
<form id="profile-form">
<div class="form-card">
  <div class="form-section-title">Profile</div>
  <div class="field"><label>Hero Tagline</label><input type="text" name="tagline" value="${profile.tagline.replace(/"/g, "&quot;")}" /></div>
  <div class="field"><label>About Bio</label><textarea name="bio" rows="5">${profile.bio}</textarea></div>
  <div class="field">
    <label>Skills (press Enter to add)</label>
    <div class="tag-input-wrap" id="skills-wrap">
      ${skillTagsHTML}
      <input class="tag-input-inner" id="skills-input" placeholder="e.g. Figma" />
    </div>
    <input type="hidden" name="skills" id="skills-hidden" value="${profile.skills.join(",")}" />
  </div>
</div>
<div class="form-card">
  <div class="form-section-title">Contact Info</div>
  <div class="form-row">
    <div class="field"><label>Email</label><input type="email" name="email" value="${profile.email.replace(/"/g, "&quot;")}" /></div>
    <div class="field"><label>Phone</label><input type="text" name="phone" value="${profile.phone.replace(/"/g, "&quot;")}" /></div>
  </div>
  <div class="form-row">
    <div class="field"><label>LinkedIn URL</label><input type="text" name="linkedin" value="${profile.linkedin.replace(/"/g, "&quot;")}" /></div>
    <div class="field"><label>Behance URL</label><input type="text" name="behance" value="${profile.behance.replace(/"/g, "&quot;")}" /></div>
  </div>
</div>
<div class="save-bar">
  <button type="button" class="btn btn-silver" onclick="saveProfile()">Save Profile</button>
</div>
</form>
<script>
var skillsInput=document.getElementById('skills-input');
skillsInput.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addSkillTag(this.value.trim());this.value='';}});
function addSkillTag(val){
  if(!val)return;
  var wrap=document.getElementById('skills-wrap');
  var span=document.createElement('span');span.className='tag-item';
  span.innerHTML=val+'<button type="button" onclick="removeTag(this)">×</button>';
  wrap.insertBefore(span,skillsInput);updateSkillsHidden();
}
function removeTag(btn){btn.parentElement.remove();updateSkillsHidden();}
function updateSkillsHidden(){
  var tags=Array.from(document.querySelectorAll('#skills-wrap .tag-item')).map(function(el){return el.textContent.replace('×','').trim();});
  document.getElementById('skills-hidden').value=tags.join(',');
}
function saveProfile(){
  var form=document.getElementById('profile-form');
  var data=new FormData(form);var obj={};
  for(var[k,v] of data.entries())obj[k]=v;
  obj.skills=(obj.skills||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
  fetch('/api/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(obj)})
    .then(r=>r.json()).then(()=>showToast('Profile saved',true)).catch(()=>showToast('Error saving',false));
}
</script>`;
  return layout("Profile", "profile", content);
}

export function settingsPage(settings: { site_title: string; meta_description: string }): string {
  const content = `
<div class="form-card">
  <div class="form-section-title">Site Settings</div>
  <div class="field"><label>Site Title (meta title)</label><input type="text" id="site-title" value="${settings.site_title.replace(/"/g, "&quot;")}" /></div>
  <div class="field"><label>Meta Description</label><textarea id="meta-desc" rows="3">${settings.meta_description}</textarea></div>
</div>
<div class="form-card">
  <div class="form-section-title">Change Password</div>
  <div class="form-row">
    <div class="field"><label>New Password</label><input type="password" id="new-pw" placeholder="Leave blank to keep current" /></div>
    <div class="field"><label>Confirm New Password</label><input type="password" id="confirm-pw" /></div>
  </div>
</div>
<div class="save-bar">
  <button type="button" class="btn btn-silver" onclick="saveSettings()">Save Settings</button>
</div>
<script>
function saveSettings(){
  var payload={
    site_title:document.getElementById('site-title').value,
    meta_description:document.getElementById('meta-desc').value,
  };
  var np=document.getElementById('new-pw').value;
  var cp=document.getElementById('confirm-pw').value;
  if(np){
    if(np!==cp){showToast('Passwords do not match',false);return;}
    payload.new_password=np;
  }
  fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(r=>r.json()).then(function(){showToast('Settings saved',true);document.getElementById('new-pw').value='';document.getElementById('confirm-pw').value='';}).catch(()=>showToast('Error saving',false));
}
</script>`;
  return layout("Settings", "settings", content);
}
