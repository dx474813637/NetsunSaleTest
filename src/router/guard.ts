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
    const {cpy_info, role} = toRefs(user)
    const { router_mode, menus } = toRefs(cate)
    
    start()
    // let getCpy = false
    // if(!cpy_info.value.hasOwnProperty('id')) {
    //     await user.getCpyData();
    //     getCpy = true
    // }
    let needLogin = to.matched.some(ele => ele.meta?.login)
    if(needLogin && !localStorage.getItem('userid')) {   
        next({name: 'login'})
        return     
    }
    // let router_all_mode = ['index', 'operate']
    // if(role.value === '') { 
    //     // console.log(2)
    //     await user.getRoleData();
    //     to.matched.some(ele => {
    //         if(router_all_mode.includes(ele.name)) { 
    //             router_mode.value = ele.name
    //             return true
    //         }
    //         return false
    //     })
    //     cate.getMenusData()
    // }
    // else {
    //     to.matched.some(ele => {
    //         if(router_all_mode.includes(ele.name)) { 
    //             router_mode.value = ele.name
    //             return true
    //         }
    //         return false
    //     })
    // }
    
    
    // if(to?.meta?.role && !to.meta.role.includes(role.value) ) {
    //     next(from)
    //     return
    // }
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