<template>
  <myDialog
    :title="title"
    width="1000px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'10vh'"
  >
    <el-form ref="dialogForm" :model="dialogForm" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="操作名称：">
            <el-input v-model="dialogForm.operationName" readonly />
          </el-form-item>
          <el-form-item label="操作类型：">
            <el-input v-model="dialogForm.operationType" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IP地址：">
            <el-input v-model="dialogForm.ipAddress" readonly />
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-input v-model="dialogForm.addTime" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          size="small"
          border
        >
          <el-table-column label="数据项">
            <template slot-scope="scope">
              <div :style="scope.row.color == true ? 'color:red' : ''">
                {{ scope.row.code }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="更改之前">
            <template slot-scope="scope">
              <div :style="scope.row.color == true ? 'color:red' : ''">
                {{ scope.row.originalData }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="更改之后">
            <template slot-scope="scope">
              <div :style="scope.row.color == true ? 'color:red' : ''">
                {{ scope.row.operationData }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
    </template>
  </myDialog>
</template>

<script>
import { Message } from 'element-ui'
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return null
      }
    },
    editData: {
      required: true,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogForm: {},
      tableData: []
    }
  },
  mounted() {
    this.dialogForm = this.editData
    this.getData()
  },

  methods: {
    getData() {

      const originalData = JSON.parse(this.dialogForm.originalData)
      const operationData = JSON.parse(this.dialogForm.operationData)
      const keys = JSON.parse(this.dialogForm.beanChineseDesc)

      for (const key in keys) {
        this.tableData.push({
          code: keys[key],
          originalData: originalData[key] || null,
          operationData: operationData[key],
          color: false
        })
      }
      this.tableData.forEach((itemSon) => {
        if (itemSon.operationData !== itemSon.originalData) {
          itemSon.color = true
        }
      })
    },

    cancel(done) {
      this.$emit('close', {})
    }
  }
}
</script>

<style lang="less" scoped>
.footer-item {
  text-align: center !important;
}
/deep/ th {
  color: #000;
}
/deep/ .el-dialog {
  min-height: 80vh;
}
</style>
