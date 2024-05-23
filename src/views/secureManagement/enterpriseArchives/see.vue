<template>
  <myDrawer custom-class="drawerClass" title="查看档案" :visible="visible" :cancel="cancel" size="85%">
    <div id="print_main" ref="print">

      <div class="div-report-page">
        <div class="report-home-title f14">（一）企业基本信息</div>
        <table cellpadding="1" border="0" class="report-home-table" style="width:100% !important;">
          <tbody>
            <tr>
              <td class="td1" colspan="2">企业名称</td>
              <td class="td2" colspan="2"> {{ dialogForm.sysEnterprise.entName }}</td>
              <td class="td1" colspan="2">所属行业</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.industrySectorKey }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">社会信用代码</td>
              <td class="td2" colspan="2"> {{ dialogForm.sysEnterprise.entCode }}</td>
              <td class="td1" colspan="2">国民经济分类</td>
              <td class="td2" colspan="2"> {{ dialogForm.sysEnterprise.nationalEconomyKey }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">经营状况</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.performanceStr }}</td>
              <td class="td1" colspan="2">成立日期</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.establishDate }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">行政区划</td>
              <td class="td2" colspan="6">
                <span class="td-line">
                  {{ dialogForm.sysEnterprise.district }}
                </span>

              </td>
            </tr>
            <tr>
              <td class="td1" colspan="2">注册地址</td>
              <td class="td2" colspan="6">{{ dialogForm.sysEnterprise.registeredAddress }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">实际地址</td>
              <td class="td2" colspan="6">{{ dialogForm.sysEnterprise.address }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">场地性质</td>
              <td class="td2" colspan="6">
                <span v-for="(item,index) in enumList.entNatureList" :key="index">
                  <div class="printcheckbox">

                    <div v-if="dialogForm.sysEnterprise.entNature==item.key" class="printcheck" />

                  </div>
                  <lable>{{ item.key }}</lable>
                </span>

                <lable style="margin-left:30px">经营场地用地面积<span class="td-line">
                  {{ dialogForm.sysEntExtend.groundForBusinessPremises }}</span>(㎡)</lable>
              </td>
            </tr>
            <tr>
              <td class="td1" colspan="2">法人姓名</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.legalPersonName }}</td>
              <td class="td1" colspan="2">法人电话</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.legalPersonPhone }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">主要负责人姓名</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.personInChargeName }}</td>
              <td class="td1" colspan="2">主要负责人电话</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.personInChargePhone }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">安全负责人姓名</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.safetyDirectorName }}</td>
              <td class="td1" colspan="2">安全负责人电话</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.safetyDirectorPhone }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">单位规模</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEntExtend.entSizeBigStr }}   {{ dialogForm.sysEnterprise.entSizeUpStr }}</td>
              <td class="td1" colspan="2">隶属类型</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEntExtend.typeOfAffiliationStr }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">注册资金(万元)</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEntExtend.registeredCapital }}
                {{ dialogForm.sysEntExtend.registeredCapital ? "万元" : "" }}
                {{ dialogForm.sysEntExtend.currency }}</td>
              <td class="td1" colspan="2">行业管理部门</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEntExtend.industryManagementDep }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">经营范围</td>
              <td class="td2" colspan="6" style="height:128px">
                {{ dialogForm.sysEnterprise.businessScope }}
              </td>
            </tr>
            <tr>
              <td class="td1" colspan="2">从业人员数量</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.practitionerNumber }}</td>
              <td class="td1" colspan="2">所属园区名称</td>
              <td class="td2" colspan="2">{{ dialogForm.sysEnterprise.parkName }}</td>
            </tr>
            <tr>
              <td class="td1" colspan="2">是否购买工伤保险</td>
              <td class="td2" colspan="6">
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntExtend.isIndustryInsure === '是'?'printcheck':''" />
                </div>
                <lable>是</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntExtend.isIndustryInsure === '否'?'printcheck':''" />
                </div>
                <lable>否</lable>
                <lable style="margin-left:30px">工伤保险购买人数:<span class="td-line">
                  {{ dialogForm.sysEntExtend.industryInsureNumber }}</span></lable>
              </td>

            </tr>
            <tr>
              <td class="td1" colspan="2">是否购买安全生产责任险</td>
              <td class="td2" colspan="6">
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntExtend.isSecureInsure === '是'?'printcheck':''" />
                </div>
                <lable>是</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntExtend.isSecureInsure === '否'?'printcheck':''" />
                </div>
                <lable>否</lable>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="div-report-page">
        <div class="report-home-title f14">（二）企业安全生产主要信息</div>
        <table cellpadding="0" border="0" class="report-home-table" style="width:100% !important">
          <tbody>
            <tr>
              <td class="td1">类别</td>
              <td class="td2" colspan="7" />
            </tr>
            <tr>
              <td class="td1 weight600">安全管理机构</td>
              <td class="td2" colspan="7">{{ dialogForm.sysEntSafe.safetyOrg }}</td>
            </tr>
            <tr>
              <td class="td1 weight600">专职安全管理人员数量</td>
              <td class="td2" colspan="7">{{ dialogForm.sysEntSafe.fullTimeSafeNumber }}</td>
            </tr>
            <tr>
              <td class="td1 weight600">特种作业人员数量</td>
              <td class="td2" colspan="7">{{ dialogForm.sysEntSafe.specialWorkNumber }}</td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>重点监管危险化工工艺</lable>
              </td>
              <td class="td2" colspan="7" style="line-height: 40px; ">
                <span v-for="(item,index) in enumList.supervisionProcessesList" :key="index">
                  <div class="printcheckbox">
                    <span v-for="(item1,index1) in dialogForm.sysEntSafe.supervisionProcessesList" :key="index1">
                      <div v-if="item1==item.dictName" class="printcheck" />
                    </span>

                  </div>
                  <lable>{{ item.dictName }}</lable>
                </span>

              </td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>危险化学品（每日使用量/最大储存量/年产量）</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.isHazardousChemicals === '是'?'printcheck':''" />
                </div>
              </td>
              <td class="td2" colspan="7">
                <div>
                  <span v-for="(item,index) in dialogForm.sysEntSafe.chemicalsList" :key="index">
                    {{ item.chemicalsName }}
                    <div class="printcheckbox">
                      <div class="printcheck" />
                    </div>

                    <span class="td-line">{{ item.maxWeight }}</span>/
                    <span class="td-line">{{ item.dailyWeight }}</span>/
                    <span class="td-line" style="margin-right: 15px;">{{ item.yearWeigh }}</span>
                    <br>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>重大危险源（分级/数量）</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.isHazardousSource === '是'?'printcheck':''" />
                </div>
              </td>
              <td class="td2" colspan="7">

                <div v-for="(item,index) in dialogForm.sysEntSafe.hazardsList" :key="index">

                  {{ item.quantity }}/{{ item.classification }}
                </div>

              </td>
            </tr>
            <tr>
              <td class="td1 weight600">涉氨制冷（气）企业
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.isRefrigeration === '是'?'printcheck':''" />
                </div>
              </td>
              <td class="td2" colspan="7">

                <span v-for="(item,index) in enumList.refrigerationTypeList" :key="index">
                  <div class="printcheckbox">
                    <div v-if="dialogForm.sysEntSafe.refrigerationType == item.dictCode" class="printcheck" />
                  </div>

                  <lable>{{ item.dictName }}</lable>
                </span>
              </td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>燃气使用（使用位置/种类）</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.isGasUse === '是'?'printcheck':''" />
                </div>
              </td>
              <td class="td2" colspan="7">
                <span v-for="(item,index) in dialogForm.sysEntSafe.gasUseList" :key="index">

                  {{ item.gasUsePosition }}/{{ item.gasUseType }}
                </span>
              </td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>有限空间</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.isLimitedSpace === '是'?'printcheck':''" />
                </div>
              </td>
              <td class="td2" colspan="7" style="line-height: 40px;">
                有限空间总数量：<span class="td-line">{{ dialogForm.sysEntSafe.limitedSpaceNumber }} 个</span>
                <br>
                同一时间在有限空间作业最大人数：<span class="td-line">{{ dialogForm.sysEntSafe.limitedSpaceWorkMaxNumber }}人</span>
              </td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>粉尘涉爆</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.isDustExplosion === '是'?'printcheck':''" />
                </div>
              </td>
              <td class="td2" colspan="7" style="line-height: 40px;">
                粉尘类型：  <span v-for="(item,index) in enumList.dustExplosionNameList" :key="index">
                  <div class="printcheckbox">
                    <div v-if="dialogForm.sysEntSafe.dustExplosionName == item.dictCode" class="printcheck" />
                  </div>

                  <lable>{{ item.dictName }}</lable>
                </span>
                <br>
                粉尘涉爆同一时间在有限空间作业最大人数：<span class="td-line">{{ dialogForm.sysEntSafe.dustExplosionWorkMaxNumber }}</span>人
              </td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>商务商业楼宇</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.isLimitedSpace === '是'?'printcheck':''" />
                </div>
              </td>
              <td class="td2" colspan="7">
                {{ dialogForm.sysEntSafe.commercialBuildingName }}
              </td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>消防重点单位</lable>

              </td>
              <td class="td2" colspan="7">
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.isFire === '是'?'printcheck':''" />
                </div>
                <lable>是</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.isFire === '否'?'printcheck':''" />
                </div>
                <lable>否</lable>
              </td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>微型消防站</lable>

              </td>
              <td class="td2" colspan="7">
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.haveFireStation === '是'?'printcheck':''" />
                </div>
                <lable>有</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.haveFireStation === '否'?'printcheck':''" />
                </div>
                <lable>无</lable>
              </td>
            </tr>
            <tr>
              <td class="td1 weight600">
                <lable>安全标准化</lable>
                <div class="printcheckbox">
                  <div :class=" dialogForm.sysEntSafe.haveFireStation === '是'?'printcheck':''" />
                </div>
              </td>
              <td class="td2" colspan="7" />
            </tr>
          </tbody>
        </table>
      </div>
      <div class="div-report-page">
        <div class="report-home-title f14">（三）安全培训取证情况表</div>
        <table cellpadding="0" border="0" class="report-other-table" style="width:100% !important">
          <thead id="spec-sale-hed">
            <tr>
              <th>姓名</th>
              <th>类别</th>
              <th>专兼职</th>
              <th>证书号</th>
              <th>有效年限</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">
            <tr v-for="(item,index) in dialogForm.trainingList " :key="index" class="j-saleTd">
              <td class="td2">{{ item.userName }}</td>
              <td>{{ item.certType }}</td>
              <td>{{ item.jobStatus }}</td>
              <td>{{ item.certNo }}</td>
              <td>{{ item.validStartTime }}~{{ item.validEndTime }}</td>
            </tr>
          </tbody>
        </table>
        <div class="report-home-title f14">（四）特种（设备）作业人员表</div>
        <table cellpadding="0" border="0" class="report-other-table" style="width:100% !important">
          <thead id="spec-sale-hed">
            <tr>
              <th>姓名</th>
              <th>类型</th>
              <th>状态</th>
              <th>证书号</th>
              <th>有效年限</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">

            <tr v-for="(item,index) in dialogForm.specialList " :key="index" class="j-saleTd">
              <td class="td2">{{ item.userName }}</td>
              <td>{{ item.certType }}</td>
              <td>{{ item.jobStatus }}</td>
              <td>{{ item.certNo }}</td>
              <td>{{ item.validStartTime }}~{{ item.validEndTime }}</td>
            </tr>
          </tbody>
        </table>
        <div class="report-home-title f14">（五）建设项目表</div>
        <table cellpadding="0" border="0" class="report-other-table" style="width:100% !important">
          <thead id="spec-sale-hed">
            <tr>
              <th>项目名称</th>
              <th>建设单位</th>
              <th>设计单位</th>
              <th>施工单位</th>
              <th>项目类型</th>
              <th>建设性质</th>
              <th>项目地址</th>
              <th>用地面积(m²)</th>
              <th>建设内容及规模</th>
              <th>工艺简述</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">

            <tr v-for="(item,index) in dialogForm.specialList " :key="index" class="j-saleTd">
              <td>{{ item.projectName }}</td>
              <td>{{ item.createCompany }}</td>
              <td>{{ item.createCompany }}</td>
              <td>{{ item.createCompany }}</td>
              <td>{{ item.projectType }}</td>
              <td>{{ item.projectProperties }}</td>
              <td>{{ item.projectAddress }}</td>
              <td>{{ item.landArea }}</td>
              <td>{{ item.projectDescription }}</td>
              <td>{{ item.productionProcess }}</td>
            </tr>

          </tbody>
        </table>
        <div class="report-home-title f14">（六）特种设备信息表</div>
        <table cellpadding="0" border="0" class="report-other-table" style="width:100% !important">
          <thead id="spec-sale-hed">
            <tr>
              <th>设备名称</th>
              <th>类型</th>
              <th>型号</th>
              <th>使用登记证书编号</th>
              <th>检验证书编号</th>
              <th>检验时间</th>
              <th>下一次检验时间</th>
              <th>设备状态</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">

            <tr class="j-saleTd">
              <td>{{ item.name }}</td>
              <td>{{ item.categoryName }}</td>
              <td>{{ item.equipmentModel }}</td>
              <td>{{ item.useRegistrationCerNum }}</td>
              <td>{{ item.inspectionCerNum }}</td>
              <td>{{ item.nextCheckTime }}</td>
              <td>{{ item.nextCheckTime }}</td>
              <td>{{ item.equipmentStatus }}</td>
            </tr>

          </tbody>
        </table>
        <div class="report-home-title f14">（七）风险分级管控</div>
        <table cellpadding="0" border="0" class="report-other-table" style="width:100% !important">
          <thead id="spec-sale-hed">
            <tr>
              <th colspan="6">风险数量</th>
            </tr>
            <tr>
              <th colspan="2">总数</th>
              <th colspan="2">重大</th>
              <th colspan="2">较大</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">
            <tr>
              <td colspan="2">{{ dialogForm.riskData.allCount||0 }}</td>
              <td colspan="2">{{ dialogForm.riskData.majorCount||0 }}</td>
              <td colspan="2">{{ dialogForm.riskData.moreCount||0 }}</td>
            </tr>
          </tbody>
          <thead id="spec-sale-hed">
            <tr>
              <th colspan="6">风险源信息</th>
            </tr>
            <tr>
              <th>场所</th>
              <th>危险源</th>
              <th>风险类型</th>
              <th>可能性</th>
              <th>严重性</th>
              <th>等级</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">
            <tr v-for="(item,index) in dialogForm.riskData.riskSourceList " :key="index" class="j-saleTd">
              <td>{{ item.pointName }}</td>
              <td>{{ item.riskName }}</td>
              <td>{{ item.riskType }}</td>
              <td>{{ item.riskPossibility }}</td>
              <td>{{ item.riskSerious }}</td>
              <td>{{ item.riskLevel }}</td>
            </tr>

          </tbody>
        </table>
        <div class="report-home-title f14">（八）应急救援能力</div>
        <table cellpadding="0" border="0" class="report-other-table" style="width:100% !important">
          <thead id="spec-sale-hed">
            <tr>
              <th colspan="10">企业内外部应急队伍</th>
            </tr>
            <tr>
              <th>队伍名称</th>
              <th>成立时间</th>
              <th>队伍类型</th>
              <th>常驻地址</th>
              <th>人数</th>
              <th>专业类型（擅长处置事故类型）</th>
              <th>是否培训</th>
              <th>24小时值班电话</th>
              <th>负责人</th>
              <th>联系电话</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">

            <tr class="j-saleTd">
              <td>{{ item.teamName }}</td>
              <td>{{ item.dateOfEstablishment }}</td>
              <td>{{ item.teamType }}</td>
              <td>{{ item.territory }}</td>
              <td>{{ item.totalNumber }}</td>
              <td>{{ item.accidentName }}</td>
              <td>{{ item.isTraining }}</td>
              <td>{{ item.dutyPhone }}</td>
              <td>{{ item.chargeMan }}</td>
              <td>{{ item.contactPhone }}</td>
            </tr>

          </tbody>
          <thead id="spec-sale-hed">
            <tr>
              <th colspan="10">应急物资装备</th>
            </tr>
            <tr>
              <th>类型</th>
              <th colspan="2">名称</th>
              <th>规格型号</th>
              <th>数量</th>
              <th>金额(万元)</th>
              <th colspan="2">存放场所</th>
              <th>负责人</th>
              <th>联系电话</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">

            <tr class="j-saleTd">
              <td>{{ item.categoryName }}</td>
              <td colspan="2">{{ item.goodsName }}</td>
              <td>{{ item.specificationAndModel }}</td>
              <td>{{ item.goodsNumber }}</td>
              <td>{{ item.materialAmount }}</td>
              <td colspan="2">{{ item.storagePlace }}</td>
              <td>{{ item.chargeMan }}</td>
              <td>{{ item.contactPhone }}</td>
            </tr>

          </tbody>
        </table>
        <div class="report-home-title f14">（九）安全事故情况</div>
        <table cellpadding="0" border="0" class="report-other-table" style="width:100% !important">
          <thead id="spec-sale-hed">
            <tr>
              <th>事故类型</th>
              <th>事故原因</th>
              <th>事故级别</th>
              <th>发生时间</th>
              <th>死亡人数</th>
              <th>重伤人数</th>
              <th>轻伤人数</th>
              <th>事故损失</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">

            <tr class="j-saleTd">
              <td>{{ item.typeName }}</td>
              <td>{{ item.reportTitle }}</td>
              <td>{{ item.accidentLevel }}</td>
              <td>{{ item.occurrenceTime }}</td>
              <td>{{ item.deathToll }}</td>
              <td>{{ item.seriouslyInjuredNum }}</td>
              <td>{{ item.minorInjuredNum }}</td>
              <td>{{ item.accidentLosses }}</td>
            </tr>

          </tbody>
        </table>
        <div class="report-home-title f14">（十）职业病危害</div>
        <table cellpadding="0" border="0" class="report-other-table">
          <thead id="spec-sale-hed">
            <tr>
              <th colspan="2">职业病名称</th>
              <th>职业病危险分类</th>
              <th>防治评价</th>
              <th>防治培训</th>
              <th>检测报告</th>
              <th colspan="2">检测时间</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">

            <tr class="j-saleTd">
              <td colspan="2">{{ item.name }}</td>
              <td>{{ item.categoryName }}</td>
              <td>{{ item.evaluateName }}</td>
              <td>{{ item.trainName }}</td>
              <td>{{ item.testReportName }}</td>
              <td colspan="2">{{ item.testReportTime }}</td>
            </tr>

          </tbody>
        </table>
        <div class="report-home-title f14">（十一）行政处罚</div>
        <table cellpadding="0" border="0" class="report-other-table" style="width:100% !important">
          <thead id="spec-sale-hed">
            <tr>
              <th colspan="2">处罚文号</th>
              <th>处罚类型</th>
              <th colspan="2">处罚原因</th>
              <th colspan="2">处罚时间</th>
              <th>处罚文件</th>
            </tr>
          </thead>
          <tbody id="safety_tbody">

            <tr class="j-saleTd">
              <td colspan="2">{{ item.punishCode }}</td>
              <td>{{ item.punishTypeName }}</td>
              <td colspan="2">{{ item.reason }}</td>
              <td colspan="2">{{ item.punishTime }}</td>
              <td class="pointer blue">{{ item.annexName }}</td>
            </tr>

          </tbody>
        </table>

      </div>
    </div>
    <template slot="footer">
      <myButton style="text-align: center;" type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="print()"
      >
        打 印
      </myButton>
    </template>

  </myDrawer>
