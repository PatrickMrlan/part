<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="85%">
    <el-form
      ref="dialogForm"
      v-loading="loading"
      style="min-height: 100%"
      :model="dialogForm"
      :rules="formRules"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基础信息" name="first">
          <el-row :gutter="20">
            <!-- <el-col :span="8">
              <el-form-item label="所属园区：" prop="parkId">
                <el-input
                  placeholder="请选择园区"
                  v-model="dialogForm.parkName"
                  readonly
                >
                  <template slot="append">选择</template>
                </el-input>
              </el-form-item>
            </el-col> -->
            <el-col>
              <el-form-item label="企业名称：" prop="sysEnterprise.entName">
                <el-input
                  v-model="dialogForm.sysEnterprise.entName"
                  placeholder="请输入企业名称"
                  show-word-limit
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="行业领域："
                prop="sysEnterprise.industrySector"
                style="margin-bottom: 16px !important"
              >
                <treeselect
                  :key="industrySectorNameKey"
                  v-model="dialogForm.sysEnterprise.industrySector"
                  :multiple="false"
                  :close-on-select="true"
                  :options="enumList.industrySectorList"
                  :default-expand-level="1"
                  :disable-branch-nodes="true"
                  :normalizer="treeSelectNormalizer"
                  no-results-text="未找到相关结果"
                  no-options-text="没有可选择的数据"
                  placeholder="请选择行业领域"
                  @select="selectIndustrySector($event, true)"
                >
                  <div slot="value-label">{{ industrySectorName }}</div>
                </treeselect>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="国民经济分类："
                prop="sysEnterprise.nationalEconomy"
                style="margin-bottom: 16px !important"
              >
                <treeselect
                  :key="nationalEconomyNameKey"
                  v-model="dialogForm.sysEnterprise.nationalEconomy"
                  :multiple="false"
                  :close-on-select="true"
                  :options="enumList.nationalEconomyList"
                  :default-expand-level="1"
                  :disable-branch-nodes="true"
                  :normalizer="treeSelectNormalizer"
                  no-results-text="未找到相关结果"
                  no-options-text="没有可选择的数据"
                  placeholder="请选择国民经济分类"
                  @select="selectEconomy($event, true)"
                >
                  <div slot="value-label">{{ nationalEconomyName }}</div>
                </treeselect>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="经营状况：" prop="sysEnterprise.performance">
                <el-select
                  v-model="dialogForm.sysEnterprise.performance"
                  filterable
                  placeholder="请选择经营状况"
                >
                  <el-option
                    v-for="(item, index) in enumList.performanceList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="统一社会信用代码："
                prop="sysEnterprise.entCode"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.entCode"
                  placeholder="请输入统一社会信用代码"
                  show-word-limit
                  maxlength="60"
                />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="行政区划：" prop="sysEnterprise.district">
                <el-cascader
                  v-model="dialogForm.sysEnterprise.district"
                  filterable
                  clearable
                  :options="address"
                  :props="cateListProps"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" style="margin-top: 32px">
              <el-form-item label=" " prop="sysEnterprise.townlet">
                <el-input
                  v-model="dialogForm.sysEnterprise.townlet"
                  placeholder="镇/街道"
                  show-word-limit
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" style="margin-top: 32px">
              <el-form-item label=" " prop="sysEnterprise.village">
                <el-input
                  v-model="dialogForm.sysEnterprise.village"
                  placeholder="村/社区"
                  show-word-limit
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="成立日期："
                prop="sysEnterprise.establishDate"
              >
                <el-date-picker
                  v-model="dialogForm.sysEnterprise.establishDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>

            <el-col
              :span="
                dialogForm.sysEnterprise.entLocation == '园内企业' ? 12 : 24
              "
            >
              <el-form-item label="归属园区：" prop="sysEnterprise.entLocation">
                <el-radio
                  v-model="dialogForm.sysEnterprise.entLocation"
                  :disabled="true"
                  label="园内企业"
                >园内企业</el-radio>
                <el-radio
                  v-model="dialogForm.sysEnterprise.entLocation"
                  :disabled="true"
                  label="园外企业"
                >园外企业</el-radio>
              </el-form-item>
            </el-col>

            <el-col
              v-if="dialogForm.sysEnterprise.entLocation == '园内企业'"
              :span="12"
            >
              <el-form-item label="所在园区：" prop="entLocation">
                <el-select
                  v-model="dialogForm.sysEnterprise.parkId"
                  placeholder="请选择所在园区"
                >
                  <el-option
                    v-for="item in parkList"
                    :key="item.parkId"
                    :label="item.parkName"
                    :value="item.parkId"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="管理员账号：" prop="sysEnterprise.loginCode">
                <el-input
                  v-model="dialogForm.sysEnterprise.loginCode"
                  type="text"
                  placeholder="请输入管理员账号"
                  clearable
                  auto-complete="new-password"
                  maxlength="20"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="管理员密码：" prop="sysEnterprise.loginPass">
                <el-input
                  v-model="dialogForm.sysEnterprise.loginPass"
                  type="password"
                  placeholder="请输入管理员密码"
                  :show-password="true"
                  auto-complete="new-password"
                  clearable
                  maxlength="20"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                v-show="dialogForm.sysEnterprise.loginPass"
                label="重复密码："
                prop="sysEnterprise.repeatPassword"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.repeatPassword"
                  auto-complete="new-password"
                  :show-password="true"
                  type="password"
                  placeholder="请输入重复密码"
                  clearable
                  maxlength="20"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="联系人：" prop="sysEnterprise.contact">
                <el-input
                  v-model="dialogForm.sysEnterprise.contact"
                  type="text"
                  placeholder="请输入联系人"
                  clearable
                  maxlength="20"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="联系人手机号："
                prop="sysEnterprise.contactTel"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.contactTel"
                  type="text"
                  placeholder="请输入联系人手机号"
                  clearable
                  maxlength="11"
                />
              </el-form-item>
            </el-col>

            <el-col>
              <el-form-item
                label="注册地址："
                prop="sysEnterprise.registeredAddress"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.registeredAddress"
                  placeholder="请输入注册地址"
                  show-word-limit
                  maxlength="200"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="实际地址：" prop="sysEnterprise.address">
                <el-input
                  v-model="dialogForm.sysEnterprise.address"
                  placeholder="请输入实际地址"
                  show-word-limit
                  readonly
                  maxlength="200"
                >
                  <template slot="append">
                    <div @click="mapShow = true">选择</div>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="场地性质：" prop="sysEnterprise.entNature">
                <el-select
                  v-model="dialogForm.sysEnterprise.entNature"
                  filterable
                  placeholder="请选择场地性质"
                >
                  <el-option
                    v-for="(item, index) in enumList.entNatureList"
                    :key="index"
                    :label="item.key"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEnterprise.entNature == '租赁'"
              :span="6"
            >
              <el-form-item
                label="所属企业："
                prop="sysEnterprise.affiliationEntName"
              >
                <el-select
                  v-model="dialogForm.sysEnterprise.affiliationEntName"
                  value-key="entId"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择或输入企业"
                  @change="changeEnt"
                >
                  <el-option
                    v-for="(item, index) in affiliationList"
                    :key="index"
                    :label="item.entName"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="从业人员（个）："
                prop="sysEnterprise.practitionerNumber"
              >
                <el-input-number
                  v-model="dialogForm.sysEnterprise.practitionerNumber"
                  placeholder="请输入从业人员"
                  :min="0"
                  :precision="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="营业执照："
                prop="sysEnterprise.businessLicenseList"
              >
                <el-tooltip
                  class="item tips"
                  effect="dark"
                  content="只能上传图片"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                <myUpload
                  action="#"
                  class="upload-demo"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                  :file-list="dialogForm.sysEnterprise.businessLicenseList"
                  :on-preview="handlePreview"
                  :http-request="
                    (file, fileList) =>
                      handleUpload(
                        dialogForm.sysEnterprise.businessLicenseList,
                        file,
                        fileList,
                        'businessLicense'
                      )
                  "
                  :before-upload="beforeUpload"
                  :on-remove="
                    (file, fileList) =>
                      handleRemove(
                        dialogForm.sysEnterprise.businessLicenseList,
                        file,
                        fileList
                      )
                  "
                  :before-remove="beforeRemove"
                >
                  <myButton
                    v-if="
                      dialogForm.sysEnterprise.businessLicenseList &&
                        dialogForm.sysEnterprise.businessLicenseList.length == 0
                    "
                  >点击上传</myButton>
                </myUpload>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                label="经营范围："
                prop="sysEnterprise.businessScope"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.businessScope"
                  type="textarea"
                  placeholder="请输入经营范围"
                  show-word-limit
                  :autosize="{ minRows: 4 }"
                  maxlength="500"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <fieldset>
                <legend>法定代表人</legend>
              </fieldset>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="sysEnterprise.legalPersonName">
                <el-input
                  v-model="dialogForm.sysEnterprise.legalPersonName"
                  placeholder="请输入法定代表人姓名"
                  show-word-limit
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="电话："
                prop="sysEnterprise.legalPersonPhone"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.legalPersonPhone"
                  placeholder="请输入法定代表人电话"
                  show-word-limit
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <fieldset>
                <legend>主要负责人</legend>
              </fieldset>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="姓名："
                prop="sysEnterprise.personInChargeName"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.personInChargeName"
                  placeholder="请输入主要负责人姓名"
                  show-word-limit
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="电话："
                prop="sysEnterprise.personInChargePhone"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.personInChargePhone"
                  placeholder="请输入主要负责人电话"
                  show-word-limit
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <fieldset>
                <legend>安全负责人</legend>
              </fieldset>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="姓名："
                prop="sysEnterprise.safetyDirectorName"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.safetyDirectorName"
                  placeholder="请输入安全负责人姓名"
                  show-word-limit
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="电话："
                prop="sysEnterprise.safetyDirectorPhone"
              >
                <el-input
                  v-model="dialogForm.sysEnterprise.safetyDirectorPhone"
                  placeholder="请输入安全负责人电话"
                  show-word-limit
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <fieldset>
                <legend>其他信息</legend>
              </fieldset>
            </el-col>

            <el-col :span="6">
              <el-form-item label="企业规模：" prop="sysEntExtend.entSizeUp">
                <el-tooltip
                  class="item tips"
                  effect="dark"
                  content="规模描述"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                <el-select
                  v-model="dialogForm.sysEntExtend.entSizeUp"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in enumList.entSizeUpList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label=""
                prop="sysEntExtend.entSizeBig"
                style="margin-top: 32px"
              >
                <el-select
                  v-model="dialogForm.sysEntExtend.entSizeBig"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in enumList.entSizeBigList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="注册资金(万元)："
                prop="sysEntExtend.registeredCapital"
              >
                <el-input-number
                  v-model="dialogForm.sysEntExtend.registeredCapital"
                  placeholder="请输入注册资金"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="币种：" prop="sysEntExtend.currency">
                <el-select
                  v-model="dialogForm.sysEntExtend.currency"
                  filterable
                  placeholder="请选择币种"
                >
                  <el-option
                    v-for="(item, index) in enumList.currencyList"
                    :key="index"
                    :label="item.key"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="隶属类型："
                prop="sysEntExtend.typeOfAffiliation"
              >
                <el-tooltip class="item tips" effect="dark" placement="top">
                  <div slot="content">
                    企业的行政隶属关系：<br>
                    1、中央:包括全国人大常委会、中共中央、国务院直厘机构和办事机构。各部委及直属机构等。<br>
                    2、省:包括自治区、直辖市直属的行政管理单位。<br>
                    3、地区:包括自治州、盟、省辖市和直辖市辖区直届行政管理单位。<br>
                    4、县:包括地、州、盟辖市、省辖市辖区、自治县、自治旗、县级市直厘的行政管理单位。<br>
                    5、乡镇企业。<br>
                    6、民营企业。<br>
                    7、其他。<br>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
                <el-select
                  v-model="dialogForm.sysEntExtend.typeOfAffiliation"
                  filterable
                  placeholder="请选择隶属类型"
                >
                  <el-option
                    v-for="(item, index) in enumList.typeOfAffiliationList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item
                label="行业管理部门："
                prop="sysEntExtend.industryManagementDep"
              >
                <el-input
                  v-model="dialogForm.sysEntExtend.industryManagementDep"
                  placeholder="请输入行业管理部门"
                  show-word-limit
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="5">
              <el-form-item label="管理员账号：" prop="userName">
                <el-input
                  placeholder="请输入管理员账号"
                  v-model="dialogForm.userName"
                  show-word-limit
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="管理员密码：" prop="password">
                <el-input
                  placeholder="请输入管理员密码"
                  v-model="dialogForm.password"
                  show-word-limit
                  maxlength="50"
                />
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item
                label="经营场地用地面积(㎡)："
                prop="sysEntExtend.groundForBusinessPremises"
              >
                <el-input-number
                  v-model="dialogForm.sysEntExtend.groundForBusinessPremises"
                  placeholder="请输入经营场地用地面积"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="20">
            <el-col>
              <fieldset>
                <legend>补充信息</legend>
              </fieldset>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否购买工伤保险："
                prop="sysEntExtend.isIndustryInsure"
              >
                <el-switch
                  v-model="dialogForm.sysEntExtend.isIndustryInsure"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntExtend.isIndustryInsure == '是'"
              :span="6"
            >
              <el-form-item
                label="工伤保险购买人数："
                prop="sysEntExtend.industryInsureNumber"
              >
                <el-input-number
                  v-model="dialogForm.sysEntExtend.industryInsureNumber"
                  placeholder="请输入工伤保险购买人数"
                  :min="0"
                  :precision="0"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntExtend.isIndustryInsure == '是'"
              :span="12"
            >
              <el-form-item
                label="工伤保险购买文件："
                prop="sysEntExtend.industryInsureFileList"
                class="floatLabel"
              >
                <myUpload
                  action="#"
                  class="upload-demo"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                  :file-list="dialogForm.sysEntExtend.industryInsureFileList"
                  :on-preview="handlePreview"
                  :before-remove="beforeRemove"
                  :http-request="
                    (file, fileList) =>
                      handleUpload(
                        dialogForm.sysEntExtend.industryInsureFileList,
                        file,
                        fileList,
                        'industryInsureFile'
                      )
                  "
                  :before-upload="beforeUpload"
                  :on-remove="
                    (file, fileList) =>
                      handleRemove(
                        dialogForm.sysEntExtend.industryInsureFileList,
                        file,
                        fileList
                      )
                  "
                >
                  <myButton
                    v-if="
                      dialogForm.sysEntExtend.industryInsureFileList &&
                        dialogForm.sysEntExtend.industryInsureFileList.length == 0
                    "
                  >点击上传</myButton>
                </myUpload>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否购买安全生产责任险："
                prop="sysEntExtend.isSecureInsure"
              >
                <el-switch
                  v-model="dialogForm.sysEntExtend.isSecureInsure"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntExtend.isSecureInsure == '是'"
              :span="12"
            >
              <el-form-item
                label="购买安全生产责任险文件："
                prop="sysEntExtend.secureInsureFileList"
                class="floatLabel"
              >
                <myUpload
                  action="#"
                  class="upload-demo"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                  :file-list="dialogForm.sysEntExtend.secureInsureFileList"
                  :on-preview="handlePreview"
                  :http-request="
                    (file, fileList) =>
                      handleUpload(
                        dialogForm.sysEntExtend.secureInsureFileList,
                        file,
                        fileList,
                        'secureInsureFile'
                      )
                  "
                  :before-upload="beforeUpload"
                  :on-remove="
                    (file, fileList) =>
                      handleRemove(
                        dialogForm.sysEntExtend.secureInsureFileList,
                        file,
                        fileList
                      )
                  "
                  :before-remove="beforeRemove"
                >
                  <myButton
                    v-if="
                      dialogForm.sysEntExtend.secureInsureFileList &&
                        dialogForm.sysEntExtend.secureInsureFileList.length == 0
                    "
                  >点击上传</myButton>
                </myUpload>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="企业备注：" prop="sysEntExtend.entRemark">
                <el-input
                  v-model="dialogForm.sysEntExtend.entRemark"
                  type="textarea"
                  placeholder="请输入企业备注"
                  show-word-limit
                  :autosize="{ minRows: 4 }"
                  maxlength="500"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="安全生产基础信息" name="second">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="安全管理机构：" prop="sysEntSafe.safetyOrg">
                <el-input
                  v-model="dialogForm.sysEntSafe.safetyOrg"
                  placeholder="请输入安全管理机构"
                  show-word-limit
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="专职安全管理人员数量："
                prop="sysEntSafe.fullTimeSafeNumber"
              >
                <el-input-number
                  v-model="dialogForm.sysEntSafe.fullTimeSafeNumber"
                  placeholder="请输入专职安全管理人员数量"
                  :min="0"
                  :precision="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="特种作业人员数量："
                prop="sysEntSafe.specialWorkNumber"
              >
                <el-input-number
                  v-model="dialogForm.sysEntSafe.specialWorkNumber"
                  placeholder="请输入特种作业人员数量"
                  :min="0"
                  :precision="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item
                label="重点监管危险化工工艺："
                prop="sysEntSafe.supervisionProcesses"
              >
                <el-checkbox-group
                  v-model="dialogForm.sysEntSafe.supervisionProcesses"
                >
                  <el-checkbox
                    v-for="(item, index) in enumList.supervisionProcessesList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否涉及涉氨制冷（气）企业："
                prop="sysEntSafe.isRefrigeration"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafe.isRefrigeration"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntSafe.isRefrigeration == '是'"
              :span="6"
            >
              <el-form-item
                label="涉氨制冷（气）类型："
                prop="sysEntSafe.refrigerationType"
              >
                <el-select
                  v-model="dialogForm.sysEntSafe.refrigerationType"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in enumList.refrigerationTypeList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item
                label="是否涉及危险化学品："
                prop="sysEntSafe.isHazardousChemicals"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafe.isHazardousChemicals"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                  @change="changeSwitch($event, '危险化学品')"
                />
              </el-form-item>
            </el-col>

            <el-col v-if="dialogForm.sysEntSafe.isHazardousChemicals == '是'">
              <el-table
                :data="dialogForm.sysEntSafe.chemicalsList"
                border
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{
                  height: '30px !important',
                  fontSize: '14px',
                  color: '#333',
                }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="50"
                />
                <el-table-column
                  prop="chemicalsName"
                  label="危化品名称"
                  min-width="200"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.chemicalsName"
                      placeholder="请输入~"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="yearWeight"
                  label="年产量(t)"
                  width="220"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.yearWeight"
                      placeholder="请输入~"
                      :min="0"
                      :precision="2"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="dailyWeight"
                  label="每日使用量(t)"
                  width="220"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.dailyWeight"
                      placeholder="请输入~"
                      :min="0"
                      :precision="2"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="maxWeight"
                  label="最大储存量(t)"
                  width="220"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.maxWeight"
                      placeholder="请输入~"
                      :min="0"
                      :precision="2"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <my-handle>
                      <span
                        v-if="
                          scope.$index ==
                            dialogForm.sysEntSafe.chemicalsList.length - 1
                        "
                        @click="
                          addRows(
                            dialogForm.sysEntSafe.chemicalsList,
                            '危险化学品'
                          )
                        "
                      >新增</span>
                      <span
                        v-if="dialogForm.sysEntSafe.chemicalsList.length > 1"
                        @click="
                          delRows(
                            dialogForm.sysEntSafe.chemicalsList,
                            scope.$index
                          )
                        "
                      >删除</span>
                    </my-handle>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item
                label="是否构成重大危险源："
                prop="sysEntSafe.isHazardousSource"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafe.isHazardousSource"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                  @change="changeSwitch($event, '重大危险源')"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="dialogForm.sysEntSafe.isHazardousSource == '是'">
              <el-table
                :data="dialogForm.sysEntSafe.hazardsList"
                border
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{
                  height: '30px !important',
                  fontSize: '14px',
                  color: '#333',
                }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="50"
                />
                <el-table-column
                  prop="classification"
                  label="分级"
                  min-width="200"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.classification"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in enumList.classificationList"
                        :key="index"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="quantity"
                  label="数量"
                  width="220"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.quantity"
                      placeholder="请输入~"
                      :min="0"
                      :precision="2"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <my-handle>
                      <span
                        v-if="
                          scope.$index ==
                            dialogForm.sysEntSafe.hazardsList.length - 1
                        "
                        @click="
                          addRows(
                            dialogForm.sysEntSafe.hazardsList,
                            '重大危险源'
                          )
                        "
                      >新增</span>
                      <span
                        v-if="dialogForm.sysEntSafe.hazardsList.length > 1"
                        @click="
                          delRows(
                            dialogForm.sysEntSafe.hazardsList,
                            scope.$index
                          )
                        "
                      >删除</span>
                    </my-handle>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item
                label="是否涉及燃气使用："
                prop="sysEntSafe.isGasUse"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafe.isGasUse"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                  @change="changeSwitch($event, '燃气使用')"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="dialogForm.sysEntSafe.isGasUse == '是'">
              <el-table
                :data="dialogForm.sysEntSafe.gasUseList"
                border
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{
                  height: '30px !important',
                  fontSize: '14px',
                  color: '#333',
                }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="50"
                />
                <el-table-column
                  prop="gasUsePosition"
                  label="使用位置"
                  width="300"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.gasUsePosition"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in enumList.gasUsePositionList"
                        :key="index"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="gasUseType" label="种类" min-width="200">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.gasUseType"
                      placeholder="请输入~"
                      maxlength="100"
                      show-word-limit
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <my-handle>
                      <span
                        v-if="
                          scope.$index ==
                            dialogForm.sysEntSafe.gasUseList.length - 1
                        "
                        @click="
                          addRows(dialogForm.sysEntSafe.gasUseList, '燃气使用')
                        "
                      >新增</span>
                      <span
                        v-if="dialogForm.sysEntSafe.gasUseList.length > 1"
                        @click="
                          delRows(
                            dialogForm.sysEntSafe.gasUseList,
                            scope.$index
                          )
                        "
                      >删除</span>
                    </my-handle>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item
                label="是否涉及有限空间："
                prop="sysEntSafe.isLimitedSpace"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafe.isLimitedSpace"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntSafe.isLimitedSpace == '是'"
              :span="6"
            >
              <el-form-item
                label="有限空间数量："
                prop="sysEntSafe.limitedSpaceNumber"
              >
                <el-input-number
                  v-model="dialogForm.sysEntSafe.limitedSpaceNumber"
                  placeholder="请输入有限空间数量"
                  :min="0"
                  :precision="0"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntSafe.isLimitedSpace == '是'"
              :span="6"
            >
              <el-form-item
                label="同一时间作业最大人数："
                prop="sysEntSafe.limitedSpacelWorkMaxNumber"
              >
                <el-input-number
                  v-model="dialogForm.sysEntSafe.limitedSpacelWorkMaxNumber"
                  placeholder="请输入同一时间作业最大人数"
                  :min="0"
                  :precision="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item
                label="是否涉及粉尘涉爆："
                prop="sysEntSafe.isDustExplosion"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafe.isDustExplosion"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntSafe.isDustExplosion == '是'"
              :span="6"
            >
              <el-form-item
                label="粉尘涉爆类型："
                prop="sysEntSafe.dustExplosionName"
              >
                <el-select
                  v-model="dialogForm.sysEntSafe.dustExplosionName"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in enumList.dustExplosionNameList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntSafe.isDustExplosion == '是'"
              :span="6"
            >
              <el-form-item
                label="作业最大人数："
                prop="sysEntSafe.dustExplosionorkMaxNumber"
              >
                <el-input-number
                  v-model="dialogForm.sysEntSafe.dustExplosionorkMaxNumber"
                  placeholder="请输入同一时间作业最大人数"
                  :min="0"
                  :precision="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item
                label="是否商务商业楼宇："
                prop="sysEntSafe.isCommercialBuilding"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafe.isCommercialBuilding"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntSafe.isCommercialBuilding == '是'"
              :span="18"
            >
              <el-form-item
                label="楼宇名称："
                prop="sysEntSafe.commercialBuildingName"
              >
                <el-input
                  v-model="dialogForm.sysEntSafe.commercialBuildingName"
                  placeholder="请输入~"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="是否消防重点单位：" prop="sysEntSafe.isFire">
                <el-switch
                  v-model="dialogForm.sysEntSafe.isFire"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item
                label="有无微型消防站："
                prop="sysEntSafe.haveFireStation"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafe.haveFireStation"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="安全培训管理" name="third">
          <el-row :gutter="20">
            <el-col>
              <fieldset>
                <legend>安全培训取证情况</legend>
              </fieldset>
            </el-col>
            <el-col>
              <el-table
                :data="dialogForm.trainingList"
                border
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%; margin-top: 20px"
                :header-cell-style="{
                  height: '30px !important',
                  fontSize: '14px',
                  color: '#333',
                }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="50"
                />
                <el-table-column prop="userName" label="姓名" min-width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.userName"
                      placeholder="请输入~"
                      maxlength="20"
                      show-word-limit
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="certType"
                  label="证书类型"
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.certType"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in enumList.safetyCertList"
                        :key="index"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="jobStatus"
                  label="专兼职"
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.jobStatus"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in enumList.fullAndPartList"
                        :key="index"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="certNo" label="证书编号" min-width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.certNo"
                      placeholder="请输入~"
                      maxlength="50"
                      show-word-limit
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="validStartTime"
                  label="证书生效开始时间"
                  width="160"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.validStartTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="validEndTime"
                  label="证书生效结束时间"
                  width="160"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.validEndTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="userCertFileList"
                  label="证书文件"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <myUpload
                      action="#"
                      class="upload-demo"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                      :file-list="scope.row.userCertFileList"
                      :on-preview="handlePreview"
                      :http-request="
                        (file, fileList) =>
                          handleUpload(
                            scope.row.userCertFileList,
                            file,
                            fileList,
                            'user_cert'
                          )
                      "
                      :before-upload="beforeUpload"
                      :on-remove="
                        (file, fileList) =>
                          handleRemove(
                            scope.row.userCertFileList,
                            file,
                            fileList
                          )
                      "
                      :before-remove="beforeRemove"
                    >
                      <myButton
                        v-if="
                          scope.row.userCertFileList &&
                            scope.row.userCertFileList.length == 0
                        "
                      >点击上传</myButton>
                    </myUpload>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <my-handle>
                      <span
                        v-if="
                          scope.$index == dialogForm.trainingList.length - 1
                        "
                        @click="addRows(dialogForm.trainingList, '培训取证')"
                      >新增</span>
                      <span
                        v-if="dialogForm.trainingList.length > 1"
                        @click="delRows(dialogForm.trainingList, scope.$index)"
                      >删除</span>
                    </my-handle>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <fieldset>
                <legend>特种（设备）作业人员</legend>
              </fieldset>
            </el-col>
            <el-col>
              <el-table
                :data="dialogForm.specialList"
                border
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%; margin-top: 20px"
                :header-cell-style="{
                  height: '30px !important',
                  fontSize: '14px',
                  color: '#333',
                }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="50"
                />
                <el-table-column prop="userName" label="姓名" min-width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.userName"
                      placeholder="请输入~"
                      maxlength="20"
                      show-word-limit
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="certType"
                  label="证书类型"
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.certType"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in enumList.specialList"
                        :key="index"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="jobStatus"
                  label="状态"
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.jobStatus"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in enumList.activeStatusList"
                        :key="index"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="certNo" label="证书编号" min-width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.certNo"
                      placeholder="请输入~"
                      maxlength="50"
                      show-word-limit
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="validStartTime"
                  label="证书生效开始时间"
                  width="160"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.validStartTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="validEndTime"
                  label="证书生效结束时间"
                  width="160"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.validEndTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="userCertFileList"
                  label="证书文件"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <myUpload
                      action="#"
                      class="upload-demo"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                      :file-list="scope.row.userCertFileList"
                      :on-preview="handlePreview"
                      :http-request="
                        (file, fileList) =>
                          handleUpload(
                            scope.row.userCertFileList,
                            file,
                            fileList,
                            'user_cert'
                          )
                      "
                      :before-upload="beforeUpload"
                      :on-remove="
                        (file, fileList) =>
                          handleRemove(
                            scope.row.userCertFileList,
                            file,
                            fileList
                          )
                      "
                      :before-remove="beforeRemove"
                    >
                      <myButton
                        v-if="
                          scope.row.userCertFileList &&
                            scope.row.userCertFileList.length == 0
                        "
                      >点击上传</myButton>
                    </myUpload>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <my-handle>
                      <span
                        v-if="scope.$index == dialogForm.specialList.length - 1"
                        @click="addRows(dialogForm.specialList, '特种作业')"
                      >新增</span>
                      <span
                        v-if="dialogForm.specialList.length > 1"
                        @click="delRows(dialogForm.specialList, scope.$index)"
                      >删除</span>
                    </my-handle>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="安全管理" name="fourth">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item
                label="是否制定安全责任制度："
                prop="sysEntSafety.isSafetyResponsibility"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafety.isSafetyResponsibility"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntSafety.isSafetyResponsibility == '是'"
              :span="6"
            >
              <el-form-item
                label="安全责任制定发布时间："
                prop="sysEntSafety.publishTime"
              >
                <el-date-picker
                  v-model="dialogForm.sysEntSafety.publishTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="dialogForm.sysEntSafety.isSafetyResponsibility == '是'"
              :span="12"
            >
              <el-form-item
                label="安全责任证书文件："
                prop="sysEntSafety.safetyFileList"
                class="floatLabel"
              >
                <myUpload
                  action="#"
                  class="upload-demo"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                  :file-list="dialogForm.sysEntSafety.safetyFileList"
                  :on-preview="handlePreview"
                  :http-request="
                    (file, fileList) =>
                      handleUpload(
                        dialogForm.sysEntSafety.safetyFileList,
                        file,
                        fileList,
                        'safetyFile'
                      )
                  "
                  :before-upload="beforeUpload"
                  :on-remove="
                    (file, fileList) =>
                      handleRemove(
                        dialogForm.sysEntSafety.safetyFileList,
                        file,
                        fileList
                      )
                  "
                  :before-remove="beforeRemove"
                >
                  <myButton
                    v-if="
                      dialogForm.sysEntSafety.safetyFileList &&
                        dialogForm.sysEntSafety.safetyFileList.length == 0
                    "
                  >点击上传</myButton>
                </myUpload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item
                label="是否制定安全管理制度："
                prop="sysEntSafety.isManageInstitution"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafety.isManageInstitution"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="dialogForm.sysEntSafety.isManageInstitution == '是'">
              <el-form-item
                label="附件上传："
                prop="sysEntSafety.manageInstitutionFileList"
              >
                <myUpload
                  action="#"
                  class="upload-demo"
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                  :file-list="dialogForm.sysEntSafety.manageInstitutionFileList"
                  :on-preview="handlePreview"
                  :http-request="
                    (file, fileList) =>
                      handleUpload(
                        dialogForm.sysEntSafety.manageInstitutionFileList,
                        file,
                        fileList,
                        'manageInstitution'
                      )
                  "
                  :before-upload="beforeUpload"
                  :on-remove="
                    (file, fileList) =>
                      handleRemove(
                        dialogForm.sysEntSafety.manageInstitutionFileList,
                        file,
                        fileList
                      )
                  "
                  :before-remove="beforeRemove"
                >
                  <myButton>点击上传</myButton>
                </myUpload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item
                label="是否制定操作规范："
                prop="sysEntSafety.isSafetyAction"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafety.isSafetyAction"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                  @change="changeSwitch($event, '操作规范')"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="dialogForm.sysEntSafety.isSafetyAction == '是'">
              <el-table
                :data="dialogForm.sysEntSafety.sysSafetyActionList"
                border
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%; margin-top: 20px"
                :header-cell-style="{
                  height: '30px !important',
                  fontSize: '14px',
                  color: '#333',
                }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="50"
                />
                <el-table-column
                  prop="actionName"
                  label="文件描述"
                  min-width="100"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.actionName"
                      placeholder="请输入~"
                      maxlength="200"
                      show-word-limit
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="safetyActionFileList"
                  label="证书文件"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <myUpload
                      action="#"
                      class="upload-demo"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                      :file-list="scope.row.safetyActionFileList"
                      :on-preview="handlePreview"
                      :http-request="
                        (file, fileList) =>
                          handleUpload(
                            scope.row.safetyActionFileList,
                            file,
                            fileList,
                            'safetyAction'
                          )
                      "
                      :before-upload="beforeUpload"
                      :on-remove="
                        (file, fileList) =>
                          handleRemove(
                            scope.row.safetyActionFileList,
                            file,
                            fileList
                          )
                      "
                      :before-remove="beforeRemove"
                    >
                      <myButton
                        v-if="
                          scope.row.safetyActionFileList &&
                            scope.row.safetyActionFileList.length == 0
                        "
                      >点击上传</myButton>
                    </myUpload>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <my-handle>
                      <span
                        v-if="
                          scope.$index ==
                            dialogForm.sysEntSafety.sysSafetyActionList.length - 1
                        "
                        @click="
                          addRows(
                            dialogForm.sysEntSafety.sysSafetyActionList,
                            '操作规范'
                          )
                        "
                      >新增</span>
                      <span
                        v-if="
                          dialogForm.sysEntSafety.sysSafetyActionList.length > 1
                        "
                        @click="
                          delRows(
                            dialogForm.sysEntSafety.sysSafetyActionList,
                            scope.$index
                          )
                        "
                      >删除</span>
                    </my-handle>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item
                label="是否取得安全标准化证书："
                prop="sysEntSafety.isStandardCert"
              >
                <el-switch
                  v-model="dialogForm.sysEntSafety.isStandardCert"
                  active-text="是"
                  inactive-text="否"
                  active-value="是"
                  inactive-value="否"
                  @change="changeSwitch($event, '安全标准化')"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="dialogForm.sysEntSafety.isStandardCert == '是'">
              <el-table
                :data="dialogForm.sysEntSafety.safetyCertList"
                border
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%; margin-top: 20px"
                :header-cell-style="{
                  height: '30px !important',
                  fontSize: '14px',
                  color: '#333',
                }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="50"
                />
                <el-table-column
                  prop="standardLevel"
                  label="等级"
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.standardLevel"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in enumList.standardLevelList"
                        :key="index"
                        :label="item.key"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="certNo" label="证书编号" min-width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.certNo"
                      placeholder="请输入~"
                      maxlength="50"
                      show-word-limit
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="issueTime"
                  label="证书发放时间"
                  width="160"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.issueTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="validStartTime"
                  label="证书生效开始时间"
                  width="160"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.validStartTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="validEndTime"
                  label="证书生效结束时间"
                  width="160"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.validEndTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="safetyCertFileList"
                  label="证书文件"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <myUpload
                      action="#"
                      class="upload-demo"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                      :file-list="scope.row.safetyCertFileList"
                      :on-preview="handlePreview"
                      :http-request="
                        (file, fileList) =>
                          handleUpload(
                            scope.row.safetyCertFileList,
                            file,
                            fileList,
                            'safetyCertFile'
                          )
                      "
                      :before-upload="beforeUpload"
                      :on-remove="
                        (file, fileList) =>
                          handleRemove(
                            scope.row.safetyCertFileList,
                            file,
                            fileList
                          )
                      "
                      :before-remove="beforeRemove"
                    >
                      <myButton
                        v-if="
                          scope.row.safetyCertFileList &&
                            scope.row.safetyCertFileList.length == 0
                        "
                      >点击上传</myButton>
                    </myUpload>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <my-handle>
                      <span
                        v-if="
                          scope.$index ==
                            dialogForm.sysEntSafety.safetyCertList.length - 1
                        "
                        @click="
                          addRows(
                            dialogForm.sysEntSafety.safetyCertList,
                            '安全标准化'
                          )
                        "
                      >新增</span>
                      <span
                        v-if="dialogForm.sysEntSafety.safetyCertList.length > 1"
                        @click="
                          delRows(
                            dialogForm.sysEntSafety.safetyCertList,
                            scope.$index
                          )
                        "
                      >删除</span>
                    </my-handle>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <fieldset>
                <legend>周边环境

                  <el-tooltip class="item tips" effect="dark" placement="top">
                    <div slot="content">
                      周边环境影响范围：危化行业500m，其他行业100m
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </legend>
              </fieldset>
            </el-col>
            <el-col>
              <el-table
                :data="dialogForm.sysEnterprise.placeList"
                border
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%; margin-top: 20px"
                :header-cell-style="{
                  height: '30px !important',
                  fontSize: '14px',
                  color: '#333',
                }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="50"
                />
                <el-table-column
                  prop="placesCode"
                  label="场所"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.placesCode"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in enumList.placeList"
                        :key="index"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column prop="num" label="数量" >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.num"
                      placeholder="请输入~"
                      :min="1"
                      :max="9999"
                      type="number"
                      show-word-limit
                    />
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <my-handle>
                      <span
                        v-if="
                          scope.$index ==
                            dialogForm.sysEnterprise.placeList.length - 1
                        "
                        @click="
                          addRows(
                            dialogForm.sysEnterprise.placeList,
                            '安全标准化'
                          )
                        "
                      >新增</span>
                      <span
                        v-if="dialogForm.sysEnterprise.placeList.length > 1"
                        @click="
                          delRows(
                            dialogForm.sysEnterprise.placeList,
                            scope.$index
                          )
                        "
                      >删除</span>
                    </my-handle>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

        </el-tab-pane>
      </el-tabs>
    </el-form>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >
        提 交
      </myButton>
      <!-- <myButton
        v-if="dialogForm.sysEnterprise.entState == '新注册'"
        :loading="loading"
        icon="el-icon-position"
        @click.native="toReview"
      >发起审核</myButton> -->
    </template>

    <mapup
      v-if="mapShow"
      :show="mapShow"
      :postform="postForm"
      @close="mapupclose"
    />
  </myDrawer>
