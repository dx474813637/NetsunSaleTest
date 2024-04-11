
import pinia from '@/stores/index';  
import {
	defineStore
} from 'pinia';
import { ElNotification, ElMessageBox } from 'element-plus'
import apis from '@/apis/index'
// import menuList from '@/utils/menuList' 
// import menuList2 from '@/utils/menuList_operate' 
import {deepClone, initAddressData} from '@/utils/index' 
import router from '@/router/guard' 
// import {
// 	User, Setting, Handbag, Pointer, Postcard, Files, Box
// } from "@element-plus/icons-vue";   
export const useExpressStore = defineStore('express', { 
	state: () => {
		return {
            express_pay_list: [],
            express_list: [],
            express_list_loading: false
		};
	},  
	actions: {  
		async getExpressData(needLoading = false) {
            if(this.express_list_loading) return;
            this.express_list_loading = true
			const res = await apis.express_dictionary({ needLoading });
			if (res.code == 1) {
				this.express_list = res.list
				this.express_pay_list = res.list1
			} 
            this.express_list_loading = false
		},
        expressPayType2Str(v) {
            return this.express_pay_list.filter(ele => ele.value == v)[0].name
        }
	},
});
 