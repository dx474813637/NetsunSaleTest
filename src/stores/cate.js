import {
	defineStore
} from 'pinia';
import apis from '@/apis/index'
import menuList from '@/utils/menuList'
import {deepClone} from '@/utils/index'
// import {
// 	User, Setting, Handbag, Pointer, Postcard, Files, Box
// } from "@element-plus/icons-vue"; 

export const cateStore = defineStore('cate', {
	persist: {
		enabled: false // true 表示开启持久化保存
	},
	state: () => {
		return {
			cate_list: [],
			memu_list: [],
			cate_loading: false,
			freight_list: [
				{
					label: '包邮',
					value: '0'
				}
			],
			freight_loading: false,
			regional_list: [],
			regional_loading: false,
			// menuList: menuList,
			warehouse_list: [],
			menus: []
		};
	},
	getters: {
		cate_list_all: (state) => {
			let cate = deepClone(state.cate_list)  
			cate.unshift({
				name: '全部',
				id: ''
			})
			cate.forEach((ele, index) => {
				ele.children && ele.children.unshift({
					name: '全部',
					id: ele.id
				}) 
			}) 
			return cate
		},
		menuList: (state) => {
			let menus = deepClone(state.menus).map((ele, index) => {
				return {
					...ele,
					label: ele.name,
					type: 'title',
					index: `api_${index}`,
					icon: 'icon-xitongguanli',
					children: ele.list.map(item => {
						return {
							label: item.name,
							icon: 'icon-xitongguanli',
							url: item.url
						}
					})
				}
			})
			return [...menuList, ...menus]
		},
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		async getCateData() {
			this.cate_loading = true
			const res = await apis.cate_list();
			this.cate_loading = false
			if (res.code == 1) {
				this.cate_list = res.list
				this.memu_list = res.memu
			}
		},
		async getWarehouseData(needLoading = false) {
			const res = await apis.warehouse_list({ needLoading });
			if (res.code == 1) {
				this.warehouse_list = res.list
			}
		},
		async getMenusData(needLoading = false) {
			const res = await apis.memu({ needLoading });
			if (res.code == 1) {
				this.menus = res.list
			}
		},
		async getFreightData() {
			this.freight_loading = true
			const res = await apis.freight_list();
			this.freight_loading = false
			if (res.code == 1) {
				this.freight_list = res.list
			}
		},
		async getRegionalData() {
			this.regional_loading = true
			const res = await apis.addressDetail();
			this.regional_loading = false
			if (res.code == 1) {
				this.regional_list = JSON.parse(res.regional_list)
				console.log(this.regional_list)
			}
		},
	},
});