</template>

<script>
import {

  detail, enumList

} from '@/api/system/enterprise'

export default {
  components: { },

  props: {

    visible: {
      type: Boolean,
      required: true,
      default() {
        return false
      }
    },
    id: {
      type: String,
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogForm: {
        sysEnterprise: {},
        sysEntExtend: {},
        enterpriseSafe: {},
        sysEntSafe: {}

      },
      enumList: {
        industrySectorList: [],
        nationalEconomyList: [],
        supervisionProcessesList: []
      }, // 枚举、字典
      item: {}
    }
  },
  watch: {

  },
  created() {
    this.loadData()
  },
  methods: {

    /**
       * 获取枚举、字典、数据
       */
    async loadData() {
      const that = this

      that.loading = true
      await enumList().then((res) => {
        that.enumList = res
      })
      await detail({ entId: that.id })
        .then((res) => {
          that.dialogForm = res
        })
        .finally(() => {
          that.loading = false
        })
    },

    cancel(done) {
      this.$emit('close', {})
    },
    print() {
      this.$print(this.$refs.print)
    }

  }
}
</script>

  <style lang="less" scoped>

        #print_main {
            width: 531.35pt;
            height: auto;
            font-family: "宋体";
            margin: 0 auto;
            position: relative;
        }

        body {
            padding: 0px !important;
        }

        .f11 {
            font-size: 11pt !important;
        }

        .f12 {
            font-size: 12pt !important;
        }

        .f14 {
            font-size: 14pt !important;
        }

        .f16 {
            font-size: 16pt !important;
        }

        .f18 {
            font-size: 18pt !important;
        }

        .f26 {
            font-size: 26pt !important;
        }

        .f28 {
            font-size: 28pt !important;
        }

        .ff-En {
            font-family: 'Times New Roman' !important;
        }

        .page-line {
            height: 5pt;
            background-color: #EFEFEF;
        }

        .div-report-page {
            /*height: 539pt;*/
            width: 500.35pt;
            border: 10pt solid transparent;
            border-left: 15pt solid transparent;
            border-right: 15pt solid transparent;
            position: relative;
            z-index: 1;
            /*padding: 10pt 15pt;*/
            page-break-after: always;
            page-break-inside: avoid;
            /*overflow-x:hidden;*/
        }

        .report-home-title {
            text-align: left;
            line-height: 40px;
        }

        .report-home-row .left {
            width: 50%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .report-home-row .right {
            width: 50%;
            margin-left: 50%;
            text-align: right;
        }

        .report-home-row .right > span {
            margin: 0 5px;
            text-align: center;
            display: inline !important;
        }

        .report-home-table {
            border: 0px;
            border-top: 1px solid #999999;
            border-left: 1px solid #999999;
            table-layout: fixed;
            word-break: break-all;
        }

        .report-home-table td {
            vertical-align: middle;
            font-size: 11pt !important;
            font-family: '宋体';
            border-right: 1px solid #999999;
            border-bottom: 1px solid #999999;
            height: 26pt;
            line-height: 15pt;
            padding: 0pt 4pt;
        }

        .report-home-table .td1 {
            /*text-align: justify;
            text-align-last: justify;*/
            width: 18%;
            text-align: center;
        }
        .report-home-table .td1.weight600{
            font-weight: 600;
        }

        .report-home-table .td2 {
            text-align: left;
            width: 32%;
        }

        .report-home-table .td2 > textarea {
            width: 421pt !important;
            height: 112pt;
            margin: 4pt 0 !important;
            font-family: '宋体';
            font-size: 11pt;
            line-height: 15pt;
            color: #000000;
            display: table-cell;
            vertical-align: middle;
        }
        .report-home-autograph > div {
            width: 33.33%;
            float: left;
            text-indent: 2pt;
        }
        .report-other-table {
            border: 0px;
            border-top: 1px solid #999999;
            border-left: 1px solid #999999;
            width: 100%;
            table-layout: fixed;
            word-break: break-all;
        }

        .report-other-table thead {
            text-align: center;
            border-top: 0 !important;
        }

        .report-other-table thead th {
            height: 30pt;
            border-right: 1px solid #999999;
            border-bottom: 1px solid #999999;
            word-wrap: break-word !important;
            word-break: normal !important;
        }

        .report-other-table tbody td {
            text-align: center;
            padding: 0 4pt;
            border-right: 1px solid #999999;
            border-bottom: 1px solid #999999;
            height: 38pt;
            line-height: 15pt;
            vertical-align: middle;
            font-size: 14px;
            word-wrap: break-word !important;
            word-break: normal !important;
        }

        .report-other-table tbody td > textarea {
            width: 474pt !important;
            height: 30pt;
            margin: 4pt 0 !important;
            font-family: '宋体';
            font-size: 11pt;
            line-height: 15pt;
            color: #000000;
        }

        .div-cnas img {
            height: 100%;
        }

        .div-cma img {
            height: 65px;
            padding-bottom: 25px;
        }

        .div-cma div {
            position: absolute;
            color: #FF0000;
            text-align: center;
            bottom: 4px;
            width: 100%;
            height: 20px;
            font-family: '仿宋';
            font-weight: bold;
            letter-spacing: 3px;
            font-size: 16px;
        }

        .follow img {
            /*filter: brightness(0);*/
        }

        .rz select {
            width: 100px;
        }

        .report-img-edit > div {
            line-height: 30px;
            padding: 5px 0;
        }

        .report-img-edit input[type="number"] {
            height: 30px;
            border: none;
            line-height: 30px;
            width: 213px;
            margin: 0;
        }

        .report-img-edit input[type="checkbox"] {
            vertical-align: middle;
            margin-top: 0;
            width: 16px;
            height: 16px;
        }

        .report-img-edit label {
            display: initial;
        }

        .report-img-edit .div1 {
            padding: 0 10px;
            border-radius: 3px;
            background-color: #999999;
        }

        .report-img-edit .btn {
            float: right;
            padding: 0 20px !important;
            margin-left: 10px;
        }

        .printcheckbox {
            width: 14px;
            height: 14px;
            border: 1px solid #000000;
            display: inline-block;
            margin: 0 5px;
            margin-bottom: -1px;
            min-height: 10px !important;
        }

        .printcheck {
            width: 0px;
            height: 0px;
            margin: 1px;
            border: 5px #000000 solid;
        }
        .td-line{
            width: 180px;
            text-decoration: underline;
            margin-right: 5px;
        }
        .printbutton {
            width: 35px;
            height: 24px;
            position: fixed;
            top: 0;
            right: 30px;
            z-index: 10;
            line-height: 24px;
            background-color: #1e9fff;
            background-image: none;
            filter: none;
            border: 1px solid #ccc;
            padding: 5px 15px !important;
            text-shadow: none;
            font-family: "Segoe UI", Helvetica, Arial, sans-serif;
            font-size: 12px;
            color: #333333;
            cursor: pointer;
            text-align: center;
            color: white;

        }
        .pointer{
            cursor:pointer;
        }
        .blue{
            color: #1E9FFF;
        }
        table{
            border-collapse: collapse;
        }
  </style>
<style>
.drawerclass .el-drawer body
{ background-color: #EFEFEF;}
</style>

