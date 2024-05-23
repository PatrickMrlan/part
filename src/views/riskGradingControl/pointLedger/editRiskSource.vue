<template>
  <myDialog
    :title="title"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="70%"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      style="min-height: 70vh"
    >
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="风险源（点）名称：" prop="riskName">
            <el-input
              v-model.trim="dialogForm.riskName"
              type="text"
              placeholder="请输入风险源（点）名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="风险源（点）类别：" prop="riskCategory">
            <el-select
              v-model="dialogForm.riskCategory"
              placeholder="请选择"
              filterable
              @change="changeRiskCategory"
            >
              <el-option
                v-for="(item, index) in enumList.riskCategoryList"
                :key="index"
                :label="item.key"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="风险分析：" prop="riskAnalysis">
            <el-select
              v-model="dialogForm.riskAnalysis"
              placeholder="请选择"
              filterable
              @change="changeRiskAnalysis"
            >
              <el-option
                v-for="(item, index) in enumList.riskAnalysisList"
                :key="index"
                :label="item.key"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="风险等级：">
            <el-input
              v-model="dialogForm.riskLevel"
              type="text"
              placeholder="自动计算"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="风险概述：" prop="riskOverview">
            <el-input
              v-model.trim="dialogForm.riskOverview"
              type="textarea"
              placeholder="请输入风险概述"
              clearable
              maxlength="2000"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 8 }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-show="dialogForm.riskAnalysis">
        <el-col>
          <el-form-item
            label="危险有害因素辨识及风险评价："
            class="tableTitle"
            prop="majorAccidentsList"
          >
            <template slot="label">
              <div class="customLabel">
                <span>危险有害因素辨识及风险评价：</span>
                <myButton
                  v-show="dialogForm.riskAnalysis == '直接判断法'"
                  @click.native="checkStandard"
                  >选择标准</myButton
                >
              </div>
            </template>

            <el-table
              :data="dialogForm.majorAccidentsList"
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
                prop="accidentType"
                label="主要事故类型"
                min-width="110"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.accidentType"
                    placeholder="请选择"
                    filterable
                    @change="changeGetLevel(scope.row, 'type')"
                  >
                    <el-option
                      v-for="(item, index) in enumList.riskAccidentTypeList"
                      :key="index"
                      :label="item.dictName"
                      :value="item.dictCode"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="likelihood"
                label="可能性(L)"
                min-width="100"
                v-if="dialogForm.riskAnalysis == '风险矩阵分析法LS'"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.likelihood"
                    placeholder="请选择"
                    filterable
                    @change="changeGetLevel(scope.row)"
                  >
                    <el-option
                      v-for="(item, index) in enumList.likelihoodList"
                      :key="index"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="seriousness"
                label="事故后果严重性(S)"
                min-width="150"
                v-if="dialogForm.riskAnalysis == '风险矩阵分析法LS'"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.seriousness"
                    placeholder="请选择"
                    filterable
                    @change="changeGetLevel(scope.row)"
                  >
                    <el-option
                      v-for="(item, index) in enumList.seriousnessList"
                      :key="index"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column
                prop="possibility"
                label="可能性(L)"
                min-width="100"
                v-if="dialogForm.riskAnalysis == 'LEC 评价法'"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.possibility"
                    placeholder="请选择"
                    filterable
                    @change="changeGetLevel(scope.row)"
                  >
                    <el-option
                      v-for="(item, index) in enumList.possibilityList"
                      :key="index"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="exposure"
                label="暴露于危险环境的频繁程度(E)"
                min-width="210"
                v-if="dialogForm.riskAnalysis == 'LEC 评价法'"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.exposure"
                    placeholder="请选择"
                    filterable
                    @change="changeGetLevel(scope.row)"
                  >
                    <el-option
                      v-for="(item, index) in enumList.exposureList"
                      :key="index"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column
                prop="consequence"
                label="可能造成的后果(C)"
                min-width="150"
                v-if="dialogForm.riskAnalysis == 'LEC 评价法'"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.consequence"
                    placeholder="请选择"
                    filterable
                    @change="changeGetLevel(scope.row)"
                  >
                    <el-option
                      v-for="(item, index) in enumList.consequenceList"
                      :key="index"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="风险等级">
                <template slot-scope="scope">
                  <el-select
                    v-if="
                      dialogForm.riskAnalysis == '直接判断法' &&
                      scope.row.customAdd
                    "
                    v-model="scope.row.riskLevel"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in riskLevelList"
                      :key="index"
                      :label="item"
                      :value="item"
                    />
                  </el-select>

                  <el-input
                    v-else
                    v-model="scope.row.riskLevel"
                    type="text"
                    placeholder="自动计算"
                    readonly
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <my-handle>
                    <span
                      @click="addRows(dialogForm.majorAccidentsList)"
                      v-if="
                        scope.$index == dialogForm.majorAccidentsList.length - 1
                      "
                      >新增</span
                    >
                    <span
                      @click="
                        delRows(dialogForm.majorAccidentsList, scope.$index)
                      "
                      v-if="dialogForm.majorAccidentsList.length > 1"
                      >删除</span
                    >
                  </my-handle>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
        >提 交</myButton
      >
    </template>

    <standardLookup
      v-if="standarShow"
      title="选择辨识标准"
      :multiple="true"
      @close="standardLookupClose"
    />
  </myDialog>
