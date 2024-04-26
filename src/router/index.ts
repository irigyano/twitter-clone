import { createRouter, createWebHistory } from 'vue-router'

import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { defaultAvatar } from '@/utils/defaultAvatar'
import MainLayout from '@/components/Layout/MainLayout.vue'

import HomePage from '@/pages/HomePage.vue'
import AuthPage from '@/pages/AuthPage.vue'
import SignInForm from '@/components/Auth/SignInForm.vue'
import SignUpForm from '@/components/Auth/SignUpForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
          component: () => import('../pages/PostPage.vue')
        }
      ]
    },
    {
      path: '/auth',
      component: AuthPage,
      redirect: 'signin',
      children: [
        {
          path: 'signin',
          name: 'signin',
          meta: { title: '登入' },
          component: SignInForm
        },
        {
          path: 'signup',
          name: 'signup',
          meta: { title: '註冊' },
          component: SignUpForm
        }
      ]
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from) => {
  // Set page title if its static
  if (to.meta.title) document.title = ((to.meta.title as string) && `${to.meta.title} / W`) || 'W'

  const isGoingAuthRoutes = to.matched.some(({ path }) => path.includes('auth'))

  // Init the session on app start
  const userStore = useUserStore()
  if (!userStore.session) {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    userStore.session = session
  }

  // Allow auth pages only
  if (!userStore.session && !isGoingAuthRoutes) return { name: 'signin' }

  // Init user data in Pinia
  if (userStore.session && !userStore.user) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userStore.session.user.id)
      .single()
    if (data) userStore.user = { ...data, avatar: data.avatar || defaultAvatar }

    // Redirect from login page
    if (isGoingAuthRoutes) return { name: 'home' }
  }
})

export default router
