<template>
  <myDialog
    :title="title"
    width="530px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'20vh'"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="120px"
    >
      <el-row :gutter="20">
        <!-- <el-col :span="15"> -->
        <el-form-item label="计划名称：" prop="taskName">
          <el-input
            v-model="task.taskName"
            type="text"
            disabled
            class="input-default"
            placeholder="计划名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="计划执行时间：" prop="taskTime">
          <el-date-picker
            v-model="task.time"
            disabled
            class="input-default"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="任务名称：" prop="detailName">
          <el-input
            v-model="dialogForm.detailName"
            type="text"
            class="input-default"
            placeholder="计划名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="执行时间：" prop="time">
          <el-date-picker
            v-model="dialogForm.time"

            class="input-default"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item label="计划状态：" prop="detailState">
          <el-select
            v-model="dialogForm.detailState"
            filterable
            class="input-default"
            placeholder="请选择"
          >
            <el-option
              v-for="item in taskStateList"
              :key="item.value"
              :label="item.key"
              :value="item.key"
            />
          </el-select>

        </el-form-item>

      </el-row>

    </el-form>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      <myButton
        :type="'confirm'"
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >
        提 交
      </myButton>
    </template>

  </myDialog>
</template>

<script>
import { detail, edit, add } from '@/api/hazard/taskDetail'
import { enumList } from '@/api/hazard/task'

import { Message } from 'element-ui'

export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return '编辑任务'
      }
    },
    id: {
      type: String,
      required: false,
      default() {
        return null
      }
    },
    taskId: {
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
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogForm: {

      },
      task: {},
      lookupUserShow: false,
      lookupThirdPartyShow: false,

      formRules: {
        detailName: [
          { required: true, message: '请输入任务名称！', trigger: 'blur' },
          {
            max: 50,
            message: '任务名称长度不能大于50',
            trigger: ['blur', 'change']
          }
        ],

        time: [
          {
            required: true,
            message: '请选择执行时间！',
            trigger: ['blur', 'change']
          }
        ],

        detailState: [
          {
            required: true,
            message: '请选择计划状态！',
            trigger: ['change']
          }
        ]

      },

      taskTypeList: [],
      inspectTypeList: [],

      yesOrNoList: [],

      taskStateList: []
    }
  },
  created() {
    this.getEnumList()

    this.loadData()
  },
  methods: {
    getEnumList() {
      const that = this
      that.loading = true
      enumList()
        .then((res) => {
          that.loading = false

          that.taskStateList = res.taskStateList
        })
        .catch(() => {
          that.loading = false
        })
    },
    // 根据id加载数据
    loadData() {
      const that = this
      that.loading = true
      console.log(this.id)
      detail({ detailId: this.id, taskId: this.taskId })
        .then((res) => {
          that.loading = false
          that.task = res.hazardTask
          that.dialogForm = res.hazardTaskDetail

          that.dialogForm.taskId = that.taskId
        })
        .catch(() => {
          that.loading = false
        })
    },

    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this
      console.log(that.dialogForm)
      if (that.loading) {
        return
      }
      if (that.dialogForm.time.length > 0) {
        that.dialogForm.executeStart = that.dialogForm.time[0]
        that.dialogForm.executeEnd = that.dialogForm.time[1]
      }
      if (that.dialogForm.time.length > 0) {
        that.dialogForm.executeStart = that.dialogForm.time[0]
        that.dialogForm.executeEnd = that.dialogForm.time[1]
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          if (that.id) {
            edit(that.dialogForm)
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
          } else {
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
          }
        } else {
          return false
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
.input-default textarea {
  height: 44vh;
}
</style>
