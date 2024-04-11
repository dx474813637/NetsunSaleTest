import {
	defineStore
} from 'pinia';
import apis from '@/apis/index'
// import { useStoreB } from '@/store/modules/page_b';
// const storeB = useStoreB();
// let { pniaBcuntData } = storeToRefs(storeB);

export const userStore = defineStore('user', {
	persist: {
		enabled: true, // true 表示开启持久化保存 默认保存到sessionStorage 
		// strategies: [
		// 	{
		// 		key: 'user',
		// 		storage: localStorage,
		// 		paths: ['name']
		// 	},
		// ],
		// strategies: [
		// 	{ storage: sessionStorage, paths: ['name'] },
		// 	{ storage: localStorage, paths: ['age'] },
		// ],
	},
	state: () => {
		return {
			user_info: {},
			user_loading: false,
			cpy_info: {},
			cpy_loading: false,
			role: '',
			roleStr: [
				{
					role: '1',
					name: '商家',
					api_name: { 
						index: 'menuList'
					}
				},
				{
					role: '2',
					name: '运营商',
					api_name: {
						operate: 'menuList_operate',
						index: 'menuList'
					}
				},
				{
					role: '3',
					name: 'VIP商家',
					api_name: {
						operate: 'menuList_operate',
						index: 'menuList'
					} 
				},
				{
					role: '4',
					name: '子账户',
					api_name: { 
						index: 'menuList'
					}  
				},
			],
			subAccount: [],
		};
	},
	getters: {
		login: (state) => state.cpy_info.login || localStorage.getItem('login'),
		roleName:  (state) => state.roleStr.filter(ele => ele.role == state.role)[0]?.name,
		roleName2:  (state) => state.roleStr.filter(ele => ele.role != state.role)[0]?.name,
		roleApiName: (state) => state.roleStr.filter(ele => ele.role == state.role)[0]?.api_name, 
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		logout() {
			console.log('清除token 登录过期')
			this.user_info = {}
			this.cpy_info = {}
			localStorage.removeItem('token')
			localStorage.removeItem('login')
		},
		async getRoleData(needLoading = false) {
			const res = await apis.getAccRole({ loading: needLoading });
			if (res.code == 1) {
				this.role = res.role
			}
		},
		async getSubAccData(needLoading = false) {
			const res = await apis.sub_account({ params: {all: 1},loading: needLoading });
			if (res.code == 1) {
				this.subAccount = res.list
			}
		},
		async getUserData(needLoading = false) {
			this.user_loading = true
			const res = await apis.my_card({ loading: needLoading });
			this.user_loading = false
			if (res.code == 1) {
				this.user_info = res.list
				localStorage.setItem('login', this.login)
			}
		},
		async getCpyData(needLoading = false) {
			this.cpy_loading = true
			const res = await apis.company_detail({ loading: needLoading });
			this.cpy_loading = false
			if (res.code == 1) {
				this.cpy_info = res.list || {}
			}
		},
	},
});
