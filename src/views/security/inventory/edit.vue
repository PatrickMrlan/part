<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="600px">
    <el-form
      ref="dialogForm"
      v-loading="loading"
      style="min-height: 100%"
      :model="dialogForm"
      :rules="formRules"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="岗位名称：" prop="postName">
            <el-input
              v-model="dialogForm.postName"
              type="text"
              placeholder="请输入岗位名称"
              clearable
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位层级：" prop="postLevel">
            <el-select
              v-model="dialogForm.postLevel"
              placeholder="请选择岗位层级"
              clearable
              filterable
            >
              <el-option
                v-for="item in postLevelList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="履职清单：" prop="performance">
            <el-input
              v-model="dialogForm.performance"
              placeholder="请输入履职清单"
              clearable
              maxlength="200"
              type="textarea"
              :rows="3"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="责任清单：" prop="duty">
            <el-input
              v-model="dialogForm.duty"
              placeholder="请输入责任清单"
              clearable
              maxlength="200"
              type="textarea"
              :rows="3"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任人：" prop="userIdList">
            <el-select
              v-model="dialogForm.userIdList"
              placeholder="请选择责任人"
              clearable
              multiple
              collapse-tags
              filterable
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="完成情况：" prop="completionStatus">
            <el-select
              v-model="dialogForm.completionStatus"
              placeholder="请选择完成情况"
              clearable
            >
              <el-option
                v-for="item in completionStatusList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
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
  userlist,
  enumList,
  detail,
  edit,
  add
} from '@/api/security/inventory'
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
    }
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,
      dialogForm: {},
      formRules: {
        postName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        postLevel: [
          { required: true, message: '请选择岗位级别', trigger: 'change' }
        ],
        performance: [
          { required: true, message: '请输入履职清单', trigger: 'blur' }
        ],
        userIdList: [
          { required: true, message: '请选择责任人', trigger: 'change' }
        ],
        completionStatus: [
          { required: true, message: '请选择完成情况', trigger: 'change' }
        ],
        duty: [
          { required: true, message: '请输入岗位职责', trigger: 'blur' }
        ]
      },
      completionStatusList: [],
      postLevelList: [],
      userList: [], // 责任人列表
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
        that.completionStatusList = res.completionStatusList
        that.postLevelList = res.postLevelList
      })
      userlist({
        pageIdnex: 1,
        pageSize: 9999,
        entId: that.loginUser.entId
      }).then(res => {
        that.userList = res.page.records
      })
    },
    loadData() {
      const that = this
      that.loading = true
      detail({ id: that.id })
        .then(res => {
          console.log(res)
          that.dialogForm = res
          that.dialogForm = JSON.parse(JSON.stringify(that.dialogForm))
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
              .finally(() => {
                that.loading = false
              })
          } else {
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
