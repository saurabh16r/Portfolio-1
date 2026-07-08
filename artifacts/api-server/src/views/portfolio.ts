import type { Project, Service, Profile, SiteSettings } from "../lib/db.js";

const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />`;

const sharedCSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#050505;--surface:#0D0D0D;--card:#111111;
  --white:#FFFFFF;--text:rgba(255,255,255,.72);--dim:rgba(255,255,255,.36);--muted:rgba(255,255,255,.16);
  --border:rgba(255,255,255,.08);--border-hover:rgba(255,255,255,.2);
  --heading:'Bebas Neue',sans-serif;--body:'Inter',sans-serif;
}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:var(--body);font-weight:400;line-height:1.6;overflow-x:hidden;cursor:none;}
::-webkit-scrollbar{width:2px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);}
::selection{background:#fff;color:#000;}

/* LOADER */
#loader{position:fixed;inset:0;z-index:99999;background:var(--bg);display:flex;align-items:center;justify-content:center;transition:opacity .7s ease,visibility .7s ease;}
#loader.out{opacity:0;visibility:hidden;}
.loader-logo{font-family:var(--heading);font-size:clamp(48px,8vw,96px);letter-spacing:12px;color:var(--white);animation:loaderPulse 1.2s ease-in-out;}
@keyframes loaderPulse{0%{opacity:0;transform:scale(.94) translateY(12px);}60%{opacity:1;transform:scale(1) translateY(0);}100%{opacity:1;transform:scale(1) translateY(0);}}

/* SCROLL PROGRESS */
#progress{position:fixed;top:0;left:0;height:1px;background:rgba(255,255,255,.5);z-index:10001;width:0%;transition:width .1s linear;}

/* CURSOR */
#cur{position:fixed;width:8px;height:8px;background:#fff;border-radius:50%;pointer-events:none;z-index:10000;transform:translate(-50%,-50%);transition:width .2s,height .2s,opacity .2s;mix-blend-mode:difference;will-change:transform;}
#cur-ring{position:fixed;width:36px;height:36px;border:1px solid rgba(255,255,255,.3);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .25s,height .25s,border-color .25s;will-change:transform;}
#cur-label{position:fixed;font-family:var(--body);font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:#000;background:#fff;padding:4px 10px;border-radius:2px;pointer-events:none;z-index:10000;opacity:0;transition:opacity .2s;transform:translate(-50%,-50%);white-space:nowrap;}

/* GRAIN */
.grain{position:fixed;inset:-50%;width:200%;height:200%;opacity:.045;pointer-events:none;z-index:9998;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E");animation:grainMove 8s steps(10) infinite;}
@keyframes grainMove{0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-1%)}20%{transform:translate(1%,2%)}30%{transform:translate(-1%,1%)}40%{transform:translate(2%,-2%)}50%{transform:translate(-2%,2%)}60%{transform:translate(1%,-1%)}70%{transform:translate(-1%,2%)}80%{transform:translate(2%,1%)}90%{transform:translate(-1%,-2%)}}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:24px 64px;display:flex;align-items:center;justify-content:space-between;transition:padding .4s ease,background .4s ease,backdrop-filter .4s ease,border-color .4s ease;border-bottom:1px solid transparent;}
nav.scrolled{padding:16px 64px;background:rgba(5,5,5,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom-color:var(--border);}
.nav-logo{font-family:var(--heading);font-size:28px;letter-spacing:8px;color:var(--white);text-decoration:none;cursor:none;}
.nav-logo em{color:rgba(255,255,255,.4);font-style:normal;}
.nav-links{display:flex;gap:40px;list-style:none;}
.nav-links a{color:var(--dim);text-decoration:none;font-size:11px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;transition:color .25s;cursor:none;position:relative;}
.nav-links a::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:var(--white);transition:width .3s ease;}
.nav-links a:hover,.nav-links a.active{color:var(--white);}
.nav-links a:hover::after,.nav-links a.active::after{width:100%;}
.nav-cta{font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--bg);background:var(--white);padding:10px 24px;text-decoration:none;transition:opacity .2s;cursor:none;border-radius:1px;}
.nav-cta:hover{opacity:.88;}

/* HERO */
#hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 64px 80px;position:relative;overflow:hidden;isolation:isolate;}
.hero-grid{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px);background-size:32px 32px;pointer-events:none;z-index:0;}
.hero-glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.04) 0%,transparent 70%);pointer-events:none;z-index:0;top:50%;left:50%;transform:translate(-50%,-50%);animation:glowPulse 6s ease-in-out infinite;}
@keyframes glowPulse{0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.08);}}
.hero-spotlight{position:absolute;inset:0;background:radial-gradient(600px circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.04),transparent 40%);pointer-events:none;z-index:1;}
.hero-inner{position:relative;z-index:2;text-align:center;max-width:1100px;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:10px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:var(--dim);background:rgba(255,255,255,.04);border:1px solid var(--border);padding:8px 18px;border-radius:100px;margin-bottom:40px;}
.hero-badge-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;animation:badgePulse 2s ease-in-out infinite;}
@keyframes badgePulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(74,222,128,.4);}50%{opacity:.8;box-shadow:0 0 0 6px rgba(74,222,128,0);}}
.hero-line{display:block;overflow:hidden;}
.hero-line-inner{display:block;transform:translateY(100%);opacity:0;animation:lineReveal .9s cubic-bezier(.16,1,.3,1) forwards;}
.hero-title{font-family:var(--heading);font-size:clamp(80px,12vw,172px);line-height:.88;letter-spacing:4px;color:var(--white);margin-bottom:36px;}
.hero-title .dim-name{color:rgba(255,255,255,.28);}
.hl1{animation-delay:.15s;}
.hl2{animation-delay:.35s;}
@keyframes lineReveal{to{transform:translateY(0);opacity:1;}}
.hero-sub{font-size:clamp(15px,1.6vw,18px);color:var(--dim);font-weight:300;max-width:500px;margin:0 auto 52px;line-height:1.7;opacity:0;animation:fadeUp .8s .6s ease forwards;}
@keyframes fadeUp{to{opacity:1;transform:translateY(0);}from{opacity:0;transform:translateY(16px);}}
.hero-ctas{display:flex;gap:16px;justify-content:center;opacity:0;animation:fadeUp .8s .75s ease forwards;}
.btn-mag{position:relative;display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;padding:16px 40px;text-decoration:none;overflow:hidden;cursor:none;border-radius:1px;transition:transform .2s ease;}
.btn-primary-mag{color:var(--bg);background:var(--white);}
.btn-primary-mag::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,.08);opacity:0;transition:opacity .2s;}
.btn-primary-mag:hover::after{opacity:1;}
.btn-secondary-mag{color:var(--white);border:1px solid var(--border-hover);}
.btn-secondary-mag::before{content:'';position:absolute;inset:0;background:var(--white);transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.16,1,.3,1);}
.btn-secondary-mag:hover::before{transform:scaleX(1);}
.btn-secondary-mag:hover{color:var(--bg);}
.btn-secondary-mag span{position:relative;z-index:1;}
.btn-arr{transition:transform .3s ease;display:inline-block;}
.btn-primary-mag:hover .btn-arr,.btn-secondary-mag:hover .btn-arr{transform:translateX(4px);}
.hero-scroll{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;animation:fadeUp .8s 1s ease forwards;z-index:2;}
.hero-scroll span{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--muted);}
.scroll-line{width:1px;height:48px;background:linear-gradient(to bottom,rgba(255,255,255,.2),transparent);animation:scrollPulse 2.4s ease-in-out infinite;}
@keyframes scrollPulse{0%{transform:scaleY(0);transform-origin:top;}50%{transform:scaleY(1);transform-origin:top;}51%{transform:scaleY(1);transform-origin:bottom;}100%{transform:scaleY(0);transform-origin:bottom;}}

/* MARQUEE */
.marquee-wrap{border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--surface);padding:18px 0;overflow:hidden;display:flex;user-select:none;}
.marquee-track{display:flex;animation:marqueeRoll 30s linear infinite;white-space:nowrap;}
.marquee-item{font-family:var(--heading);font-size:14px;letter-spacing:5px;color:rgba(255,255,255,.2);text-transform:uppercase;padding:0 36px;}
.marquee-item em{color:rgba(255,255,255,.55);font-style:normal;}
@keyframes marqueeRoll{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* QUOTE */
.quote-block{padding:80px 64px;text-align:center;position:relative;overflow:hidden;}
.quote-text{font-family:var(--heading);font-size:clamp(28px,4.5vw,60px);letter-spacing:2px;color:rgba(255,255,255,.85);line-height:1.12;max-width:860px;margin:0 auto;}
.quote-text em{color:var(--white);font-style:normal;}

/* WORK */
#work{padding:120px 64px;background:var(--surface);border-top:1px solid var(--border);}
.section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:72px;}
.section-tag{font-size:9px;letter-spacing:5px;text-transform:uppercase;color:var(--muted);margin-bottom:12px;}
.section-title{font-family:var(--heading);font-size:clamp(44px,7vw,88px);letter-spacing:2px;color:var(--white);line-height:.95;}
.section-count{font-family:var(--heading);font-size:88px;color:rgba(255,255,255,.06);line-height:1;letter-spacing:-2px;}
.cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);}

/* PROJECT CARD */
.card{background:var(--card);cursor:none;position:relative;overflow:hidden;transition:transform .4s cubic-bezier(.16,1,.3,1);}
.card:hover{transform:translateY(-4px);}
.card-spotlight{position:absolute;inset:0;background:radial-gradient(300px circle at var(--cx,50%) var(--cy,50%),rgba(255,255,255,.06),transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none;z-index:1;}
.card:hover .card-spotlight{opacity:1;}
.card-thumb{aspect-ratio:4/3;position:relative;overflow:hidden;}
.card-thumb-img{position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .6s cubic-bezier(.16,1,.3,1);}
.card:hover .card-thumb-img{transform:scale(1.06);}
.card-thumb-overlay{position:absolute;inset:0;background:rgba(5,5,5,.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;z-index:2;}
.card:hover .card-thumb-overlay{opacity:1;}
.card-thumb-label{font-family:var(--heading);font-size:14px;letter-spacing:6px;color:rgba(255,255,255,.9);text-transform:uppercase;}
.card-body{padding:28px 28px 36px;position:relative;z-index:2;}
.card-tag{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:12px;display:block;transition:color .25s;}
.card:hover .card-tag{color:rgba(255,255,255,.5);}
.card-name{font-family:var(--heading);font-size:34px;letter-spacing:2px;color:var(--white);margin-bottom:8px;line-height:1;}
.card-desc{font-size:13px;color:var(--dim);line-height:1.65;margin-bottom:24px;}
.card-link{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.4);text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:color .25s;}
.card-link-arr{transition:transform .3s ease;}
.card:hover .card-link{color:var(--white);}
.card:hover .card-link-arr{transform:translateX(4px);}

/* SERVICES */
#services{padding:120px 64px;position:relative;overflow:hidden;isolation:isolate;}
.srv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);}
.srv-card{background:var(--bg);padding:52px 44px;cursor:none;position:relative;overflow:hidden;transition:background .35s ease;}
.srv-card::after{content:'';position:absolute;inset:0;background:radial-gradient(400px circle at var(--sx,50%) var(--sy,50%),rgba(255,255,255,.04),transparent 60%);opacity:0;transition:opacity .35s;pointer-events:none;}
.srv-card:hover{background:var(--card);}
.srv-card:hover::after{opacity:1;}
.srv-num{font-family:var(--heading);font-size:88px;color:rgba(255,255,255,.04);line-height:1;position:absolute;top:20px;right:28px;letter-spacing:-2px;}
.srv-icon{font-size:24px;margin-bottom:32px;position:relative;z-index:1;}
.srv-title{font-family:var(--heading);font-size:30px;letter-spacing:3px;color:var(--white);margin-bottom:16px;position:relative;z-index:1;}
.srv-desc{font-size:14px;color:var(--dim);line-height:1.8;margin-bottom:28px;position:relative;z-index:1;}
.srv-price{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.35);border-top:1px solid var(--border);padding-top:20px;position:relative;z-index:1;}

/* ABOUT */
#about{padding:120px 64px;background:var(--surface);border-top:1px solid var(--border);position:relative;}
.about-grid{display:grid;grid-template-columns:1.1fr 0.9fr;gap:100px;align-items:center;}
.about-kicker{font-size:9px;letter-spacing:5px;text-transform:uppercase;color:var(--muted);margin-bottom:20px;}
.about-name{font-family:var(--heading);font-size:clamp(52px,6.5vw,88px);letter-spacing:3px;color:var(--white);line-height:.92;margin-bottom:32px;}
.about-name em{color:rgba(255,255,255,.28);font-style:normal;}
.about-bio{font-size:15px;color:var(--dim);line-height:1.9;margin-bottom:40px;max-width:520px;}
.about-skills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:44px;}
.skill-tag{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.45);border:1px solid var(--border);padding:7px 16px;transition:border-color .2s,color .2s;}
.skill-tag:hover{border-color:var(--border-hover);color:rgba(255,255,255,.8);}
.about-links{display:flex;gap:24px;}
.about-link{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--dim);text-decoration:none;position:relative;cursor:none;transition:color .25s;}
.about-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:var(--white);transition:width .3s ease;}
.about-link:hover{color:var(--white);}
.about-link:hover::after{width:100%;}
.about-right{position:relative;}
.about-photo-placeholder{width:100%;aspect-ratio:3/4;background:linear-gradient(160deg,#111 0%,#0d0d0d 100%);display:flex;align-items:center;justify-content:center;border:1px solid var(--border);position:relative;overflow:hidden;}
.about-photo-placeholder::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px);background-size:24px 24px;}
.about-photo-placeholder span{font-family:var(--heading);font-size:100px;letter-spacing:6px;color:rgba(255,255,255,.06);}
.about-stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin-top:1px;background:var(--border);}
.a-stat{background:var(--card);padding:24px 28px;}
.a-stat-num{font-family:var(--heading);font-size:48px;color:var(--white);line-height:1;margin-bottom:4px;}
.a-stat-label{font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;}

/* CONTACT */
#contact{padding:140px 64px;position:relative;overflow:hidden;isolation:isolate;}
#contact::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.025) 1px,transparent 1px);background-size:32px 32px;pointer-events:none;z-index:0;}
.contact-glow{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.025) 0%,transparent 70%);pointer-events:none;z-index:0;top:50%;left:20%;transform:translate(-50%,-50%);}
.contact-inner{position:relative;z-index:1;max-width:860px;}
.contact-big{font-family:var(--heading);font-size:clamp(72px,10vw,148px);letter-spacing:2px;color:var(--white);line-height:.88;margin-bottom:36px;}
.contact-big em{color:rgba(255,255,255,.28);font-style:normal;}
.contact-sub{font-size:16px;color:var(--dim);line-height:1.75;margin-bottom:52px;max-width:440px;font-weight:300;}
.contact-avail{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:32px;}
.avail-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;animation:badgePulse 2s ease-in-out infinite;}
.contact-row{display:flex;gap:16px;flex-wrap:wrap;}
.contact-btn{font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--bg);background:var(--white);padding:18px 48px;text-decoration:none;cursor:none;border-radius:1px;transition:opacity .2s;}
.contact-btn:hover{opacity:.9;}
.contact-alt{font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:var(--white);border:1px solid var(--border-hover);padding:18px 48px;text-decoration:none;cursor:none;border-radius:1px;position:relative;overflow:hidden;}
.contact-alt::before{content:'';position:absolute;inset:0;background:var(--white);transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.16,1,.3,1);}
.contact-alt:hover::before{transform:scaleX(1);}
.contact-alt:hover{color:var(--bg);}
.contact-alt span{position:relative;z-index:1;}

/* FOOTER */
footer{border-top:1px solid var(--border);padding:28px 64px;display:flex;align-items:center;justify-content:space-between;background:var(--surface);}
.f-copy{font-size:11px;color:var(--muted);letter-spacing:1px;}
.f-links{display:flex;gap:28px;}
.f-links a{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);text-decoration:none;cursor:none;transition:color .2s;}
.f-links a:hover{color:var(--white);}

/* PROCESS */
#process{padding:120px 64px;background:var(--bg);border-top:1px solid var(--border);position:relative;overflow:hidden;}
#process::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0;}
.process-inner{position:relative;z-index:1;}
.process-steps{margin-top:72px;display:flex;flex-direction:column;gap:0;}
.process-step{display:grid;grid-template-columns:80px 1fr 1fr;gap:48px;align-items:start;padding:48px 0;border-top:1px solid var(--border);position:relative;cursor:default;}
.process-step:last-child{border-bottom:1px solid var(--border);}
.process-step::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:rgba(255,255,255,.2);transition:width .6s cubic-bezier(.16,1,.3,1);}
.process-step:hover::after{width:100%;}
.ps-num{font-family:var(--heading);font-size:72px;color:rgba(255,255,255,.06);line-height:1;letter-spacing:-2px;transition:color .4s ease;}
.process-step:hover .ps-num{color:rgba(255,255,255,.14);}
.ps-left{display:flex;flex-direction:column;gap:12px;}
.ps-tag{font-size:9px;letter-spacing:5px;text-transform:uppercase;color:var(--muted);transition:color .3s;}
.process-step:hover .ps-tag{color:rgba(255,255,255,.4);}
.ps-title{font-family:var(--heading);font-size:clamp(32px,3.5vw,48px);letter-spacing:2px;color:var(--white);line-height:.95;transition:letter-spacing .4s ease;}
.process-step:hover .ps-title{letter-spacing:3px;}
.ps-right{padding-top:8px;}
.ps-desc{font-size:14px;color:var(--dim);line-height:1.85;max-width:420px;}
.ps-deliverables{margin-top:20px;display:flex;flex-wrap:wrap;gap:6px;}
.ps-chip{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);border:1px solid var(--border);padding:5px 12px;border-radius:100px;transition:border-color .3s,color .3s;}
.process-step:hover .ps-chip{border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.5);}
@media(max-width:900px){
  #process{padding:80px 24px;}
  .process-step{grid-template-columns:48px 1fr;grid-template-rows:auto auto;gap:16px 24px;}
  .ps-num{font-size:48px;}
  .ps-right{grid-column:2;}
}

/* BACK TO TOP */
#btt{position:fixed;bottom:40px;right:40px;z-index:999;width:44px;height:44px;border:1px solid var(--border);background:var(--card);display:flex;align-items:center;justify-content:center;cursor:none;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s,transform .3s,border-color .3s;border-radius:1px;transform:translateY(12px);}
#btt.show{opacity:1;visibility:visible;transform:translateY(0);}
#btt:hover{border-color:var(--border-hover);}
#btt svg{width:16px;height:16px;stroke:var(--white);stroke-width:1.5;fill:none;}

/* REVEAL */
.rev{opacity:0;transform:translateY(32px);filter:blur(4px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1),filter .9s cubic-bezier(.16,1,.3,1);}
.rev.in{opacity:1;transform:translateY(0);filter:blur(0);}
.d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}.d5{transition-delay:.5s}
.stagger > *{opacity:0;transform:translateY(24px);filter:blur(2px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1),filter .7s cubic-bezier(.16,1,.3,1);}
.stagger.in > *:nth-child(1){opacity:1;transform:none;filter:none;transition-delay:.05s;}
.stagger.in > *:nth-child(2){opacity:1;transform:none;filter:none;transition-delay:.15s;}
.stagger.in > *:nth-child(3){opacity:1;transform:none;filter:none;transition-delay:.25s;}
.stagger.in > *:nth-child(4){opacity:1;transform:none;filter:none;transition-delay:.35s;}
.stagger.in > *:nth-child(5){opacity:1;transform:none;filter:none;transition-delay:.45s;}
.stagger.in > *:nth-child(n+6){opacity:1;transform:none;filter:none;transition-delay:.55s;}

/* PAGE TRANSITION */
#pt-overlay{position:fixed;inset:0;background:var(--bg);z-index:99998;transform:scaleY(0);transform-origin:bottom;pointer-events:none;}

@media(max-width:900px){
  nav{padding:18px 24px;}.nav-links{display:none;}
  nav.scrolled{padding:14px 24px;}
  #hero{padding:100px 24px 60px;}
  .hero-title{font-size:clamp(64px,16vw,120px);}
  .hero-glow,.hero-spotlight{display:none;}
  .grain{display:none;}
  #work,#services,#about,#contact{padding:80px 24px;}
  .cards-grid,.srv-grid{grid-template-columns:1fr;}
  .about-grid{grid-template-columns:1fr;gap:52px;}
  .quote-block{padding:56px 24px;}
  footer{padding:24px;flex-direction:column;gap:12px;text-align:center;}
  .section-header{flex-direction:column;align-items:flex-start;gap:8px;}.section-count{display:none;}
  #btt{bottom:24px;right:24px;}
  #cur,#cur-ring,#cur-label{display:none;}
  body{cursor:auto;}a,button{cursor:pointer;}
  .about-stats{grid-template-columns:1fr 1fr;}
}
@media(prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important;}
  .rev{opacity:1;transform:none;filter:none;}
  .hero-line-inner{transform:none;opacity:1;}
  .hero-sub,.hero-ctas,.hero-scroll{opacity:1;}
  #loader{display:none;}
}
`;

