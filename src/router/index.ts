import { createRouter, createWebHistory } from 'vue-router'

import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { defaultAvatar } from '@/utils/defaultAvatar'
import MainLayout from '@/components/Layout/MainLayout.vue'

import HomePage from '@/pages/HomePage.vue'
import SignInPage from '@/pages/SignInPage.vue'
import SignUpPage from '@/pages/SignUpPage.vue'

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
          component: HomePage
        },
        {
          path: '/:user',
          children: [
            {
              path: '',
              name: 'user',
              component: () => import('../pages/UserPage.vue')
            },
            // How to make these nested?
            {
              path: '/:user/following',
              name: 'following',
              component: () => import('../pages/FollowPage.vue')
            },
            {
              path: '/:user/followers',
              name: 'followers',
              component: () => import('../pages/FollowPage.vue')
            }
          ]
        },
        {
          path: '/notifications',
          name: 'notifications',
          meta: { title: '通知' },
          component: () => import('../pages/NotificationPage.vue')
        },
        {
          path: '/search',
          name: 'search',
          component: () => import('../pages/SearchPage.vue')
        },
        {
          path: '/post/:postId',
          name: 'post',
          component: () => import('../pages/PostPage.vue')
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
      component: SignUpPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) document.title = ((to.meta.title as string) && `${to.meta.title} / W`) || 'W'

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
