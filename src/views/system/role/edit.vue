<template>
  <myDialog
    :title="title"
    width="480px"
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
        <el-form-item label="角色名称：" prop="roleName">
          <el-input
            v-model="dialogForm.roleName"
            type="text"
            class="input-default"
            placeholder="角色名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="角色编码：" prop="roleCode">
          <el-input
            v-model="dialogForm.roleCode"
            type="text"
            class="input-default"
            placeholder="角色名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="角色编码：" prop="roleCode">
          <el-input
            v-model="dialogForm.roleCode"
            max="20"
            class="input-default"
            placeholder="角色编码"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item label="角色描述：" prop="remake">
          <el-input
            v-model="dialogForm.remake"
            type="textarea"
            :rows="6"
            max="50"
            class="input-default"
            placeholder="角色描述"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="9">
          <div style="height: 55vh; border: 1px solid #eeeeee; overflow: auto">
            <el-tree
              :data="appList"
              show-checkbox
              node-key="id"
              :expand-on-click-node="true"
              :default-expand-all="true"
              :props="defaultProps"
              :default-checked-keys="dialogForm.powerIds"
              @check-change="treeCheckChange"
            />
          </div>
        </el-col> -->
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
import { detail, edit, add } from '@/api/role'
import { Message } from 'element-ui'
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return '编辑角色'
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
      loading: false,
      appList: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleTypeList: [],
      dialogForm: {
        roleId: null,
        roleName: null,
        remake: null,
        isAdminRole: null,
        powerIds: []
      },
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称！', trigger: 'blur' },
          {
            max: 20,
            message: '角色名称长度不能大于20',
            trigger: ['blur', 'change']
          }
        ],
        remake: [
          {
            max: 50,
            message: '角色描述长度不能大于50',
            trigger: ['blur', 'change']
          }
        ],
        roleCode:[
        { required: true, message: '请输入角色编码！', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 根据id加载数据
    loadData() {
      const that = this
      that.loading = true
      console.log(this.id)
      detail({ roleId: this.id })
        .then((res) => {
          that.loading = false
          that.roleTypeList = res.cloudRoleTypeList
          that.dialogForm = {
            roleId: res.role.roleId,
            roleName: res.role.roleName,
            remake: res.role.remake,
            isAdminRole: res.role.isAdminRole,
            powerIds: []
          }

          that.appList = res.appList
          that.appList.forEach((item) => {
            item.name = item.appName
            item.children = item.menuList
            item.id = 'app' + item.id
            if (item.children.length > 0) {
              item.children.forEach((child1) => {
                child1.id = 'child1' + child1.id
                if (child1.children.length > 0) {
                  child1.children.forEach((child2) => {
                    child2.id = 'child2' + child2.id
                    if (child2.children.length > 0) {
                      child2.children.forEach((child3) => {
                        child3.id = 'child3' + child3.id
                        if (child3.sysMenuOperationalList.length > 0) {
                          child3.sysMenuOperationalList.forEach(op => {
                            if (op.isSelect) {
                              that.dialogForm.powerIds.push(op.id)
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
          console.log(that.appList)
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
      console.log(that.dialogForm.powerIds)
      if (that.loading) {
        return
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
