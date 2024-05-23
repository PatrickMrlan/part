<template>
  <myDialog
    :title="title"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="80%"
  >
    <el-form ref="dialogForm">
      <el-row :gutter="20">
        <el-col>
          <div class="info">
            <div>
              <div class="label">
                <img src="@/assets/img/enterprise/enterprise-plan-icon.png">
                风险单元（场所、区域）名称：
              </div>
              <span>{{ measureInfo.riskPointName }}</span>
            </div>
            <div>
              <div class="label">
                <img src="@/assets/img/enterprise/enterprise-plan-icon.png">
                风险源（点）名称：
              </div>
              <span>{{ measureInfo.riskName }}</span>
            </div>
            <div>
              <div class="label">
                <img src="@/assets/img/enterprise/enterprise-plan-icon.png">
                事故类型：
              </div>
              <span>{{ measureInfo.accidentType }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" class="line" />
      <el-row :gutter="20">
        <el-col>
          <div class="table-title">
            <span>新增管控措施</span>
            <myButton
              v-if="!isDisabled"
              icon="el-icon-plus"
              type="search"
              @click.native="addRow(dialogForm, 'table')"
            >新增管控措施</myButton>
          </div>
          <ul class="table-list">
            <li v-for="(item, index) in dialogForm" :key="index">
              <div class="thead">
                <div>序号</div>
                <div>措施名称</div>
                <div class="classification">措施分类</div>
                <div>检查标准</div>
                <div style="flex: none; width: 150px">责任人</div>
                <div style="flex: none; width: 120px">检查频率</div>
                <div>操作</div>
              </div>
              <div class="tbody">
                <div v-for="(itemSon, i) in item.measureStandardList" :key="i">
                  <div>
                    <span v-show="i == 0">{{ index + 1 }}</span>
                  </div>
                  <div>
                    <el-input
                      v-show="i == 0"
                      v-model="item.measureName"
                      placeholder="请输入措施名称"
                      :disabled="isDisabled"
                    />
                  </div>
                  <div class="classification">
                    <el-select
                      v-show="i == 0"
                      v-model="item.measureType"
                      filterable
                      :disabled="isDisabled"
                      @change="selectType($event,index)"
                    >
                      <el-option
                        v-for="(item, index) in enumList.measureTypeList"
                        :key="index"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>

                    <el-select
                      v-show="i == 0"
                      v-model="item.measureClassification"
                      filterable
                      :disabled="isDisabled"
                    >
                      <el-option
                        v-for="(
                          item, index
                        ) in item.measureClassificationList"
                        :key="index"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </div>
                  <div>
                    <el-input
                      v-model="itemSon.inspectionStandards"
                      placeholder="请输入检查标准"
                    />
                  </div>
                  <div style="flex: none; width: 150px">
                    <el-select
                      v-model="itemSon.postId"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="(item, index) in enumList.postList"
                        :key="index"
                        :label="item.postName"
                        :value="item.postId"
                      />
                    </el-select>
                  </div>
                  <div style="flex: none; width: 120px">
                    <el-select
                      v-model="itemSon.inspectionFrequency"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="(
                          item, index
                        ) in enumList.inspectionFrequencyList"
                        :key="index"
                        :label="item.key"
                        :value="item.key"
                      />
                    </el-select>
                  </div>
                  <div>
                    <my-handle>
                      <span
                        v-if="i == item.measureStandardList.length - 1"
                        @click="addRow(item.measureStandardList, 'row')"
                      >添加标准</span>
                      <span
                        @click="del(item.measureStandardList, i, index)"
                      >删除</span>
                    </my-handle>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-form>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >提 交</myButton>
    </template>
  </myDialog>
</template>

<script>
import { Message } from 'element-ui'
import {
  add,
  measureType,
  enumList,
  list,
  measuresList,
  ledger,
  classificationListByType
} from '@/api/risk/measures'

