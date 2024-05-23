import { validateFour, validateMobilePhone } from "@/utils/validate";

let dialogForm = {
  trainingList: [], // 安全培训取证情况
  specialList: [], // 特种（设备）作业人员
  sysEnterprise: {
    parkName: null, // 园区名称
    parkId: null, // 园区Id
    entName: null, // 企业全称
    entshortName: null, // 企业简称
    industrySector: null, // 行业领域
    performance: null, // 经营状况
    entCode: null, // 统一社会信用代码
    establishDate: null, // 成立日期
    district: [], // 行政区划
    townlet: null, // 镇/街道
    village: null, // 村/社区
    longitude: null, // 经度
    latitude: null, // 经度
    registeredAddress: null, // 注册地址
    address: null, // 实际地址
    entNature: null, // 企业性质
    practitionerNumber: null, // 从业人员
    businessLicenseList: [], // 营业执照
    businessScope: null, // 经营范围
    legalPersonName: null, // 法定代表人姓名
    legalPersonPhone: null, // 法定代表人电话
    personInChargeName: null, // 主要负责人姓名
    personInChargePhone: null, // 主要负责人电话
    safetyDirectorName: null, // 安全负责人姓名
    safetyDirectorPhone: null, // 安全负责人电话
    nationalEconomy: null, // 国民经济分类
    loginCode: null, //管理员账号
    loginPass: null, //管理员密码
    repeatPassword: null, //重复密码
    contact: null, //联系人
    contactTel: null //联系人手机号
  },

  sysEntExtend: {
    entSizeUp: null, // 企业规模
    entSizeBig: null, // 企业规模
    typeOfAffiliation: null, // 隶属类型
    currency: '人民币', // 币种
    registeredCapital: null, // 注册资金
    industryManagementDep: null, // 行业管理部门
    groundForBusinessPremises: null, // 经营场地用地面积
    userName: null, // 管理员账号
    password: null, // 管理员密码
    isIndustryInsure: "否", // 是否购买工伤保险
    industryInsureFileList: [], // 购买工伤保险文件、
    industryInsureNumber: null, // 工伤保险购买人数
    isSecureInsure: "否", // 是否购买安全生产责任险
    secureInsureFileList: [], // 购买安全生产责任险文件
    entRemark: null // 企业备注
  },

  sysEntSafe: {
    safetyOrg: null, // 安全管理机构
    fullTimeSafeNumber: null, // 专职安全管理人员数量
    specialWorkNumber: null, // 特种作业人员数量
    supervisionProcesses: [], // 重点监管危险化工工艺
    isRefrigeration: "否", // 是否涉及涉氨制冷（气）企业
    refrigerationType: null, // 涉氨制冷（气）类型
    isHazardousChemicals: "否", // 是否涉及危险化学品
    chemicalsList: [], // 危险化学品表格
    isHazardousSource: "否", // 是否构成重大危险源
    hazardsList: [], // 重大危险源表格
    isGasUse: "否", // 是否涉及燃气使用
    gasUseList: [], // 燃气使用表格
    isLimitedSpace: false, // 是否涉及有限空间
    limitedSpaceNumber: null, // 有限空间数量
    limitedSpaceWorkMaxNumber: null, // 有限空间同一时间作业最大人数
    isDustExplosion: false, // 是否涉及粉尘涉爆
    dustExplosionName: null, // 粉尘涉爆类型
    dustExplosionNumber: null, // 粉尘涉爆数量
    dustExplosionWorkMaxNumber: null, // 粉尘涉爆同一时间作业最大人数
    isCommercialBuilding: false, // 是否商务商业楼宇
    commercialBuildingName: null, // 楼宇名称
    isFire: false, // 是否消防重点单位
    haveFireStation: false // 有无微型消防站
  },

  sysEntSafety: {
    isSafetyResponsibility: "否", // 是否制定安全责任制度
    publishTime: null, // 安全责任制定发布时间
    isManageInstitution: "否", // 是否制定安全管理制度
    manageInstitutionFileList: [], // 安全管理制度 多附件
    isSafetyAction: "否", // 是否制定操作规范
    sysSafetyActionList: [], // 操作规范表格
    isStandardCert: "否", // 是否取得安全标准化证书
    safetyCertList: [] // 安全标准化证书表格
  }
};

let formRules = {
  /**
   * 基本信息
   */
  "sysEnterprise.entName": [
    {
      required: true,
      message: "请输入企业名称！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.industrySector": [
    {
      required: true,
      message: "请选择行业领域！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.nationalEconomy": [
    {
      required: true,
      message: "请选择国民经济分类！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.affiliationEntName": [
    {
      required: true,
      message: "请选择所属企业！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.performance": [
    {
      required: true,
      message: "请选择经营状况！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.entCode": [
    {
      required: true,
      message: "请输入统一社会信用代码！",
      trigger: ["blur", "change"]
    },
    {
      message: "请输入正确的统一社会信用代码！",
      trigger: ["change", "blur"],
      validator: (rule, value, callback) => {
        validateFour(rule, value, callback);
      }
    }
  ],
  "sysEnterprise.address": [
    {
      required: true,
      message: "请选择实际地址！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.entNature": [
    {
      required: true,
      message: "请选择场地性质！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.businessLicenseList": [
    {
      required: true,
      message: "请上传营业执照！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.legalPersonName": [
    {
      required: true,
      message: "请输入法定代表人姓名！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.loginCode": [
    {
      required: true,
      message: "请输入管理员账号！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.contact": [
    {
      required: true,
      message: "请输入联系人！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.contactTel": [
    {
      required: true,
      message: "请输入联系人手机号！",
      trigger: ["blur", "change"]
    },
    {
      message: "请输入正确的电话号码！",
      trigger: ["change", "blur"],
      validator: (rule, value, callback) => {
        validateMobilePhone(rule, value, callback);
      }
    }
  ],
  "sysEnterprise.legalPersonPhone": [
    {
      required: true,
      message: "请输入法定代表人电话！",
      trigger: ["blur", "change"]
    },
    {
      message: "请输入正确的电话号码！",
      trigger: ["change", "blur"],
      validator: (rule, value, callback) => {
        validateMobilePhone(rule, value, callback);
      }
    }
  ],
  "sysEnterprise.personInChargeName": [
    {
      required: true,
      message: "请输入主要负责人姓名！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.personInChargePhone": [
    {
      required: true,
      message: "请输入主要负责人电话！",
      trigger: ["blur", "change"]
    },
    {
      message: "请输入正确的电话号码！",
      trigger: ["change", "blur"],
      validator: (rule, value, callback) => {
        validateMobilePhone(rule, value, callback);
      }
    }
  ],
  "sysEnterprise.safetyDirectorName": [
    {
      required: true,
      message: "请输入安全负责人姓名！",
      trigger: ["blur", "change"]
    }
  ],
  "sysEnterprise.safetyDirectorPhone": [
    {
      required: true,
      message: "请输入安全负责人电话！",
      trigger: ["blur", "change"]
    },
    {
      message: "请输入正确的电话号码！",
      trigger: ["change", "blur"],
      validator: (rule, value, callback) => {
        validateMobilePhone(rule, value, callback);
      }
    }
  ]
};

export default {
  formRules,
  dialogForm
};