</template>

<script>
import {
  edit,
  detail,
  enumList,
  getSingleLevel,
  getSourceLevel,
} from "@/api/risk/riskSource";
import { edit as identificationEdit } from "@/api/hazard/identificationCheck";

import { Message } from "element-ui";
import standardLookup from "./standardLookup.vue";

export default {
  components: { standardLookup },
  props: {
    title: {
      required: true,
      default() {
        return "";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
    editData: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      dialogForm: {
        riskName: null, // 风险源（点）名称
        riskCategory: null, // 风险源（点）类别
        riskAnalysis: null, // 风险分析
        riskOverview: null, // 风险概述
        riskLevel: null, // 风险等级
        majorAccidentsList: [
          {
            accidentType: null, // 事故类型

            likelihood: null, // 可能性(L)
            seriousness: null, // 事故后果严重性(S)

            possibility: null, // 可能性(L)
            exposure: null, // 暴露于危险环境的频繁程度(E)
            consequence: null, // 可能造成的后果(C)

            riskLevel: null, // 风险等级
          },
        ],
      },
      formRules: {
        riskName: [
          {
            required: true,
            message: "请输入风险源（点）名称！",
            trigger: ["blur", "change"],
          },
        ],
        riskCategory: [
          {
            required: true,
            message: "请选择风险源（点）类别！",
            trigger: ["blur", "change"],
          },
        ],
        riskAnalysis: [
          {
            required: true,
            message: "请选择风险分析！",
            trigger: ["blur", "change"],
          },
        ],
        riskOverview: [
          {
            required: true,
            message: "请输入风险概述！",
            trigger: ["blur", "change"],
          },
          {
            max: 2000,
            message: "风险概述长度不能大于2000",
            trigger: ["blur", "change"],
          },
        ],
        riskLevel: [
          {
            required: true,
            message: "必填，请至少完善表格的一条数据！",
            trigger: "blur",
          },
        ],
      },
      enumList: {},
      standarShow: false,

      riskLevelList: ["重大风险", "较大风险", "一般风险", "低风险"],
    };
  },
  created() {
    this.getEnumList();
    this.loadData();
  },
  methods: {
    /**
     * 1、改变下拉框的值
     * 2、传递参数和分析 得到每一行的风险等级
     * 3、传递整个数组  得到风险源（点）的风险等级
     */
    async changeGetLevel(data, type) {
      const that = this;

      let obj = {};

      if (data.accidentType && data.likelihood && data.seriousness) {
        obj.likelihood = data.likelihood;
        obj.seriousness = data.seriousness;
        obj.riskAnalysis = this.dialogForm.riskAnalysis;
      }

      if (
        data.accidentType &&
        data.possibility &&
        data.exposure &&
        data.consequence
      ) {
        obj.possibility = data.possibility;
        obj.exposure = data.exposure;
        obj.consequence = data.consequence;
        obj.riskAnalysis = this.dialogForm.riskAnalysis;
      }

      if (obj.riskAnalysis) {
        that.loading = true;
        await getSingleLevel(obj)
          .then((res) => {
            data.riskLevel = res;
          })
          .finally(() => {
            this.loading = false;
          });

        that.loading = true;
        await getSourceLevel(that.dialogForm.majorAccidentsList)
          .then((res) => {
            that.dialogForm.riskLevel = res;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    /**
     * 改变风险源（点）类别
     * 如果风险分析没有值则自动填充对应的值
     */
    changeRiskCategory(e) {
      switch (e) {
        case "作业活动":
          this.dialogForm.riskAnalysis = "LEC 评价法";
          break;
        case "设施设备":
          this.dialogForm.riskAnalysis = "风险矩阵分析法LS";
          break;
      }
      this.dialogForm.riskLevel = null;

      this.dialogForm.majorAccidentsList.forEach((item) => {
        item.likelihood = null;
        item.seriousness = null;
        item.possibility = null;
        item.exposure = null;
        item.consequence = null;
        item.riskLevel = null;

        item.customAdd =
          this.dialogForm.riskAnalysis == "直接判断法" ? true : false;
      });
    },

    /**
     * 改变风险分析
     */
    changeRiskAnalysis(e) {
      if (e) {
        this.dialogForm.riskLevel = null;

        this.dialogForm.majorAccidentsList.forEach((item) => {
          item.likelihood = null;
          item.seriousness = null;
          item.possibility = null;
          item.exposure = null;
          item.consequence = null;
          item.riskLevel = null;
          item.customAdd =
            this.dialogForm.riskAnalysis == "直接判断法" ? true : false;
        });
      }
    },

    loadData() {
      this.loading = true;
      detail({ id: this.id })
        .then((res) => {
          if (this.id) {
            this.dialogForm = res;
          }
          console.log(this.editData);

          if (this.editData) {
            this.dialogForm = Object.assign({}, this.editData);
          }
          if (this.dialogForm.majorAccidentsList.length < 1) {
            this.addRows(this.dialogForm.majorAccidentsList);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 获取枚举
     */
    getEnumList() {
      enumList().then((res) => {
        this.enumList = res;
      });
    },

    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;

          let riskLevelEmpty = false;
          for (let i = 0; i < that.dialogForm.majorAccidentsList.length; i++) {
            const element = that.dialogForm.majorAccidentsList[i];

            if (!element.riskLevel) {
              that.loading = false;
              riskLevelEmpty = true;
              Message({
                type: "warning",
                message: "请完善表格中第" + (i + 1) + "行的数据",
              });
              break;
            }
          }

          if (riskLevelEmpty) {
            return;
          }

          if (that.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false;
                Message({
                  type: "success",
                  message: "操作成功",
                });
                this.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            that.loading = false;
            // Message({
            //   type: "success",
            //   message: "操作成功",
            // });

            that.dialogForm.majorAccidentsList.forEach((item) => {
              that.enumList.riskAccidentTypeList.forEach((itemSon) => {
                if (item.accidentType == itemSon.dictCode) {
                  item.accidentTypeName = itemSon.dictName;
                }
              });
            });

            that.$emit("close", { reload: true, data: that.dialogForm });
          }
        } else {
          return false;
        }
      });
    },

    addRows(table) {
      table.push({
        accidentType: null, // 事故类型

        likelihood: null, // 可能性(L)
        seriousness: null, // 事故后果严重性(S)

        possibility: null, // 可能性(L)
        exposure: null, // 暴露于危险环境的频繁程度(E)
        consequence: null, // 可能造成的后果(C)

        riskLevel: null, // 风险等级
        customAdd: true,
      });
    },

    delRows(table, index) {
      table.splice(index, 1);
    },

    /**
     * 直接判断法
     * 选择标准
     */
    checkStandard() {
      this.standarShow = true;
    },

    standardLookupClose(data, flag) {
      console.log(data, flag);
      const that = this;

      // return;

      if (flag) {
        if (data.length) {
          that.loading = true;

          let dataArrList = [];
          let oldOverview = [];
          let newOverview = [];

          data.forEach((item) => {
            newOverview.push(item.identificationStandards);
          });
          if (that.dialogForm.riskOverview) {
            oldOverview = that.dialogForm.riskOverview.split("\n");
          }
          let result = Array.from(new Set([...oldOverview, ...newOverview]));
          that.dialogForm.riskOverview = result.join("\n");

          that.dialogForm.majorAccidentsList.forEach((item) => {
            if (item.accidentType) {
              dataArrList.push(item);
            }
          });

          identificationEdit({
            hazardIdentificationCheckList: data,
            majorAccidentsList: dataArrList,
          })
            .then((res) => {
              that.dialogForm.majorAccidentsList = [...res.list];
              that.dialogForm.riskLevel = res.riskLevel;
            })
            .finally(() => {
              that.loading = false;
            });
        }
      }

      this.standarShow = false;
    },

    // 取消
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
/deep/.el-input {
  width: 100% !important;
}

/deep/.tableTitle {
  label {
    width: 100%;
  }
  .customLabel {
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    z-index: 20;
    position: relative;
  }
}
</style>
