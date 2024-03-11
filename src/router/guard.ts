import router from '@/router'
import {toRefs} from 'vue'
// 导入进度条
import { start, close } from "@/utils/nporgress";
import pinia from '@/stores/index';  
import {userStore} from '@/stores/user'
import {useSettingsStore} from '@/stores/settings'
import {useFinanceStore} from '@/stores/finance'
import {cateStore} from '@/stores/cate'
import { ElMessage, ElMessageBox  } from 'element-plus'
router.beforeEach(async (to, from, next) => {
    const useSettings = useSettingsStore(pinia)
    const user = userStore(pinia)
    const finance = useFinanceStore(pinia)
    const cate = cateStore(pinia)
    const {account_info} = toRefs(finance)
    const {cpy_info} = toRefs(user)
    const {role} = toRefs(cate)
    
    start() 

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
            return  
        }
        
    } 
    if(role.value === '') { 
        await cate.getMenusData();
    }
    if(to?.meta?.role && !to.meta.role.includes(role.value) ) {
        next(from)
        return
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