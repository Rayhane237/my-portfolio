import { useEffect, useRef } from 'react'
import { FaWhatsapp, FaGithub, FaLinkedinIn } from 'react-icons/fa'
import './App.css'

const WHATSAPP = 'https://wa.me/213797955763'

const projects = [
  {
    tag: 'Travel',
    title: 'Phnes Travels',
    featured: true,
    desktop: 'https://res.cloudinary.com/n2czqwzg/image/upload/v1793038603/port6.webp',
    mobile: 'https://res.cloudinary.com/n2czqwzg/image/upload/v1793038594/port7.webp',
    chips: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT', 'Role-based access'],
    problem:
      'A travel agency needs one system for its customers and its staff, with different permissions for each.',
    built:
      'Three cooperating apps (customer app, admin dashboard and a shared backend) with public, customer and admin access enforced at the API level.',
    hardest:
      'stabilizing the business logic and deployment, using the lessons from the other two projects.',
    link: 'https://travalagency-eight.vercel.app/',
    linkLabel: 'Visit Phnes Travels',
  },
  {
    tag: 'Recruitment Platform · MVP',
    title: 'Autono',
    desktop: 'https://res.cloudinary.com/n2czqwzg/image/upload/v1793038612/port5.webp',
    mobile: 'https://res.cloudinary.com/n2czqwzg/image/upload/v1793038718/PORT10.webp',
    chips: ['MongoDB', 'Express', 'React', 'Node.js', 'REST API'],
    problem:
      'AI and tech engineers and autonomous-vehicle companies need a way to find each other with relevant, structured information.',
    built:
      'A full MERN marketplace with role-based matching flows and structured data models for both sides.',
    hardest:
      'the layout broke on real devices after deployment, so I rebuilt it with fluid units and proper breakpoints.',
    link: 'https://autono-wep-application.vercel.app/',
    linkLabel: 'Visit Autono',
  },
  {
    tag: 'E-Commerce',
    title: 'Adeline',
    desktop: 'https://res.cloudinary.com/n2czqwzg/image/upload/v1793038581/port8.webp',
    mobile: 'https://res.cloudinary.com/n2czqwzg/image/upload/v1793038654/port3.jpg',
    chips: ['MongoDB', 'Express', 'React', 'Node.js'],
    problem:
      'Small brands need an online store they control, without being locked into a template.',
    built:
      'A working storefront with dynamic catalog, cart and checkout, from database schema to production deployment.',
    hardest:
      'the live site still called the local backend, so I moved the API URL into environment variables.',
    link: 'https://ma-boutiqhe-frontend-pro-pn7e.vercel.app/laBoutique',
    linkLabel: 'Visit Adeline',
  },
]

const stackRows = [
  ['Stack', 'MongoDB · Express · React · Node'],
  ['Direction', 'SaaS & MVPs for business management'],
  ['Database', 'MongoDB'],
  ['Integration', 'REST API, frontend ↔ backend'],
  ['Deployment', 'Vercel, cloud-hosted backend'],
  ['Certification', 'BrainerX, 2025'],
]

function ProjectCard({ project }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width) * 100 + '%')
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height) * 100 + '%')
  }

  return (
    <div
      ref={cardRef}
      className={`card reveal${project.featured ? ' featured' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {project.featured && <span className="featured-badge">★ Flagship</span>}

      <div className="card-media">
        <div className="devices">
          <div className="laptop">
            <div className="laptop-bar">
              <span></span><span></span><span></span>
            </div>
            <img
              src={project.desktop}
              alt={`${project.title} on desktop`}
              loading="lazy"
            />
          </div>
          <div className="phone">
            <div className="phone-screen">
              <img
                src={project.mobile}
                alt={`${project.title} on mobile`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="tag"><span className="dot"></span>{project.tag}</div>
        <h3>{project.title}</h3>

        <div className="stack-chips">
          {project.chips.map((c) => (
            <span className="chip" key={c}>{c}</span>
          ))}
        </div>

        <div className="info">
          <span className="k">The problem</span>
          <p>{project.problem}</p>
        </div>
        <div className="info">
          <span className="k">What I built</span>
          <p>{project.built}</p>
        </div>

        <p className="hardest">
          <b>Hardest part:</b> {project.hardest}
        </p>

        <a className="link-row" href={project.link} target="_blank" rel="noopener noreferrer">
          {project.linkLabel} <span className="arrow">↗</span>
        </a>
      </div>
    </div>
  )
}

function App() {
  const canvasRef = useRef(null)
  const nebulaRef = useRef(null)

  // cursor glow
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
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.setAttribute('data-revealed', 'true')
        })
      },
      { threshold: 0.15 }
    )
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
        shooting.push({
          x: Math.random() * w * 0.6,
          y: Math.random() * h * 0.3,
          len: 80 + Math.random() * 60,
          speed: 8 + Math.random() * 4,
          life: 1,
        })
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h)
      const px = (mouseX - 0.5) * 14
      const py = (mouseY - 0.5) * 14

      for (const s of stars) {
        const twinkle = reducedMotion
          ? s.baseAlpha
          : s.baseAlpha + Math.sin(t * 0.001 * s.speed * 40 + s.phase) * 0.2
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
          <div className="nav-links">
            <a className="pill pill-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp /> <span className="pill-label">WhatsApp</span>
            </a>
            <a className="pill pill-gh" href="https://github.com/Rayhane237" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub /> <span className="pill-label">GitHub</span>
            </a>
            <a className="pill pill-li" href="https://www.linkedin.com/in/rayhane-tliba-765982358/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn /> <span className="pill-label">LinkedIn</span>
            </a>
          </div>
        </nav>

        <section className="hero">
          <div className="coords">
            FULL-STACK MERN DEVELOPER <em>·</em> ALGIERS <em>·</em> OPEN TO INTERNSHIPS
          </div>
          <h1>
            I build secure web apps for businesses:{' '}
            <span className="grad">booking systems, dashboards and e-commerce.</span>
          </h1>
          <p className="hero-sub">
            From database to deployment, with role-based access and production builds.{' '}
            <b>Three deployed products</b>, each solving a real business problem.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              Let's talk
            </a>
            <a className="btn btn-ghost" href="#work">View projects</a>
          </div>
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
              <p>
                Full-stack developer with a <b>Full Stack Web App Developer certification</b> from
                BrainerX (2025).
              </p>
              <p>
                My goal is to grow into building <b>SaaS products and MVPs</b> that help businesses
                manage their operations, turning real needs into reliable, production-ready software.
                I treat code as a tool to solve problems: I focus on clean architecture,
                well-structured REST APIs, and dependable cloud deployments that hold up well beyond
                localhost.
              </p>
              <p>
                Each of my projects taught me something a local setup never could: managing
                environment variables, making layouts responsive on real devices, and securing
                authentication. I'm now looking for an internship where I can apply this discipline
                within a team and keep growing.
              </p>
            </div>
            <div className="stack-list reveal">
              {stackRows.map(([label, val]) => (
                <div className="stack-item" key={label}>
                  <span className="label">{label}</span>
                  <span className="val">{val}</span>
                </div>
              ))}
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