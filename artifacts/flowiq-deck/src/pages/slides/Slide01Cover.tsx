const base = import.meta.env.BASE_URL;

export default function Slide01Cover() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Hero background image */}
      <img
        src={`${base}hero.png`}
        crossOrigin="anonymous"
        alt=""
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
      />

      {/* Dark gradient overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(12,15,26,0.95) 0%, rgba(12,15,26,0.75) 50%, rgba(12,15,26,0.9) 100%)' }} />

      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blob top right */}
      <div style={{ position: 'absolute', top: '-15vh', right: '-8vw', width: '45vw', height: '45vw', borderRadius: '50%', backgroundColor: '#4F7FFF', opacity: 0.06, filter: 'blur(8vw)' }} />
      {/* Accent blob bottom left */}
      <div style={{ position: 'absolute', bottom: '-20vh', left: '-10vw', width: '50vw', height: '50vw', borderRadius: '50%', backgroundColor: '#7C6BF0', opacity: 0.07, filter: 'blur(10vw)' }} />

      {/* Logo top left */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '2vw', height: '2vw', backgroundColor: '#7C6BF0', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 3v12M18 9v12M6 15a6 6 0 0 0 6 6M18 3a6 6 0 0 0-6 6" />
          </svg>
        </div>
        <span style={{ fontSize: '1.2vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Center content */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, textAlign: 'center', padding: '0 8vw' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5vw', padding: '0.6vh 1.4vw', backgroundColor: 'rgba(124,107,240,0.15)', border: '1px solid rgba(124,107,240,0.35)', borderRadius: '2vw', color: '#7C6BF0', fontSize: '0.95vw', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4vh' }}>
          <span style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7C6BF0', borderRadius: '50%', display: 'inline-block' }} />
          Enterprise Workflow Intelligence
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '9vw', fontWeight: 800, margin: '0 0 2vh 0', lineHeight: 1, letterSpacing: '-0.04em', textWrap: 'balance' }}>
          FlowIQ
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '1.8vw', fontWeight: 300, color: 'rgba(255,255,255,0.7)', margin: '0 0 7vh 0', lineHeight: 1.5, maxWidth: '55vw', textWrap: 'pretty' }}>
          Automate, optimize, and predict enterprise workflows with AI — built for teams that demand clarity and speed.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '1.5vw' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw', padding: '1vh 1.8vw', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.85)' }}>
            <span style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#4F7FFF', borderRadius: '50%' }} />
            AI-Powered
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw', padding: '1vh 1.8vw', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.85)' }}>
            <span style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7C6BF0', borderRadius: '50%' }} />
            Enterprise Ready
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw', padding: '1vh 1.8vw', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.85)' }}>
            <span style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#27C93F', borderRadius: '50%' }} />
            Real-time Analytics
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '4vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', zIndex: 10 }}>FLOWIQ — MERIDIAN GROUP</div>
      <div style={{ position: 'absolute', bottom: '4vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>01 / 10</div>
    </div>
  );
}