const premiumJS = `
// LOADER
(function(){
  var l=document.getElementById('loader');
  if(!l)return;
  window.addEventListener('load',function(){
    setTimeout(function(){l.classList.add('out');},400);
  });
  setTimeout(function(){l.classList.add('out');},1800);
})();

// SCROLL PROGRESS
(function(){
  var bar=document.getElementById('progress');
  if(!bar)return;
  function upd(){
    var s=window.scrollY,h=document.body.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?Math.min(s/h,1)*100:0)+'%';
  }
  window.addEventListener('scroll',upd,{passive:true});
})();

// CURSOR
(function(){
  var cur=document.getElementById('cur'),ring=document.getElementById('cur-ring'),lbl=document.getElementById('cur-label');
  if(!cur||!ring)return;
  var mx=-300,my=-300,rx=-300,ry=-300,raf;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
  function tick(){
    cur.style.left=mx+'px';cur.style.top=my+'px';
    rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    if(lbl){lbl.style.left=(mx+28)+'px';lbl.style.top=(my-16)+'px';}
    raf=requestAnimationFrame(tick);
  }
  tick();
  document.querySelectorAll('a,button').forEach(function(el){
    el.addEventListener('mouseenter',function(){
      cur.style.width='14px';cur.style.height='14px';
      ring.style.width='52px';ring.style.height='52px';ring.style.borderColor='rgba(255,255,255,.5)';
    });
    el.addEventListener('mouseleave',function(){
      cur.style.width='8px';cur.style.height='8px';
      ring.style.width='36px';ring.style.height='36px';ring.style.borderColor='rgba(255,255,255,.3)';
      if(lbl)lbl.style.opacity='0';
    });
  });
  document.querySelectorAll('.card').forEach(function(el){
    el.addEventListener('mouseenter',function(){
      if(lbl){lbl.textContent='View Project';lbl.style.opacity='1';}
      ring.style.width='80px';ring.style.height='80px';
    });
    el.addEventListener('mouseleave',function(){
      if(lbl)lbl.style.opacity='0';
      ring.style.width='36px';ring.style.height='36px';
    });
  });
})();

// HERO MOUSE SPOTLIGHT
(function(){
  var hero=document.getElementById('hero');
  if(!hero)return;
  hero.addEventListener('mousemove',function(e){
    var r=hero.getBoundingClientRect();
    var x=((e.clientX-r.left)/r.width*100).toFixed(1);
    var y=((e.clientY-r.top)/r.height*100).toFixed(1);
    hero.style.setProperty('--mx',x+'%');
    hero.style.setProperty('--my',y+'%');
  });
})();

// CARD SPOTLIGHT + TILT
(function(){
  document.querySelectorAll('.card').forEach(function(card){
    var spot=card.querySelector('.card-spotlight');
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      var x=e.clientX-r.left,y=e.clientY-r.top;
      if(spot){card.style.setProperty('--cx',x+'px');card.style.setProperty('--cy',y+'px');}
      var cx=x-r.width/2,cy=y-r.height/2;
      card.style.transform='translateY(-4px) perspective(800px) rotateY('+(cx/r.width*6).toFixed(1)+'deg) rotateX('+(-cy/r.height*4).toFixed(1)+'deg)';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='';
    });
  });
})();

// SERVICE CARD SPOTLIGHT
(function(){
  document.querySelectorAll('.srv-card').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      card.style.setProperty('--sx',(e.clientX-r.left)+'px');
      card.style.setProperty('--sy',(e.clientY-r.top)+'px');
    });
  });
})();

// NAV SCROLL + ACTIVE SECTION
(function(){
  var nav=document.querySelector('nav');
  var links=document.querySelectorAll('.nav-links a[href^="#"]');
  var sections=document.querySelectorAll('section[id]');
  var btt=document.getElementById('btt');
  function onScroll(){
    var y=window.scrollY;
    if(nav){if(y>40)nav.classList.add('scrolled');else nav.classList.remove('scrolled');}
    if(btt){if(y>500)btt.classList.add('show');else btt.classList.remove('show');}
    // Active nav
    var current='';
    sections.forEach(function(s){if(s.offsetTop-140<=y)current='#'+s.id;});
    links.forEach(function(a){
      if(a.getAttribute('href')===current)a.classList.add('active');
      else a.classList.remove('active');
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
  if(btt)btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
})();

// SMOOTH SCROLL
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var t=document.querySelector(a.getAttribute('href'));
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
    });
  });
})();

// SCROLL REVEAL (IntersectionObserver)
(function(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}
    });
  },{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rev').forEach(function(el){obs.observe(el);});
  var sObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');sObs.unobserve(e.target);}});
  },{threshold:0.1});
  document.querySelectorAll('.stagger').forEach(function(el){sObs.observe(el);});
})();

// STAT COUNTERS
(function(){
  function animCount(el){
    var target=parseFloat(el.dataset.target||el.textContent);
    var suffix=el.dataset.suffix||'';
    var dur=1600,start=null;
    function step(ts){
      if(!start)start=ts;
      var p=Math.min((ts-start)/dur,1);
      var ease=1-Math.pow(1-p,4);
      var val=Math.round(ease*target);
      el.textContent=(val%1===0?val:val.toFixed(1))+suffix;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        animCount(e.target);
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.5});
  document.querySelectorAll('.count-up').forEach(function(el){
    el.dataset.target=el.textContent.replace(/[^0-9.]/g,'');
    el.dataset.suffix=el.textContent.replace(/[0-9.]/g,'');
    obs.observe(el);
  });
})();

// PAGE TRANSITIONS
(function(){
  var ov=document.getElementById('pt-overlay');
  if(!ov)return;
  function exit(href){
    ov.style.transition='transform .45s cubic-bezier(.16,1,.3,1)';
    ov.style.transformOrigin='bottom';
    ov.style.transform='scaleY(1)';
    setTimeout(function(){window.location.href=href;},450);
  }
  document.querySelectorAll('a[href]').forEach(function(a){
    var href=a.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto')||href.startsWith('http')||a.target==='_blank')return;
    a.addEventListener('click',function(e){e.preventDefault();exit(href);});
  });
  // Reveal on load
  ov.style.transformOrigin='top';
  ov.style.transform='scaleY(1)';
  ov.style.transition='none';
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      ov.style.transition='transform .6s cubic-bezier(.16,1,.3,1)';
      ov.style.transform='scaleY(0)';
    });
  });
})();

// MAGNETIC BUTTONS
(function(){
  document.querySelectorAll('.btn-mag').forEach(function(btn){
    btn.addEventListener('mousemove',function(e){
      var r=btn.getBoundingClientRect();
      var x=(e.clientX-r.left-r.width/2)*.18;
      var y=(e.clientY-r.top-r.height/2)*.18;
      btn.style.transform='translate('+x+'px,'+y+'px)';
    });
    btn.addEventListener('mouseleave',function(){btn.style.transform='';});
  });
})();
`;

