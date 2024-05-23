<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="85%">
    <el-form
      ref="dialogForm"
      v-loading="loading"
      style="min-height: 100%"
      :model="dialogForm"
      :rules="formRules"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col>
          <h3 class="checkTitle">检查信息</h3>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="检查任务："
            style="margin-bottom: 10px !important"
          >
            <el-radio v-model="checkTaskRadio" label="2">随机检查</el-radio>
            <el-radio v-model="checkTaskRadio" label="1">按计划</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="checkTaskRadio == 1">
          <el-form-item label="隐患计划：" prop="taskId">
            <el-select
              v-model="dialogForm.taskId"
              filterable
              placeholder="请选择隐患计划"
            >
              <el-option
                v-for="(item, index) in taskList"
                :key="index"
                :label="item.taskName"
                :value="item.taskId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-if="isShowEnt && checkTaskRadio">
          <el-form-item label="受检企业：" prop="entName">
            <el-select v-model="dialogForm.entId" placeholder="请选择">
              <el-option
                v-for="(item, index) in entList"
                :key="index"
                :label="item.entName"
                :value="item.entId"
              />
            </el-select>

            <!-- <el-input
              v-model="dialogForm.entName"
              placeholder="请输入企业名称"
              readonly
            /> -->
          </el-form-item>
        </el-col>
        <!-- <el-col>
          <el-form-item label="隐患排查名称：" prop="hazardName">
            <el-input
              v-model="dialogForm.hazardName"
              placeholder="请输入隐患排查名称"
              clearable
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="检查类型：" prop="examType">
            <el-select
              v-model="dialogForm.examType"
              filterable
              placeholder="请选择检查类型"
            >
              <el-option
                v-for="(item, index) in examTypeList"
                :key="index"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item
            label="检查方法："
            style="margin-bottom: 10px !important"
            prop="objectType"
          >
            <el-radio
              v-model="dialogForm.objectType"
              :label="1"
              @input="changeObject"
              >风险单元（场所、区域）</el-radio
            >
            <el-radio
              v-model="dialogForm.objectType"
              :label="0"
              @input="changeObject"
              >模板</el-radio
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-show="dialogForm.objectType === 0">
        <el-col :span="12">
          <el-form-item label="检查模板：" prop="template">
            <el-select
              v-model="dialogForm.objectId"
              filterable
              placeholder="请选择检查模板"
            >
              <el-option
                v-for="item in templateList"
                :key="item.templateId"
                :label="item.templateName"
                :value="item.templateId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="12"
          v-if="dialogForm.objectType === 0 && dialogForm.objectId"
        >
          <myButton @click.native="checkTemplate">
            {{ id ? "继续排查" : "开始排查" }}
          </myButton>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-show="dialogForm.objectType === 1">
        <el-col :span="12">
          <el-form-item label="风险单元（场所、区域）：" prop="riskPoint">
            <el-select
              ref="riskPoint"
              v-model="dialogForm.objectId"
              filterable
              placeholder="请选择风险单元（场所、区域）"
              @visible-change="
                (v) => visibleChange(v, 'riskPoint', addFn, '添加')
              "
              @change="changeRiskPoint"
            >
              <el-option
                v-for="item in riskPointList"
                :key="item.riskPointId"
                :label="item.riskPointName"
                :value="item.riskPointId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="12"
          v-if="dialogForm.objectId && dialogForm.objectType === 1"
        >
          <myButton @click.native="addFn('riskSourceLookup')"
            >选择风险源（点）</myButton
          >
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        v-if="dialogForm.objectId && dialogForm.objectType === 1"
      >
        <el-col>
          <div>
            <el-table
              :key="tableKey"
              :data="dialogForm.riskSourceList"
              border
              style="width: 100%"
              highlight-current-row
              :header-cell-style="{
                height: '30px !important',
                fontSize: '14px',
                color: '#333',
              }"
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50"
              />
              <el-table-column prop="riskName" label="风险源（点）名称" />
              <el-table-column prop="riskCategory" label="风险源（点）类别" />
              <el-table-column prop="riskAnalysis" label="风险分析" />
              <el-table-column
                prop="riskLevel"
                label="风险等级"
                width="100"
                align="center"
              />
              <el-table-column label="有无隐患" width="100" align="center">
                <template slot-scope="scope">
                  <div>
                    {{
                      scope.row.hazardInvestigationResultList &&
                      scope.row.hazardInvestigationResultList.length > 0
                        ? "有"
                        : "无"
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    title="删除"
                    circle
                    @click="delRow(scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col style="margin-top: 10px; text-align: right">
          <div
            v-if="
              dialogForm.riskSourceList && dialogForm.riskSourceList.length > 0
            "
          >
            <myButton @click.native="investigationRisk">
              {{ id ? "继续排查" : "开始排查" }}
            </myButton>
          </div>
        </el-col>
      </el-row>
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
    </template>

    <!-- 增加风险单元（场所、区域） -->
    <addRiskPoint
      v-if="addRiskPointShow"
      :title="titleName"
      :id="addId"
      @close="addClose"
    />

    <!-- 选择风险源（点） -->
    <riskSourceLookup
      v-if="riskSourceLookupShow"
      :title="titleName"
      :id="addId"
      :tags="dialogForm.riskSourceList"
      :multiple="true"
      @close="riskSourceLookupClose"
    />

    <!-- 开始排查 -->
    <investigation
      v-if="investigationShow"
      :title="titleName"
      :data="investigationData"
      @close="investigationClose"
    />

    <!-- 模板排查 -->
    <templateCheck
      v-if="templateCheckShow"
      :title="titleName"
      :id="dialogForm.objectId"
      @close="templateCheckClose"
    />
  </myDrawer>
</template>

<script>
import { mapGetters } from "vuex";
import { enumList, detail, add, edit } from "@/api/security/danger";
import { list as templateList } from "@/api/hazard/template";
import { list as riskPointList } from "@/api/risk/riskPoint";
import { list as taskList } from "@/api/hazard/task";
import { list as entList } from "@/api/system/enterprise";
import { thirdPartyEntList } from "@/api/thirdparty/information";

import addRiskPoint from "./addRiskPoint.vue";
import riskSourceLookup from "./riskSourceLookup.vue";
import investigation from "./investigation.vue";
import templateCheck from "./templateCheck.vue";

export default {
  components: {
    addRiskPoint,
    riskSourceLookup,
    investigation,
    templateCheck,
  },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    visible: {
      type: Boolean,
      required: true,
      default() {
        return false;
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      checkTaskRadio: null, // 检查任务

      dialogForm: {},
      formRules: {
        hazardName: [
          {
            required: true,
            message: "请选择隐患排查名称！",
            trigger: ["blur", "change"],
          },
        ],
        examType: [
          {
            required: true,
            message: "请选择检查类型！",
            trigger: ["blur", "change"],
          },
        ],
        objectType: [
          {
            required: true,
            message: "请选择检查方法！",
            trigger: ["blur", "change"],
          },
        ],
      },

      titleName: null,
      addRiskPointShow: false,
      riskSourceLookupShow: false,
      investigationShow: false,
      templateCheckShow: false,
      addId: null,
      investigationData: [],
      enumList: {},
      loginUser: {},
      templateList: [],
      riskPointList: [],
      examTypeList: [],

      oldVal: null,
      tableKey: null,

      taskList: [],
      hazardStandardList: [],
      isShowEnt: true,
      entList: [],
    };
  },
  async created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));

    await this.getEnumList();
    await this.loadData();
  },
  mounted() {},
  watch: {
    "dialogForm.objectId": {
      handler(newVal, oldVal) {
        this.oldVal = oldVal;
      },
    },
    checkTaskRadio: {
      handler(newVal, oldVal) {
        this.changeCheckTaskRadio(newVal);
      },
    },
  },
  computed: {
    ...mapGetters("app", ["themeColor"]),
  },
  methods: {
    changeCheckTaskRadio(val) {
      this.examTypeList = [];
      if (val == "1") {
        this.getTaskList();
        this.examTypeList = this.enumList.examTypeList;
      } else {
        this.dialogForm.taskId = null;

        if (this.enumList.examTypeList && this.enumList.examTypeList.length) {
          this.enumList.examTypeList.forEach((item, index) => {
            if (item.key == "日常检查") {
              this.examTypeList.push(item);
            }
          });
        }
        this.dialogForm.examType = 0;
      }
    },

    getTaskList() {
      const that = this;
      that.loading = true;

      taskList({
        entId: this.dialogForm.entId,
        pageIndex: 1,
        pageSize: 99999999,
      })
        .then((res) => {
          that.taskList = res.records;
        })
        .finally(() => {
          that.loading = false;
        });
    },

    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      console.log(that.dialogForm);
      console.log(that.hazardStandardList);

      this.$refs[formName].validate((valid) => {
        console.log(valid);
        if (valid) {
          that.loading = true;
          that.dialogForm.hazardInvestigationResultList = [];
          that.dialogForm.riskSourceIdList = [];
          // that.dialogForm.hazardStandardList = [];

          if (that.dialogForm.objectType === 1) {
            that.dialogForm.riskSourceList.forEach((item) => {
              that.dialogForm.riskSourceIdList.push(item.riskSourceId);
              if (item.customTable && item.customTable.length) {
                item.customTable.forEach((itemSon) => {
                  itemSon.mainRisk = itemSon.inspectionStandards;
                  if (
                    itemSon.mainRisk &&
                    itemSon.hazardType &&
                    itemSon.rectType
                  ) {
                    that.dialogForm.hazardInvestigationResultList.push(itemSon);
                  }
                });
              }
            });
          }

          if (that.dialogForm.objectType === 0) {
            that.dialogForm.hazardStandardList = that.hazardStandardList;
          }

          if (that.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            add(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },

    checkTemplate() {
      this.titleName = this.id ? "继续排查" : "开始排查";
      this.templateCheckShow = true;
    },

    /**
     * 开始排查
     */
    investigationRisk() {
      this.titleName = this.id ? "继续排查" : "开始排查";
      console.log(this.dialogForm.riskSourceList);

      if (this.id && this.dialogForm.hazardInvestigationResultList.length > 0) {
        this.dialogForm.riskSourceList.forEach((item) => {
          item.customTable = [];
          this.dialogForm.hazardInvestigationResultList.forEach((itemSon) => {
            if (item.riskSourceId == itemSon.riskSourceId) {
              itemSon.inspectionStandards = itemSon.mainRisk;
              itemSon.inspectionResults = itemSon.rectState;
              itemSon.isSource = true;
              item.customTable.push(itemSon);
            }
          });
        });
      }
      this.investigationData = this.dialogForm.riskSourceList;
      this.investigationShow = true;
    },

    /**
     * 1、选择类型
     * 2、隐藏 模板 || 风险单元（场所、区域）
     * 3、模板：0    风险单元（场所、区域）：1
     */
    changeObject(e) {
      this.dialogForm.objectType = e;
      this.dialogForm.objectId = null;
      this.dialogForm.riskSourceList = [];
      this.$forceUpdate();
    },

    /**
     * 进行确认 是否 改变风险单元（场所、区域）
     */
    changeRiskPoint() {
      if (
        this.dialogForm.riskSourceList &&
        this.dialogForm.riskSourceList.length
      ) {
        this.$confirm(
          "确认更换成其他风险单元（场所、区域）? 这样将会清除风险源（点）",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.dialogForm.riskSourceList = [];
            this.tableKey = new Date().getTime();
            this.$forceUpdate();
          })
          .catch(() => {
            // 取消删除
            this.dialogForm.objectId = this.oldVal;
          });
      }
    },

    /**
     * 删除风险源（点）
     */
    delRow(index) {
      this.dialogForm.riskSourceList.forEach((item, i) => {
        if (i == index) {
          this.dialogForm.riskSourceList.splice(i, 1);
        }
      });
      this.$forceUpdate();
    },

    loadData() {
      this.loading = true;
      detail({ hazardId: this.id })
        .then((res) => {
          this.dialogForm = res;

          if (this.loginUser.sysEnterprise) {
            this.dialogForm.entName = this.loginUser.sysEnterprise.entName;
            this.dialogForm.entId = this.loginUser.sysEnterprise.entId;
            this.isShowEnt = false;
          }

          if (!this.dialogForm.taskId) {
            this.checkTaskRadio = "2";
          } else {
            this.checkTaskRadio = "1";
          }

          this.changeCheckTaskRadio(this.checkTaskRadio);

          this.$forceUpdate();
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 获取枚举
     */
    async getEnumList() {
      await enumList().then((res) => {
        this.enumList = res;
      });

      await templateList({
        pageIndex: 1,
        pageSize: 99999999,
      }).then((res) => {
        this.templateList = res.records;
      });

      await riskPointList({
        pageIndex: 1,
        pageSize: 99999999,
      }).then((res) => {
        this.riskPointList = res.records;
      });

      if (this.loginUser.sysPark) {
        await entList({
          parkId: this.loginUser.sysPark.parkId,
          pageIndex: 1,
          pageSize: 99999999,
        }).then((res) => {
          this.entList = res.records;
        });
      }

      if (this.loginUser.sysThirdParty) {
        await thirdPartyEntList({
          pageIndex: 1,
          pageSize: 99999999,
        }).then((res) => {
          this.entList = res.records;
        });
      }
    },

    /**
     * 重构下拉框(给下拉框增加添加按钮)
     */
    visibleChange(visible, refName, onClick, addname) {
      if (visible) {
        const ref = this.$refs[refName];
        let popper = ref.$refs.popper;
        if (popper.$el) popper = popper.$el;
        if (!Array.from(popper.children).some((v) => v.className === "add")) {
          const el = document.createElement("div");
          el.className = "add";
          el.style = `  font-size: 14px;
                        padding: 0 20px;
                        height: 34px;
                        line-height: 34px; box-sizing: border-box;
                        cursor: pointer;
                        text-align: center;
                        border-top: 1px solid rgba(0, 0, 0, 0.06);
                        color:${this.themeColor}`;
          el.innerHTML = addname;
          popper.appendChild(el);
          el.onclick = () => {
            // 底部按钮的点击事件 点击后想触发的逻辑也可以直接写在这
            onClick && onClick(refName);

            // 以下代码实现点击后弹层隐藏 不需要可以删掉
            if (ref.toggleDropDownVisible) {
              ref.toggleDropDownVisible(false);
            } else {
              ref.visible = false;
            }
          };
        }
      }
    },

    /**
     * 点击添加
     */
    addFn(type) {
      switch (type) {
        case "riskPoint":
          this.titleName = "新增风险单元（场所、区域）";
          this.addRiskPointShow = true;
          this.addId = this.loginUser.sysEnterprise.entId;
          break;
        case "riskSourceLookup":
          this.titleName = "选择风险源（点）";
          this.riskSourceLookupShow = true;
          this.addId = this.dialogForm.objectId;
          break;
        default:
          break;
      }
    },

    /**
     * 关闭添加风险单元（场所、区域）
     */
    addClose(data) {
      console.log(data);
      if (data.reload) {
        this.getEnumList();
      }
      this.addRiskPointShow = false;
    },

    /**
     * 关闭选择风险源（点）
     */
    riskSourceLookupClose(data, flag) {
      if (flag) {
        this.dialogForm.riskSourceList = data;
      }
      this.riskSourceLookupShow = false;
    },

    /**
     * 关闭排查
     */
    investigationClose(data) {
      console.log(data);
      if (data.reload) {
        this.investigationData = data.riskSourceList;
      }
      this.investigationShow = false;
    },

    templateCheckClose(data) {
      console.log(data);
      if (data.reload) {
        this.hazardStandardList = data.hazardStandardList;
      }
      this.templateCheckShow = false;
    },

    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
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

.checkTitle {
  font-weight: bold;
  margin: 0 0 10px;
}

/deep/.floatNone {
  label {
    float: none;
  }
}
</style>