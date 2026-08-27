import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import router from './router'
import App from './App.vue'
import { initImageFade } from './utils/imgFade'

import './assets/fonts.css'   // self-hosted @font-face (replaces Google Fonts <link>)
import 'primeicons/primeicons.css'
import './assets/scss/main.scss'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',
      cssLayer: false
    }
  }
})

app.use(router)
app.mount('#app')

// Soft fade-in for images as they load (see src/utils/imgFade.js)
initImageFade()