function projectCard(p: Project): string {
  const bgStyle = p.thumbnail_url
    ? `background-image:url('${p.thumbnail_url}');background-color:${p.thumbnail_gradient.split(',')[0].replace('linear-gradient(135deg,','')};`
    : `background:${p.thumbnail_gradient};`;
  return `
  <div class="card rev">
    <div class="card-spotlight"></div>
    <div class="card-thumb">
      <div class="card-thumb-img" style="${bgStyle}"></div>
      <div class="card-thumb-overlay"><span class="card-thumb-label">View</span></div>
    </div>
    <div class="card-body">
      <span class="card-tag">${p.category}</span>
      <h3 class="card-name">${p.title}</h3>
      <p class="card-desc">${p.tagline}</p>
      <a href="/project/${p.slug}" class="card-link">Case Study <span class="card-link-arr">→</span></a>
    </div>
  </div>`;
}

function serviceCard(s: Service, i: number): string {
  const nums = ['01','02','03','04','05','06'];
  return `
  <div class="srv-card rev">
    <div class="srv-num">${nums[i] ?? String(i+1).padStart(2,'0')}</div>
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
    : `<p style="color:var(--muted);font-size:11px;letter-spacing:3px;grid-column:1/-1;text-align:center;padding:80px 0;">No projects yet — add some in the <a href="/admin" style="color:var(--white);">admin panel</a>.</p>`;

  const serviceCards = visibleServices.length
    ? visibleServices.map((s, i) => serviceCard(s, i)).join("")
    : `<p style="color:var(--muted);font-size:11px;letter-spacing:3px;grid-column:1/-1;text-align:center;padding:80px 0;">No services configured.</p>`;

  const skillTags = profile.skills.map(s => `<span class="skill-tag">${s}</span>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${settings.site_title}</title>
  <meta name="description" content="${settings.meta_description}" />
  <meta property="og:title" content="${settings.site_title}" />
  <meta property="og:description" content="${settings.meta_description}" />
  <meta name="theme-color" content="#050505" />
  ${fonts}
  <style>${sharedCSS}</style>
</head>
<body>
<div id="loader"><div class="loader-logo">SR</div></div>
<div id="pt-overlay"></div>
<div id="progress"></div>
<div class="grain"></div>
<div id="cur"></div>
<div id="cur-ring"></div>
<div id="cur-label"></div>

<nav>
  <a class="nav-logo" href="/">S<em>R</em></a>
  <ul class="nav-links">
    <li><a href="#work">Work</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <a class="nav-cta btn-mag" href="#contact">Let's Talk</a>
</nav>

<section id="hero">
  <div class="hero-grid"></div>
  <div class="hero-glow"></div>
  <div class="hero-spotlight"></div>
  <div class="hero-inner">
    <div class="hero-badge">
      <span class="hero-badge-dot"></span>
      Available for work &nbsp;·&nbsp; Based in India
    </div>
    <h1 class="hero-title">
      <span class="hero-line"><span class="hero-line-inner hl1">SAURABH</span></span>
      <span class="hero-line"><span class="hero-line-inner hl2 dim-name" style="color:rgba(255,255,255,.28)">RATHORE</span></span>
    </h1>
    <p class="hero-sub">UI/UX Designer &amp; Framer Developer crafting premium digital experiences — from wireframes to production-ready builds.</p>
    <div class="hero-ctas">
      <a class="btn-mag btn-primary-mag" href="#work">View Work <span class="btn-arr">→</span></a>
      <a class="btn-mag btn-secondary-mag" href="#contact"><span>Get In Touch</span></a>
    </div>
  </div>
  <div class="hero-scroll"><span>Scroll</span><div class="scroll-line"></div></div>
</section>

<div class="marquee-wrap" aria-hidden="true">
  <div class="marquee-track">
    <span class="marquee-item">UI Design</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Framer Development</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">UX Research</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Brand Identity</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Prototyping</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Product Design</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Motion Design</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">UI Design</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Framer Development</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">UX Research</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Brand Identity</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Prototyping</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Product Design</span><span class="marquee-item"><em>·</em></span>
    <span class="marquee-item">Motion Design</span><span class="marquee-item"><em>·</em></span>
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
  <div class="cards-grid stagger">
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
  <div class="srv-grid stagger">
    ${serviceCards}
  </div>
</section>

<section id="process">
  <div class="process-inner">
    <div class="section-header">
      <div>
        <p class="section-tag">How I Work</p>
        <h2 class="section-title rev">MY PROCESS</h2>
      </div>
    </div>
    <div class="process-steps">

      <div class="process-step rev">
        <div class="ps-num">01</div>
        <div class="ps-left">
          <span class="ps-tag">Week 1</span>
          <h3 class="ps-title">DISCOVER</h3>
        </div>
        <div class="ps-right">
          <p class="ps-desc">Deep dive into your business goals, users, and competitive landscape. I ask the uncomfortable questions to uncover what really needs solving — not just what looks good.</p>
          <div class="ps-deliverables">
            <span class="ps-chip">Brief</span>
            <span class="ps-chip">Stakeholder Interviews</span>
            <span class="ps-chip">Competitor Audit</span>
            <span class="ps-chip">Goals &amp; KPIs</span>
          </div>
        </div>
      </div>

      <div class="process-step rev d1">
        <div class="ps-num">02</div>
        <div class="ps-left">
          <span class="ps-tag">Week 1–2</span>
          <h3 class="ps-title">RESEARCH</h3>
        </div>
        <div class="ps-right">
          <p class="ps-desc">User research, behavioural patterns, and information architecture. Data-backed decisions — every design choice has a reason grounded in how real users think and move.</p>
          <div class="ps-deliverables">
            <span class="ps-chip">User Personas</span>
            <span class="ps-chip">Journey Maps</span>
            <span class="ps-chip">IA Diagrams</span>
            <span class="ps-chip">Insights Report</span>
          </div>
        </div>
      </div>

      <div class="process-step rev d2">
        <div class="ps-num">03</div>
        <div class="ps-left">
          <span class="ps-tag">Week 2–3</span>
          <h3 class="ps-title">DESIGN</h3>
        </div>
        <div class="ps-right">
          <p class="ps-desc">From rough wireframes to pixel-perfect high-fidelity screens. I work in Figma and iterate fast — you see progress weekly, not a big reveal at the end.</p>
          <div class="ps-deliverables">
            <span class="ps-chip">Wireframes</span>
            <span class="ps-chip">Design System</span>
            <span class="ps-chip">Hi-Fi Screens</span>
            <span class="ps-chip">Responsive Specs</span>
          </div>
        </div>
      </div>

      <div class="process-step rev d3">
        <div class="ps-num">04</div>
        <div class="ps-left">
          <span class="ps-tag">Week 3–4</span>
          <h3 class="ps-title">PROTOTYPE</h3>
        </div>
        <div class="ps-right">
          <p class="ps-desc">Bring designs to life with interactive prototypes and micro-interactions. Test assumptions before a single line of code is written — saving time, money, and embarrassment.</p>
          <div class="ps-deliverables">
            <span class="ps-chip">Figma Prototype</span>
            <span class="ps-chip">Motion Specs</span>
            <span class="ps-chip">Usability Testing</span>
            <span class="ps-chip">Iteration Rounds</span>
          </div>
        </div>
      </div>

      <div class="process-step rev d4">
        <div class="ps-num">05</div>
        <div class="ps-left">
          <span class="ps-tag">Week 4+</span>
          <h3 class="ps-title">DELIVER</h3>
        </div>
        <div class="ps-right">
          <p class="ps-desc">Production-ready Framer build or developer handoff with obsessive attention to detail. Animations, interactions, and responsive behaviour — all implemented, not just designed.</p>
          <div class="ps-deliverables">
            <span class="ps-chip">Framer Build</span>
            <span class="ps-chip">Dev Handoff</span>
            <span class="ps-chip">Component Docs</span>
            <span class="ps-chip">Launch Support</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<div class="quote-block" style="background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <p class="rev" style="font-size:clamp(18px,2.2vw,26px);color:var(--dim);font-weight:300;max-width:680px;margin:0 auto;line-height:1.65;font-style:italic;">
    "Good design is invisible. <em style="color:rgba(255,255,255,.7);font-style:normal;">Great design</em> is unforgettable."
  </p>
</div>

<section id="about">
  <div class="about-grid">
    <div>
      <p class="about-kicker rev">About Me</p>
      <h2 class="about-name rev">SAURABH<br/><em>RATHORE</em></h2>
      <p class="about-bio rev">${profile.bio}</p>
      <div class="about-skills stagger">${skillTags}</div>
      <div class="about-links rev d2">
        ${profile.linkedin ? `<a class="about-link" href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
        ${profile.behance ? `<a class="about-link" href="${profile.behance}" target="_blank" rel="noopener">Behance</a>` : ""}
        ${profile.email ? `<a class="about-link" href="mailto:${profile.email}">Email</a>` : ""}
      </div>
    </div>
    <div class="about-right rev d1">
      <div class="about-photo-placeholder"><span>SR</span></div>
      <div class="about-stats">
        <div class="a-stat"><div class="a-stat-num count-up">${visibleProjects.length}+</div><div class="a-stat-label">Projects</div></div>
        <div class="a-stat"><div class="a-stat-num count-up">3+</div><div class="a-stat-label">Years Exp</div></div>
      </div>
    </div>
  </div>
</section>

<section id="contact">
  <div class="contact-glow"></div>
  <div class="contact-inner">
    <p class="section-tag rev">Let's Work Together</p>
    <div class="contact-avail rev"><span class="avail-dot"></span>Available for new projects</div>
    <h2 class="contact-big rev">LET'S<br/><em>TALK</em></h2>
    <p class="contact-sub rev">Have a project in mind? I'd love to hear about it. Let's create something exceptional together.</p>
    <div class="contact-row rev d2">
      ${profile.email ? `<a class="contact-btn btn-mag" href="mailto:${profile.email}">Send an Email</a>` : `<a class="contact-btn btn-mag" href="mailto:saurabh@example.com">Send an Email</a>`}
      ${profile.linkedin ? `<a class="contact-alt" href="${profile.linkedin}" target="_blank" rel="noopener"><span>LinkedIn</span></a>` : ""}
    </div>
  </div>
</section>

<footer>
  <span class="f-copy">© ${new Date().getFullYear()} Saurabh Rathore</span>
  <div class="f-links">
    ${profile.linkedin ? `<a href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
    ${profile.behance ? `<a href="${profile.behance}" target="_blank" rel="noopener">Behance</a>` : ""}
  </div>
</footer>

<button id="btt" aria-label="Back to top">
  <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>
</button>

<script>${premiumJS}</script>
</body>
</html>`;
}

export function caseStudyPage(p: Project, nextProject?: Project): string {
  const researchCards = p.research.map((r, i) => `
    <div class="r-card rev d${i % 3}">
      <div class="r-num">${r.number}</div>
      <h3 class="r-title">${r.heading}</h3>
      <p class="r-desc">${r.description}</p>
    </div>`).join("");

  const solutionRows = p.solution_features.map((f, i) => {
    const isEven = i % 2 === 0;
    const mockup = `<div class="sol-mockup"><span>${f.title.toUpperCase().slice(0, 12)}</span></div>`;
    const text = `<div class="sol-text rev"><h3>${f.title.toUpperCase()}</h3><p>${f.description}</p></div>`;
    return `<div class="solution-row">${isEven ? `${text}${mockup}` : `${mockup}${text}`}</div>`;
  }).join("");

  const resultCards = p.results.map((r, i) => `
    <div class="stat-card rev d${i % 4}">
      <div class="stat-num">${r.number}</div>
      <div class="stat-label">${r.label}</div>
    </div>`).join("");

  const workedItems = p.learnings.worked.map(w => `<li><i class="li-icon">✓</i>${w}</li>`).join("");
  const improveItems = p.learnings.improve.map(w => `<li><i class="li-icon">→</i>${w}</li>`).join("");
  const myRoleItems = p.overview.my_role.map(r => `<li>${r}</li>`).join("");
  const toolsPills = p.tools.map(t => `<div class="cs-pill"><span>·</span>${t}</div>`).join("");

  const thumbStyle = p.thumbnail_url
    ? `background:url('${p.thumbnail_url}') center/cover;`
    : `background:${p.thumbnail_gradient};`;

  const nextBanner = nextProject
    ? `<a class="next-banner rev" href="/project/${nextProject.slug}">
        <div><div class="next-lbl">Next Project</div><div class="next-name">${nextProject.title.toUpperCase()}</div></div>
        <div class="next-arrow">→</div>
      </a>`
    : `<a class="next-banner rev" href="/#work">
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
  nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:24px 64px;display:flex;align-items:center;justify-content:space-between;transition:padding .4s ease,background .4s ease,backdrop-filter .4s ease,border-color .4s ease;border-bottom:1px solid transparent;}
  nav.scrolled{padding:16px 64px;background:rgba(5,5,5,.92);backdrop-filter:blur(24px);border-bottom-color:var(--border);}
  .nav-logo{font-family:var(--heading);font-size:28px;letter-spacing:8px;color:var(--white);text-decoration:none;cursor:none;}
  .nav-logo em{color:rgba(255,255,255,.4);font-style:normal;}
  .nav-links{display:flex;gap:40px;list-style:none;}
  .nav-links a{color:var(--dim);text-decoration:none;font-size:11px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;transition:color .25s;cursor:none;}
  .nav-links a:hover{color:var(--white);}
  .back-btn{position:fixed;top:82px;left:64px;z-index:999;font-size:11px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.35);text-decoration:none;display:inline-flex;align-items:center;gap:8px;cursor:none;transition:color .25s;}
  .back-btn:hover{color:var(--white);}

  #cs-hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;padding:140px 64px 80px;position:relative;overflow:hidden;isolation:isolate;}
  #cs-hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px);background-size:32px 32px;pointer-events:none;z-index:0;}
  #cs-hero > *{position:relative;z-index:1;}
  .cs-label{font-size:9px;letter-spacing:5px;color:var(--muted);text-transform:uppercase;margin-bottom:20px;}
  .cs-title{font-family:var(--heading);font-size:clamp(64px,8vw,112px);line-height:.88;color:var(--white);letter-spacing:2px;margin-bottom:24px;}
  .cs-tagline{font-size:18px;color:var(--dim);font-weight:300;margin-bottom:40px;line-height:1.5;}
  .cs-pills{display:flex;flex-wrap:wrap;gap:8px;}
  .cs-pill{font-size:11px;color:rgba(255,255,255,.5);background:rgba(255,255,255,.04);border:1px solid var(--border);padding:6px 14px;letter-spacing:.5px;}
  .cs-pill span{color:var(--muted);margin-right:6px;font-size:9px;text-transform:uppercase;letter-spacing:2px;}
  .cs-mockup{aspect-ratio:4/5;${thumbStyle}display:flex;align-items:center;justify-content:center;border:1px solid var(--border);position:relative;overflow:hidden;}
  .cs-mockup::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 38px,rgba(255,255,255,.01) 38px,rgba(255,255,255,.01) 39px);}
  .cs-mockup-label{font-family:var(--heading);font-size:48px;letter-spacing:5px;color:rgba(255,255,255,.1);position:relative;z-index:1;}

  .cs-section{padding:100px 64px;}
  .cs-section-alt{padding:100px 64px;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
  .cs-s-tag{font-size:9px;letter-spacing:5px;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
  .cs-s-head{font-family:var(--heading);font-size:clamp(40px,5.5vw,64px);letter-spacing:2px;color:var(--white);margin-bottom:52px;line-height:.95;}

  .overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;}
  .ov-col h3{font-family:var(--heading);font-size:26px;letter-spacing:2px;color:var(--white);margin-bottom:20px;}
  .ov-col p{font-size:15px;color:var(--dim);line-height:1.9;margin-bottom:16px;}
  .ov-col ul{list-style:none;display:flex;flex-direction:column;gap:12px;}
  .ov-col li{font-size:14px;color:var(--dim);padding-left:20px;position:relative;line-height:1.65;}
  .ov-col li::before{content:'—';position:absolute;left:0;color:rgba(255,255,255,.25);}

  .research-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);}
  .r-card{background:var(--card);padding:44px 40px;cursor:none;transition:background .3s;}
  .r-card:hover{background:#161616;}
  .r-num{font-family:var(--heading);font-size:52px;color:rgba(255,255,255,.15);line-height:1;margin-bottom:24px;}
  .r-title{font-family:var(--heading);font-size:22px;letter-spacing:2px;color:var(--white);margin-bottom:14px;}
  .r-desc{font-size:13.5px;color:var(--dim);line-height:1.75;}

  .solution-row{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;margin-bottom:80px;}
  .solution-row:last-child{margin-bottom:0;}
  .sol-text h3{font-family:var(--heading);font-size:32px;letter-spacing:2px;color:var(--white);margin-bottom:20px;line-height:1;}
  .sol-text p{font-size:14px;color:var(--dim);line-height:1.9;}
  .sol-mockup{aspect-ratio:4/3;${thumbStyle}display:flex;align-items:center;justify-content:center;border:1px solid var(--border);position:relative;overflow:hidden;}
  .sol-mockup::after{content:'';position:absolute;inset:0;background:rgba(5,5,5,.5);}
  .sol-mockup span{font-family:var(--heading);font-size:28px;letter-spacing:4px;color:rgba(255,255,255,.15);position:relative;z-index:1;}

  .results-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);}
  .stat-card{background:var(--card);padding:52px 44px;text-align:center;transition:background .3s;}
  .stat-card:hover{background:#161616;}
  .stat-num{font-family:var(--heading);font-size:80px;color:var(--white);line-height:1;margin-bottom:14px;}
  .stat-label{font-size:13px;color:var(--dim);letter-spacing:.5px;}

  .learnings-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;}
  .learn-col h3{font-family:var(--heading);font-size:24px;letter-spacing:2px;color:var(--white);margin-bottom:32px;}
  .learn-col ul{list-style:none;display:flex;flex-direction:column;gap:18px;}
  .learn-col li{font-size:14px;color:var(--dim);padding-left:28px;position:relative;line-height:1.7;}
  .learn-col li .li-icon{position:absolute;left:0;color:rgba(255,255,255,.3);font-style:normal;}

  .next-banner{margin:0 64px 64px;border:1px solid var(--border);background:var(--surface);padding:52px 60px;display:flex;align-items:center;justify-content:space-between;cursor:none;text-decoration:none;transition:border-color .35s,background .3s;}
  .next-banner:hover{border-color:var(--border-hover);background:var(--card);}
  .next-lbl{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
  .next-name{font-family:var(--heading);font-size:clamp(36px,5vw,56px);letter-spacing:2px;color:var(--white);line-height:1;}
  .next-arrow{width:56px;height:56px;border-radius:50%;border:1px solid var(--border-hover);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--white);flex-shrink:0;transition:background .25s,color .25s,transform .3s;}
  .next-banner:hover .next-arrow{background:var(--white);color:var(--bg);transform:rotate(45deg);}

  footer{border-top:1px solid var(--border);padding:28px 64px;display:flex;align-items:center;justify-content:space-between;background:var(--surface);}
  .f-copy{font-size:11px;color:var(--muted);letter-spacing:1px;}
  .f-links{display:flex;gap:28px;}
  .f-links a{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);text-decoration:none;cursor:none;transition:color .2s;}
  .f-links a:hover{color:var(--white);}

  @media(max-width:900px){
    nav{padding:18px 24px;}.nav-links{display:none;}nav.scrolled{padding:14px 24px;}
    .back-btn{left:24px;top:76px;}
    #cs-hero{grid-template-columns:1fr;padding:120px 24px 60px;min-height:auto;gap:40px;}
    .cs-title{font-size:clamp(52px,14vw,100px);}
    .cs-section,.cs-section-alt{padding:64px 24px;}
    .overview-grid,.research-grid,.results-grid,.learnings-grid{grid-template-columns:1fr;}
    .solution-row{grid-template-columns:1fr;gap:32px;}
    .next-banner{margin:0 24px 40px;padding:36px 32px;}
    footer{padding:24px;flex-direction:column;gap:12px;text-align:center;}
    #cur,#cur-ring,#cur-label{display:none;}body{cursor:auto;}a,button{cursor:pointer;}
  }
  @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}.rev{opacity:1;transform:none;filter:none;}#loader{display:none;}}
  </style>
