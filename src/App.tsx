import SlideDeck from './components/SlideDeck.tsx'
import WelcomeSlide from './slides/WelcomeSlide.tsx'
import AgendaSlide from './slides/AgendaSlide.tsx'
import AboutSlide from './slides/AboutSlide.tsx'
import PlatformSlide from './slides/PlatformSlide.tsx'
import DemosetupSlide from './slides/DemoSetupSlide.tsx'
import DemoErrorsSlide from './slides/DemoErrorsSlide.tsx'
import DemoAppSlide from './slides/DemoAppSlide.tsx'
import DemoPerformanceSlide from './slides/DemoPerformanceSlide.tsx'
import SummarySlide from './slides/SummarySlide.tsx'

const slides = [
  <WelcomeSlide />,
  <AgendaSlide />,
  <AboutSlide />,
  <PlatformSlide />,
  <DemosetupSlide />,
  <DemoErrorsSlide />,
  <DemoAppSlide />,
  <DemoPerformanceSlide />,
  <SummarySlide />,
]

const slideLabels = [
  'Velkommen',
  'Agenda',
  'Hva er Sentry?',
  'Plattform',
  'Oppsett',
  'Feilsporing',
  'Demo-app + Dashboard',
  'Ytelse',
  'Oppsummering',
]

export default function App() {
  return <SlideDeck slides={slides} slideLabels={slideLabels} />
}
