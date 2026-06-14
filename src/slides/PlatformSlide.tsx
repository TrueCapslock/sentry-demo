import sentryIcon from '../assets/sentry-icon.png'
import glitchtipIcon from '../assets/glitchtip-icon.svg'

export default function PlatformSlide() {
  return (
    <div className="slide">
      <h2>Plattform</h2>
      <p className="demo-intro">Samme SDK — to backend-alternativer</p>
      <div className="platform-cards">
        <div className="card platform-card">
          <img src={glitchtipIcon} className="platform-logo" alt="GlitchTip" />
          <h3>GlitchTip</h3>
          <p className="platform-url"><a href="https://glitchtip.backstage.prokom.no/prokom/issues?project=2" target="_blank" rel="noopener noreferrer">glitchtip.backstage.prokom.no</a></p>
          <p className="platform-desc">Open source, selv-hostet, Sentry-kompatibel API. Brukes internt i Prokom.</p>
        </div>
        <div className="card platform-card">
          <img src={sentryIcon} className="platform-logo" alt="Sentry" />
          <h3>Sentry.io</h3>
          <p className="platform-url"><a href="https://prokom.sentry.io/issues/?environment=development&project=4511564169478224&statsPeriod=1h" target="_blank" rel="noopener noreferrer">sentry.io</a></p>
          <p className="platform-desc">SaaS — fullt feature-sett inkl. Session Replay, Performance, og mer.</p>
        </div>
      </div>
      <p className="platform-note">
        Begge bruker <code>@sentry/react</code> — eneste forskjell er DSN.<br />
        Bytt DSN i <code>src/main.tsx</code> for å velge plattform.
      </p>
    </div>
  )
}
