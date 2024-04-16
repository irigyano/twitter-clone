import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { supabase } from '@/utils/supabase'
import MainLayout from '@/components/MainLayout.vue'
import { useUserStore } from '@/stores/user'

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
          meta: { title: '首頁' },
          component: HomeView
        },
        {
          path: '/:user',
          name: 'about',
          component: () => import('../views/UserView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登入' },
      component: LoginView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  document.title = ((to.meta.title as string) && `${to.meta.title} / Webber`) || 'Webber'

  const userStore = useUserStore()
  // init the session on app enter
  if (!userStore.session) {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    userStore.session = session
  }

  // allow login page only
  if (!userStore.session && to.path !== '/login') return next('/login')

  // init the user on app enter
  if (userStore.session && !userStore.user) {
    // TODO: handling no user data back
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userStore.session.user.id)
      .single()
    if (data) userStore.user = data

    // redirect from login page
    if (to.path === '/login') return next('/')
  }

  return next()
})

export default router
