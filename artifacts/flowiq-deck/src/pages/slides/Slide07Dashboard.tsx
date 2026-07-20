export default function Slide07Dashboard() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blobs */}
      <div style={{ position: 'absolute', top: '0', right: '-5vw', width: '40vw', height: '40vw', borderRadius: '50%', backgroundColor: '#4F7FFF', opacity: 0.05, filter: 'blur(10vw)' }} />
      <div style={{ position: 'absolute', bottom: '-15vh', left: '-5vw', width: '35vw', height: '35vw', borderRadius: '50%', backgroundColor: '#7C6BF0', opacity: 0.05, filter: 'blur(9vw)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#7C6BF0', borderRadius: '0.35vw' }} />
        <span style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Main content: left text + right mockup */}
      <div style={{ position: 'absolute', top: '14vh', left: '5vw', right: '5vw', bottom: '10vh', display: 'flex', gap: '4vw', alignItems: 'flex-start' }}>

        {/* Left: text content */}
        <div style={{ flex: '0 0 40%', paddingTop: '1vh' }}>
          <div style={{ display: 'inline-block', padding: '0.5vh 1vw', backgroundColor: 'rgba(79,127,255,0.12)', border: '1px solid rgba(79,127,255,0.28)', borderRadius: '2vw', color: '#4F7FFF', fontSize: '0.85vw', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>
            Visibility
          </div>
          <h2 style={{ fontSize: '3.5vw', fontWeight: 800, margin: '0 0 3vh 0', letterSpacing: '-0.03em', lineHeight: 1.1, textWrap: 'balance' }}>
            Dashboard &<br />
            <span style={{ color: '#4F7FFF' }}>Analytics</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>

            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#4F7FFF', borderRadius: '50%', marginTop: '0.8vh', flexShrink: 0 }} />
              <div style={{ fontSize: '1.1vw', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600 }}>Live KPI tiles —</span> total requests, pending approvals, avg resolution time, SLA compliance %
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#7C6BF0', borderRadius: '50%', marginTop: '0.8vh', flexShrink: 0 }} />
              <div style={{ fontSize: '1.1vw', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600 }}>Request volume by department</span> — spot which teams are overloaded at a glance
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#4F7FFF', borderRadius: '50%', marginTop: '0.8vh', flexShrink: 0 }} />
              <div style={{ fontSize: '1.1vw', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600 }}>Trend charts —</span> weekly submission volumes vs. completion rates over time
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#FFBD2E', borderRadius: '50%', marginTop: '0.8vh', flexShrink: 0 }} />
              <div style={{ fontSize: '1.1vw', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600 }}>AI delay risk flags</span> surface on the dashboard before deadlines are missed
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#7C6BF0', borderRadius: '50%', marginTop: '0.8vh', flexShrink: 0 }} />
              <div style={{ fontSize: '1.1vw', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600 }}>Admin view —</span> full user and department management with role assignment
              </div>
            </div>
          </div>
        </div>

        {/* Right: CSS dashboard mockup */}
        <div style={{ flex: 1, backgroundColor: '#0E1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1vw', overflow: 'hidden', boxShadow: '0 3vh 6vh rgba(0,0,0,0.5)', height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* Mock header bar */}
          <div style={{ padding: '1.2vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#131726' }}>
            <div style={{ display: 'flex', gap: '0.6vw', alignItems: 'center' }}>
              <div style={{ width: '0.6vw', height: '0.6vw', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
              <div style={{ width: '0.6vw', height: '0.6vw', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
              <div style={{ width: '0.6vw', height: '0.6vw', borderRadius: '50%', backgroundColor: '#27C93F' }} />
            </div>
            <div style={{ fontSize: '0.8vw', color: 'rgba(255,255,255,0.3)' }}>FlowIQ Dashboard</div>
            <div style={{ width: '4vw' }} />
          </div>

          <div style={{ flex: 1, padding: '1.5vh 1.5vw', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            {/* KPI tiles row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1vw' }}>
              <div style={{ backgroundColor: '#1A1F35', borderRadius: '0.5vw', padding: '1.2vh 1vw', border: '1px solid rgba(79,127,255,0.2)' }}>
                <div style={{ fontSize: '0.7vw', color: 'rgba(255,255,255,0.45)', marginBottom: '0.5vh' }}>Total Requests</div>
                <div style={{ fontSize: '1.8vw', fontWeight: 800, color: '#4F7FFF' }}>13</div>
              </div>
              <div style={{ backgroundColor: '#1A1F35', borderRadius: '0.5vw', padding: '1.2vh 1vw', border: '1px solid rgba(255,189,46,0.2)' }}>
                <div style={{ fontSize: '0.7vw', color: 'rgba(255,255,255,0.45)', marginBottom: '0.5vh' }}>Pending</div>
                <div style={{ fontSize: '1.8vw', fontWeight: 800, color: '#FFBD2E' }}>5</div>
              </div>
              <div style={{ backgroundColor: '#1A1F35', borderRadius: '0.5vw', padding: '1.2vh 1vw', border: '1px solid rgba(39,201,63,0.2)' }}>
                <div style={{ fontSize: '0.7vw', color: 'rgba(255,255,255,0.45)', marginBottom: '0.5vh' }}>SLA Rate</div>
                <div style={{ fontSize: '1.8vw', fontWeight: 800, color: '#27C93F' }}>87%</div>
              </div>
              <div style={{ backgroundColor: '#1A1F35', borderRadius: '0.5vw', padding: '1.2vh 1vw', border: '1px solid rgba(124,107,240,0.2)' }}>
                <div style={{ fontSize: '0.7vw', color: 'rgba(255,255,255,0.45)', marginBottom: '0.5vh' }}>Avg Time</div>
                <div style={{ fontSize: '1.8vw', fontWeight: 800, color: '#7C6BF0' }}>2.4d</div>
              </div>
            </div>

            {/* Chart mock */}
            <div style={{ flex: 1, backgroundColor: '#1A1F35', borderRadius: '0.5vw', padding: '1.5vh 1.5vw', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              <div style={{ fontSize: '0.75vw', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Requests by Department</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '0.8vw' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6vh' }}>
                  <div style={{ width: '100%', height: '75%', backgroundColor: '#4F7FFF', borderRadius: '0.3vw 0.3vw 0 0', opacity: 0.85 }} />
                  <div style={{ fontSize: '0.65vw', color: 'rgba(255,255,255,0.4)' }}>Legal</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6vh' }}>
                  <div style={{ width: '100%', height: '55%', backgroundColor: '#7C6BF0', borderRadius: '0.3vw 0.3vw 0 0', opacity: 0.85 }} />
                  <div style={{ fontSize: '0.65vw', color: 'rgba(255,255,255,0.4)' }}>Finance</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6vh' }}>
                  <div style={{ width: '100%', height: '90%', backgroundColor: '#4F7FFF', borderRadius: '0.3vw 0.3vw 0 0', opacity: 0.85 }} />
                  <div style={{ fontSize: '0.65vw', color: 'rgba(255,255,255,0.4)' }}>HR</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6vh' }}>
                  <div style={{ width: '100%', height: '40%', backgroundColor: '#7C6BF0', borderRadius: '0.3vw 0.3vw 0 0', opacity: 0.85 }} />
                  <div style={{ fontSize: '0.65vw', color: 'rgba(255,255,255,0.4)' }}>IT</div>
                </div>
              </div>
            </div>

            {/* Recent activity rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', padding: '0.8vh 1vw', backgroundColor: 'rgba(79,127,255,0.07)', borderRadius: '0.4vw', border: '1px solid rgba(79,127,255,0.12)' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', backgroundColor: '#27C93F', flexShrink: 0 }} />
                <div style={{ fontSize: '0.75vw', color: 'rgba(255,255,255,0.7)', flex: 1 }}>Contract Review — Legal — Completed</div>
                <div style={{ fontSize: '0.7vw', color: 'rgba(255,255,255,0.35)' }}>2h ago</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', padding: '0.8vh 1vw', backgroundColor: 'rgba(255,189,46,0.05)', borderRadius: '0.4vw', border: '1px solid rgba(255,189,46,0.12)' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', backgroundColor: '#FFBD2E', flexShrink: 0 }} />
                <div style={{ fontSize: '0.75vw', color: 'rgba(255,255,255,0.7)', flex: 1 }}>Budget Approval — Finance — Pending review</div>
                <div style={{ fontSize: '0.7vw', color: 'rgba(255,255,255,0.35)' }}>5h ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', zIndex: 10 }}>FLOWIQ</div>
      <div style={{ position: 'absolute', bottom: '3.5vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>07 / 10</div>
    </div>
  );
}
