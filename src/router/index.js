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
        redirect: () => ({name: 'product_list'}),
        component: () => import('@/views/index/index.vue'),
        children: [ 
            {
                path: 'product_list',
                name: 'product_list',
                meta: {
                    title: '商品管理', 
                },
                component: () => import('@/views/index/product_list/product_list.vue'),
            },
            {
                path: 'shop_info',
                name: 'shop_info',
                meta: {
                    title: '旺铺信息', 
                },
                component: () => import('@/views/index/shop_info/shop_info.vue'),
            },
            {
                path: 'return_add',
                name: 'return_add',
                meta: {
                    title: '退货地址', 
                },
                component: () => import('@/views/index/return_add/return_add.vue'),
            },
            {
                path: 'qua_ce',
                name: 'qua_ce',
                meta: {
                    title: '资质证书', 
                },
                component: () => import('@/views/index/qua_ce/qua_ce.vue'),
            },
            {
                path: 'product_edit/:id',
                name: 'product_edit',
                meta: {
                    title: '编辑商品', 
                    rz: true
                },
                props:true, 
                component: () => import('@/views/index/product_edit/product_edit.vue'),
            },
            {
                path: 'product_add',
                name: 'product_add',
                meta: {
                    title: '新增商品', 
                    rz: true
                },
                component: () => import('@/views/index/product_edit/product_edit.vue'),
            },
            {
                path: 'sku_list',
                name: 'sku_list',
                meta: {
                    title: 'SKU管理', 
                },
                component: () => import('@/views/index/sku_list/sku_list.vue'),
            }, 
            {
                path: 'order_list',
                name: 'order_list',
                meta: {
                    title: '订单管理', 
                },
                component: () => import('@/views/index/order_list/order_list.vue'),
            }, 
            {
                path: 'service_list',
                name: 'service_list',
                meta: {
                    title: '售后管理', 
                },
                component: () => import('@/views/index/service_list/service_list.vue'),
            }, 
            {
                path: 'change_psw',
                name: 'change_psw',
                meta: {
                    title: '密码修改', 
                },
                component: () => import('@/views/index/change_psw/change_psw.vue'),
            }, 
            {
                path: 'order/:id',
                name: 'order',
                meta: {
                    title: '订单详情', 
                },
                props:true, 
                component: () => import('@/views/index/order/order.vue'),
            }, 
            {
                path: 'web_view/',
                name: 'web_view',
                meta: {
                    title: '详情', 
                }, 
                component: () => import('@/views/index/web_view/web_view.vue'),
            }, 
        ]
    },
    {
        path: '/operate',
        name: 'operate',
        redirect: () => ({name: 'workers_list'}),
        component: () => import('@/views/operate/operate.vue'),
        children: [
            {
                path: 'workers_list',
                name: 'workers_list',
                meta: {
                    title: '员工管理', 
                },
                component: () => import('@/views/operate/workers_list/workers_list.vue'),
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
