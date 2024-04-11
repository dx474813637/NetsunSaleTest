
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
import {userStore} from '@/stores/user'
const user = userStore(pinia)
const { cpy_info, login } = toRefs(user)
// import {
// 	User, Setting, Handbag, Pointer, Postcard, Files, Box
// } from "@element-plus/icons-vue";  
let drafts = {};
let drafts_flag = false;
if(localStorage.getItem('drafts')) {
    drafts = JSON.parse(localStorage.getItem('drafts')) || {};
    drafts_flag = true
}
export const useDraftsStore = defineStore('drafts', {
	persist: {
		enabled: false // true 表示开启持久化保存
	},
	state: () => {
		return {
            // drafts_max: 1,
            drafts,
            drafts_flag
		};
	},  
	actions: { 
        saveDraftsEvent(data) {
            if(this.drafts_flag) {
                ElMessageBox.confirm(
                    '当前草稿箱已存在数据，继续保存将覆盖已有内容',
                    '提示',
                    {
                      confirmButtonText: '保存数据',
                      cancelButtonText: '考虑一下',
                      type: 'warning',
                    }
                )
                .then(() => {
                    this.saveDrafts(data)
                    ElNotification({
                        title: '系统消息',
                        message: '保存成功',
                        type: 'success',
                        position: 'bottom-right',
                    })
                }) 
            }
            else {
                this.saveDrafts(data)
                ElNotification({
                    title: '系统消息',
                    message: '保存成功',
                    type: 'success',
                    position: 'bottom-right',
                })
            }
            
        },
        saveDrafts(data) {
            this.drafts = data;
            console.log(data)
            localStorage.setItem('drafts', JSON.stringify(this.drafts))
            this.drafts_flag = true 
        },
        removeDrafts() {
            let data = {}
            this.drafts = data;
            localStorage.removeItem('drafts')
            this.drafts_flag = false 
        },
	},
});
 