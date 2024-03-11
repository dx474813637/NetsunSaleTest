
// import {
// 	User, Setting, Handbag, Pointer, Postcard, Files, Box
// } from "@element-plus/icons-vue"; 
export default [ 
	{
		label: '运营管理',
		type: 'title',
		index: 'yy',
		icon: 'icon-weituodantongji',
		children: [
			{
				label: '员工管理', 
				icon: '',
				index: 'workers_list', 
				role: [2, 3],
				route: {
					name: 'workers_list'
				}
			},
			{
				label: '绑定员工', 
				icon: '',
				index: 'workers_add', 
				role: [ 2, 3],
				route: {
					name: 'workers_add'
				}
			},
			{
				label: '发展团长列表', 
				icon: '',
				index: 'workers2t_list', 
				role: [ 2, 3],
				route: {
					name: 'workers2t_list'
				}
			},
			{
				label: '发展商家列表', 
				icon: '',
				index: 'workers2s_list', 
				role: [ 2 ],
				route: {
					name: 'workers2s_list'
				}
			},
			{
				label: '商家订单', 
				icon: '',
				index: 'shop_order_list', 
				role: [ 2 ],
				route: {
					name: 'shop_order_list'
				}
			},
		]
	}, 
]