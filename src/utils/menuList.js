
import {
	User, Setting, Handbag, Pointer, Postcard, Files, Box
} from "@element-plus/icons-vue"; 
export default [ 
	{
		label: '商品管理',
		type: 'title',
		index: '2',
		icon: Setting,
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
		icon: Setting,
		children: [
			{
				label: '修改密码', 
				icon: '',
				index: 'change_psw', 
				route: {
					name: 'change_psw'
				}
			},
		], 
	}, 
]