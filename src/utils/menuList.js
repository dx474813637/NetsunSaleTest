
// import {
// 	User, Setting, Handbag, Pointer, Postcard, Files, Box
// } from "@element-plus/icons-vue"; 
export default [ 
	{
		label: '旺铺管理',
		type: 'title',
		index: '1',
		icon: 'icon-shiyanshifangjian',
		children: [
			{
				label: '旺铺信息', 
				icon: '',
				index: 'shop_info', 
				route: {
					name: 'shop_info'
				}
			},
			{
				label: '退货地址', 
				icon: '',
				index: 'return_add', 
				route: {
					name: 'return_add'
				}
			},
			{
				label: '资质证书', 
				icon: '',
				index: 'qua_ce', 
				route: {
					name: 'qua_ce'
				}
			},
			{
				label: '子账户列表', 
				icon: '',
				index: 'sub_acc', 
				route: {
					name: 'sub_acc'
				}
			},
			{
				label: '供应商结算', 
				icon: '',
				index: 'out_pay_apply', 
				route: {
					name: 'out_pay_apply'
				}
			},
		]
	},
	{
		label: '商品管理',
		type: 'title',
		index: '2',
		icon: 'icon-gongyingshang',
		children: [
			{
				label: '商品发布', 
				icon: '',
				index: 'product_add', 
				route: {
					name: 'product_add'
				}
			},
			{
				label: '商品列表', 
				icon: '',
				index: 'product_list', 
				route: {
					name: 'product_list'
				}
			},
			{
				label: 'sku列表', 
				icon: '',
				index: 'sku_list', 
				route: {
					name: 'sku_list'
				}
			}, 
			{
				label: '订单管理',
				icon: '',
				index: 'order_list', 
				route: {
					name: 'order_list'
				}  
			},
			{
				label: '售后管理',
				icon: '',
				index: 'service_list', 
				route: {
					name: 'service_list'
				}  
			},
		]
	}, 
	{
		label: '账户管理',
		type: 'title',
		index: '3',
		icon: 'icon-quanxianguanli',
		children: [
			{
				label: '修改密码', 
				icon: '',
				index: 'change_psw', 
				route: {
					name: 'change_psw'
				}
			},
			{
				label: '退出登录', 
				url: 'https://www.sunmaxx.cn/Index/logout',
				linkWay: 'replace'
			},
		], 
	}, 
	{
		label: '运营管理',
		type: 'title',
		index: 'yy',
		icon: 'icon-weituodantongji',
		children: [
			{
				label: '员工管理', 
				icon: '',
				index: 'workers_list2', 
				route: {
					name: 'workers_list2'
				}
			},
			{
				label: '绑定员工', 
				icon: '',
				index: 'workers_add2', 
				route: {
					name: 'workers_add2'
				}
			},
		], 
	}, 
]