import Vue from 'vue'
import VueRouter from 'vue-router'
import ScreenPage from '@/views/ScreenPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen' //重定向
  },
  {
    path: '/screen',
    component: ScreenPage
  }
]

const router = new VueRouter({
  routes
})

export default router
