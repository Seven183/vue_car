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
      meta: {title: '首页', icon: 'dashboard'}
    }]
  },

  {
    path: '/test',
    component: Layout,
    redirect: '/test',
    children: [
      {
        path: 'test',
        name: '测试',
        component: () => import('@/views/test'),
        meta: {title: '测试', icon: 'dashboard'}
      },
      {
        path: 'test1',
        name: 'test1',
        hidden: true,
        component: () => import('@/views/test1'),
        meta: {title: '测试车辆维修', icon: 'table'}
      }
    ]
  },

  {
    path: '/test2',
    component: Layout,
    redirect: '/test2',
    children: [
      {
        path: 'test2',
        name: '卡片',
        component: () => import('@/views/test2'),
        meta: {title: '卡片', icon: 'dashboard'}
      }
    ]
  },
  {
    path: '/carsRepair',
    name: 'CarsRepair',
    component: Layout,
    alwaysShow: true,
    redirect: '/carsRepair',
    meta: {title: '车辆维修', icon: 'el-icon-setting'},
    children: [
      {
        path: 'allCarsRepairs',
        name: 'allCarsRepairs',
        component: () => import('@/views/carsRepair/listCarsRepairs'),
        meta: {title: '车辆维修列表', icon: 'table'}
      },
      {
        path: 'addCarsRepair',
        name: 'addCarsRepair',
        hidden: true,
        component: () => import('@/views/carsRepair/addCarsRepair'),
        meta: {title: '添加车辆维修', icon: 'table'}
      }
    ]
  },

  {
    path: '/advice',
    name: 'Advice',
    component: Layout,
    alwaysShow: true,
    redirect: '/advice',
    meta: {title: '维修设备', icon: 'el-icon-s-help'},
    children: [
      {
        path: 'allAdvices',
        name: 'allAdvices',
        component: () => import('@/views/advices/listAdvices'),
        meta: {title: '维修设备列表', icon: 'table'}
      },
      {
        path: 'addAdvice',
        name: 'addAdvice',
        hidden: true,
        component: () => import('@/views/advices/addAdvice'),
        meta: {title: '添加维修设备', icon: 'table'}
      }
    ]
  },

  {
    path: '/driver',
    name: 'Driver',
    component: Layout,
    alwaysShow: true,
    redirect: '/driver',
    // hidden: true,
    meta: {title: '车主信息', icon: 'el-icon-truck'},
    // hidden: true,
    children: [
      {
        path: 'allDrivers',
        name: 'allDrivers',
        component: () => import('@/views/driver/listDrivers'),
        meta: {title: '车主信息列表', icon: 'table'}
      },
      {
        path: 'addDriver',
        name: 'addDriver',
        hidden: true,
        component: () => import('@/views/driver/addDriver'),
        meta: {title: '添加车主', icon: 'table'}
      }
    ]
  },

  {
    path: '/car',
    name: 'Car',
    component: Layout,
    alwaysShow: true,
    redirect: '/car',
    hidden: true,
    meta: {title: '车辆信息', icon: 'el-icon-truck'},
    children: [
      {
        path: 'allCars',
        name: 'allCars',
        component: () => import('@/views/cars/listCars'),
        meta: {title: '车辆信息列表', icon: 'table'}
      },
      {
        path: 'addCar',
        name: 'addCar',
        hidden: true,
        component: () => import('@/views/cars/addCar'),
        meta: {title: '添加车辆信息', icon: 'table'}
      }
    ]
  },

  {
    path: '/member',
    name: 'Member',
    component: Layout,
    alwaysShow: true,
    redirect: '/member',
    hidden: true,
    meta: {title: '会员信息', icon: 'el-icon-user'},
    children: [
      {
        path: 'allMembers',
        name: 'allMembers',
        component: () => import('@/views/member/listMembers'),
        meta: {title: '会员信息列表', icon: 'table'}
      },
      {
        path: 'addMember',
        name: 'addMember',
        hidden: true,
        component: () => import('@/views/member/addMember'),
        meta: {title: '添加会员信息', icon: 'table'}
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
