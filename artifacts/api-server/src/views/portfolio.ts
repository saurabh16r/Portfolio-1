import type { Project, Service, Profile, SiteSettings } from "../lib/db.js";

const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet" />`;

const sharedCSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--black:#000;--surface:#0D0D0D;--border:#1A1A1A;--silver:#C0C0C0;--white:#FFF;--dim:#666;--muted:#333;--heading:'Bebas Neue',sans-serif;--body:'DM Sans',sans-serif;}
html{scroll-behavior:smooth;}
body{background:var(--black);color:var(--silver);font-family:var(--body);font-weight:400;line-height:1.6;overflow-x:hidden;cursor:none;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:var(--black);}::-webkit-scrollbar-thumb{background:var(--muted);}
::selection{background:var(--silver);color:var(--black);}
#cur{position:fixed;width:10px;height:10px;background:var(--silver);border-radius:50%;pointer-events:none;z-index:10000;transform:translate(-50%,-50%);transition:width .18s,height .18s,background .18s;mix-blend-mode:difference;}
#cur-ring{position:fixed;width:34px;height:34px;border:1px solid rgba(192,192,192,.35);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .2s,height .2s;}
`;

const cursorJS = `
var cur=document.getElementById('cur'),ring=document.getElementById('cur-ring'),mx=-200,my=-200,rx=-200,ry=-200;
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
(function tick(){cur.style.left=mx+'px';cur.style.top=my+'px';rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick);})();
document.querySelectorAll('a,button').forEach(function(el){
  el.addEventListener('mouseenter',function(){cur.style.width='18px';cur.style.height='18px';cur.style.background='#fff';ring.style.width='46px';ring.style.height='46px';});
  el.addEventListener('mouseleave',function(){cur.style.width='10px';cur.style.height='10px';cur.style.background='#C0C0C0';ring.style.width='34px';ring.style.height='34px';});
});
`;

function projectCard(p: Project): string {
  const gradient = p.thumbnail_url
    ? `background:url('${p.thumbnail_url}') center/cover;`
    : `background:${p.thumbnail_gradient};`;
  const gradClass = `t-custom`;
  return `
  <div class="card rev">
    <div class="card-thumb ${gradClass}" style="${gradient}"><span class="card-thumb-label">${p.title.toUpperCase()}</span></div>
    <div class="card-body">
      <span class="card-tag">${p.category}</span>
      <h3 class="card-name">${p.title}</h3>
      <p class="card-desc">${p.tagline}</p>
      <a href="/project/${p.slug}" class="card-link">View Case Study <span>→</span></a>
    </div>
  </div>`;
}

function serviceCard(s: Service): string {
  return `
  <div class="srv-card rev">
    <div class="srv-icon">${s.icon}</div>
    <h3 class="srv-title">${s.title}</h3>
    <p class="srv-desc">${s.description}</p>
    <p class="srv-price">${s.price}</p>
  </div>`;
}

export function homePage(projects: Project[], services: Service[], profile: Profile, settings: SiteSettings): string {
  const visibleProjects = projects.filter(p => p.visible).sort((a, b) => a.order - b.order);
  const visibleServices = services.filter(s => s.visible);

  const projectCards = visibleProjects.length
    ? visibleProjects.map(projectCard).join("")
    : `<p style="color:var(--dim);font-size:14px;letter-spacing:2px;grid-column:1/-1;text-align:center;">No projects yet — add some in the <a href="/admin" style="color:var(--silver);">admin panel</a>.</p>`;

  const serviceCards = visibleServices.length
    ? visibleServices.map(serviceCard).join("")
    : `<p style="color:var(--dim);font-size:14px;letter-spacing:2px;grid-column:1/-1;text-align:center;">No services configured.</p>`;

  const skillTags = profile.skills.map(s => `<span class="skill-tag">${s}</span>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${settings.site_title}</title>
  <meta name="description" content="${settings.meta_description}" />
  ${fonts}
  <style>
  ${sharedCSS}
  nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:22px 64px;display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,.88);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--border);}
  .nav-logo{font-family:var(--heading);font-size:30px;letter-spacing:6px;color:var(--white);text-decoration:none;cursor:none;}
  .nav-logo em{color:var(--silver);font-style:normal;}
  .nav-links{display:flex;gap:44px;list-style:none;}
  .nav-links a{color:var(--dim);text-decoration:none;font-size:11px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;transition:color .2s;cursor:none;}
  .nav-links a:hover{color:var(--white);}
  .nav-cta{font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--black);background:var(--silver);padding:10px 24px;text-decoration:none;transition:opacity .2s;cursor:none;}
  .nav-cta:hover{opacity:.85;}
  /* HERO */
  #hero{min-height:100vh;display:grid;place-items:center;padding:120px 64px 80px;position:relative;overflow:hidden;isolation:isolate;}
  #hero::before{content:'';position:absolute;inset:0;z-index:-1;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");background-size:300px;opacity:.04;pointer-events:none;}
  #hero::after{content:'';position:absolute;inset:0;z-index:-1;background-image:radial-gradient(circle,#2A2A2A 1px,transparent 1px);background-size:28px 28px;opacity:.4;pointer-events:none;}
  .hero-inner{text-align:center;max-width:1000px;}
  .hero-tag{font-size:11px;letter-spacing:.25em;color:var(--silver);text-transform:uppercase;margin-bottom:24px;opacity:.7;}
  .hero-title{font-family:var(--heading);font-size:clamp(72px,11vw,160px);line-height:.88;letter-spacing:4px;color:var(--white);margin-bottom:32px;}
  .hero-title em{color:var(--silver);font-style:normal;}
  .hero-sub{font-size:clamp(16px,1.8vw,20px);color:var(--dim);font-weight:300;max-width:560px;margin:0 auto 48px;line-height:1.6;}
  .hero-ctas{display:flex;gap:16px;justify-content:center;}
  .btn-primary{font-size:12px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--black);background:var(--silver);padding:16px 40px;text-decoration:none;transition:opacity .2s;cursor:none;}
  .btn-primary:hover{opacity:.85;}
  .btn-secondary{font-size:12px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:var(--silver);border:1px solid var(--silver);padding:16px 40px;text-decoration:none;transition:background .2s,color .2s;cursor:none;}
  .btn-secondary:hover{background:var(--silver);color:var(--black);}
  .hero-scroll{position:absolute;bottom:48px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;}
  .hero-scroll span{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);}
  .scroll-line{width:1px;height:50px;background:linear-gradient(to bottom,var(--muted),transparent);animation:scrollPulse 2s ease-in-out infinite;}
  @keyframes scrollPulse{0%,100%{opacity:.4}50%{opacity:1}}
  /* MARQUEE */
  .marquee-wrap{border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--surface);padding:20px 0;overflow:hidden;display:flex;}
  .marquee-track{display:flex;gap:0;animation:marqueeRoll 28s linear infinite;white-space:nowrap;}
  .marquee-item{font-family:var(--heading);font-size:13px;letter-spacing:5px;color:var(--muted);text-transform:uppercase;padding:0 40px;}
  .marquee-item em{color:var(--silver);font-style:normal;}
  @keyframes marqueeRoll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  /* QUOTE BLOCK */
  .quote-block{padding:80px 64px;text-align:center;}
  .quote-text{font-family:var(--heading);font-size:clamp(32px,5vw,64px);letter-spacing:2px;color:var(--white);line-height:1.1;max-width:900px;margin:0 auto;}
  .quote-text em{color:var(--silver);font-style:normal;}
  /* WORK */
  #work{padding:120px 64px;background:var(--surface);border-top:1px solid var(--border);}
  .section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:64px;}
  .section-tag{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--muted);margin-bottom:10px;}
  .section-title{font-family:var(--heading);font-size:clamp(40px,6vw,80px);letter-spacing:2px;color:var(--white);line-height:1;}
  .section-count{font-family:var(--heading);font-size:80px;color:var(--muted);line-height:1;opacity:.3;}
  .cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;}
  .card{background:var(--black);border:1px solid var(--border);cursor:none;transition:border-color .3s;}
  .card:hover{border-color:var(--silver);}
  .card-thumb{aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
  .card-thumb::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 38px,rgba(192,192,192,.014) 38px,rgba(192,192,192,.014) 39px);}
  .card-thumb-label{font-family:var(--heading);font-size:36px;letter-spacing:5px;color:rgba(255,255,255,.12);position:relative;z-index:1;}
  .card-body{padding:28px 28px 32px;}
  .card-tag{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:10px;display:block;}
  .card-name{font-family:var(--heading);font-size:32px;letter-spacing:2px;color:var(--white);margin-bottom:8px;}
  .card-desc{font-size:13px;color:var(--dim);line-height:1.6;margin-bottom:20px;}
  .card-link{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--silver);text-decoration:none;border-bottom:1px solid var(--muted);padding-bottom:2px;transition:border-color .2s,color .2s;cursor:none;}
  .card-link:hover{color:var(--white);border-color:var(--white);}
  /* SERVICES */
  #services{padding:120px 64px;position:relative;overflow:hidden;isolation:isolate;}
  #services::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(-45deg,transparent,transparent 58px,rgba(192,192,192,.012) 58px,rgba(192,192,192,.012) 59px);z-index:-1;}
  .srv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;}
  .srv-card{background:var(--surface);border:1px solid var(--border);padding:48px 40px;cursor:none;transition:border-color .3s,transform .3s;}
  .srv-card:hover{border-color:var(--silver);transform:translateY(-4px);}
  .srv-icon{font-size:28px;color:var(--silver);margin-bottom:28px;}
  .srv-title{font-family:var(--heading);font-size:28px;letter-spacing:3px;color:var(--white);margin-bottom:16px;}
  .srv-desc{font-size:14px;color:var(--dim);line-height:1.75;margin-bottom:24px;}
  .srv-price{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--silver);border-top:1px solid var(--border);padding-top:20px;margin-top:auto;}
  /* ABOUT */
  #about{padding:120px 64px;background:var(--surface);border-top:1px solid var(--border);position:relative;overflow:hidden;isolation:isolate;}
  #about::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(192,192,192,.025) 0%,transparent 60%);z-index:-1;}
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center;}
  .about-kicker{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--muted);margin-bottom:16px;}
  .about-name{font-family:var(--heading);font-size:clamp(48px,6vw,84px);letter-spacing:3px;color:var(--white);line-height:.95;margin-bottom:28px;}
  .about-name em{color:var(--silver);font-style:normal;}
  .about-bio{font-size:15px;color:var(--dim);line-height:1.85;margin-bottom:36px;}
  .about-skills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:40px;}
  .skill-tag{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--silver);border:1px solid var(--border);padding:7px 16px;}
  .about-links{display:flex;gap:20px;}
  .about-link{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--silver);text-decoration:none;border-bottom:1px solid var(--muted);padding-bottom:2px;transition:border-color .2s,color .2s;cursor:none;}
  .about-link:hover{color:var(--white);border-color:var(--white);}
  .about-right{position:relative;}
  .about-photo{width:100%;aspect-ratio:3/4;object-fit:cover;display:block;}
  .about-photo-placeholder{width:100%;aspect-ratio:3/4;background:linear-gradient(135deg,#111,#222);display:flex;align-items:center;justify-content:center;border:1px solid var(--border);}
  .about-photo-placeholder span{font-family:var(--heading);font-size:80px;letter-spacing:5px;color:rgba(255,255,255,.08);}
  .about-stats{display:flex;gap:0;margin-top:24px;}
  .a-stat{flex:1;text-align:center;padding:20px;border:1px solid var(--border);}
  .a-stat:first-child{border-right:none;}
  .a-stat-num{font-family:var(--heading);font-size:40px;color:var(--silver);line-height:1;}
  .a-stat-label{font-size:11px;color:var(--muted);letter-spacing:1px;margin-top:4px;}
  /* CONTACT */
  #contact{padding:120px 64px;position:relative;overflow:hidden;isolation:isolate;}
  #contact::before{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");background-size:300px;opacity:.03;z-index:-2;}
  #contact::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(192,192,192,.008) 4px,rgba(192,192,192,.008) 5px);z-index:-1;}
  .contact-inner{max-width:700px;}
  .contact-big{font-family:var(--heading);font-size:clamp(60px,8vw,120px);letter-spacing:2px;color:var(--white);line-height:.9;margin-bottom:32px;}
  .contact-big em{color:var(--silver);font-style:normal;}
  .contact-sub{font-size:15px;color:var(--dim);line-height:1.7;margin-bottom:48px;max-width:480px;}
  .contact-row{display:flex;gap:16px;flex-wrap:wrap;}
  .contact-btn{font-size:12px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--black);background:var(--silver);padding:18px 44px;text-decoration:none;transition:opacity .2s;cursor:none;}
  .contact-btn:hover{opacity:.85;}
  .contact-alt{font-size:12px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:var(--silver);border:1px solid var(--silver);padding:18px 44px;text-decoration:none;transition:background .2s,color .2s;cursor:none;}
  .contact-alt:hover{background:var(--silver);color:var(--black);}
  /* FOOTER */
  footer{border-top:1px solid var(--border);padding:28px 64px;display:flex;align-items:center;justify-content:space-between;background:var(--surface);}
  .f-copy{font-size:11.5px;color:var(--muted);letter-spacing:1px;}
  .f-links{display:flex;gap:24px;}
  .f-links a{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);text-decoration:none;cursor:none;transition:color .2s;}
  .f-links a:hover{color:var(--white);}
  /* REVEAL */
  .rev{opacity:0;transform:translateY(36px);transition:opacity .8s ease,transform .8s ease;}
  .rev.in{opacity:1;transform:translateY(0);}
  .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}.d5{transition-delay:.5s}
  @media(max-width:900px){
    nav{padding:20px 24px;}.nav-links{display:none;}
    #hero{padding:100px 24px 60px;}
    .hero-title{font-size:clamp(56px,14vw,120px);}
    #work,#services,#about,#contact{padding:80px 24px;}
    .cards-grid,.srv-grid{grid-template-columns:1fr;}
    .about-grid{grid-template-columns:1fr;gap:48px;}
    .quote-block{padding:60px 24px;}
    footer{padding:24px;flex-direction:column;gap:12px;text-align:center;}
    .section-header{flex-direction:column;align-items:flex-start;gap:8px;}.section-count{display:none;}
  }
  </style>
