import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Blog from '../pages/Blog.vue'
import Contact from '../pages/Contact.vue'
import Projects from '../pages/Projects.vue'
import BlogDetail from '../pages/BlogDetail.vue';
import BlogCreate from '../pages/BlogCreate.vue';
import BlogEdit from '../pages/BlogEdit.vue';
import AdminLogin from "../pages/admin/AdminLogin.vue"
import AdminDashboard from "../pages/admin/AdminDashboard.vue"
import AdminPosts from "../pages/admin/AdminPosts.vue"
import AdminComments from "../pages/admin/AdminComments.vue"

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/blog', name: 'blog', component: Blog },
  { path: '/projects', name: 'projects', component: Projects },// 项目展示页
  { path: '/contact', name: 'contact', component: Contact },// 联系页
  { path: '/blog/create', component: BlogCreate }, // 发布文章
  { path: '/blog/edit/:id', component: BlogEdit }, // 编辑文章
  { path: '/blog/:id', name: 'blogDetail', component: BlogDetail }, // 文章详情
  { path: "/admin/login", component: AdminLogin },// 管理员登录页
  { path: "/admin", component: AdminDashboard },// 管理员仪表板
  { path: "/admin/posts", component: AdminPosts },// 文章管理
  { path: "/admin/comments", component: AdminComments }// 评论管理
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach((to, from, next) => {

//   const token = localStorage.getItem("token")

//   if (to.path.startsWith("/admin") && !token) {

//     next("/admin/login")

//   } else {

//     next()

//   }

// })

router.beforeEach((to,from,next)=>{

const token = localStorage.getItem("token")

if(
  to.path.startsWith("/admin") &&
  !token &&
  to.path !== "/admin/login"
){

next("/admin/login")

}else{

next()

}

})

export default router
