import { useEffect, useRef, useState } from 'react'
import './App.css'

const projects = [
  {
    tag: 'Travel · Flagship Project',
    title: 'Phnes Travels',
    featured: true,
    stack: ['Customer App', 'Admin Dashboard', 'Shared Backend'],
    media: 'https://images.unsplash.com/photo-1738682085346-6a6faff97fb1?auto=format&fit=crop&w=1200&q=70',
    desc: 'A full-stack travel booking platform built as three cooperating apps sharing one backend: customers book flights and hotels, admins manage inventory and users through a role-based dashboard, and a shared Express/MongoDB API enforces public, customer and admin access tiers.',
    challenge: 'The most complex backend of the three, with the strongest authentication system — but business logic and deployment weren\u2019t holding up. Built first, so it carried unresolved issues into deployment.',
    fix: 'Came back to it last, after solving environment-variable and responsiveness issues on the other two projects, and applied those same lessons to stabilize its logic and deployment.',
    link: 'https://travalagency-eight.vercel.app/',
    linkLabel: 'phenaTravels.app',
  },
  {
    tag: 'MVP · Recruitment Platform',
    title: 'Autono',
    media: 'https://images.unsplash.com/photo-1685984351618-f0c4287590b8?auto=format&fit=crop&w=1200&q=70',
    desc: 'Connects specialized AI/tech engineers with autonomous-vehicle companies — full MERN build with role-based matching flows and structured data models on both sides of the marketplace.',
    challenge: 'Every screen was designed and tested responsively — mobile, tablet, desktop — and looked correct locally. Once deployed, the layout broke out of alignment on real devices.',
    fix: 'Rebuilt the responsive layer around fluid units and proper breakpoints instead of fixed local-only styling, then verified across actual deployed viewports.',
    link: 'https://autono-wep-application.vercel.app/',
    linkLabel: 'autono.app',
  },
  {
    tag: 'E-Commerce',
    title: 'Adeline',
    media: 'https://images.unsplash.com/photo-1778996525689-cbbbc33a5185?auto=format&fit=crop&w=1200&q=70',
    desc: 'A functioning MERN storefront — dynamic catalog, cart and checkout — built as the reference implementation for the stack, from database schema to deployment.',
    challenge: "Products displayed correctly locally but not on the live deploy — the frontend was still calling the local backend address, and since the API URL wasn't managed through environment variables, updating it after deploying the backend didn't take effect.",
    fix: 'Moved the API base URL into environment variables on both frontend and backend, redeployed with the correct production values, and confirmed the connection end-to-end.',
    link: 'https://ma-boutiqhe-frontend-pro-pn7e.vercel.app/laBoutique',
    linkLabel: 'adeline.app',
  },
]

