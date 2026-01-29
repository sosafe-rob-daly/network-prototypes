import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import ThreatRadar from './ThreatRadar'
import ThreatRadar2 from './ThreatRadar2'
import Interventions from './Interventions'
import EarlyWarning from './EarlyWarning'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/threat-radar" replace />} />
        <Route path="/threat-radar" element={<ThreatRadar />} />
        <Route path="/threat-radar-2" element={<ThreatRadar2 />} />
        <Route path="/interventions" element={<Interventions />} />
        <Route path="/early-warning" element={<EarlyWarning />} />
      </Routes>
    </HashRouter>
  )
}

export default App
