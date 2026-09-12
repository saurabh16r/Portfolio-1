import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";

export function CraftsmanshipVisual() {
  const isMobile = useIsMobile();

  // Floating animations
  const floatingTransition = (delay: number) => ({
    y: ["0px", "-12px", "0px"],
    rotate: [0, 1.5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  });

  return (
    <div
      className="relative w-full aspect-[4/3] flex items-center justify-center preserve-3d"
      style={{
        transform: !isMobile ? "rotateY(calc(var(--mouse-x) * -5deg)) rotateX(calc(var(--mouse-y) * 5deg))" : "none",
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Grid mesh background */}
      <div
        className="absolute w-[80%] h-[80%] opacity-[0.06] border border-white/10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
          transform: 'translateZ(-100px) rotateX(45deg) scale(1.2)',
        }}
      />

      {/* Volumetric Studio Backlight Spot */}
      <div className="absolute w-[60%] h-[60%] rounded-full bg-white/[0.03] blur-[80px] -z-10" />

      {/* Layered UI Component A: Code snippet (Z: 60px) */}
      <motion.div
        animate={floatingTransition(0)}
        className="absolute top-[10%] left-[5%] w-[65%] max-w-[280px] rounded-lg border border-white/[0.08] bg-[#111111] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-20 pointer-events-none select-none text-left"
        style={{
          transform: !isMobile ? "translateZ(60px)" : "none",
        }}
      >
        <div className="flex items-center gap-1.5 mb-3.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <pre className="font-mono text-[9px] text-white/50 leading-normal">
          <span className="text-white/30">1  </span><span className="text-white/80">const</span> <span className="text-white">MotionCard</span> = () =&gt; &#123;
          <br />
          <span className="text-white/30">2    </span>  <span className="text-white/80">return</span> (
          <br />
          <span className="text-white/30">3    </span>    &lt;<span className="text-white/80">motion.div</span>
          <br />
          <span className="text-white/30">4    </span>      <span className="text-white/80">animate</span>=&#123;&#123; <span className="text-white">y: -10</span> &#125;&#125;
          <br />
          <span className="text-white/30">5    </span>      <span className="text-white/80">transition</span>=&#123;&#123; <span className="text-white">spring</span> &#125;&#125;
          <br />
          <span className="text-white/30">6    </span>    /&gt;
          <br />
          <span className="text-white/30">7    </span>  );
          <br />
          <span className="text-white/30">8  </span>&#125;;
        </pre>
      </motion.div>

      {/* Layered UI Component B: Vector curve path editor (Z: 0px) */}
      <motion.div
        animate={floatingTransition(1.5)}
        className="absolute top-[28%] right-[5%] w-[68%] max-w-[280px] aspect-[1.4] rounded-lg border border-white/[0.08] bg-[#111111] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.6)] z-10 pointer-events-none select-none"
        style={{
          transform: !isMobile ? "translateZ(0px)" : "none",
        }}
      >
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2 text-[8px] uppercase tracking-[0.2em] text-white/40">
          <span>Vector Editor</span>
          <span className="text-white/60">Bezier Curve</span>
        </div>
        <svg className="w-full h-[60%]" viewBox="0 0 200 80">
          {/* Grid lines */}
          <line x1="0" y1="40" x2="200" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="100" y1="0" x2="100" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

          {/* Animated Bezier Curve */}
          <motion.path
            d="M 10 60 C 50 10, 150 10, 190 60"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Anchor controls */}
          <circle cx="50" cy="10" r="1.5" fill="#fff" />
          <line x1="10" y1="60" x2="50" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="150" cy="10" r="1.5" fill="#fff" />
          <line x1="190" y1="60" x2="150" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="2 2" />

          {/* Keyframes node dots */}
          <circle cx="10" cy="60" r="2.5" fill="#050505" stroke="#fff" strokeWidth="1" />
          <circle cx="190" cy="60" r="2.5" fill="#050505" stroke="#fff" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Layered UI Component C: Design system Sliders (Z: -40px) */}
      <motion.div
        animate={floatingTransition(3)}
        className="absolute bottom-[8%] left-[20%] w-[58%] max-w-[240px] rounded-lg border border-white/[0.08] bg-[#111111] p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-0 pointer-events-none select-none text-left"
        style={{
          transform: !isMobile ? "translateZ(-40px)" : "none",
        }}
      >
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] uppercase tracking-[0.25em] text-white/40">
              <span>Dimension X</span>
              <span className="text-white/60">0.82s</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 bottom-0 w-[82%] bg-white/30" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] uppercase tracking-[0.25em] text-white/40">
              <span>Scale Factor</span>
              <span className="text-white/60">1.04</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 bottom-0 w-[55%] bg-white/30" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating cross hairs */}
      <div className="absolute top-[5%] right-[25%] opacity-20 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <line x1="6" y1="0" x2="6" y2="12" stroke="#fff" strokeWidth="0.8" />
          <line x1="0" y1="6" x2="12" y2="6" stroke="#fff" strokeWidth="0.8" />
        </svg>
      </div>
      <div className="absolute bottom-[35%] left-[10%] opacity-20 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <line x1="6" y1="0" x2="6" y2="12" stroke="#fff" strokeWidth="0.8" />
          <line x1="0" y1="6" x2="12" y2="6" stroke="#fff" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
}
