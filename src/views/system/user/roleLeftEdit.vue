<template>
  <el-dialog
    :title="title"
    width="500px"
    class="dialog-form"
    :visible="true"
    :before-close="cancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :destroy-on-close="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    top="20vh"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <!-- <el-col :span="15"> -->
          <el-form-item label="角色名称：" prop="roleName">
            <el-input v-model="dialogForm.roleName" type="text" class="input-default" placeholder="角色名称" maxlength="10" />
          </el-form-item>
          <el-form-item label="角色类型：" prop="roleType">
            <el-select v-model="dialogForm.roleType" placeholder="请选择" filterable class="input-default">
              <el-option v-for="(item,i) in roleTypeList" :key="i" :value="item.value" :label="item.key">{{ item.key }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色描述：" prop="description">
            <el-input v-model="dialogForm.description" type="textarea"
:rows="6" max="50"  class="input-default" placeholder="角色描述" maxlength="50" show-word-limit />
          </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="9">
          <div style="height:55vh;border:1px solid #EEEEEE;overflow:auto">
            <el-tree
              :data="menuList"
              show-checkbox
              node-key="id"
              :expand-on-click-node="true"
              :default-expand-all="true"
              :props="defaultProps"
              :default-checked-keys="dialogForm.menuOperIdList"
              @check-change="treeCheckChange"
            />
          </div>
        </el-col> -->
      </el-row>

      <div class="footer-item">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm('dialogForm')">
          提 交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { detail, edit } from '../../../api/role'
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
      menuList: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleTypeList: [],
      dialogForm: {
        roleId: null,
        roleName: null,
        description: null,
        roleType: null,
        menuOperIdList: []
      },
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称！', trigger: 'blur' },
          { max: 20, message: '角色名称长度不能大于20', trigger: ['blur', 'change'] }
        ],
        description: [
          { max: 50, message: '角色描述长度不能大于50', trigger: ['blur', 'change'] }
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
      detail({ roleId: this.id }).then(res => {
        that.loading = false
        that.roleTypeList = res.roleTypeList
        that.dialogForm = {
          roleId: res.sysRole.roleId,
          roleName: res.sysRole.roleName,
          description: res.sysRole.description,
          roleType: res.sysRole.roleType,
          menuOperIdList: []
        }

        for (const i in res.menuList) {
          that.setOperChildren(res.menuList[i])
        }
        that.menuList = res.menuList
      }).catch(() => {
        that.loading = false
      })
    },
    setOperChildren(item) {
      if (item.children.length > 0) {
        for (let i = 0; i < item.children.length; i++) {
          this.setOperChildren(item.children[i])
        }
      } else if (item.sysMenuOperationalList != null && item.sysMenuOperationalList.length > 0) {
        for (let j = 0; j < item.sysMenuOperationalList.length; j++) {
          item.children.push({
            id: item.sysMenuOperationalList[j].menuOperId,
            name: item.sysMenuOperationalList[j].operName
          })
          if (item.sysMenuOperationalList[j].isSelect) {
            this.dialogForm.menuOperIdList.push(item.sysMenuOperationalList[j].menuOperId)
          }
        }
        return
      } else {
        return
      }
    },
    treeCheckChange(data, ischeck, children) {
      if (ischeck) {
        this.dialogForm.menuOperIdList.push(data.id)
      } else {
        const index = this.dialogForm.menuOperIdList.indexOf(data.id)
        if (index > -1) {
          this.dialogForm.menuOperIdList.splice(index, 1)
        }
      }
    },
    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this
      console.log(that.dialogForm);
      if (that.loading) {
        return
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          edit(that.dialogForm).then(res => {
            that.loading = false
            Message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('close', { reload: true })
          }).catch(() => {
            that.loading = false
          })
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
// .input-default textarea{
//   height: 44vh;
// }
</style>