</head>
<body>
<div id="loader"><div class="loader-logo">SR</div></div>
<div id="pt-overlay"></div>
<div id="progress"></div>
<div class="grain"></div>
<div id="cur"></div>
<div id="cur-ring"></div>
<div id="cur-label"></div>

<nav>
  <a class="nav-logo" href="/">S<em>R</em></a>
  <ul class="nav-links">
    <li><a href="/#work">Work</a></li>
    <li><a href="/#about">About</a></li>
    <li><a href="/#services">Services</a></li>
    <li><a href="/#contact">Contact</a></li>
  </ul>
</nav>
<a class="back-btn" href="/#work">← Back to Work</a>

<section id="cs-hero">
  <div>
    <p class="cs-label rev">Case Study</p>
    <h1 class="cs-title rev">${p.title.toUpperCase()}</h1>
    <p class="cs-tagline rev">${p.tagline}</p>
    <div class="cs-pills stagger">
      <div class="cs-pill"><span>Role</span>${p.role}</div>
      <div class="cs-pill"><span>Timeline</span>${p.timeline}</div>
      <div class="cs-pill"><span>Type</span>${p.type}</div>
      ${toolsPills}
    </div>
  </div>
  <div class="cs-mockup rev d2"><span class="cs-mockup-label">${p.title.toUpperCase()}</span></div>
