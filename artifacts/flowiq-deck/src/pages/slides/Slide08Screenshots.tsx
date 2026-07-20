const base = import.meta.env.BASE_URL;

export default function Slide08Screenshots() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blobs */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', width: '30vw', height: '30vw', borderRadius: '50%', backgroundColor: '#4F7FFF', opacity: 0.04, filter: 'blur(10vw)' }} />
      <div style={{ position: 'absolute', bottom: '5vh', right: '5vw', width: '30vw', height: '30vw', borderRadius: '50%', backgroundColor: '#7C6BF0', opacity: 0.04, filter: 'blur(10vw)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#7C6BF0', borderRadius: '0.35vw' }} />
        <span style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Header */}
      <div style={{ position: 'absolute', top: '13vh', left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
        <div style={{ display: 'inline-block', padding: '0.5vh 1.2vw', backgroundColor: 'rgba(79,127,255,0.12)', border: '1px solid rgba(79,127,255,0.28)', borderRadius: '2vw', color: '#4F7FFF', fontSize: '0.85vw', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5vh' }}>
          Product
        </div>
        <h2 style={{ fontSize: '3.5vw', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Product Screenshots</h2>
      </div>

      {/* Screenshots side by side */}
      <div style={{ position: 'absolute', top: '28vh', left: '5vw', right: '5vw', bottom: '10vh', display: 'flex', gap: '3vw', alignItems: 'flex-start' }}>

        {/* Screenshot 1: Landing */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5vh', height: '100%' }}>
          <div style={{ flex: 1, backgroundColor: '#1a1d2e', borderRadius: '0.8vw', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2vh 5vh rgba(0,0,0,0.5)' }}>
            {/* Browser chrome */}
            <div style={{ padding: '0.8vh 1vw', backgroundColor: '#242438', display: 'flex', alignItems: 'center', gap: '0.4vw', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '0.65vw', height: '0.65vw', borderRadius: '50%', backgroundColor: '#FF5F56', flexShrink: 0 }} />
              <div style={{ width: '0.65vw', height: '0.65vw', borderRadius: '50%', backgroundColor: '#FFBD2E', flexShrink: 0 }} />
              <div style={{ width: '0.65vw', height: '0.65vw', borderRadius: '50%', backgroundColor: '#27C93F', flexShrink: 0 }} />
              <div style={{ flex: 1, backgroundColor: '#181830', borderRadius: '0.25vw', padding: '0.3vh 0.8vw', fontSize: '0.65vw', color: 'rgba(255,255,255,0.35)', marginLeft: '0.5vw' }}>flowiq.app</div>
            </div>
            <img
              src={`${base}landing.jpg`}
              crossOrigin="anonymous"
              alt="FlowIQ landing page"
              style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.05vw', fontWeight: 600, marginBottom: '0.4vh' }}>Landing Page</div>
            <div style={{ fontSize: '0.9vw', color: 'rgba(255,255,255,0.5)' }}>Public-facing hero with AI-powered messaging and CTA</div>
          </div>
        </div>

        {/* Screenshot 2: Login */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5vh', height: '100%' }}>
          <div style={{ flex: 1, backgroundColor: '#1a1d2e', borderRadius: '0.8vw', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2vh 5vh rgba(0,0,0,0.5)' }}>
            {/* Browser chrome */}
            <div style={{ padding: '0.8vh 1vw', backgroundColor: '#242438', display: 'flex', alignItems: 'center', gap: '0.4vw', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '0.65vw', height: '0.65vw', borderRadius: '50%', backgroundColor: '#FF5F56', flexShrink: 0 }} />
              <div style={{ width: '0.65vw', height: '0.65vw', borderRadius: '50%', backgroundColor: '#FFBD2E', flexShrink: 0 }} />
              <div style={{ width: '0.65vw', height: '0.65vw', borderRadius: '50%', backgroundColor: '#27C93F', flexShrink: 0 }} />
              <div style={{ flex: 1, backgroundColor: '#181830', borderRadius: '0.25vw', padding: '0.3vh 0.8vw', fontSize: '0.65vw', color: 'rgba(255,255,255,0.35)', marginLeft: '0.5vw' }}>flowiq.app/login</div>
            </div>
            <img
              src={`${base}login.jpg`}
              crossOrigin="anonymous"
              alt="FlowIQ login page"
              style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.05vw', fontWeight: 600, marginBottom: '0.4vh' }}>Authentication</div>
            <div style={{ fontSize: '0.9vw', color: 'rgba(255,255,255,0.5)' }}>Secure session-based login — email and password, branded to your organisation</div>
          </div>
        </div>

        {/* Screenshot 3: Request detail (CSS mockup) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5vh', height: '100%' }}>
          <div style={{ flex: 1, backgroundColor: '#1a1d2e', borderRadius: '0.8vw', overflow: 'hidden', border: '1px solid rgba(79,127,255,0.2)', boxShadow: '0 2vh 5vh rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
            {/* Browser chrome */}
            <div style={{ padding: '0.8vh 1vw', backgroundColor: '#242438', display: 'flex', alignItems: 'center', gap: '0.4vw', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
              <div style={{ width: '0.65vw', height: '0.65vw', borderRadius: '50%', backgroundColor: '#FF5F56', flexShrink: 0 }} />
              <div style={{ width: '0.65vw', height: '0.65vw', borderRadius: '50%', backgroundColor: '#FFBD2E', flexShrink: 0 }} />
              <div style={{ width: '0.65vw', height: '0.65vw', borderRadius: '50%', backgroundColor: '#27C93F', flexShrink: 0 }} />
              <div style={{ flex: 1, backgroundColor: '#181830', borderRadius: '0.25vw', padding: '0.3vh 0.8vw', fontSize: '0.65vw', color: 'rgba(255,255,255,0.35)', marginLeft: '0.5vw' }}>flowiq.app/requests/7</div>
            </div>
            {/* Mockup content */}
            <div style={{ flex: 1, padding: '1.2vw', display: 'flex', flexDirection: 'column', gap: '1vh', backgroundColor: '#0F1320' }}>
              {/* Request title */}
              <div style={{ height: '1vw', width: '65%', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '0.25vw' }} />
              <div style={{ height: '0.7vw', width: '40%', backgroundColor: 'rgba(79,127,255,0.3)', borderRadius: '0.25vw' }} />
              {/* Timeline row */}
              <div style={{ display: 'flex', gap: '0.5vw', alignItems: 'center', marginTop: '0.5vh' }}>
                <div style={{ width: '1.2vw', height: '1.2vw', borderRadius: '50%', backgroundColor: '#27C93F' }} />
                <div style={{ height: '0.15vw', flex: 1, backgroundColor: '#27C93F' }} />
                <div style={{ width: '1.2vw', height: '1.2vw', borderRadius: '50%', backgroundColor: '#4F7FFF' }} />
                <div style={{ height: '0.15vw', flex: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
                <div style={{ width: '1.2vw', height: '1.2vw', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.2)' }} />
              </div>
              {/* AI Briefing card */}
              <div style={{ backgroundColor: 'rgba(124,107,240,0.12)', border: '1px solid rgba(124,107,240,0.25)', borderRadius: '0.4vw', padding: '0.8vh 0.8vw', display: 'flex', flexDirection: 'column', gap: '0.4vh' }}>
                <div style={{ fontSize: '0.6vw', color: '#7C6BF0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Briefing</div>
                <div style={{ height: '0.6vw', width: '85%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.2vw' }} />
                <div style={{ height: '0.6vw', width: '70%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '0.2vw' }} />
                <div style={{ height: '0.6vw', width: '55%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '0.2vw' }} />
              </div>
              {/* Comment thread */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
                <div style={{ height: '0.6vw', width: '40%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '0.2vw' }} />
                <div style={{ height: '0.6vw', width: '75%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '0.2vw' }} />
              </div>
              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5vw', marginTop: 'auto' }}>
                <div style={{ flex: 1, height: '1.5vh', backgroundColor: '#4F7FFF', borderRadius: '0.3vw' }} />
                <div style={{ flex: 1, height: '1.5vh', backgroundColor: 'rgba(255,80,80,0.3)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '0.3vw' }} />
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.05vw', fontWeight: 600, marginBottom: '0.4vh' }}>Request Detail</div>
            <div style={{ fontSize: '0.9vw', color: 'rgba(255,255,255,0.5)' }}>Timeline, AI briefing panel, comments, and advance / reject actions</div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', zIndex: 10 }}>FLOWIQ</div>
      <div style={{ position: 'absolute', bottom: '3.5vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>08 / 10</div>
    </div>
  );
}
