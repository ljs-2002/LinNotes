import { createApp } from 'vue'
import {createPinia} from 'pinia'
import notes from '@/pages/notes.vue'

const pinia = createPinia()
createApp(notes).use(pinia).mount('#notes')