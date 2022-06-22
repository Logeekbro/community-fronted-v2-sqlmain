import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// Buefy
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
// Vuesax
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';
// ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// AntDesign
import { Avatar, Anchor } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/assets/app.css'
import './assets/plugins/font-awesome-4.7.0/css/font-awesome.min.css'
import format from 'date-fns/format'
import '@/permission'
import relativeTime from 'dayjs/plugin/relativeTime';
// 消息提示
import { MyMsg } from '@/utils/message'
// 国际化
import 'dayjs/locale/zh-cn'
const dayjs = require('dayjs');

// 相对时间插件
dayjs.extend(relativeTime)

dayjs.locale('zh-cn') // use locale globally
dayjs().locale('zh-cn').format() // use locale in a specific instance

Vue.prototype.dayjs = dayjs; // 可以全局使用dayjs
Vue.prototype.msg = MyMsg; // 可以全局使用消息提示

Vue.filter('date', (date) => {
  return format(new Date(date), 'yyyy-MM-dd')
})

Vue.use(Buefy)
Vue.use(ElementUI)
Vue.use(Vuesax)
Vue.use(Avatar)
Vue.use(Anchor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
