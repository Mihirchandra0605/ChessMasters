import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import styles from './index.module.css'
import Coachdash from  './src/components/Coachdash.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className={`${styles.CoachDash}`}>
    <Coachdash />
    </div>
  </StrictMode>,
)
