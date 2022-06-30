import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BalanceView from '../views/BalanceView.vue'
import ProjectionView from '../views/ProjectionView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/balance/:key',
        name: 'balance',
        component: BalanceView
    },
    {
        path: '/projection',
        name: 'projection',
        component: ProjectionView
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
