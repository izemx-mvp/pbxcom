import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Activity, Cctv, Check, Clock, PhoneCall, ShieldCheck, Users, Wifi } from "lucide-react";
import { images } from "@/config/images";
import { site } from "@/config/site";
import { services } from "@/data/services";
import { buttonVariants, ButtonContent, Magnetic } from "@/components/site/button";
import { CircuitLines, Glow, GridBackground } from "@/components/site/circuit";
import { Marquee } from "@/components/site/blocks";
import { Eyebrow } from "@/components/site/primitives";
import { EASE, WordReveal } from "@/components/site/motion";

const trust = [
  { icon: Clock, label: `Devis en ${site.quoteDelay}` },
  { icon: ShieldCheck, label: "Estimation sans engagement" },
  { icon: Users, label: "Équipe dédiée" },
];

const audiences = ["vos bureaux", "votre hôtel", "votre résidence", "vos sites publics", "votre clinique", "vos entrepôts"];

const systems = [
  { icon: Cctv, label: "Vidéosurveillance", state: "Enregistrement" },
  { icon: Wifi, label: "Réseau & Wi-Fi", state: "Connecté" },
  { icon: PhoneCall, label: "Téléphonie IP", state: "Opérationnelle" },
];

/* Rotating audience word */
function RotatingWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % audiences.length), 2400);
    return () => window.clearInterval(t);
  }, [reduce]);
  return (
    <span className="relative inline-flex h-[1.5em] min-w-[11ch] overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={audiences[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute left-0 whitespace-nowrap font-semibold text-green"
        >
          {audiences[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* Animated "supervision" panel: illustrative UI, not real-time data */
function SupervisionPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 1 }}
      className="absolute -bottom-10 -left-4 w-[290px] rounded-2xl border border-white/10 bg-graphite/95 p-4 shadow-[0_30px_60px_-20px_oklch(0_0_0/0.7)] sm:-left-10 sm:w-[320px]"
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <p className="label-mono text-[10px] text-white/50">Supervision · PBXcom</p>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-green">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-green" />
          </span>
          Tout est opérationnel
        </span>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {systems.map((s, i) => (
          <motion.li
            key={s.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: 1.25 + i * 0.18 }}
            className="flex items-center gap-3 rounded-xl bg-ink/70 px-3 py-2.5"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-green/12 text-green">
              <s.icon className="size-4" strokeWidth={1.75} />
            </span>
            <span className="flex-1 text-[13px] text-white/85">{s.label}</span>
            <span className="flex items-center gap-1 text-[11px] text-white/50">
              <Check className="size-3 text-green" />
              {s.state}
            </span>
          </motion.li>
        ))}
      </ul>
      <div className="mt-4 rounded-xl bg-ink/70 p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] text-white/50">
            <Activity className="size-3.5 text-green" /> Trafic réseau
          </span>
          <span className="label-mono text-[10px] text-green">Stable</span>
        </div>
        <svg viewBox="0 0 200 40" className="mt-2 h-10 w-full">
          <defs>
            <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--green)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 30 L20 26 L40 28 L60 18 L80 22 L100 12 L120 16 L140 8 L160 14 L180 6 L200 10 V40 H0 Z" fill="url(#spark-fill)" />
          <motion.path
            d="M0 30 L20 26 L40 28 L60 18 L80 22 L100 12 L120 16 L140 8 L160 14 L180 6 L200 10"
            fill="none"
            stroke="var(--green)"
            strokeWidth="1.75"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: EASE, delay: 1.6 }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0.4]);

  /* subtle 3D tilt following the mouse (desktop) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section ref={ref} className="surface-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-noise">
      <GridBackground className="-z-10" />
      <CircuitLines className="-z-10" opacity={0.55} />
      <Glow className="-left-48 top-1/4 -z-10 size-[640px]" />
      <Glow className="-right-40 bottom-0 -z-10 size-[520px] opacity-70" />

      <motion.div
        style={{ opacity: fade }}
        className="container-wide grid w-full flex-1 items-center gap-16 pb-28 pt-[calc(var(--header-h)+40px)] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-32"
      >
        {/* Copy */}
        <div className="relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <Eyebrow>
              Depuis {site.foundingYear} · Rabat
            </Eyebrow>
          </motion.div>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,1.4rem+4.2vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.035em] text-white">
            <WordReveal text={"Sécurité, Réseau, Télécom : Tout pour Connecter et Protéger"} highlight="Connecter et Protéger" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
            className="type-lead mt-7 max-w-[54ch] text-white/65"
          >
            De l'étude à la maintenance, un seul interlocuteur pour sécuriser et connecter <RotatingWord />
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.85 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Magnetic>
              <Link to="/devis" className={buttonVariants({ variant: "primary", size: "lg" })}>
                <ButtonContent arrow>Devis Gratuit</ButtonContent>
              </Link>
            </Magnetic>
            <Magnetic strength={0.15}>
              <Link to="/boutique" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                Découvrir la boutique
              </Link>
            </Magnetic>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/[0.08] pt-7"
          >
            {trust.map((t) => (
              <li key={t.label} className="flex items-center gap-2.5 text-sm text-white/75">
                <t.icon className="size-4 text-green" strokeWidth={1.5} aria-hidden />
                {t.label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
          className="relative mx-auto w-full max-w-[640px] [perspective:1400px] lg:max-w-none"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <motion.div style={{ y, rotateX: rx, rotateY: ry }} className="relative [transform-style:preserve-3d]">
            <div className="absolute -inset-6 rounded-[32px] bg-green/10 blur-3xl" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] ring-1 ring-white/10 sm:aspect-[5/4] lg:aspect-[4/4.4] xl:aspect-[5/5]">
              <picture>
                <source media="(min-width: 640px)" srcSet={images.hero.main.src} width={images.hero.main.width} height={images.hero.main.height} />
                <img
                  src={images.hero.mobile.src}
                  width={images.hero.mobile.width}
                  height={images.hero.mobile.height}
                  alt={images.hero.main.alt}
                  fetchPriority="high"
                  loading="eager"
                  decoding="sync"
                  className="absolute inset-0 h-full w-full object-cover object-[50%_40%] sm:object-[68%_50%]"
                />
              </picture>
              <div className="absolute inset-0 bg-[linear-gradient(200deg,transparent_40%,oklch(0.155_0.006_165/0.75))]" aria-hidden />
              {/* scanning line */}
              <motion.div
                aria-hidden
                className="absolute inset-x-0 h-24 bg-[linear-gradient(180deg,transparent,oklch(0.775_0.215_133/0.12),transparent)]"
                initial={{ top: "-20%" }}
                animate={reduce ? { top: "-20%" } : { top: ["-20%", "110%"] }}
                transition={reduce ? { duration: 0 } : { duration: 5, ease: "linear", repeat: Infinity, repeatDelay: 1.5 }}
              />
              {/* corner frame marks */}
              {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((c) => (
                <span key={c} aria-hidden className={`absolute size-6 border-green/70 ${c}`} />
              ))}
              <div className="label-mono absolute left-6 top-6 flex items-center gap-2 text-[10px] text-white/70" aria-hidden>
                <span className="size-1.5 animate-pulse rounded-full bg-red-500 motion-reduce:animate-none" /> REC · CAM 01
              </div>
            </div>

            {/* Badge */}
            <div className="absolute -top-5 right-5 flex items-center gap-3 rounded-2xl bg-green px-4 py-3 text-ink shadow-[0_20px_40px_-12px_oklch(0.775_0.215_133/0.55)] [transform:translateZ(40px)] sm:right-8">
              <Clock className="size-5" strokeWidth={1.75} aria-hidden />
              <div className="leading-tight">
                <p className="label-mono text-[10px] opacity-70">Devis gratuit</p>
                <p className="font-display text-lg font-bold">en &lt; 4h</p>
              </div>
            </div>

            <div className="hidden sm:block [transform:translateZ(60px)]">
              <SupervisionPanel />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Services ticker */}
      <div className="relative z-10 border-t border-white/[0.08] bg-ink/80 py-4">
        <Marquee duration={45}>
          {services.map((s) => (
            <span key={s.slug} className="flex shrink-0 items-center gap-4 pr-4">
              <span className="flex items-center gap-2.5 whitespace-nowrap text-sm text-white/55">
                <s.icon className="size-4 text-green" strokeWidth={1.5} aria-hidden />
                {s.name}
              </span>
              <span className="size-1.5 rounded-full bg-green/40" aria-hidden />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}