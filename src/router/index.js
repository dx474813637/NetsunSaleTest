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
                    role: [1, 2, 3], 
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
            role: [2, 3]
        },
        redirect: () => ({name: 'workers_list'}),
        component: () => import('@/views/operate/operate.vue'),
        children: [
            {
                path: 'workers_list',
                name: 'workers_list',
                meta: {
                    title: '员工管理', 
                    role: [2, 3],
                },
                component: () => import('@/views/operate/workers_list/workers_list.vue'),
            },
            {
                path: 'workers_add',
                name: 'workers_add',
                meta: {
                    title: '绑定员工', 
                    role: [2, 3],
                },
                component: () => import('@/views/operate/workers_add/workers_add.vue'),
            },
            {
                path: 'workers2t_list',
                name: 'workers2t_list',
                meta: {
                    title: '发展团长列表', 
                    role: [2, 3],
                },
                component: () => import('@/views/operate/workers2role_list/workers2role_list.vue'),
            },
            {
                path: 'workers2s_list',
                name: 'workers2s_list', 
                meta: {
                    title: '发展商家列表',  
                    role: [2],
                }, 
                component: () => import('@/views/operate/workers2shop_list/workers2shop_list.vue'),
            },
            {
                path: 'shop_order_list',
                name: 'shop_order_list', 
                meta: {
                    title: '商家订单',  
                    role: [2],
                }, 
                component: () => import('@/views/operate/shop_order_list/shop_order_list.vue'),
            },
            {
                path: 'om_product_list',
                name: 'om_product_list', 
                meta: {
                    title: '商品列表',  
                    role: [2],
                }, 
                component: () => import('@/views/operate/om_product_list/om_product_list.vue'),
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
