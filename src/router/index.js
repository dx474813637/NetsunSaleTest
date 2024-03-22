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
                    title: '商品管理',  
                    role: [1, 2, 3], 
                },
                component: () => import('@/views/index/product_list/product_list.vue'),
            },
            {
                path: 'shop_info',
                name: 'shop_info',
                meta: {
                    title: '旺铺信息', 
                    role: [1, 2, 3], 
                },
                component: () => import('@/views/index/shop_info/shop_info.vue'),
            },
            {
                path: 'return_add',
                name: 'return_add',
                meta: {
                    title: '退货地址', 
                    role: [1, 2, 3], 
                },
                component: () => import('@/views/index/return_add/return_add.vue'),
            },
            {
                path: 'qua_ce',
                name: 'qua_ce',
                meta: {
                    title: '资质证书',  
                    role: [1, 2, 3], 
                },
                component: () => import('@/views/index/qua_ce/qua_ce.vue'),
            },
            {
                path: 'sub_acc',
                name: 'sub_acc',
                meta: {
                    title: '子账号列表',  
                    role: [1, 2, 3], 
                },
                component: () => import('@/views/index/sub_acc/sub_acc.vue'),
            },
            {
                path: 'sub_acc_edit/:id',
                name: 'sub_acc_edit',
                meta: {
                    title: '编辑子账号密码',  
                    role: [1, 2, 3], 
                },
                props:true, 
                component: () => import('@/views/index/sub_acc_edit/sub_acc_edit.vue'),
            },
            {
                path: 'sub_acc_add',
                name: 'sub_acc_add',
                meta: {
                    title: '新增子账号',  
                    role: [1, 2, 3], 
                },
                props:true, 
                component: () => import('@/views/index/sub_acc_edit/sub_acc_edit.vue'),
            },
            {
                path: 'product_edit/:id',
                name: 'product_edit',
                meta: {
                    title: '编辑商品',  
                    role: [1, 2, 3],
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
                    role: [1, 2, 3],
                    rz: true
                },
                component: () => import('@/views/index/product_edit/product_edit.vue'),
            },
            {
                path: 'sku_list',
                name: 'sku_list',
                meta: {
                    title: 'SKU管理', 
                    role: [1, 2, 3], 
                },
                component: () => import('@/views/index/sku_list/sku_list.vue'),
            }, 
            {
                path: 'order_list',
                name: 'order_list',
                meta: {
                    title: '订单管理', 
                    role: [1, 2, 3, 4] 
                },
                component: () => import('@/views/index/order_list/order_list.vue'),
            }, 
            {
                path: 'service_list',
                name: 'service_list',
                meta: {
                    title: '售后管理', 
                    role: [1, 2, 3],
                },
                component: () => import('@/views/index/service_list/service_list.vue'),
            }, 
            {
                path: 'change_psw',
                name: 'change_psw',
                meta: {
                    title: '密码修改',  
                    role: [1, 2, 3, 4],
                },
                component: () => import('@/views/index/change_psw/change_psw.vue'),
            }, 
            {
                path: 'order/:id',
                name: 'order',
                meta: {
                    title: '订单详情', 
                    role: [],
                },
                props:true, 
                component: () => import('@/views/index/order/order.vue'),
            }, 
            {
                path: 'web_view/',
                name: 'web_view',
                meta: {
                    title: '详情', 
                    role: [1, 2, 3, 4],
                }, 
                component: () => import('@/views/index/web_view/web_view.vue'),
            }, 
            {
                path: 'workers_list',
                name: 'workers_list2',
                meta: {
                    title: '员工管理', 
                    role: [1, 2, 3],
                },
                component: () => import('@/views/operate/workers_list/workers_list2.vue'),
            },
            {
                path: 'workers_add',
                name: 'workers_add2',
                meta: {
                    title: '绑定员工', 
                    role: [1, 2, 3], 
                },
                component: () => import('@/views/operate/workers_add/workers_add2.vue'),
            },
            {
                path: 'out_pay_bind',
                name: 'out_pay_bind', 
                meta: {
                    title: '提现账户绑定',
                    rz: true,
                    role: [1, 2, 3], 
                    mode: 'bind'
                },
                component: () => import('@/views/index/out_pay_apply/out_pay_apply.vue'),
            },
            {
                path: 'out_pay_apply',
                name: 'out_pay_apply', 
                meta: {
                    title: '提现申请', 
                    role: [], 
                    mode: 'apply'
                },
                component: () => import('@/views/index/out_pay_apply/out_pay_apply.vue'),
            },
            {
                path: 'statement_list',
                name: 'statement_list',
                meta: {
                    title: '提现列表', 
                    role: [], 
                },
                component: () => import('@/views/index/statement_list/statement_list.vue'),
            },
            {
                path: 'order_statement_list',
                name: 'order_statement_list',
                meta: {
                    title: '资金中心', 
                    role: [1, 2, 3], 
                },
                component: () => import('@/views/index/order_statement_list/order_statement_list.vue'),
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
