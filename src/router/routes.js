import Layout from "../layout";

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 * */

export const asyncRoutes = [
  {
    path: "/system",
    component: Layout,
    children: [
      {
        path: "user/index",
        name: "systemUser",
        component: () => import("../views/system/user/index"),
        meta: {
          title: "用户档案",
        },
      },
      {
        path: "applicationManagement/index",
        name: "systemApplicationManagement",
        component: () => import("../views/system/applicationManagement/index"),
        meta: {
          title: "应用管理",
        },
      },
      {
        path: "userGroup/index",
        name: "userGroup",
        component: () => import("../views/system/userGroup/index"),
        meta: {
          title: "用户分组管理",
        },
      },
      {
        path: "role/index",
        name: "systemRole",
        component: () => import("../views/system/role/index"),
        meta: {
          title: "角色管理",
        },
      },
      {
        path: "dictionaryConfig/index",
        name: "dictionaryConfig",
        component: () => import("../views/system/dictionaryConfig/index"),
        meta: {
          title: "字典配置",
        },
      },
      {
        path: "menu/index",
        name: "systemMenu",
        component: () => import("../views/system/menu/index"),
        meta: {
          title: "菜单配置",
        },
      },
      {
        path: "department/index",
        name: "systemDepartment",
        component: () => import("../views/system/department/index"),
        meta: {
          title: "部门管理",
        },
      },

      {
        path: "entManagement/index",
        name: "systemEntManagement",
        component: () => import("../views/system/entManagement/index"),
        meta: {
          title: "机构管理",
        },
      },
      {
        path: "notice/index",
        name: "systemNotice",
        component: () => import("../views/system/notice/index"),
        meta: {
          title: "公告管理",
        },
      },

      {
        path: "theSystemConfiguration/index",
        name: "theSystemConfiguration",
        component: () => import("../views/system/theSystemConfiguration/index"),
        meta: {
          title: "系统配置",
        },
      },
      {
        path: "operationManagement/index",
        name: "operationManagement",
        component: () => import("../views/system/operationManagement/index"),
        meta: {
          title: "操作管理",
        },
      },

      {
        path: "noticeAnnouncement/index",
        name: "noticeAnnouncement",
        component: () => import("../views/system/noticeAnnouncement/index"),
        meta: {
          title: "通知公告管理",
        },
      },

      {
        path: "log/operationLog/index",
        name: "operationLog",
        component: () => import("../views/system/log/operationLog/index"),
        meta: {
          title: "操作日志",
        },
      },
      {
        path: "log/exceptionLog/index",
        name: "exceptionLog",
        component: () => import("../views/system/log/exceptionLog/index"),
        meta: {
          title: "错误日志",
        },
      },
      {
        path: "log/loginLog/index",
        name: "loginLog",
        component: () => import("../views/system/log/loginLog/index"),
        meta: {
          title: "登录日志",
        },
      },
      {
        path: "enterprise/index",
        name: "enterpriseindex",
        component: () => import("../views/system/enterprise/index"),
        meta: {
          title: "企业管理",
        },
      },
      {
        path: "enterprise/detail",
        name: "enterprisedetail",
        component: () => import("../views/system/enterprise/detail"),
        meta: {
          title: "企业详情",
        },
      },
    ],
  },

  {
    path: "/powerMessage",
    component: Layout,
    children: [
      {
        path: "rolePower/index",
        name: "rolePower",
        component: () => import("../views/powerMessage/rolePower/index"),
        meta: {
          title: "角色授权",
        },
      },
      {
        path: "dataPower/index",
        name: "dataPower",
        component: () => import("../views/powerMessage/dataPower/index"),
        meta: {
          title: "数据权限管理",
        },
      },
    ],
  },

  {
    path: "/secureManagement",
    component: Layout,
    name: "secureManagement",
    children: [
      {
        path: "enterpriseArchives/index",
        name: "enterpriseArchives",
        component: () =>
          import("../views/secureManagement/enterpriseArchives/detail"),
        meta: {
          title: "企业档案",
        },
      },
      {
        path: "roleermission/index",
        name: "roleermission",
        component: () =>
          import("../views/secureManagement/roleermission/index"),
        meta: {
          title: "角色权限",
        },
      },
      {
        path: "enterpriseArchives/dimension",
        name: "dimension",
        component: () =>
          import("../views/secureManagement/enterpriseArchives/dimension"),
        meta: {
          title: "平面图标注",
        },
      },
    ],
  },

  {
    path: "/riskGradingControl",
    component: Layout,
    children: [
      {
        path: "statistic/index",
        name: "statistic",
        component: () => import("../views/riskGradingControl/statistic/index"),
        meta: {
          title: "统计分析",
        },
      },
      {
        path: "pointLedger/index",
        name: "pointLedgerIndex",
        component: () =>
          import("../views/riskGradingControl/pointLedger/index"),
        meta: {
          title: "风险单元（场所、区域）台账",
        },
      },
      {
        path: "pointLedger/edit",
        name: "pointLedgerEdit",
        component: () => import("../views/riskGradingControl/pointLedger/edit"),
        meta: {
          title: "编辑风险单元（场所、区域）",
        },
      },
      {
        path: "pointLedger/detail",
        name: "pointLedgerDetail",
        component: () =>
          import("../views/riskGradingControl/pointLedger/detail"),
        meta: {
          title: "风险单元（场所、区域）详情",
        },
      },
      {
        path: "checklist/index",
        name: "checklist",
        component: () => import("../views/riskGradingControl/checklist/index"),
        meta: {
          title: "安全检查清单",
        },
      },
      {
        path: "inspectionLedger/index",
        name: "inspectionLedger",
        component: () =>
          import("../views/riskGradingControl/inspectionLedger/index"),
        meta: {
          title: "巡查台账",
        },
      },
      {
        path: "distributionMap/index",
        name: "distributionMap",
        component: () =>
          import("../views/riskGradingControl/distributionMap/index"),
        meta: {
          title: "风险四色分布图",
        },
      },
    ],
  },

  //   {
  //     path: '/message',
  //     component: Layout,
  //     name: 'messages',
  //     children: [
  //       {
  //         path: 'index',
  //         name: 'message',
  //         component: () => import('../views/message/index'),
  //         meta: {
  //           title: '信息管理'
  //         }
  //       }
  //     ]
  //   },

  {
    path: "/error-page",
    name: "ErrorPage",
    component: Layout,
    redirect: "/error-page/page-401",
    meta: {
      title: "错误页面",
      icon: "vue-dsn-icon-bug",
    },
    children: [
      {
        path: "page-401",
        name: "Page401",
        component: () => import("../views/error-page/401"),
        meta: {
          title: "401页面",
        },
      },
      {
        path: "page-404",
        name: "Page404",
        component: () => import("../views/error-page/404"),
        meta: {
          title: "404页面",
        },
      },
    ],
  },

  {
    path: "/security",
    component: Layout,
    name: "security",
    children: [
      {
        path: "target/index",
        name: "target",
        component: () => import("../views/security/target/index"),
        meta: {
          title: "活动安全生产目标",
        },
      },
      {
        path: "institution/index",
        name: "institution",
        component: () => import("../views/security/institution/index"),
        meta: {
          title: "机构设置",
        },
      },
      {
        path: "institution/organtabel",
        name: "organtabel",
        component: () => import("../views/security/institution/organtabel"),
        meta: {
          title: "关联机构",
        },
      },
      {
        path: "inventory/index",
        name: "inventory",
        component: () => import("../views/security/inventory/index"),
        meta: {
          title: "职责清单",
        },
      },
      {
        path: "management/index",
        name: "management",
        component: () => import("../views/security/management/index"),
        meta: {
          title: "安全制度管理",
        },
      },
      {
        path: "operate/index",
        name: "operate",
        component: () => import("../views/security/operate/index"),
        meta: {
          title: "安全操作规程",
        },
      },
      {
        path: "operate/indexIsm",
        name: "indexIsm",
        component: () => import("../views/security/operate/indexIsm"),
        meta: {
          title: "制度分类",
        },
      },
      {
        path: "cost/index",
        name: "cost",
        component: () => import("../views/security/cost/index"),
        meta: {
          title: "安全生产费用管理",
        },
      },
      {
        path: "employee/index",
        name: "employee",
        component: () => import("../views/security/employee/index"),
        meta: {
          title: "从业人员管理",
        },
      },

      {
        path: "risk/index",
        name: "risk",
        component: () => import("../views/security/risk/index"),
        meta: {
          title: "风险分级管控",
        },
      },
      {
        path: "hazard/index",
        name: "hazard",
        component: () => import("../views/security/hazard/index"),
        meta: {
          title: "重大危险源管理",
        },
      },
      {
        path: "hazard/task/index",
        name: "task",
        component: () => import("../views/security/hazard/task/index"),
        meta: {
          title: "隐患计划",
        },
      },
      {
        path: "danger/index",
        name: "danger",
        component: () => import("../views/security/danger/index"),
        meta: {
          title: "隐患排查治理",
        },
      },
      {
        path: 'punish/index',
        name: 'punish',
        component: () => import('../views/security/punish/index'),
        meta: {
          title: '行政处罚'
        }
      },
      {
        path: "hiddenDanger/administer/index",
        name: "administer",
        component: () =>
          import("../views/security/hiddenDanger/administer/index"),
        meta: {
          title: "隐患整改",
        },
      },
      {
        path: "hiddenDanger/standard/index",
        name: "standard",
        component: () =>
          import("../views/security/hiddenDanger/standard/index"),
        meta: {
          title: "标准管理",
        },
      },
      {
        path: "hiddenDanger/template/index",
        name: "template",
        component: () =>
          import("../views/security/hiddenDanger/template/index"),
        meta: {
          title: "模板管理",
        },
      },

      {
        path: "education/index",
        name: "education",
        component: () => import("../views/security/education/index"),
        meta: {
          title: "教育培训",
        },
      },
      {
        path: "related/index",
        name: "related",
        component: () => import("../views/security/related/index"),
        meta: {
          title: "相关方管理",
        },
      },
      {
        path: "emergency/index",
        name: "emergency",
        component: () => import("../views/security/emergency/index"),
        meta: {
          title: "应急管理",
        },
      },
      {
        path: "accident/index",
        name: "accident",
        component: () => import("../views/security/accident/index"),
        meta: {
          title: "事故管理",
        },
      },
      {
        path: "standardization/index",
        name: "standardization",
        component: () => import("../views/security/standardization/index"),
        meta: {
          title: "安全生产标准化",
        },
      },
      {
        path: "assessment/index",
        name: "assessment",
        component: () => import("../views/security/assessment/index"),
        meta: {
          title: "企业综合风险评定",
        },
      },
      {
        path: "visualization/index",
        name: "visualization",
        component: () => import("../views/security/visualization/index"),
        meta: {
          title: "可视化功能扩展",
        },
      },
    ],
  },

  {
    path: "/park",
    component: Layout,
    name: "park",
    children: [
      {
        path: "overview/index",
        name: "poverview",
        component: () => import("../views/park/overview/index"),
        meta: {
          title: "总览",
        },
      },
      {
        path: "information/index",
        name: "information",
        component: () => import("../views/park/information/index"),
        meta: {
          title: "园区管理",
        },
      },
      {
        path: "parkerpriseArchives/index",
        name: "parkerpriseArchives",
        component: () => import("../views/park/parkerpriseArchives/index"),
        meta: {
          title: "园区基础信息",
        },
      },
      {
        path: "grid/index",
        name: "grid",
        component: () => import("../views/park/grid/index"),
        meta: {
          title: "网格管理",
        },
      },
      {
        path: "permission/index",
        name: "permission",
        component: () => import("../views/park/permission/index"),
        meta: {
          title: "角色权限",
        },
      },
      {
        path: "plan/index",
        name: "parkplan",
        component: () => import("../views/park/plan/index"),
        meta: {
          title: "设立规划",
        },
      },
      {
        path: "courtship/index",
        name: "courtship",
        component: () => import("../views/park/courtship/index"),
        meta: {
          title: "招商项目管理",
        },
      },
      {
        path: "duringproject/index",
        name: "duringproject",
        component: () => import("../views/park/duringproject/index"),
        meta: {
          title: "项目建设期安全管理",
        },
      },
      {
        path: "organization/index",
        name: "organizationplan",
        component: () => import("../views/park/organization/index"),
        meta: {
          title: "机构设置",
        },
      },
      {
        path: "personnel/index",
        name: "personnel",
        component: () => import("../views/park/personnel/index"),
        meta: {
          title: "人员管理",
        },
      },
      {
        path: "resumption/index",
        name: "resumption",
        component: () => import("../views/park/resumption/index"),
        meta: {
          title: "履职档案",
        },
      },
      {
        path: "digitalization/index",
        name: "digitalization",
        component: () => import("../views/park/digitalization/index"),
        meta: {
          title: "档案数字化管理",
        },
      },
      {
        path: "approval/index",
        name: "approval",
        component: () => import("../views/park/approval/index"),
        meta: {
          title: "企业档案",
        },
      },
      {
        path: "classification/index",
        name: "classification",
        component: () => import("../views/park/classification/index"),
        meta: {
          title: "企业分布",
        },
      },
      {
        path: "riskidentification/index",
        name: "riskidentification",
        component: () => import("../views/park/riskidentification/index"),
        meta: {
          title: "公共风险源（点）",
        },
      },
      {
        path: "grade/index",
        name: "pgrade",
        component: () => import("../views/park/grade/index"),
        meta: {
          title: "风险评估分级",
        },
      },

      {
        path: "hiddenDanger/standard/index",
        name: "standard",
        component: () => import("../views/park/hiddenDanger/standard/index"),
        meta: {
          title: "标准管理",
        },
      },
      {
        path: "hiddenDanger/template/index",
        name: "template",
        component: () => import("../views/park/hiddenDanger/template/index"),
        meta: {
          title: "模板管理",
        },
      },
      {
        path: "hiddenDanger/investigation/index",
        name: "investigation",
        component: () =>
          import("../views/park/hiddenDanger/investigation/index"),
        meta: {
          title: "隐患排查",
        },
      },
      {
        path: "hiddenDanger/administer/index",
        name: "administer",
        component: () => import("../views/park/hiddenDanger/administer/index"),
        meta: {
          title: "隐患治理",
        },
      },

      {
        path: "facilities/index",
        name: "facilities",
        component: () => import("../views/park/facilities/index"),
        meta: {
          title: "设备设施管理",
        },
      },
      {
        path: "sameTime/index",
        name: "sameTime",
        component: () => import("../views/park/sameTime/index"),
        meta: {
          title: "三同时管理",
        },
      },

      {
        path: "repair/index",
        name: "repair",
        component: () => import("../views/park/repair/index"),
        meta: {
          title: "维修保养管理",
        },
      },
      {
        path: "administration/index",
        name: "administration",
        component: () => import("../views/park/administration/index"),
        meta: {
          title: "行政处罚",
        },
      },
    ],
  },

  {
    path: "/thirdparty",
    component: Layout,
    name: "thirdparty",
    children: [
      {
        path: "overview/index",
        name: "toverview",
        component: () => import("../views/thirdparty/overview/index"),
        meta: {
          title: "总览",
        },
      },
      {
        path: "information/index",
        name: "tinformation",
        component: () => import("../views/thirdparty/information/index"),
        meta: {
          title: "第三方管理",
        },
      },
      {
        path: "thirderpriseArchives/index",
        name: "thirderpriseArchives",
        component: () =>
          import("../views/thirdparty/thirderpriseArchives/index"),
        meta: {
          title: "第三方基础信息",
        },
      },
      {
        path: "organizational/index",
        name: "organizational",
        component: () => import("../views/thirdparty/organizational/index"),
        meta: {
          title: "机构管理",
        },
      },
      {
        path: "personnel/index",
        name: "tpersonnel",
        component: () => import("../views/thirdparty/personnel/index"),
        meta: {
          title: "人员管理",
        },
      },
      {
        path: "permission/index",
        name: "tpermission",
        component: () => import("../views/thirdparty/permission/index"),
        meta: {
          title: "角色权限",
        },
      },
      {
        path: "projectManage/index",
        name: "projectManage",
        component: () => import("../views/thirdparty/projectManage/index"),
        meta: {
          title: "项目管理",
        },
      },

      {
        path: "hiddenDanger/standard/index",
        name: "standard",
        component: () =>
          import("../views/thirdparty/hiddenDanger/standard/index"),
        meta: {
          title: "标准管理",
        },
      },
      {
        path: "hiddenDanger/template/index",
        name: "template",
        component: () =>
          import("../views/thirdparty/hiddenDanger/template/index"),
        meta: {
          title: "模板管理",
        },
      },
      {
        path: "hiddenDanger/investigation/index",
        name: "investigation",
        component: () =>
          import("../views/thirdparty/hiddenDanger/investigation/index"),
        meta: {
          title: "隐患排查治理",
        },
      },
    ],
  },
];
