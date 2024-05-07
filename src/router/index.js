//引入路由对象
import { createRouter, createWebHistory, createWebHashHistory, RouterView } from 'vue-router'

//vue2 mode history vue3 createWebHistory
//vue2 mode  hash  vue3  createWebHashHistory
//vue2 mode abstact vue3  createMemoryHistory

//路由数组的类型 RouteRecordRaw
// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes = [
    {
        path: '/',
        redirect: () => ({name: 'product_list'}),
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',   
        },
        component: () => import('@/views/login/login.vue'),
    },
    {
        path: '/index',
        name: 'index',
        meta: {
            role: [1, 2, 3, 4]
        },
        redirect: () => ({name: 'product_list'}),
        component: () => import('@/views/index/index.vue'),
        children: [
            {
                path: 'product_list',
                name: 'product_list',
                meta: {
                    title: '商品',   
                },
                component: () => import('@/views/index/product_list/product_list.vue'),
            },
            {
                path: '/product/:id',
                name: 'product',
                meta: {
                    title: '商品详情',
                    cache: true,
                },
                props:true, 
                component: () => import('@/views/index/product/product.vue')
            }, 
        ]
    },
    {
        path: '/operate',
        name: 'operate',
        meta: {
            role: [2, 3],
            login: true
        },
        redirect: () => ({name: 'order_list'}),
        component: () => import('@/views/operate/operate.vue'),
        children: [ 
            {
                path: 'order_list',
                name: 'order_list', 
                meta: {
                    title: '订单列表',  
                    role: [2],

                }, 
                component: () => import('@/views/operate/order_list/order_list.vue'),
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/error/404.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//导出router
export default router
