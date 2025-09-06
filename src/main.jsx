import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './utils/App.jsx'
import './index.css'

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{navigator.serviceWorker.register('/service-worker.js').catch(()=>{})})
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
