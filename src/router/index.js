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
        redirect: '/product_list'
    },
    {
        path: '/product_list',
        name: 'product_list',
        meta: {
            title: '商品管理', 
        },
        component: () => import('@/views/product_list/product_list.vue'),
    },
    {
        path: '/product_edit/:id',
        name: 'product_edit',
        meta: {
            title: '编辑商品', 
        },
        props:true, 
        component: () => import('@/views/product_edit/product_edit.vue'),
    },
    {
        path: '/product_add',
        name: 'product_add',
        meta: {
            title: '新增商品', 
        },
        component: () => import('@/views/product_edit/product_edit.vue'),
    },
    {
        path: '/sku_list',
        name: 'sku_list',
        meta: {
            title: 'SKU管理', 
        },
        component: () => import('@/views/sku_list/sku_list.vue'),
    }, 
    {
        path: '/order_list',
        name: 'order_list',
        meta: {
            title: '订单管理', 
        },
        component: () => import('@/views/order_list/order_list.vue'),
    }, 
    {
        path: '/service_list',
        name: 'service_list',
        meta: {
            title: '售后管理', 
        },
        component: () => import('@/views/service_list/service_list.vue'),
    }, 
    {
        path: '/change_psw',
        name: 'change_psw',
        meta: {
            title: '密码修改', 
        },
        component: () => import('@/views/change_psw/change_psw.vue'),
    }, 
    {
        path: '/order/:id',
        name: 'order',
        meta: {
            title: '订单详情', 
        },
        props:true, 
        component: () => import('@/views/order/order.vue'),
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
