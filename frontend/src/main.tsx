import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import './index.css'
import App from './App.tsx'

const basename = import.meta.env.MODE === "production" ? "/nowhere_and_4ever" : "/";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<BrowserRouter basename={basename}>
  <App />
</BrowserRouter>
  </StrictMode>,
)
