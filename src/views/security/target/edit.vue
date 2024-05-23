<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="600px">
    <el-form ref="dialogForm" v-loading="loading" style="min-height: 100%" :model="dialogForm" :rules="formRules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="目标计划标题：" prop="planName">
            <el-input v-model="dialogForm.planName" type="text" placeholder="请输入岗位名称" clearable maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年份：" prop="planYear">
            <el-select v-model="dialogForm.planYear" placeholder="请选择年份" clearable filterable>
              <el-option v-for="item in planYearList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="目标计划内容：" prop="planContent">
            <el-input v-model="dialogForm.planContent" placeholder="请输入目标计划内容" clearable maxlength="500" type="textarea"
              :rows="3" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton :loading="loading" @click.native="submit('dialogForm')">
        提 交
      </myButton>
    </template>
  </myDrawer>
</template>

<script>
import {
  enumList,
  detail,
  edit,
  add
} from '@/api/security/targetplan'
export default {
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
    },
    targetId: {
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,
      dialogForm: {},
      formRules: {
        planName: [
          { required: true, message: '请输入目标计划标题', trigger: 'blur' }
        ],
        planYear: [
          { required: true, message: '请选择年份', trigger: 'change' }
        ],
        planContent: [
          { required: true, message: '请输入目标计划内容', trigger: 'blur' }
        ],
      },
      planYearList: [],
      loginUser: {}
    }
  },
  async created() {
    this.loginUser = JSON.parse(sessionStorage.getItem('loginUser'))
    await this.getenumList()
    if (this.id) {
      await this.loadData()
    }
  },
  methods: {
    cancel(done) {
      this.$emit('close', {})
    },
    // 获取枚举
    getenumList() {
      const that = this
      enumList().then(res => {
        that.planYearList = res.planYearList
      })
    },
    loadData() {
      const that = this
      that.loading = true
      detail({ id: that.id })
        .then(res => {
          console.log(res)
          that.dialogForm = res
          // that.dialogForm = JSON.parse(JSON.stringify(that.dialogForm))
        })
        .finally(() => {
          that.loading = false
        })
    },
    submit() {
      const that = this
      if (that.loading) {
        return
      }
      that.$refs['dialogForm'].validate(valid => {
        if (valid) {
          that.loading = true
          if (that.id) {
            edit(that.dialogForm)
              .then(res => {
                that.loading = false
                that.$message({
                  type: 'success',
                  message: '修改成功'
                })
                that.$emit('close', { reload: true })
              })
              .catch(() => {
                that.loading = false
              })
          } else {
            that.dialogForm.entId = that.loginUser.entId
            that.dialogForm.targetId = that.targetId
            add(that.dialogForm)
              .then(res => {
                that.loading = false
                that.$message({
                  type: 'success',
                  message: '添加成功'
                })
                that.$emit('close', { reload: true })
              })
              .catch(() => {
                that.loading = false
              })
          }
        }
      })
    }
  }
}
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
</style>
