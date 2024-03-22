[ 
	{
		"label": "旺铺管理",
		"type": "title",
		"index": "1",
		"role": "[1, 2, 3]",
		"icon": "icon-shiyanshifangjian",
		"children": [
			{
				"label": "旺铺信息", 
				"icon": "",
				"index": "shop_info",  
				"role": "[1, 2, 3]",
				"route": {
					"name": "shop_info"
				}
			},
			{
				"label": "退货地址", 
				"icon": "",
				"index": "return_add", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "return_add"
				}
			},
			{
				"label": "资质证书", 
				"icon": "",
				"index": "qua_ce", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "qua_ce"
				}
			},
			{
				"label": "子账户列表", 
				"icon": "",
				"index": "sub_acc", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "sub_acc"
				}
			},
			{
				"label": "商品发布", 
				"icon": "",
				"index": "product_add", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "product_add"
				}
			},
			{
				"label": "商品列表", 
				"icon": "",
				"index": "product_list", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "product_list"
				}
			}
		]
	},
	{
		"label": "订单中心",
		"type": "title",
		"index": "2",
		"role": "[1, 2, 3, 4]",
		"icon": "icon-gongyingshang",
		"children": [ 
			{
				"label": "订单管理",
				"icon": "",
				"index": "order_list", 
				"role": "[1, 2, 3, 4]",
				"route": {
					"name": "order_list"
				}  
			},
			{
				"label": "售后管理",
				"icon": "",
				"index": "service_list", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "service_list"
				}  
			},
			{
				"label": "待发货订单",
				"icon": "", 
				"role": "[1, 2, 3]",
				"url": "https://www.sunmaxx.cn/User/down_order"
			}
		]
	}, 
	{
		"label": "运营管理",
		"type": "title",
		"index": "yy",
		"icon": "icon-weituodantongji",
		"role": "[1, 2, 3]",
		"children": [
			{
				"label": "员工管理", 
				"icon": "",
				"index": "workers_list2",
				"role": "[1, 2, 3]", 
				"route": {
					"name": "workers_list2"
				}
			},
			{
				"label": "绑定员工", 
				"icon": "",
				"index": "workers_add2", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "workers_add2"
				}
			}
		]
	}, 
	{
		"label": "结算中心",
		"type": "title",
		"index": "zj",
		"icon": "icon-baojiadan",
		"role": "[1, 2, 3]", 
		"children": [
			{
				"label": "提现账户绑定", 
				"icon": "",
				"index": "out_pay_bind", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "out_pay_bind"
				}
			}, 
			{
				"label": "资金中心", 
				"icon": "",
				"index": "order_statement_list", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "order_statement_list"
				} 
			}, 
			{
				"label": "开票信息", 
				"icon": "",
				"role": "[1, 2, 3]", 
				"url": "https://www.sunmaxx.cn/User/kaipiao" 
			}
		]
	}, 
	{
		"label": "账户管理",
		"type": "title",
		"index": "3",
		"role": "[1, 2, 3, 4]", 
		"icon": "icon-quanxianguanli",
		"children": [
			{
				"label": "修改密码", 
				"icon": "",
				"index": "change_psw", 
				"role": "[1, 2, 3, 4]", 
				"route": {
					"name": "change_psw"
				}
			},
			{
				"label": "退出登录", 
				"role": "[1, 2, 3, 4]", 
				"url": "https://www.sunmaxx.cn/Index/logout",
				"linkWay": "replace"
			}
		] 
	}
]