export default {
  props: {
    title: {
      required: true,
      default() {
        return ''
      }
    },
    id: {
      required: false,
      default() {
        return null
      }
    },
    isDisabled: {
      required: false,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      loading: false,

      measureInfo: {},

      listQuery: {
        keyword: null,
        accidentId: null,
        measureClassification: null,
        measureType: null,
        riskPointId: null
      },
      dialogForm: [
        {
          riskPointId: null, // 风险单元（场所、区域）Id
          riskSourceId: null, // 风险源（点）Id
          accidentId: null, // 事故Id
          measureName: null, // 措施名称
          measureType: null, // 措施类型
          measureClassification: null, // 措施分类
          measureClassificationList: [],
          measureStandardList: [
            {
              inspectionFrequency: null, // 检查频率
              postId: null, // 责任人Id
              postName: null, // 责任人
              inspectionStandards: null, // 检查标准
              inspectionResults: null // 检查结果
            }
          ]
        }
      ],

      enumList: {}
    }
  },
  created() {
    this.getEnumList()
    this.loadData()
  },
  mounted() {},
  methods: {
    getEnumList() {
      enumList().then((res) => {
        this.enumList = res
      })
    },
    selectType(e, index) {
      const that = this

      classificationListByType({ code: e })
        .then((res) => {
          console.log(res)
          that.$nextTick(() => {
            that.dialogForm[index].measureClassification = null
            that.dialogForm[index].measureClassificationList = res
            that.$forceUpdate()
          })

          // that.tableList = res.list;
          // that.tableList.forEach((item) => {
          //   item.isExpand = false;
          // });
        })
        .finally(() => {
          that.loading = false
        })
    },
    loadData() {
      const that = this

      that.loading = true
      that.listQuery.accidentId = that.id

      list(that.listQuery)
        .then((res) => {
          console.log(res)
          that.measureInfo = res.riskMeasuresResponse
          that.dialogForm = res.list
          // that.tableList = res.list;
          // that.tableList.forEach((item) => {
          //   item.isExpand = false;
          // });
        })
        .finally(() => {
          that.loading = false
        })
    },

    addRow(dataList, type) {
      switch (type) {
        case 'row':
          dataList.push({
            inspectionFrequency: null, // 检查频率
            postId: null, // 责任人Id
            postName: null, // 责任人
            inspectionStandards: null, // 检查标准
            inspectionResults: null // 检查结果
          })
          break
        case 'table':
          dataList.push({
            riskPointId: null, // 风险单元（场所、区域）Id
            riskSourceId: null, // 风险源（点）Id
            accidentId: null, // 事故Id
            measureName: null, // 措施名称
            measureType: null, // 措施类型
            measureClassification: null, // 措施分类
            measureStandardList: [
              {
                inspectionFrequency: null, // 检查频率
                postId: null, // 责任人Id
                postName: null, // 责任人
                inspectionStandards: null, // 检查标准
                inspectionResults: null // 检查结果
              }
            ]
          })
          break

        default:
          break
      }
    },

    del(dataList, i, fatherIndex) {
      dataList.forEach((item, index) => {
        if (i == index) {
          dataList.splice(i, 1)
        }
      })

      if (dataList.length == 0) {
        this.dialogForm.forEach((item, index) => {
          if (fatherIndex == index) {
            this.dialogForm.splice(fatherIndex, 1)
          }
        })
      }
    },

    submitForm(formName) {
      const that = this
      if (that.loading) {
        return
      }
      that.loading = true

      if (that.dialogForm && that.dialogForm.length) {
        that.dialogForm.forEach((item) => {
          item.riskPointId = that.measureInfo.riskPointId
          item.riskSourceId = that.measureInfo.riskSourceId
          item.accidentId = that.measureInfo.accidentId
        })
      }

      add(that.dialogForm)
        .then((res) => {
          that.loading = false
          Message({
            type: 'success',
            message: '操作成功'
          })
          this.$emit('close', { reload: true })
        })
        .catch(() => {
          that.loading = false
        })
    },

    // 取消
    cancel(done) {
      this.$emit('close', {})
    }
  }
}
</script>

<style lang="less" scoped>
.info {
  display: flex;
  align-items: center;
  & > div {
    display: flex;
    align-items: center;
    margin-right: 90px;
    font-size: 14px;
    .label {
      display: flex;
      align-items: center;
      color: #999999;
      img {
        margin-right: 8px;
      }
    }
    span {
      margin-left: 8px;
      color: #262626;
    }
  }
}

.line {
  height: 16px;
  background: #f0f2f5;
  margin: 32px 0;
}

.table-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  span {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
  }
}

.table-list {
  height: 50vh;
  overflow: auto;
  li {
    border: 1px solid rgba(0, 0, 0, 0.16);
    .thead {
      display: flex;
      align-items: center;
      height: 50px;
      background: rgba(0, 0, 0, 0.02);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      & > div {
        padding: 0 10px;
        font-size: 14px;
        font-weight: bold;
        color: #000000;
        flex: 1;
      }
      & > div:not(:last-child) {
        border-right: 1px solid rgba(0, 0, 0, 0.06);
      }

      & > div:first-child {
        flex: none;
        width: 50px;
        text-align: center;
      }
      & > div:last-child {
        flex: none;
        width: 130px;
        text-align: center;
      }
    }
    .tbody {
      background: #fff;
      & > div:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      & > div {
        display: flex;
        align-items: center;
        height: 50px;
        & > div {
          padding: 0 10px;
          font-size: 14px;
          flex: 1;
        }

        & > div:first-child {
          flex: none;
          width: 50px;
          text-align: center;
        }

        & > div:last-child {
          flex: none;
          width: 130px;
          text-align: center;
        }
      }
    }
  }
  li:not(:last-child) {
    margin-bottom: 24px;
  }
}
.classification {
  display: flex;
  grid-gap: 10px;
  min-width: 250px;
}

/** 输入框、下拉框的宽度 **/
/deep/.el-cascader,
/deep/.el-select,
/deep/.el-input-number,
/deep/.el-date-editor,
/deep/.el-input {
  width: 100% !important;
}
</style>
