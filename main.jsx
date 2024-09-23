import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import styles from './index.module.css'
import Coachdash from  './src/components/Coachdash.jsx'
import Coachprofile from './src/components/Coachprofile.jsx'
import ChessBoard from  './src/components/Chessboard.jsx'
import CoachDashboard from './src/components/CoachDashboard.jsx'
// import App from './src/components/admin.jsx'
import Footer from './src/components/footer.jsx'
import Navbar from './src/components/Navbar.jsx'
import SubscriptionChart from './src/components/subscription.jsx'
import ViewChart from './src/components/views.jsx'
import EarningsChart from './src/components/earnings.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CoachDashboard/>
    {/* <h1>Coach Subscription Analysis</h1> */}
      {/* <SubscriptionChart/>
      <ViewChart />
      <EarningsChart/> */}
  </StrictMode>,
)
