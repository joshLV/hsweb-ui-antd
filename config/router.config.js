export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // 系统设置
      {
        path: '/system',
        icon: 'system',
        name: 'system',
        routes: [
          {
            path: '/system/index-setting',
            name: 'index-setting',
            component: './System/indexSetting',
          },
          {
            path: '/system/menus',
            name: 'menus',
            component: './System/Menus',
          },
          {
            path: '/system/permission',
            name: 'permission',
            component: './System/Permission/List',
          },
          {
            path: '/system/role',
            name: 'role',
            component: './System/Role',
          },
          {
            path: '/system/user',
            name: 'user',
            component: './System/User',
          },
        ],
      },
      // 组织架构
      {
        path: '/org',
        icon: 'org',
        name: 'org',
        routes: [
          {
            path: '/org/organizational',
            name: 'organizational',
            component: './Org/Organizational',
          },
          {
            path: '/org/manager',
            name: 'manager',
            component: './Org/Manager',
          },
          {
            path: '/org/person',
            name: 'person',
            component: './Org/Person',
          },
        ],
      },
      {
        path: '/develop',
        name: 'develop',
        icon: 'develop',
        routes: [
          {
            path: '/develop/code-generator',
            name: 'code-generator',
            component: './Develop/CodeGenerator',
          },
          {
            path: '/develop/dynamic-form',
            name: 'dynamic-form',
            component: './Develop/DynamicForm',
          },
          {
            path: '/develop/template',
            name: 'template',
            component: './Develop/Template',
          },
          {
            path: '/develop/schedule',
            name: 'schedule',
            component: './Develop/Schedule',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },

    ],
  },
];
