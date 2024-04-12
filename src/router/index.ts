import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { supabase } from '@/utils/supabase'
import SideNav from '@/components/SideNav.vue'
import SideFeed from '@/components/SideFeed.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Q: how to reduce verbose import components for name routes?
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: HomeView,
        SideNav,
        SideFeed
      }
    },
    {
      // lazy loading example
      path: '/:user',
      name: 'about',
      components: { default: () => import('../views/UserView.vue'), SideNav, SideFeed }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { data, error } = await supabase.auth.getSession()

  if (!data.session && to.path !== '/login') return next('/login')

  // redirect to home after login
  if (data.session && to.path === '/login') return next('/')

  return next()
})

export default router
