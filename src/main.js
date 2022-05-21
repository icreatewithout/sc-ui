import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import ElTreeSelect from 'el-tree-select'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from "./router/Router";
import store from "./store/store";
import * as icons from "@element-plus/icons-vue"
import 'default-passive-events'

const app = createApp(App)
for (const i in icons){
    app.component(i,icons[i])
}

app.use(ElTreeSelect)
app.use(router)
app.use(store)
app.use(ElementPlus, {size: 'default', zIndex: 3000, local: zhCn})
app.mount('#app')