</template>

<script>
import address from '@/assets/json/addressData.json'
import { fileUpload } from '@/api/upload'
import { parkList } from '@/api/register'
import {
  edit,
  add,
  detail,
  enumList,
  affiliationList,
  toReview,
  getTreeParentName,
  nationalEconomyList
} from '@/api/system/enterprise'
import treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import mapup from './mapup'
import formRules from './formRules'

export default {
  components: { treeselect, mapup },

  props: {
    title: {
      type: String,
      required: false,
      default() {
        return ''
      }
    },
    visible: {
      type: Boolean,
      required: true,
      default() {
        return false
      }
    },
    id: {
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      parkbol: false,
      loading: false,
      activeName: 'first',
      dialogForm: formRules.dialogForm,
      formRules: formRules.formRules,
      address,
      parkList: [],
      enumList: {
        industrySectorList: [],
        nationalEconomyList: []
      }, // 枚举、字典
      mapShow: false,

      postForm: {
        longitude: null,
        latitude: null,
        detailedAddress: null
      },

      cateListProps: {
        value: 'label', // 匹配响应数据中的id
        label: 'label', // 匹配响应数据中的name
        children: 'children' // 匹配响应数据中的children
      },

      loginUser: {},
      affiliationList: [],

      nationalEconomyName: null,
      nationalEconomyNameKey: null,
      industrySectorName: null,
      industrySectorNameKey: null
    }
  },
  watch: {
    activeName(newName, oldName) {
      if (newName == 'third') {
        if (!this.dialogForm.trainingList.length) {
          this.addRows(this.dialogForm.trainingList, '培训取证')
        }
        if (!this.dialogForm.specialList.length) {
          this.addRows(this.dialogForm.specialList, '特种作业')
        }
      }

      if (newName == 'fourth') {
        if (
          this.dialogForm.sysEntSafety.sysSafetyActionList.length == 0 &&
          this.dialogForm.sysEntSafety.isSafetyAction == '是'
        ) {
          this.addRows(
            this.dialogForm.sysEntSafety.sysSafetyActionList,
            '操作规范'
          )
        }
        if (
          !this.dialogForm.sysEntSafety.safetyCertList.length &&
          this.dialogForm.sysEntSafety.isStandardCert == '是'
        ) {
          this.addRows(
            this.dialogForm.sysEntSafety.safetyCertList,
            '安全标准化'
          )
        }
      }
    }
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem('loginUser') || '{}')
    console.log(this.loginUser)

    if (this.loginUser.sysPark) {
      this.parkbol = true
    }
    this.loadData()
  },
  methods: {
    selectEconomy(node, flag) {
      this.loading = true
      getTreeParentName({
        code: 'enterprise_nationalEconomy',
        nodeCode: flag ? node.code : node.nationalEconomy
      })
        .then((res) => {
          this.$nextTick(() => {
            this.nationalEconomyName = res
            this.dialogForm.sysEnterprise.nationalEconomyKey = res
            this.nationalEconomyNameKey = new Date().getTime()
          })
        })
        .finally(() => {
          this.loading = false
        })
      this.dialogForm.sysEnterprise.isNotContain = node.isNotContain
    },
    selectIndustrySector(node, flag) {
      this.loading = true
      getTreeParentName({
        code: 'enterprise_industrySector',
        nodeCode: flag ? node.code : node.industrySector
      })
        .then((res) => {
          this.$nextTick(() => {
            this.industrySectorName = res
            this.dialogForm.sysEnterprise.industrySectorKey = res
            this.industrySectorNameKey = new Date().getTime()
          })
        })
        .finally(() => {
          this.loading = false
        })
      nationalEconomyList({
        code: node.code || node.industrySector
      })
        .then((res) => {
          this.$nextTick(() => {
            this.enumList.nationalEconomyList = res
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * 获取枚举、字典、数据
     */
    async loadData() {
      const that = this

      that.loading = true
      await enumList().then((res) => {
        that.enumList = res
      })
      await parkList().then((res) => {
        that.parkList = res
      })
      await affiliationList({ entId: that.loginUser.entId }).then((res) => {
        that.affiliationList = res
      })

      await detail({ entId: that.id })
        .then((res) => {
          that.dialogForm = res

          if (that.dialogForm.sysEnterprise.industrySector) {
            that.selectIndustrySector(that.dialogForm.sysEnterprise, false)
          }

          if (that.dialogForm.sysEnterprise.nationalEconomy) {
            that.selectEconomy(that.dialogForm.sysEnterprise, false)
          }

          if (!that.dialogForm.sysEntExtend.currency) {
            that.dialogForm.sysEntExtend.currency = '人民币'
          }

          that.refactoringType()
        })
        .finally(() => {
          that.loading = false
        })
    },
    // 发起审核
    // toReview() {
    //   const that = this
    //   toReview({ id: that.dialogForm.sysEnterprise.entId })
    //     .then(res => {
    //       that.$message({
    //         type: 'success',
    //         message: '发起审核成功!'
    //       })
    //     })
    //     .catch(() => {
    //       that.loading = false
    //     })
    // },
    changeEnt(e) {
      console.log(e.constructor)
      if (e.constructor === Object) {
        this.dialogForm.sysEnterprise.affiliationEntId = e.entId
        this.dialogForm.sysEnterprise.affiliationEntName = e.entName
      } else {
        this.dialogForm.sysEnterprise.affiliationEntName = e
      }
    },

    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.code,
        label: node.title,
        children: node.children
      }
    },

    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this
      if (that.loading) {
        return
      }

      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true

          // 行政区划
          if (
            that.dialogForm.sysEnterprise.district &&
            that.dialogForm.sysEnterprise.district.length
          ) {
            that.dialogForm.sysEnterprise.district =
              that.dialogForm.sysEnterprise.district.join()
          } else {
            that.dialogForm.sysEnterprise.district = null
          }

          // 重点监管危险化工工艺

          if (
            that.dialogForm.sysEntSafe.supervisionProcesses &&
            that.dialogForm.sysEntSafe.supervisionProcesses.length
          ) {
            that.dialogForm.sysEntSafe.supervisionProcesses =
              that.dialogForm.sysEntSafe.supervisionProcesses.join()
          } else {
            that.dialogForm.sysEntSafe.supervisionProcesses = null
          }

          if (that.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.$emit('close', { reload: true })
              })
              .catch(() => {
                this.refactoringType()
              })
              .finally(() => {
                that.loading = false
              })
          } else {
            add(that.dialogForm)
              .then((res) => {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.$emit('close', { reload: true })
              })
              .finally(() => {
                that.loading = false
              })
          }
        } else {
          return false
        }
      })
    },

    changeSwitch(e, type) {
      switch (type) {
        case '危险化学品':
          if (e && !this.dialogForm.sysEntSafe.chemicalsList.length) {
            this.addRows(this.dialogForm.sysEntSafe.chemicalsList, type)
          }
          break
        case '重大危险源':
          if (e && !this.dialogForm.sysEntSafe.hazardsList.length) {
            this.addRows(this.dialogForm.sysEntSafe.hazardsList, type)
          }
          break
        case '燃气使用':
          if (e && !this.dialogForm.sysEntSafe.gasUseList.length) {
            this.addRows(this.dialogForm.sysEntSafe.gasUseList, type)
          }
          break
        case '操作规范':
          if (e && !this.dialogForm.sysEntSafety.sysSafetyActionList.length) {
            this.addRows(
              this.dialogForm.sysEntSafety.sysSafetyActionList,
              type
            )
          }
          break
        case '安全标准化':
          if (e && !this.dialogForm.sysEntSafety.safetyCertList.length) {
            this.addRows(this.dialogForm.sysEntSafety.safetyCertList, type)
          }
          break
      }
    },

    addRows(table, type) {
      switch (type) {
        case '危险化学品':
          table.push({
            chemicalsName: null, // 危化品名称
            yearWeight: null, // 年产量
            dailyWeight: null, // 每日使用量
            maxWeight: null // 最大储存量
          })
          break
        case '重大危险源':
          table.push({
            classification: null, // 分级
            quantity: null // 数量
          })
          break
        case '燃气使用':
          table.push({
            gasUsePosition: null, // 使用位置
            gasUseType: null // 种类
          })
          break
        case '培训取证':
          table.push({
            userName: null, // 姓名
            businessDataType: 0, // 业务类型
            certType: null, // 证书类型
            jobStatus: null, // 工作性质
            certNo: null, // 证书编号
            validStartTime: null, // 证书生效开始时间
            validEndTime: null, // 证书生效结束时间
            userCertFileList: [] // 证书文件
          })
          break
        case '特种作业':
          table.push({
            userName: null, // 姓名
            businessDataType: 1, // 业务类型
            certType: null, // 证书类型
            jobStatus: null, // 工作性质
            certNo: null, // 证书编号
            validStartTime: null, // 证书生效开始时间
            validEndTime: null, // 证书生效结束时间
            userCertFileList: [] // 证书文件
          })
          break
        case '操作规范':
          table.push({
            actionName: null, // 描述
            safetyActionFileList: [] // 证书文件
          })
          break
        case '安全标准化':
          table.push({
            standardLevel: null, // 等级
            certNo: null, // 证书编号
            issueTime: null, // 发证时间
            validStartTime: null, // 证书生效开始时间
            validEndTime: null, // 证书生效结束时间
            safetyCertFileList: [] // 证书文件
          })
          break
      }
    },
    delRows(table, index) {
      table.splice(index, 1)
    },
    beforeUpload(file) {
      const name = file.name.split('.').pop().toUpperCase()
      if (
        name !== 'PDF' &&
        name !== 'DOCX' &&
        name !== 'DOC' &&
        name !== 'XLS' &&
        name !== 'XLSX' &&
        name !== 'JPG' &&
        name !== 'JPEG' &&
        name !== 'PNG' &&
        name !== 'GIF' &&
        name !== 'BMP' &&
        name !== 'WEBP' &&
        name !== 'RAR' &&
        name !== 'ZIP'
      ) {
        this.$message({
          type: 'error',
          message: '不支持上传当前文件！'
        })
        return false
      }
    },
    handlePreview(file) {
      if (file && file.fileId) {
        window.open(this.baseURL + file.fileUrl)
      }
    },
    // 自定义上传
    handleUpload(dataList, file, fileList, type) {
      const that = this
      that.loading = true
      const formData = new FormData()
      formData.append('fileType', 4)
      formData.append('file', file.file)
      formData.append('type', type)
      fileUpload(formData)
        .then((res) => {
          // var index = res.fileName.lastIndexOf(".");

          res.link = that.baseURL + res.fileUrl
          // res.fileName = res.fileName.substring(0, index);
          res.fileId = res.fileId

          dataList.push(res)
          that.$message({
            type: 'success',
            message: '上传成功！'
          })
        })
        .finally(() => {
          that.loading = false
        })
    },
    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`)
      } else {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },

    // 移除模板
    handleRemove(dataList, file, fileList) {
      dataList.forEach((item, index) => {
        if (file.fileId == item.fileId) {
          dataList.splice(index, 1)
        }
      })
    },

    /**
     * 重构字段类型
     */
    refactoringType() {
      const that = this

      // 行政区划
      if (!this.dialogForm.sysEnterprise.district) {
        this.dialogForm.sysEnterprise.district = []
      } else {
        that.dialogForm.sysEnterprise.district =
          that.dialogForm.sysEnterprise.district.split(',')
      }

      // 营业执照
      if (!this.dialogForm.sysEnterprise.businessLicenseList) {
        this.dialogForm.sysEnterprise.businessLicenseList = []
      }

      // 工伤保险购买文件
      if (!this.dialogForm.sysEntExtend.industryInsureFileList) {
        this.dialogForm.sysEntExtend.industryInsureFileList = []
      }

      // 安全生产责任险文件
      if (!this.dialogForm.sysEntExtend.secureInsureFileList) {
        this.dialogForm.sysEntExtend.secureInsureFileList = []
      }

      // 重点监管危险化工工艺
      if (!this.dialogForm.sysEntSafe.supervisionProcesses) {
        this.dialogForm.sysEntSafe.supervisionProcesses = []
      } else {
        that.dialogForm.sysEntSafe.supervisionProcesses =
          that.dialogForm.sysEntSafe.supervisionProcesses.split(',')
      }

      // 是否涉及危险化学品
      if (!this.dialogForm.sysEntSafe.chemicalsList) {
        this.dialogForm.sysEntSafe.chemicalsList = []
      }
      // 是否构成重大危险源
      if (!this.dialogForm.sysEntSafe.hazardsList) {
        this.dialogForm.sysEntSafe.hazardsList = []
      }
      // 是否涉及燃气使用
      if (!this.dialogForm.sysEntSafe.gasUseList) {
        this.dialogForm.sysEntSafe.gasUseList = []
      }

      // 安全责任证书文件
      if (!this.dialogForm.sysEntSafety.safetyFileList) {
        this.dialogForm.sysEntSafety.safetyFileList = []
      }
      // 安全管理制度文件
      if (!this.dialogForm.sysEntSafety.manageInstitutionFileList) {
        this.dialogForm.sysEntSafety.manageInstitutionFileList = []
      }
      // 操作规范
      if (!this.dialogForm.sysEntSafety.sysSafetyActionList) {
        this.dialogForm.sysEntSafety.sysSafetyActionList = []
      }
      // 安全标准化证书
      if (!this.dialogForm.sysEntSafety.safetyCertList) {
        this.dialogForm.sysEntSafety.safetyCertList = []
      }
    },

    cancel(done) {
      this.$emit('close', {})
    },

    mapupclose(data) {
      this.mapShow = false
      // this.$forceUpdate();
      if (data != null) {
        this.dialogForm.sysEnterprise.address = data.address
        this.dialogForm.sysEnterprise.longitude = data.lng
        this.dialogForm.sysEnterprise.latitude = data.lat

        this.postForm.detailedAddress = data.address
        this.postForm.longitude = data.lng
        this.postForm.latitude = data.lat
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-input-group__append {
  cursor: pointer;
}

/** 输入框、下拉框的宽度 **/
/deep/.el-cascader,
/deep/.el-select,
/deep/.el-input-number,
/deep/.el-date-editor,
/deep/.el-switch,
/deep/.el-input {
  width: 100% !important;
}

/** 问号提示 **/
/deep/.tips {
  font-size: 16px;
  cursor: pointer;
}

/deep/input[type="file"] {
  display: none;
}
/** 上传文件 **/
/deep/ .upload-demo > div:first-of-type {
  display: inline;
}

fieldset {
  border-width: 1px 0 0;
  border-color: #e6e6e6;
  padding: 0 30px;
  legend {
    width: auto;
    border: none;
    padding: 0 10px;
    font-size: 20px;
    color: #000;
  }
}

/deep/.buttonSpace {
  width: 100%;
  text-align: left;
}
/deep/.el-table {
  margin-bottom: 20px;
}

/deep/.floatLabel {
  label {
    float: none;
  }
}
.displayflex {
  display: flex;
  align-items: center;
}
</style>

