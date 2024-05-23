<template>
  <div class="table-classic-wrapper">
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="header" ref="header">
        <div class="title">
          <i class="el-icon-back" @click="back" />
          <span>企业管理</span>
        </div>
      </div>
      <div class="flex">
        <div class="right">
          <myButton
            v-if="detailInfo.sysEnterprise.entState == '正常'"
            icon="el-icon-folder-opened"
            >风险管理</myButton
          >
          <myButton
            v-if="detailInfo.sysEnterprise.entState == '正常'"
            icon="el-icon-thumb"
            >隐患排查</myButton
          >
          <myButton
            v-if="detailInfo.sysEnterprise.entState == '待审核'"
            icon="el-icon-s-check"
            @click.native="process"
            >审核</myButton
          >
        </div>
      </div>
    </div>
    <div v-loading="loading" class="content">
      <el-card class="box-card info">
        <h3>
          <img src="@/assets/img/enterprise/enterprise-logo.png" />
          <span class="hiddenText">{{ detailInfo.sysEnterprise.entName }}</span>
        </h3>
        <div class="basic">
          <div class="basic_left">
            <div class="contactsInfo">
              <div class="riskIcon">
                <img src="@/assets/img/homeIcon/riskIcon.png" />
              </div>
              <div class="detail">
                <div class="user">
                  <img src="@/assets/img/homeIcon/risk-user.png" />
                  <span>安全负责人：</span>
                  <strong>{{
                    detailInfo.sysEnterprise.safetyDirectorName
                  }}</strong>
                </div>
                <div class="tel">
                  <img src="@/assets/img/homeIcon/risk-tel.png" />
                  <span>负责人电话：</span>
                  <strong>{{
                    detailInfo.sysEnterprise.safetyDirectorPhone
                  }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="basic_right">
            <ul>
              <li>
                <img src="@/assets/img/enterprise/enterprise-menu-icon.png" />
                <span class="label">信用代码：</span>
                <span class="text">{{ detailInfo.sysEnterprise.entCode }}</span>
              </li>
              <li>
                <img src="@/assets/img/enterprise/enterprise-menu-icon.png" />
                <span class="label">法定代表人：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.legalPersonName
                }}</span>
              </li>
              <li>
                <img src="@/assets/img/enterprise/enterprise-date-icon.png" />
                <span class="label">经营状况：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.performanceStr
                }}</span>
              </li>

              <li>
                <img src="@/assets/img/enterprise/enterprise-plan-icon.png" />
                <span class="label">企业规模：</span>
                <span class="text"
                  >{{ detailInfo.sysEntExtend.entSizeBigStr }}
                  {{ detailInfo.sysEntExtend.entSizeUpStr }}</span
                >
              </li>
              <li>
                <img src="@/assets/img/enterprise/enterprise-menu-icon.png" />
                <span class="label">单位占地面积：</span>
                <span class="text"
                  >{{
                    detailInfo.sysEntExtend.groundForBusinessPremises || 0
                  }}㎡</span
                >
              </li>
              <li>
                <img src="@/assets/img/enterprise/enterprise-date-icon.png" />
                <span class="label">国民经济分类：</span>
                <span class="text">
                  {{ detailInfo.sysEnterprise.nationalEconomyKey }}
                </span>
              </li>
              <li>
                <img src="@/assets/img/enterprise/enterprise-plan-icon.png" />
                <span class="label">单位地址：</span>
                <span class="text">{{ detailInfo.sysEnterprise.address }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="state_icon">
          <img
            v-if="detailInfo.sysEnterprise.entState == '正常'"
            src="@/assets/img/enterprise/state-normal.png"
          />
          <img
            v-if="detailInfo.sysEnterprise.entState == '审核不通过'"
            src="@/assets/img/enterprise/state-not.png"
          />
          <img
            v-if="detailInfo.sysEnterprise.entState == '新注册'"
            src="@/assets/img/enterprise/state-register.png"
          />
          <img
            v-if="detailInfo.sysEnterprise.entState == '待审核'"
            src="@/assets/img/enterprise/state-review.png"
          />
        </div>
      </el-card>
      <el-tabs type="border-card" class="other">
        <el-tab-pane label="基本信息">
          <div class="basic_info">
            <ul>
              <li>
                <span class="label">行业领域：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.industrySectorKey
                }}</span>
              </li>
              <li>
                <span class="label">注册地址：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.registeredAddress
                }}</span>
              </li>
              <li>
                <span class="label">成立日期：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.establishDate
                }}</span>
              </li>

              <li>
                <span class="label">法定代表人：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.legalPersonName
                }}</span>
              </li>
              <li>
                <span class="label">法定代表人电话：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.legalPersonPhone
                }}</span>
              </li>
              <li>
                <span class="label">场地性质：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.entNature
                }}</span>
              </li>
              <li>
                <span class="label">主要负责人：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.personInChargeName
                }}</span>
              </li>
              <li>
                <span class="label">主要负责人电话：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.personInChargePhone
                }}</span>
              </li>
              <li>
                <span class="label">从业人员：</span>
                <span class="text"
                  >{{ detailInfo.sysEnterprise.practitionerNumber }}人</span
                >
              </li>
              <li>
                <span class="label">安全负责人：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.safetyDirectorName
                }}</span>
              </li>
              <li>
                <span class="label">安全负责人电话：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.safetyDirectorPhone
                }}</span>
              </li>
              <li>
                <span class="label">隶属类型：</span>
                <span class="text">{{
                  detailInfo.sysEntExtend.typeOfAffiliationStr
                }}</span>
              </li>
              <li>
                <span class="label">行业管理部门：</span>
                <span class="text">{{
                  detailInfo.sysEntExtend.industryManagementDep
                }}</span>
              </li>
              <li>
                <span class="label">注册资金：</span>
                <span class="text"
                  >{{ detailInfo.sysEntExtend.registeredCapital }}
                  {{ detailInfo.sysEntExtend.registeredCapital ? "万元" : "" }}
                  {{ detailInfo.sysEntExtend.currency }}</span
                >
              </li>
              <li v-if="detailInfo.sysEnterprise.entNature == '租赁'">
                <span class="label">租赁场地：</span>
                <span class="text"
                  >{{ detailInfo.sysEnterprise.affiliationEntName }}
                </span>
              </li>
              <li class="imgs">
                <span class="label">经营范围：</span>
                <span class="text">{{
                  detailInfo.sysEnterprise.businessScope
                }}</span>
              </li>
              <li class="imgs">
                <span class="label">营业执照：</span>
                <div class="pic">
                  <el-image
                    v-for="(item, index) in detailInfo.sysEnterprise
                      .businessLicenseList"
                    :key="index"
                    style="width: 100px; height: 100px"
                    :src="baseURL + item.fileUrl"
                    fit="contain"
                    :preview-src-list="srcList"
                  />
                </div>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="安全生产基础信息">
          <el-descriptions border :column="3">
            <el-descriptions-item label="安全管理机构">{{
              detailInfo.sysEntSafe.safetyOrg
            }}</el-descriptions-item>
            <el-descriptions-item label="专职安全管理人员数量">{{
              detailInfo.sysEntSafe.fullTimeSafeNumber
            }}</el-descriptions-item>
            <el-descriptions-item label="特种作业人员数量">{{
              detailInfo.sysEntSafe.specialWorkNumber
            }}</el-descriptions-item>
            <el-descriptions-item label="重点监管危险化工工艺" :span="3">{{
              detailInfo.sysEntSafe.supervisionProcesses
            }}</el-descriptions-item>

            <el-descriptions-item label="是否涉及涉氨制冷（气）企业">{{
              detailInfo.sysEntSafe.isRefrigeration || "否"
            }}</el-descriptions-item>
            <el-descriptions-item
              v-if="detailInfo.sysEntSafe.isRefrigeration == '是'"
              label="涉氨制冷（气）类型"
              :span="2"
              >{{
                detailInfo.sysEntSafe.refrigerationTypeStr
              }}</el-descriptions-item
            >
            <el-descriptions-item label="是否涉及有限空间">{{
              detailInfo.sysEntSafe.isLimitedSpace || "否"
            }}</el-descriptions-item>
            <el-descriptions-item
              v-if="detailInfo.sysEntSafe.isLimitedSpace == '是'"
              label="有限空间数量"
              >{{
                detailInfo.sysEntSafe.limitedSpaceNumber
              }}</el-descriptions-item
            >
            <el-descriptions-item
              v-if="detailInfo.sysEntSafe.isLimitedSpace == '是'"
              label="有限空间同一时间作业最大人数"
              >{{
                detailInfo.sysEntSafe.limitedSpaceWorkMaxNumber
              }}</el-descriptions-item
            >
            <el-descriptions-item label="是否涉及粉尘涉爆">{{
              detailInfo.sysEntSafe.isDustExplosion || "否"
            }}</el-descriptions-item>
            <el-descriptions-item
              v-if="detailInfo.sysEntSafe.isDustExplosion == '是'"
              label="粉尘涉爆类型"
              >{{
                detailInfo.sysEntSafe.dustExplosionNameStr
              }}</el-descriptions-item
            >
            <el-descriptions-item
              v-if="detailInfo.sysEntSafe.isDustExplosion == '是'"
              label="粉尘涉爆同一时间作业最大人数"
              >{{
                detailInfo.sysEntSafe.dustExplosionWorkMaxNumber
              }}</el-descriptions-item
            >
            <el-descriptions-item label="是否商务商业楼宇">{{
              detailInfo.sysEntSafe.isCommercialBuilding || "否"
            }}</el-descriptions-item>
            <el-descriptions-item
              v-if="detailInfo.sysEntSafe.isCommercialBuilding == '是'"
              label="楼宇名称"
              :span="2"
              >{{
                detailInfo.sysEntSafe.commercialBuildingName
              }}</el-descriptions-item
            >
            <el-descriptions-item label="是否消防重点单位">{{
              detailInfo.sysEntSafe.isFire || "否"
            }}</el-descriptions-item>
            <el-descriptions-item label="有无微型消防站" :span="2">{{
              detailInfo.sysEntSafe.haveFireStation == "是" ? "有" : "无"
            }}</el-descriptions-item>
            <el-descriptions-item label="是否涉及危险化学品">{{
              detailInfo.sysEntSafe.isHazardousChemicals || "否"
            }}</el-descriptions-item>
            <el-descriptions-item label="是否构成重大危险源">{{
              detailInfo.sysEntSafe.isHazardousSource || "否"
            }}</el-descriptions-item>

            <el-descriptions-item label="是否涉及燃气使用">{{
              detailInfo.sysEntSafe.isGasUse || "否"
            }}</el-descriptions-item>
          </el-descriptions>

          <el-row style="margin-top: 20px">
            <el-col style="padding: 0 5px">
              <myTable
                v-if="
                  detailInfo.sysEntSafe.chemicalsList &&
                    detailInfo.sysEntSafe.chemicalsList.length &&
                    detailInfo.sysEntSafe.isHazardousChemicals == '是'
                "
                :show-index="true"
                :selection="false"
                :checked="checked1"
                :table-data="detailInfo.sysEntSafe.chemicalsList"
                on-resize-height="700"
                :is-screening="false"
                :is-print-table="false"
                :show-tip="true"
                tip-title="涉及危险化学品"
              />
            </el-col>
            <el-col :span="12" style="padding: 0 5px">
              <myTable
                v-if="
                  detailInfo.sysEntSafe.hazardsList &&
                    detailInfo.sysEntSafe.hazardsList.length &&
                    detailInfo.sysEntSafe.isHazardousSource == '是'
                "
                :show-index="true"
                :selection="false"
                :checked="checked2"
                :table-data="detailInfo.sysEntSafe.hazardsList"
                on-resize-height="700"
                :is-screening="false"
                :is-print-table="false"
                :show-tip="true"
                tip-title="构成重大危险源"
              />
            </el-col>
            <el-col :span="12" style="padding: 0 5px">
              <myTable
                v-if="
                  detailInfo.sysEntSafe.gasUseList &&
                    detailInfo.sysEntSafe.gasUseList.length &&
                    detailInfo.sysEntSafe.isGasUse == '是'
                "
                :show-index="true"
                :selection="false"
                :checked="checked3"
                :table-data="detailInfo.sysEntSafe.gasUseList"
                on-resize-height="700"
                :is-screening="false"
                :is-print-table="false"
                :show-tip="true"
                tip-title="涉及燃气使用"
              />
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="安全培训管理">
          <el-col style="padding: 0 5px; margin-top: 10px">
            <myTable
              v-if="detailInfo.trainingList && detailInfo.trainingList.length"
              :show-index="true"
              :selection="false"
              :checked="checked4"
              :table-data="detailInfo.trainingList"
              on-resize-height="700"
              :is-screening="false"
              :is-print-table="false"
              custom1-label="证书文件"
              :show-tip="true"
              tip-title="安全培训取证情况"
            >
              <template slot="custom1" slot-scope="scope">
                <a
                  v-for="(item, index) in scope.data.row.userCertFileList"
                  :key="index"
                  :href="baseURL + item.fileUrl"
                  target="_blank"
                >
                  {{ item.fileName }}
                </a>
              </template>
            </myTable>

            <myTable
              v-if="detailInfo.specialList && detailInfo.specialList.length"
              :show-index="true"
              :selection="false"
              :checked="checked5"
              :table-data="detailInfo.specialList"
              on-resize-height="700"
              :is-screening="false"
              :is-print-table="false"
              custom1-label="证书文件"
              :show-tip="true"
              tip-title="特种（设备）作业人员"
            >
              <template slot="custom1" slot-scope="scope">
                <a
                  v-for="(item, index) in scope.data.row.userCertFileList"
                  :key="index"
                  :href="baseURL + item.fileUrl"
                  target="_blank"
                >
                  {{ item.fileName }}
                </a>
              </template>
            </myTable>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="安全管理">
          <el-descriptions border :column="3">
            <el-descriptions-item label="是否制定安全责任制度">{{
              detailInfo.sysEntSafety.isSafetyResponsibility || "否"
            }}</el-descriptions-item>
            <el-descriptions-item
              v-if="detailInfo.sysEntSafety.isSafetyResponsibility == '是'"
              label="安全责任制定发布时间"
              >{{ detailInfo.sysEntSafety.publishTime }}</el-descriptions-item
            >
            <el-descriptions-item
              v-if="detailInfo.sysEntSafety.isSafetyResponsibility == '是'"
              label="安全责任证书文件"
            >
              <a
                v-for="(item, index) in detailInfo.sysEntSafety.safetyFileList"
                :key="index"
                :href="baseURL + item.fileUrl"
                target="_blank"
              >
                {{ item.fileName }}</a
              >
            </el-descriptions-item>
            <el-descriptions-item label="是否制定安全管理制度">{{
              detailInfo.sysEntSafety.isManageInstitution || "否"
            }}</el-descriptions-item>
            <el-descriptions-item
              v-if="detailInfo.sysEntSafety.isManageInstitution == '是'"
              label="安全管理制度附件"
              :span="2"
            >
              <a
                v-for="(item, index) in detailInfo.sysEntSafety
                  .manageInstitutionFileList"
                :key="index"
                :href="baseURL + item.fileUrl"
                target="_blank"
                style="display: inline-block; margin-right: 20px"
              >
                {{ item.fileName }}</a
              >
            </el-descriptions-item>
            <el-descriptions-item label="是否制定操作规范">{{
              detailInfo.sysEntSafety.isSafetyAction || "否"
            }}</el-descriptions-item>
            <el-descriptions-item label="是否取得安全标准化证书">{{
              detailInfo.sysEntSafety.isStandardCert || "否"
            }}</el-descriptions-item>
          </el-descriptions>
          <el-col style="padding: 0 5px; margin-top: 10px">
            <myTable
              v-if="
                detailInfo.sysEntSafety.sysSafetyActionList &&
                  detailInfo.sysEntSafety.sysSafetyActionList.length &&
                  detailInfo.sysEntSafety.isSafetyAction == '是'
              "
              :show-index="true"
              :selection="false"
              :checked="checked6"
              :table-data="detailInfo.sysEntSafety.sysSafetyActionList"
              on-resize-height="700"
              :is-screening="false"
              :is-print-table="false"
              custom1label="证书文件"
              :show-tip="true"
              tip-title="制定操作规范"
            >
              <template slot="custom1" slot-scope="scope">
                <a
                  v-for="(item, index) in scope.data.row.safetyActionFileList"
                  :key="index"
                  :href="baseURL + item.fileUrl"
                  target="_blank"
                >
                  {{ item.fileName }}
                </a>
              </template>
            </myTable>

            <myTable
              v-if="
                detailInfo.sysEntSafety.safetyCertList &&
                  detailInfo.sysEntSafety.safetyCertList.length &&
                  detailInfo.sysEntSafety.isStandardCert == '是'
              "
              :show-index="true"
              :selection="false"
              :checked="checked7"
              :table-data="detailInfo.sysEntSafety.safetyCertList"
              on-resize-height="700"
              :is-screening="false"
              :is-print-table="false"
              custom1label="证书文件"
              :show-tip="true"
              tip-title="安全标准化证书"
            >
              <template slot="custom1" slot-scope="scope">
                <a
                  v-for="(item, index) in scope.data.row.safetyCertFileList"
                  :key="index"
                  :href="baseURL + item.fileUrl"
                  target="_blank"
                >
                  {{ item.fileName }}
                </a>
              </template>
            </myTable>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="其他">
          <div class="supplement_info">
            <ul>
              <li>
                <span class="label">是否购买工伤保险：</span>
                <span class="text">{{
                  detailInfo.sysEntExtend.isIndustryInsure
                }}</span>
              </li>
              <li v-if="detailInfo.sysEntExtend.isIndustryInsure == '是'">
                <span class="label">工伤保险购买人数：</span>
                <span class="text"
                  >{{ detailInfo.sysEntExtend.industryInsureNumber }}人</span
                >
              </li>
              <li
                v-if="detailInfo.sysEntExtend.isIndustryInsure == '是'"
                class="imgs"
              >
                <span class="label">工伤保险购买文件：</span>
                <span class="text">
                  <a
                    v-for="(item, index) in detailInfo.sysEntExtend
                      .industryInsureFileList"
                    :key="index"
                    :href="baseURL + item.fileUrl"
                    target="_blank"
                    style="display: inline-block; margin-right: 20px"
                  >
                    {{ item.fileName }}
                  </a>
                </span>
              </li>
              <li>
                <span class="label">是否购买安全生产责任险：</span>
                <span class="text">{{
                  detailInfo.sysEntExtend.isSecureInsure
                }}</span>
              </li>
              <li
                v-if="detailInfo.sysEntExtend.isSecureInsure == '是'"
                class="imgs"
              >
                <span class="label">购买安全生产责任险文件：</span>
                <span class="text">
                  <a
                    v-for="(item, index) in detailInfo.sysEntExtend
                      .secureInsureFileList"
                    :key="index"
                    :href="baseURL + item.fileUrl"
                    target="_blank"
                    style="display: inline-block; margin-right: 20px"
                  >
                    {{ item.fileName }}
                  </a>
                </span>
              </li>
              <li class="imgs">
                <span class="label">企业备注：</span>
                <span class="text">{{
                  detailInfo.sysEntExtend.entRemark
                }}</span>
              </li>
            </ul>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { detail, enumList, entReview } from "@/api/system/enterprise";