</section>

<section class="cs-section">
  <p class="cs-s-tag">01 — Overview</p>
  <h2 class="cs-s-head rev">The Brief</h2>
  <div class="overview-grid">
    <div class="ov-col rev"><h3>The Challenge</h3><p>${p.overview.challenge}</p></div>
    <div class="ov-col rev d1"><h3>My Role</h3><ul>${myRoleItems}</ul></div>
  </div>
</section>

<section class="cs-section-alt">
  <p class="cs-s-tag">02 — Discovery</p>
  <h2 class="cs-s-head rev">Research &amp; Discovery</h2>
  <div class="research-grid">${researchCards}</div>
</section>

<section class="cs-section" style="background:var(--card);border-top:1px solid var(--border);">
  <p class="cs-s-tag">03 — Execution</p>
  <h2 class="cs-s-head rev">The Solution</h2>
  ${solutionRows}
</section>

<section class="cs-section">
  <p class="cs-s-tag">04 — Outcome</p>
  <h2 class="cs-s-head rev">Results &amp; Impact</h2>
  <div class="results-grid">${resultCards}</div>
</section>

<section class="cs-section-alt">
  <p class="cs-s-tag">05 — Reflection</p>
  <h2 class="cs-s-head rev">What I Learned</h2>
  <div class="learnings-grid">
    <div class="learn-col rev"><h3>WHAT WORKED</h3><ul>${workedItems}</ul></div>
    <div class="learn-col rev d1"><h3>WHAT I'D IMPROVE</h3><ul>${improveItems}</ul></div>
  </div>
</section>

${nextBanner}

<footer>
  <span class="f-copy">© ${new Date().getFullYear()} Saurabh Rathore</span>
  <div class="f-links"><a href="/#work">Work</a><a href="/#contact">Contact</a></div>
</footer>

<script>${premiumJS}</script>
</body>
</html>`;
}
