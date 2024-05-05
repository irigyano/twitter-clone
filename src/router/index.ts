import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { queryUserMetaById } from '@/utils/queries'
import MainLayout from '@/components/Layout/MainLayout.vue'
import HomePage from '@/pages/Home/HomePage.vue'
import UserPage from '@/pages/User/UserPage.vue'
import FollowPage from '@/pages/FollowPage.vue'
import NotificationPage from '@/pages/NotificationPage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import PostPage from '@/pages/PostPage.vue'

import AuthPage from '@/pages/Auth/AuthPage.vue'
import SignInForm from '@/pages/Auth/SignInForm.vue'
import SignUpForm from '@/pages/Auth/SignUpForm.vue'

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
              component: UserPage
            },
            {
              path: '/:user/following',
              name: 'following',
              component: FollowPage
            },
            {
              path: '/:user/followers',
              name: 'followers',
              component: FollowPage
            }
          ]
        },
        {
          path: '/notifications',
          name: 'notifications',
          meta: { title: '通知' },
          component: NotificationPage
        },
        {
          path: '/search',
          name: 'search',
          component: SearchPage
        },
        {
          path: '/post/:postId',
          name: 'post',
          component: PostPage
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
    const data = await queryUserMetaById(userStore.session.user.id)

    userStore.user = data
    // Redirect from login page
    if (isGoingAuthRoutes) return { name: 'home' }
  }
})

export default router
