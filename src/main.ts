import { createApp } from "vue"

import App from "./App.vue"
import router from "./router"
// @ts-ignore
import { registerSW } from "virtual:pwa-register"

import "./assets/main.css"

const app = createApp(App)

app.use(router)

app.mount("#app")

// Enregistrer le Service Worker avec interval de 30s pour les mises à jour
registerSW({ immediate: true })