function ProjectCard({ project }) {
  const [open, setOpen] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width * 100) + '%')
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height * 100) + '%')
  }

  return (
    <div
      ref={cardRef}
      className={`card reveal${open ? ' open' : ''}${project.featured ? ' featured' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {project.featured && <span className="featured-badge">★ Flagship</span>}
      <div className="card-media" style={{ backgroundImage: `url('${project.media}')` }} />
      <div className="tag"><span className="dot"></span>{project.tag}</div>
      <h3>{project.title}</h3>
      {project.stack && (
        <div className="stack-chips">
          {project.stack.map((s) => (
            <span className="chip" key={s}>{s}</span>
          ))}
        </div>
      )}
      <p>{project.desc}</p>
      <button type="button" className="challenge-toggle" onClick={() => setOpen((o) => !o)}>
        Show the challenge <span className="chev">▾</span>
      </button>
      <div className="challenge-panel">
        <div className="challenge-panel-inner">
          <div className="challenge-block">
            <span className="k">Challenge</span>
            <p>{project.challenge}</p>
          </div>
          <div className="challenge-block">
            <span className="k">Fix</span>
            <p>{project.fix}</p>
          </div>
        </div>
      </div>
      <a className="link-row" href={project.link} target="_blank" rel="noopener noreferrer">
        {project.linkLabel} <span className="arrow">↗</span>
      </a>
    </div>
  )
}

function App() {
  const [navOpen, setNavOpen] = useState(false)
  const canvasRef = useRef(null)
  const nebulaRef = useRef(null)
  const rootRefsSet = useRef(new Set())

  // close mobile nav on link click
  const closeNav = () => setNavOpen(false)

  // nebula cursor glow, tracked via CSS custom properties on :root
  useEffect(() => {
    const root = document.documentElement
    const nebula = nebulaRef.current
    const onMove = (e) => {
      root.style.setProperty('--mx', e.clientX + 'px')
      root.style.setProperty('--my', e.clientY + 'px')
    }
    const onLeave = () => { if (nebula) nebula.style.opacity = '0' }
    const onEnter = () => { if (nebula) nebula.style.opacity = '1' }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  // scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.setAttribute('data-revealed', 'true')
      })
    }, { threshold: 0.15 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // starfield canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w, h, stars = [], shooting = []
    let mouseX = 0.5, mouseY = 0.5
    let rafId
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function initStars() {
      const count = Math.floor((w * h) / 9000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005,
        depth: Math.random() * 0.6 + 0.2,
      }))
    }

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      initStars()
    }

    function onMouseMove(e) {
      mouseX = e.clientX / w
      mouseY = e.clientY / h
    }

    function maybeSpawnShootingStar() {
      if (Math.random() < 0.004 && shooting.length < 2) {
        const startX = Math.random() * w * 0.6
        const startY = Math.random() * h * 0.3
        shooting.push({ x: startX, y: startY, len: 80 + Math.random() * 60, speed: 8 + Math.random() * 4, life: 1 })
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h)
      const px = (mouseX - 0.5) * 14
      const py = (mouseY - 0.5) * 14

      for (const s of stars) {
        const twinkle = reducedMotion ? s.baseAlpha : s.baseAlpha + Math.sin(t * 0.001 * s.speed * 40 + s.phase) * 0.2
        ctx.beginPath()
        ctx.fillStyle = `rgba(230,222,255,${Math.max(0, Math.min(1, twinkle))})`
        ctx.arc(s.x + px * s.depth, s.y + py * s.depth, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reducedMotion) {
        maybeSpawnShootingStar()
        shooting.forEach((st) => {
          ctx.strokeStyle = `rgba(232,121,249,${st.life})`
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(st.x, st.y)
          ctx.lineTo(st.x - st.len, st.y - st.len * 0.4)
          ctx.stroke()
          st.x += st.speed * 2
          st.y += st.speed * 0.8
          st.life -= 0.012
        })
        shooting = shooting.filter((st) => st.life > 0 && st.x < w + 100 && st.y < h + 100)
      }

      rafId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    resize()
    rafId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <canvas id="stars" ref={canvasRef}></canvas>
      <div className="nebula-cursor" ref={nebulaRef}></div>
      <div className="nebula-static nebula-1"></div>
      <div className="nebula-static nebula-2"></div>

      <main>
        <nav>
          <div className="logo">Tliba Rayhane<span>.</span></div>
          <div className={`nav-links${navOpen ? ' open' : ''}`}>
            <a href="https://wa.me/213797955763" target="_blank" rel="noopener noreferrer" onClick={closeNav}>WhatsApp</a>
            <a href="https://github.com/Rayhane237" target="_blank" rel="noopener noreferrer" onClick={closeNav}>GitHub</a>
            <a href="https://www.linkedin.com/in/rayhane-tliba-765982358/" target="_blank" rel="noopener noreferrer" onClick={closeNav}>LinkedIn</a>
          </div>
          <button
            className={`nav-toggle${navOpen ? ' open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </nav>

        <section className="hero">
          <div className="coords">3RD YEAR CS · ENSK <em>·</em> MERN STACK <em>·</em> ALGIERS</div>
          <h1>Building web apps that feel as <span className="grad">weightless</span> as they work.</h1>
          <p className="hero-sub">
            Full-stack developer working across the <b>MERN</b> stack — from data modeling to the last pixel of a checkout flow.
            Three shipped products, each one an exercise in keeping architecture clean and interfaces out of the user's way.
          </p>
        </section>

        <section className="work" id="work">
          <div className="section-head reveal">
            <h2>Selected Work</h2>
            <span>3 Deployed Projects</span>
          </div>
          <div className="cards">
            <ProjectCard project={projects[0]} />
            <div className="cards-secondary">
              {projects.slice(1).map((p) => (
                <ProjectCard key={p.title} project={p} />
              ))}
            </div>
          </div>
        </section>

        <section id="about">
          <div className="section-head reveal">
            <h2>About</h2>
            <span>Formation &amp; Stack</span>
          </div>
          <div className="about-grid">
            <div className="about-text reveal">
              <p><b>3rd-year Computer Science student at ENSK</b> (École Normale Supérieure de Kouba, Algeria), alongside a <b>Full Stack Web App Developer certification</b> from BrainerX (2025).</p>
              <p>Focused on assembling clean, production-ready architecture rather than writing raw code for its own sake — connecting frontend and backend through well-structured REST APIs, and shipping to the cloud rather than leaving projects on localhost.</p>
            </div>
            <div className="stack-list reveal">
              <div className="stack-item"><span className="label">Stack</span><span className="val">MongoDB · Express · React · Node</span></div>
              <div className="stack-item"><span className="label">Database</span><span className="val">Modeling &amp; structuring</span></div>
              <div className="stack-item"><span className="label">Integration</span><span className="val">REST API, frontend ↔ backend</span></div>
              <div className="stack-item"><span className="label">Deployment</span><span className="val">Cloud, production builds</span></div>
              <div className="stack-item"><span className="label">Certification</span><span className="val">BrainerX, 2025</span></div>
            </div>
          </div>
        </section>

        <footer>
          <div className="footer-stamp">Designed to feel <span>seamless.</span></div>
          <div className="footer-links">
            <a href="https://autono-wep-application.vercel.app/" target="_blank" rel="noopener noreferrer">Autono</a>
            <a href="https://ma-boutiqhe-frontend-pro-pn7e.vercel.app/laBoutique" target="_blank" rel="noopener noreferrer">Adeline</a>
            <a href="https://travalagency-eight.vercel.app/" target="_blank" rel="noopener noreferrer">Phnes Travels</a>
          </div>
        </footer>
      </main>
    </>
  )
}

export default App