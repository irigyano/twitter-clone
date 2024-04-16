import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'

const app = createApp(App)

const head = createHead()
const pinia = createPinia()

app.use(head)
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
