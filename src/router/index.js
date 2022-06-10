import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: 'Dashboard', icon: 'dashboard'}
    }]
  },

  {
    path: '/carsRepair',
    name: 'CarsRepair',
    component: Layout,
    alwaysShow: true,
    redirect: '/carsRepair',
    meta: {title: 'CarsRepair', icon: 'el-icon-setting'},
    children: [
      {
        path: 'allCarsRepair',
        name: 'allCarsRepair',
        component: () => import('@/views/carsRepair/index'),
        meta: {title: 'allCarsRepair', icon: 'table'}
      },
      {
        path: 'addCarsRepair',
        name: 'addCarsRepair',
        component: () => import('@/views/carsRepair/addCarsRepair'),
        meta: {title: 'addCarsRepair', icon: 'table'}
      }
    ]
  },

  {
    path: '/advices',
    name: 'Advices',
    component: Layout,
    alwaysShow: true,
    redirect: '/advices',
    meta: {title: 'Advices', icon: 'el-icon-s-help'},
    children: [
      {
        path: 'queryAllAdvice',
        name: 'queryAllAdvice',
        component: () => import('@/views/advices/index'),
        meta: {title: 'queryAllAdvice', icon: 'table'}
      }
    ]
  },

  {
    path: '/drivers',
    name: 'Drivers',
    component: Layout,
    alwaysShow: true,
    redirect: '/drivers',
    meta: {title: 'Drivers', icon: 'el-icon-truck'},
    hidden: true,
    children: [
      {
        path: 'queryAllDrivers',
        name: 'queryAllDrivers',
        component: () => import('@/views/driver/index'),
        meta: {title: 'queryAllDrivers', icon: 'table'}
      }
    ]
  },

  {
    path: '/cars',
    name: 'Cars',
    component: Layout,
    alwaysShow: true,
    redirect: '/cars',
    meta: {title: 'Cars', icon: 'el-icon-truck'},
    children: [
      {
        path: 'queryAllCars',
        name: 'queryAllCars',
        component: () => import('@/views/cars/index'),
        meta: {title: 'queryAllCars', icon: 'table'}
      }
    ]
  },

  {
    path: '/member',
    name: 'Member',
    component: Layout,
    alwaysShow: true,
    redirect: '/member',
    meta: {title: 'Member', icon: 'el-icon-user'},
    children: [
      {
        path: 'queryAllMember',
        name: 'queryAllMember',
        component: () => import('@/views/member/index'),
        meta: {title: 'queryAllMember', icon: 'table'}
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: {title: 'External Link', icon: 'link'}
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
