import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// config
var app= createApp(App)
app.use(VueAxios, axios)

// start
app.mount('#app')