</head>
<body>
<div id="cur"></div>
<div id="cur-ring"></div>
<nav>
  <a class="nav-logo" href="/">S<em>R</em></a>
  <ul class="nav-links">
    <li><a href="#work">Work</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <a class="nav-cta" href="#contact">Let's Talk</a>
</nav>

<section id="hero">
  <div class="hero-inner">
    <p class="hero-tag">UI/UX Designer · Framer Developer · Based in India</p>
    <h1 class="hero-title">SAURABH<br/><em>RATHORE</em></h1>
    <p class="hero-sub">I design premium digital experiences — from wireframes to production-ready Framer builds.</p>
    <div class="hero-ctas">
      <a class="btn-primary" href="#work">View Work</a>
      <a class="btn-secondary" href="#contact">Get In Touch</a>
    </div>
  </div>
  <div class="hero-scroll"><span>Scroll</span><div class="scroll-line"></div></div>
</section>

<div class="marquee-wrap">
  <div class="marquee-track">
    <span class="marquee-item">UI Design</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Framer Development</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">UX Research</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Brand Identity</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Prototyping</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Product Design</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">UI Design</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Framer Development</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">UX Research</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Brand Identity</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Prototyping</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Product Design</span><span class="marquee-item"><em>·</em></span>
  </div>
</div>

