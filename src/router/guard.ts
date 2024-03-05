import router from '@/router'
import {toRefs} from 'vue'
// 导入进度条
import { start, close } from "@/utils/nporgress";
import pinia from '@/stores/index';  
import {userStore} from '@/stores/user'
import {useSettingsStore} from '@/stores/settings'
import {useFinanceStore} from '@/stores/finance'
import { ElMessage, ElMessageBox  } from 'element-plus'
router.beforeEach(async (to, from, next) => {
    const useSettings = useSettingsStore(pinia)
    const user = userStore(pinia)
    const finance = useFinanceStore(pinia)
    const {account_info} = toRefs(finance)
    const {cpy_info} = toRefs(user)
    
    start()
    // console.log(to, from)
    // if(to?.meta?.isAuth) {
    //     if( to.matched.some(ele => ele.meta.isAuth) && !localStorage.getItem('token')) {
    //         // router.push({ name: 'login' })
    //         useSettings.goLogin()
    //         useSettings.setPrevPage(to)
    //         return
    //     }
    //     else if(!user.login && to.name != 'user_index') {  
    //         user.getUserData()
    //     }
    // }
   
    // if(to?.meta?.isFinanceAuth && to.matched.some(ele => ele.meta.isFinanceAuth) && !account_info.hasOwnProperty('state')) {
    //     await finance.getAccountData(true);
    //     if(account_info.value.organizations_id) { 
    //         finance.getCpyData();
    //     } 
    // }

    if(to?.meta?.rz && cpy_info.value.rz == 0) {
        // console.log(router)
        // router.back()
        await user.getCpyData();
        if(cpy_info.value.rz == 0) {
            ElMessageBox.confirm(
                '该功能需要认证旺铺信息，请先完成认证',
                '提示',
                {
                  confirmButtonText: '立即认证',
                  cancelButtonText: '考虑一下',
                  type: 'warning',
                }
            )
            .then(() => {
                router.push({name: 'shop_info'})
            }) 
            next(from)
        }
        
        // return  
    } 
    if(to?.meta?.title) {
        // document.title = to?.meta?.title
        useSettings.setTitle(to.meta.title)
    } 
    next()
})

router.afterEach(() => {
    close()
})

export default router