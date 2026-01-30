import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import ThreatRadar from './ThreatRadar'
import ThreatRadar2 from './ThreatRadar2'
import Interventions from './Interventions'
import EarlyWarning from './EarlyWarning'
import SofieDashboard from './SofieDashboard'
import InterventionsOld from './InterventionsOld'
import EarlyWarningOld from './EarlyWarningOld'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/threat-radar" replace />} />
        <Route path="/threat-radar" element={<ThreatRadar2 />} />
        <Route path="/threat-radar-2" element={<ThreatRadar />} />
        <Route path="/interventions" element={<Interventions />} />
        <Route path="/early-warning" element={<EarlyWarning />} />
        <Route path="/sofie-dashboard" element={<SofieDashboard />} />
        <Route path="/interventions-old" element={<InterventionsOld />} />
        <Route path="/early-warning-old" element={<EarlyWarningOld />} />
      </Routes>
    </HashRouter>
  )
}

export default App
