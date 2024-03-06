import { createApp } from 'vue'
import pinia from '@/stores/index.js';
import router from '@/router/guard'
import * as icons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import axios from '@/request/index'
import apis from '@/apis/index'
import defineDirectives from '@/directive/index'
import filters from '@/plugins/filters'
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$filters: Record<string, any>
	}
}
const app = createApp(App)
defineDirectives(app)
app.use(pinia)
app.use(router)
app.use(filters)
app.provide('$api', apis);
app.provide('$axios', axios);
app.mount('#app')
Object.keys(icons).forEach(key => {
	app.component(key, icons[key])
})
export default app