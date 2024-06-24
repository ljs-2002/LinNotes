import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/pages/helloworld.vue')
    },
    // {
    //     path: '/home',
    //     component: () => import('@/pages/home.vue')
    // },
    {
        path: '/notes:id',
        component: () => import('@/pages/notes.vue')
    },
    {
        path: '/test:id',
        component: () => import('@/pages/test.vue')
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(),
})

export default router