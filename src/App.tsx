import { useState } from 'react'
import ThreatRadar from './ThreatRadar'
import ThreatRadar2 from './ThreatRadar2'
import Interventions from './Interventions'
import EarlyWarning from './EarlyWarning'

function App() {
  const [currentPage, setCurrentPage] = useState<string>('threat-radar')

  return (
    <>
      {currentPage === 'threat-radar' && <ThreatRadar onNavigate={setCurrentPage} />}
      {currentPage === 'threat-radar-2' && <ThreatRadar2 onNavigate={setCurrentPage} />}
      {currentPage === 'interventions' && <Interventions onNavigate={setCurrentPage} />}
      {currentPage === 'early-warning' && <EarlyWarning onNavigate={setCurrentPage} />}
    </>
  )
}

export default App
