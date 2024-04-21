import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInPage from '@/views/SignInPage.vue'
import { supabase } from '@/utils/supabase'
import MainLayout from '@/components/Layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'
import SignView from '../views/SignView.vue'
import { defaultAvatar } from '@/utils/defaultAvatar'

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
          name: 'user',
          component: () => import('../views/UserView.vue')
        },
        {
          path: '/notifications',
          name: 'notifications',
          meta: { title: '通知' },
          component: () => import('../views/NotificationsView.vue')
        },
        {
          path: '/search',
          name: 'search',
          component: () => import('../views/SearchView.vue')
        },
        {
          path: '/post/:postId',
          name: 'post',
          component: () => import('../views/PostView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登入' },
      component: SignInPage
    },
    {
      path: '/signup',
      name: 'signup',
      meta: { title: '註冊' },
      component: SignView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.title)
    document.title = ((to.meta.title as string) && `${to.meta.title} / Webber`) || 'Webber'

  const userStore = useUserStore()
  // init the session on app enter
  if (!userStore.session) {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    userStore.session = session
  }

  // temp fix
  // allow login page only
  if (!userStore.session) {
    if (to.path === '/signup') return next()
    if (to.path !== '/login') return next('/login')
  }
  // if (!userStore.session && to.path !== '/login') return next('/login')

  // init the user on app enter
  if (userStore.session && !userStore.user) {
    // TODO: handling no user data back
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userStore.session.user.id)
      .single()
    // fix
    if (data) userStore.user = { ...data, avatar: data.avatar || defaultAvatar }

    // temp fix
    // redirect from login page
    if (to.path === '/login') return next('/')
    if (to.path === '/signup') return next('/')
  }

  return next()
})

export default router
