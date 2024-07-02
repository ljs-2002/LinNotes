import { createRouter, createWebHashHistory} from 'vue-router'
import Notes from '@/pages/Notes.vue'
import Home from '@/pages/Home.vue'
import test from '@/pages/test.vue'
const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/notes/:id',
        name: 'Notes',
        component: Notes
    },
    {
        path: '/test/:id',
        component: test
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
})

export default router