import formRules from "./formRules";

export default {
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,

      editId: null,

      detailInfo: formRules.dialogForm,
      srcList: [],
      loginUser: {},
      registerShow: false,
      checked1: [
        { key: "危化品名称", val: "chemicalsName" },
        { key: "年产量(t)", val: "yearWeight" },
        { key: "每日使用量(t)", val: "dailyWeight" },
        { key: "最大储存量(t)", val: "maxWeight" }
      ],
      checked2: [
        { key: "分级", val: "classificationStr" },
        { key: "数量", val: "quantity" }
      ],
      checked3: [
        { key: "使用位置", val: "gasUsePositionStr" },
        { key: "种类", val: "gasUseType" }
      ],
      checked4: [
        { key: "姓名", val: "userName" },
        { key: "证书类型", val: "certTypeStr" },
        { key: "专兼职", val: "jobStatusStr" },
        { key: "证书编号", val: "certNo" },
        { key: "证书生效开始时间", val: "validStartTime" },
        { key: "证书生效结束时间", val: "validEndTime" }
      ],
      checked5: [
        { key: "姓名", val: "userName" },
        { key: "证书类型", val: "certTypeStr" },
        { key: "状态", val: "jobStatusStr" },
        { key: "证书编号", val: "certNo" },
        { key: "证书生效开始时间", val: "validStartTime" },
        { key: "证书生效结束时间", val: "validEndTime" }
      ],
      checked6: [{ key: "文件描述", val: "actionName" }],
      checked7: [
        { key: "等级", val: "standardLevel" },
        { key: "证书编号", val: "certNo" },
        { key: "证书发放时间", val: "issueTime" },
        { key: "证书生效开始时间", val: "validStartTime" },
        { key: "证书生效结束时间", val: "validEndTime" }
      ],
      entStateList: []
    };
  },
  async created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    this.editId = this.$route.query.id;
    await this.getMainData();
    await this.getenumList();
  },
  methods: {
    //枚举
    getenumList() {
      enumList().then(res => {
        this.entStateList = res.entStateList;
      });
    },
    findIndex(arr, key, value) {
      return arr.findIndex(obj => obj[key] === value);
    },
    getMainData() {
      this.loading = true;
      detail({ entId: this.editId })
        .then(res => {
          console.log(res);
          this.detailInfo = res;

          if (
            this.detailInfo.sysEnterprise.businessLicenseList &&
            this.detailInfo.sysEnterprise.businessLicenseList.length
          ) {
            this.srcList = [];
            this.detailInfo.sysEnterprise.businessLicenseList.forEach(item => {
              this.srcList.push(this.baseURL + item.fileUrl);
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //审核
    process() {
      if (
        this.loginUser.userType == "平台" &&
        this.detailInfo.sysEnterprise.entLocation == "园内企业"
      ){
        this.$message.error("平台只可审核园外企业！");
        return 
      }
        this.$confirm("请选择审核是否通过？", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "同意",
          cancelButtonText: "拒绝"
        })
          .then(() => {
            const index = this.findIndex(this.entStateList, "key", "正常");
            let obj = {
              ids: [this.editId],
              value: this.entStateList[index].value
            };
            console.log(index);
            entReview(obj).then(res => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.getMainData();
            });
          })
          .catch(action => {
            if (action === "cancel") {
              const index = this.findIndex(
                this.entStateList,
                "key",
                "审核不通过"
              );
              let obj = {
                ids: [this.editId],
                value: this.entStateList[index].value
              };
              entReview(obj).then(res => {
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
                this.getMainData();
              });
            }
          });
    },
    back() {
      console.log();
      if (this.$route.query.type == "park") {
        this.$router.push({
          path: "/park/approval/index",
          query: {
            name: "企业档案"
          }
        });
      } else {
        this.$router.push({
          path: "/system/enterprise/index",
          query: {
            name: "企业管理"
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .title {
    height: 30px;
    font-size: 20px;
    font-family: "Microsoft YaHei, Microsoft YaHei";
    font-weight: bold;
    color: #006cfb;
    i {
      font-weight: bold;
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
/deep/.toolsRight {
  flex-direction: row !important;
}

.hiddenText {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

ul {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  grid-gap: 20px;
  padding: 10px 0;
  li {
    min-width: calc(100% / 3 - 20px);
    display: flex;
    align-items: center;

    span {
      margin-left: 5px;
      font-size: 14px;
      color: #000000;
    }
    .label {
      color: #999999;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      img {
        margin-right: 5px;
      }
    }
  }
  .imgs {
    width: 100%;
    align-items: flex-start;
    .pic {
      display: flex;
      flex-wrap: wrap;
      grid-gap: 10px;
      img {
        width: 100px;
        height: 100px;
        object-fit: contain;
      }
    }
  }
}

.table-classic-wrapper {
  background-color: #f0f2f5;
  height: 100%;
}

.flex {
  justify-content: flex-end;
  .right {
    margin: 0 !important;
  }
}

/deep/.content {
  height: calc(100% - 42px);
  .el-card {
    margin-bottom: 10px;
  }
  .el-card__body {
    height: 100%;
  }

  .info {
    height: 30%;
    min-height: 220px;
    position: relative;

    h3 {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
        font-weight: bold;
        font-size: 22px;
        width: 100%;
      }
    }
    .basic {
      display: flex;
      height: calc(100% - 35px);
      .basic_left {
        min-width: 350px;
        width: 30%;
        .contactsInfo {
          display: flex;
          align-items: center;
          .riskIcon {
            width: 118px;
            height: 118px;
          }
          .detail {
            width: calc(100% - 118px);
            & > div {
              display: flex;
              align-items: center;
              height: 40px;
              background: rgba(0, 0, 0, 0.03);
              border-radius: 5px;
              padding: 8px;
              font-size: 14px;
              margin: 4px 0;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              span {
                color: #262626;
                margin-left: 8px;
                min-width: 90px;
              }
              strong {
                color: #006eff;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }

      .basic_right {
        width: 70%;
        margin-left: 30px;
        height: 100%;
        overflow: auto;
      }
    }
    .state_icon {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }

  .other {
    height: calc(70% - 10px);
    border-radius: 4px;
    .el-tabs__header {
      border-radius: 4px 4px 0 0;
      .el-tabs__item.is-active {
        color: #000000;
      }
      .el-tabs__item:not(.is-disabled):hover {
        color: #000000;
      }
    }
  }
}

/deep/.el-tabs__header {
  height: 40px;
}
/deep/.el-tab-pane {
  height: 100%;
  overflow: auto;
}

/deep/.el-tabs__content {
  height: calc(100% - 40px);
  .el-tab-pane {
    height: 100%;
  }
}

.basic_info {
  height: 100%;

  .label {
    min-width: 130px;
    text-align: right;
  }
}

.supplement_info {
  height: 100%;

  .label {
    min-width: 170px;
    text-align: right;
  }
}

// 滚动条整体部分
&::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
// 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
&::-webkit-scrollbar-button {
  display: none;
}
// 滚动条的轨道（里面装有Thumb）
&::-webkit-scrollbar-track {
  background: transparent;
}
// 滚动条的轨道（里面装有Thumb）
&::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
// 滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
&::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  cursor: pointer;
  border-radius: 4px;
}
/deep/.my_table {
  margin-bottom: 20px;
}
</style>