<div class="quote-block">
  <p class="quote-text rev">"Design is not just what it looks like. <em>Design is how it works.</em>"</p>
</div>

<section id="work">
  <div class="section-header">
    <div>
      <p class="section-tag">Selected Work</p>
      <h2 class="section-title rev">PROJECTS</h2>
    </div>
    <span class="section-count">${String(visibleProjects.length).padStart(2, "0")}</span>
  </div>
  <div class="cards-grid">
    ${projectCards}
  </div>
</section>

<section id="services">
  <div class="section-header">
    <div>
      <p class="section-tag">What I Do</p>
      <h2 class="section-title rev">SERVICES</h2>
    </div>
  </div>
  <div class="srv-grid">
    ${serviceCards}
  </div>
</section>

<div class="quote-block" style="background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <p class="rev" style="font-style:italic;font-size:clamp(18px,2.2vw,26px);color:var(--dim);font-weight:300;max-width:700px;margin:0 auto;line-height:1.6;">
    "Good design is invisible. <em style="color:var(--silver);font-style:normal;">Great design</em> is unforgettable."
  </p>
</div>

<section id="about">
  <div class="about-grid">
    <div>
      <p class="about-kicker">About Me</p>
      <h2 class="about-name rev">SAURABH<br/><em>RATHORE</em></h2>
      <p class="about-bio rev">${profile.bio}</p>
      <div class="about-skills rev">${skillTags}</div>
      <div class="about-links rev">
        ${profile.linkedin ? `<a class="about-link" href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
        ${profile.behance ? `<a class="about-link" href="${profile.behance}" target="_blank" rel="noopener">Behance</a>` : ""}
        ${profile.email ? `<a class="about-link" href="mailto:${profile.email}">Email</a>` : ""}
      </div>
    </div>
    <div class="about-right rev d1">
      <div class="about-photo-placeholder"><span>SR</span></div>
      <div class="about-stats">
        <div class="a-stat"><div class="a-stat-num">${visibleProjects.length}+</div><div class="a-stat-label">Projects</div></div>
        <div class="a-stat"><div class="a-stat-num">3+</div><div class="a-stat-label">Years Exp</div></div>
      </div>
    </div>
  </div>
</section>

<section id="contact">
  <div class="contact-inner">
    <p class="section-tag">Let's Work Together</p>
    <h2 class="contact-big rev">LET'S<br/><em>TALK</em></h2>
    <p class="contact-sub rev">Have a project in mind? I'd love to hear about it. Let's create something exceptional together.</p>
    <div class="contact-row rev d1">
      ${profile.email ? `<a class="contact-btn" href="mailto:${profile.email}">Send an Email</a>` : `<a class="contact-btn" href="mailto:saurabh@example.com">Send an Email</a>`}
      ${profile.linkedin ? `<a class="contact-alt" href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
    </div>
  </div>
</section>

<footer>
  <span class="f-copy">© 2025 Saurabh Rathore</span>
  <div class="f-links">
    ${profile.linkedin ? `<a href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
    ${profile.behance ? `<a href="${profile.behance}" target="_blank" rel="noopener">Behance</a>` : ""}
  </div>
</footer>

<script>
${cursorJS}
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in');});},{threshold:0.1});
document.querySelectorAll('.rev').forEach(function(el){obs.observe(el);});
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){var href=a.getAttribute('href');if(!href||href==='#')return;var t=document.querySelector(href);if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}});
});
</script>
</body>
</html>`;
}

export function caseStudyPage(p: Project, nextProject?: Project): string {
  const researchCards = p.research.map(r => `
    <div class="r-card rev">
      <div class="r-num">${r.number}</div>
      <h3 class="r-title">${r.heading}</h3>
      <p class="r-desc">${r.description}</p>
    </div>`).join("");

  const solutionRows = p.solution_features.map((f, i) => {
    const isEven = i % 2 === 0;
    const mockup = `<div class="sol-mockup"><span>${f.title.toUpperCase().slice(0, 12)}</span></div>`;
    const text = `<div class="sol-text"><h3>${f.title.toUpperCase()}</h3><p>${f.description}</p></div>`;
    return `<div class="solution-row rev d${i % 3}">${isEven ? `${text}${mockup}` : `${mockup}${text}`}</div>`;
  }).join("");

  const resultCards = p.results.map((r, i) => `
    <div class="stat-card rev d${i}">
      <div class="stat-num">${r.number}</div>
      <div class="stat-label">${r.label}</div>
    </div>`).join("");

  const workedItems = p.learnings.worked.map(w => `<li><i class="li-icon">✓</i>${w}</li>`).join("");
  const improveItems = p.learnings.improve.map(w => `<li><i class="li-icon">→</i>${w}</li>`).join("");
  const myRoleItems = p.overview.my_role.map(r => `<li>${r}</li>`).join("");
  const toolsPills = p.tools.map(t => `<div class="cs-pill"><span>·</span>${t}</div>`).join("");

  const nextBanner = nextProject
    ? `<a class="next-banner" href="/project/${nextProject.slug}">
        <div><div class="next-lbl">Next Project →</div><div class="next-name">${nextProject.title.toUpperCase()}</div></div>
        <div class="next-arrow">→</div>
      </a>`
    : `<a class="next-banner" href="/#work">
        <div><div class="next-lbl">Back to</div><div class="next-name">ALL WORK</div></div>
        <div class="next-arrow">→</div>
      </a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${p.title} — Case Study · Saurabh Rathore</title>
  <meta name="description" content="${p.tagline}" />
  ${fonts}
  <style>
  ${sharedCSS}
  nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:22px 64px;display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,.88);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);}
  .nav-logo{font-family:var(--heading);font-size:30px;letter-spacing:6px;color:var(--white);text-decoration:none;cursor:none;}
  .nav-logo em{color:var(--silver);font-style:normal;}
  .nav-links{display:flex;gap:44px;list-style:none;}
  .nav-links a{color:var(--dim);text-decoration:none;font-size:11px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;transition:color .2s;cursor:none;}
  .nav-links a:hover{color:var(--white);}
  .back-btn{position:fixed;top:82px;left:64px;z-index:999;font-size:13px;color:var(--silver);text-decoration:none;letter-spacing:1px;display:flex;align-items:center;gap:8px;cursor:none;transition:color .2s;opacity:.7;}
  .back-btn:hover{color:var(--white);opacity:1;}
  #cs-hero{min-height:70vh;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;padding:140px 64px 80px;position:relative;overflow:hidden;isolation:isolate;}
  #cs-hero::before{content:'';position:absolute;inset:0;z-index:-1;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");background-size:300px;opacity:.04;pointer-events:none;}
  #cs-hero::after{content:'';position:absolute;inset:0;z-index:-1;background-image:radial-gradient(circle,#2A2A2A 1px,transparent 1px);background-size:28px 28px;opacity:.4;pointer-events:none;}
  .cs-label{font-size:12px;letter-spacing:.2em;color:var(--silver);text-transform:uppercase;margin-bottom:16px;}
  .cs-title{font-family:var(--heading);font-size:8vw;line-height:.9;color:var(--white);letter-spacing:2px;margin-bottom:20px;}
  .cs-tagline{font-size:20px;color:var(--dim);font-weight:300;margin-bottom:36px;line-height:1.4;}
  .cs-pills{display:flex;flex-wrap:wrap;gap:8px;}
  .cs-pill{font-size:13px;color:var(--silver);background:var(--border);border:1px solid var(--silver);padding:6px 16px;letter-spacing:.5px;}
  .cs-pill span{color:var(--muted);margin-right:6px;font-size:10px;text-transform:uppercase;letter-spacing:2px;}
  .cs-mockup{aspect-ratio:4/5;background:${p.thumbnail_gradient};display:flex;align-items:center;justify-content:center;border:1px solid var(--border);position:relative;overflow:hidden;}
  .cs-mockup::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 38px,rgba(192,192,192,.014) 38px,rgba(192,192,192,.014) 39px);}
  .cs-mockup-label{font-family:var(--heading);font-size:48px;letter-spacing:5px;color:rgba(255,255,255,.15);}
  .cs-section{padding:100px 64px;}
  .cs-section-alt{padding:100px 64px;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
  .cs-s-tag{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--muted);margin-bottom:12px;}
  .cs-s-head{font-family:var(--heading);font-size:clamp(36px,5vw,60px);letter-spacing:2px;color:var(--white);margin-bottom:48px;line-height:1;}
  .overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;}
  .ov-col h3{font-family:var(--heading);font-size:28px;letter-spacing:2px;color:var(--white);margin-bottom:20px;}
  .ov-col p{font-size:15px;color:var(--dim);line-height:1.9;margin-bottom:16px;}
  .ov-col ul{list-style:none;display:flex;flex-direction:column;gap:12px;}
  .ov-col li{font-size:14px;color:var(--dim);padding-left:20px;position:relative;line-height:1.6;}
  .ov-col li::before{content:'—';position:absolute;left:0;color:var(--silver);}
  .research-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;}
  .r-card{background:var(--surface);border:1px solid var(--border);padding:40px 36px;transition:border-color .3s;cursor:none;}
  .r-card:hover{border-color:var(--silver);}
  .r-num{font-family:var(--heading);font-size:48px;color:var(--silver);line-height:1;margin-bottom:20px;opacity:.6;}
  .r-title{font-family:var(--heading);font-size:22px;letter-spacing:2px;color:var(--white);margin-bottom:12px;}
  .r-desc{font-size:13.5px;color:var(--dim);line-height:1.7;}
  .solution-row{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;margin-bottom:80px;}
  .solution-row:last-child{margin-bottom:0;}
  .sol-text h3{font-family:var(--heading);font-size:32px;letter-spacing:2px;color:var(--white);margin-bottom:20px;line-height:1;}
  .sol-text p{font-size:14px;color:var(--dim);line-height:1.85;}
  .sol-mockup{aspect-ratio:4/3;background:${p.thumbnail_gradient};display:flex;align-items:center;justify-content:center;border:1px solid var(--border);position:relative;overflow:hidden;}
  .sol-mockup::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 38px,rgba(192,192,192,.014) 38px,rgba(192,192,192,.014) 39px);}
  .sol-mockup span{font-family:var(--heading);font-size:28px;letter-spacing:4px;color:rgba(255,255,255,.12);}
  .results-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;}
  .stat-card{background:var(--surface);border:1px solid var(--border);padding:48px 40px;text-align:center;transition:border-color .3s;}
  .stat-card:hover{border-color:var(--silver);}
  .stat-num{font-family:var(--heading);font-size:72px;color:var(--silver);line-height:1;margin-bottom:12px;}
  .stat-label{font-size:14px;color:var(--dim);letter-spacing:.5px;}
  .learnings-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;}
  .learn-col h3{font-family:var(--heading);font-size:24px;letter-spacing:2px;color:var(--white);margin-bottom:28px;}
  .learn-col ul{list-style:none;display:flex;flex-direction:column;gap:16px;}
  .learn-col li{font-size:14px;color:var(--dim);padding-left:28px;position:relative;line-height:1.65;}
  .learn-col li .li-icon{position:absolute;left:0;color:var(--silver);font-style:normal;}
  .next-banner{margin:0 64px 64px;border:1px solid var(--border);background:var(--surface);padding:48px 56px;display:flex;align-items:center;justify-content:space-between;cursor:none;text-decoration:none;transition:border-color .3s,background .25s;}
  .next-banner:hover{border-color:var(--silver);background:#080808;}
  .next-lbl{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:12px;}
  .next-name{font-family:var(--heading);font-size:48px;letter-spacing:2px;color:var(--white);line-height:1;}
  .next-arrow{width:56px;height:56px;border-radius:50%;border:1px solid var(--silver);display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--silver);flex-shrink:0;transition:background .2s,color .2s;}
  .next-banner:hover .next-arrow{background:var(--silver);color:var(--black);}
  footer{border-top:1px solid var(--border);padding:28px 64px;display:flex;align-items:center;justify-content:space-between;background:var(--surface);}
  .f-copy{font-size:11.5px;color:var(--muted);letter-spacing:1px;}
  .f-links{display:flex;gap:24px;}
  .f-links a{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);text-decoration:none;cursor:none;transition:color .2s;}
  .f-links a:hover{color:var(--white);}
  .rev{opacity:0;transform:translateY(36px);transition:opacity .8s ease,transform .8s ease;}
  .rev.in{opacity:1;transform:translateY(0);}
  .d0{transition-delay:.0s}.d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}
  @media(max-width:900px){
    nav{padding:20px 24px;}.nav-links{display:none;}
    .back-btn{left:24px;top:76px;}
    #cs-hero{grid-template-columns:1fr;padding:120px 24px 60px;min-height:auto;}
    .cs-title{font-size:14vw;}
    .cs-section,.cs-section-alt{padding:64px 24px;}
    .overview-grid,.research-grid,.results-grid,.learnings-grid{grid-template-columns:1fr;}
    .solution-row{grid-template-columns:1fr;gap:32px;}
    .next-banner{margin:0 24px 40px;padding:32px 28px;}
    footer{padding:24px;flex-direction:column;gap:12px;text-align:center;}
  }
  </style>
</head>
<body>
<div id="cur"></div><div id="cur-ring"></div>
<nav>
  <a class="nav-logo" href="/">S<em>R</em></a>
  <ul class="nav-links">
    <li><a href="/#work">Work</a></li><li><a href="/#about">About</a></li>
    <li><a href="/#services">Services</a></li><li><a href="/#contact">Contact</a></li>
  </ul>
</nav>
<a class="back-btn" href="/#work">← Back to Work</a>

<section id="cs-hero">
  <div>
    <p class="cs-label">Case Study</p>
    <h1 class="cs-title">${p.title.toUpperCase()}</h1>
    <p class="cs-tagline">${p.tagline}</p>
    <div class="cs-pills">
      <div class="cs-pill"><span>Role</span>${p.role}</div>
      <div class="cs-pill"><span>Timeline</span>${p.timeline}</div>
      <div class="cs-pill"><span>Type</span>${p.type}</div>
      ${toolsPills}
    </div>
  </div>
  <div class="cs-mockup"><span class="cs-mockup-label">${p.title.toUpperCase()}</span></div>
</section>

<section class="cs-section">
  <p class="cs-s-tag">01 — Overview</p>
  <h2 class="cs-s-head">The Brief</h2>
  <div class="overview-grid">
    <div class="ov-col rev"><h3>The Challenge</h3><p>${p.overview.challenge}</p></div>
    <div class="ov-col rev d1"><h3>My Role</h3><ul>${myRoleItems}</ul></div>
  </div>
</section>

<section class="cs-section-alt">
  <p class="cs-s-tag">02 — Discovery</p>
  <h2 class="cs-s-head">Research &amp; Discovery</h2>
  <div class="research-grid">${researchCards}</div>
</section>

<section class="cs-section-alt" style="background:var(--black);border-top:none;">
  <p class="cs-s-tag">03 — Execution</p>
  <h2 class="cs-s-head">The Solution</h2>
  ${solutionRows}
</section>

<section class="cs-section">
  <p class="cs-s-tag">04 — Outcome</p>
  <h2 class="cs-s-head">Results &amp; Impact</h2>
  <div class="results-grid">${resultCards}</div>
</section>

<section class="cs-section-alt">
  <p class="cs-s-tag">05 — Reflection</p>
  <h2 class="cs-s-head">What I Learned</h2>
  <div class="learnings-grid">
    <div class="learn-col rev"><h3>WHAT WORKED</h3><ul>${workedItems}</ul></div>
    <div class="learn-col rev d1"><h3>WHAT I'D IMPROVE</h3><ul>${improveItems}</ul></div>
  </div>
</section>

${nextBanner}

<footer>
  <span class="f-copy">© 2025 Saurabh Rathore</span>
  <div class="f-links"><a href="/#work">Work</a><a href="/#contact">Contact</a></div>
</footer>

<script>
${cursorJS}
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in');});},{threshold:0.1});
document.querySelectorAll('.rev').forEach(function(el){obs.observe(el);});
</script>
</body>
</html>`;
}
