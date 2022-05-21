import {createRouter, createWebHashHistory} from 'vue-router'
import store from "../store/store"

const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@components/index/Index.vue'),
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: 'Content',
                component: () => import('@components/main/Content.vue'),
            },
            {
                path: '/system',
                name: 'System',
                redirect: '/user',
                component: () => import('@components/system/System.vue'),
                children: [
                    {
                        path: '/user',
                        name: 'User',
                        component: () => import('@components/system/user/ScUser.vue'),
                    },
                    {
                        path: '/role',
                        name: 'Role',
                        component: () => import('@components/system/role/ScRole.vue'),
                    },
                    {
                        path: '/menu',
                        name: 'Menu',
                        component: () => import('@components/system/menu/ScMenu.vue'),
                    },
                    {
                        path: '/dept',
                        name: 'Dept',
                        component: () => import('@components/system/dept/ScDept.vue'),
                    },
                    {
                        path: '/log',
                        name: 'Log',
                        component: () => import('@components/system/log/ScLog.vue'),
                    },
                    {
                        path: '/adminserver',
                        name: 'AdminServer',
                        component: () => import('@components/monitor/admin/AdminServer.vue'),
                    },
                    {
                        path: '/zipkin',
                        name: 'Zipkin',
                        component: () => import('@components/monitor/zipkin/Zipkin.vue'),
                    },
                    {
                        path: '/online',
                        name: 'Online',
                        component: () => import('@components/monitor/zipkin/Zipkin.vue'),
                    },
                ]
            },
            {
                path: '/center',
                name: 'Center',
                component: () => import('@components/system/System.vue'),
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@components/login/Login.vue'),
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (!store.getters.auth && to.path !== '/login') {
        next({path: '/login'})
    } else {
        next()
    }
})

router.afterEach((to, from) => {

})

export default router
