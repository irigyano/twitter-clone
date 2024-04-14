import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { supabase } from '@/utils/supabase'
import MainLayout from '@/components/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          // lazy loading example
          path: '/:user',
          name: 'about',
          component: () => import('../views/UserView.vue')
        }
      ]
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
