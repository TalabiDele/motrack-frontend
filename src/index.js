import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import 'leaflet/dist/leaflet.css'
import { AuthProvider } from './components/context/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	// <React.StrictMode>
	<Router>
		<AuthProvider>
			<App />
		</AuthProvider>
	</Router>
	// </React.StrictMode>
)

serviceWorkerRegistration.register()

reportWebVitals()
