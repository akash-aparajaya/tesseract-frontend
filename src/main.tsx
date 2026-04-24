import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// App = main UI of your application
import App from "./app/App";

// Global styles applied to entire app
import "./styles/global.css";
import "./styles/variables.css";


// Create React root and render the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)