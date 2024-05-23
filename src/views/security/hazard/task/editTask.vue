<template>
  <myDialog
    :title="title"
    width="1000px"
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
      label-width="140px"
    >
      <el-row :gutter="20">
        <!-- <el-col :span="15"> -->

        <el-col :span="12">
          <el-form-item label="计划名称：" prop="taskName">
            <el-input
              v-model="dialogForm.taskName"
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
          <el-form-item v-if="dialogForm.inspectType == '督导巡查' || dialogForm.inspectType == '园区监督检查'" label="是否委托第三方：" prop="isEntrust">
            <el-select
              v-model="dialogForm.isEntrust"
              filterable
              class="input-default"
              placeholder="请选择"
            >
              <el-option
                v-for="item in yesOrNoList"
                :key="item.value"
                :label="item.key"
                :value="item.key"
              />
            </el-select>

          </el-form-item>
          <el-form-item label="负责人：" prop="principalName">
            <el-input
              v-model="dialogForm.principalName"
              class="input-normal"
              readonly
              placeholder="请选择"
              maxlength="100"
            />
            <el-button type="primary" @click.native="checkUser">选 择</el-button>
            <el-button type="danger" @click.native="deleteUser">清 除</el-button>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划类型：" prop="taskType">
            <el-select
              v-model="dialogForm.taskType"
              filterable
              class="input-default"
              placeholder="请选择"
            >
              <el-option
                v-for="item in taskTypeList"
                :key="item.value"
                :label="item.key"
                :value="item.key"
              />
            </el-select>

          </el-form-item>

          <el-form-item label="检查类型：" prop="inspectType">
            <el-select
              v-model="dialogForm.inspectType"
              :disabled="loginUser.userType==='企业'"
              filterable
              class="input-default"
              placeholder="请选择"
            >
              <el-option
                v-for="item in inspectTypeList"
                :key="item.value"
                :label="item.key"
                :value="item.key"
              />
            </el-select>

          </el-form-item>
          <el-form-item v-if="dialogForm.isEntrust == '是' " label="第三方机构：" prop="entrustEntName">
            <el-input
              v-model="dialogForm.entrustEntName"
              class="input-normal"
              readonly
              placeholder="请选择"
              maxlength="50"
            />
            <el-button type="primary" @click.native="checkThirdParty">选 择</el-button>
            <el-button type="danger" @click.native="deleteThirdParty">清 除</el-button>

          </el-form-item>

          <el-form-item label="计划状态：" prop="taskState">
            <el-select
              v-model="dialogForm.taskState"
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

        </el-col>

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
    <lookupUser
      v-if="lookupUserShow"
      :multiple="false"
      :show="lookupUserShow"
      :is-task="1"
      @close="lookupUserClose"
    />
    <lookupThirdParty
      v-if="lookupThirdPartyShow"
      :multiple="false"
      :show="lookupThirdPartyShow"
      @close="lookupThirdPartyClose"
    />
  </myDialog>
</template>

<script>
import { detail, edit, add, enumList } from '@/api/hazard/task'
import { Message } from 'element-ui'
import lookupUser from './lookupUser.vue'
import lookupThirdParty from './lookupThirdParty.vue'

export default {
  components: { lookupUser, lookupThirdParty },
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return '编辑计划'
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
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogForm: {

      },
      loginUser: JSON.parse(sessionStorage.getItem('loginUser') || '{}'),

      lookupUserShow: false,
      lookupThirdPartyShow: false,

      formRules: {
        taskName: [
          { required: true, message: '请输入计划名称！', trigger: 'blur' },
          {
            max: 50,
            message: '计划名称长度不能大于50',
            trigger: ['blur', 'change']
          }
        ],
        taskType: [
          {
            required: true,
            message: '请选择计划类型！',
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
        inspectType: [
          {
            required: true,
            message: '请选择检查类型！',
            trigger: ['blur', 'change']
          }
        ],
        entrustEntName: [
          {
            required: true,
            message: '请选择第三方机构！',
            trigger: ['change']
          }
        ],
        taskState: [
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
          that.taskTypeList = res.taskTypeList
          that.inspectTypeList = res.inspectTypeList

          that.yesOrNoList = res.yesOrNoList
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
      detail({ taskId: this.id })
        .then((res) => {
          that.loading = false

          that.dialogForm = res
        })
        .catch(() => {
          that.loading = false
        })
    },
    checkUser() {
      this.lookupUserShow = true
    },
    /**
     * 用户选择带回
     */
    lookupUserClose(data, flag) {
      console.log(data)
      const that = this
      that.lookupUserShow = false
      that.dialogForm.principalId = null

      if (data.length > 0) {
        that.dialogForm.principalId = data[0].userId
        that.dialogForm.principalName = data[0].userName
      }
    },
    deleteUser() {
      const that = this

      that.dialogForm.principalId = null
      that.dialogForm.principalName = null
      that.$forceUpdate()
    },

    checkThirdParty() {
      this.lookupThirdPartyShow = true
    },
    /**
     * 用户选择带回
     */
    lookupThirdPartyClose(data, flag) {
      console.log(data)
      const that = this
      that.lookupThirdPartyShow = false
      that.dialogForm.entrustEntId = null

      if (data.length > 0) {
        that.dialogForm.entrustEntId = data[0].thirdPartyId
        that.dialogForm.entrustEntName = data[0].thirdPartyName
      }
    },
    deleteThirdParty() {
      const that = this

      that.dialogForm.entrustEntId = null
      that.dialogForm.entrustEntName = null
      that.$forceUpdate()
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
