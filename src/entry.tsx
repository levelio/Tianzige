import { StartClient } from '@tanstack/react-start/client'

import App from './app'

const rootElement = document.getElementById('app')

StartClient(App, rootElement)
