<template>
  <myDialog
    :title="title"
    width="500px"
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
        <el-col :span="24">
          <el-form-item v-if="!isEnt" label="父级部门：" prop="entId">
            <treeselect
              v-model="dialogForm.parentId"
              :single="true"
              :options="orgTreeLists"
              placeholder="请选择企业或部门"
              :normalizer="treeSelectNormalizer"
              :show-count="true"
              no-results-text="未找到相关结果"
              no-options-text="没有可选择的数据"
              @select="selectDep($event)"
            />
          </el-form-item>

          <el-form-item label="部门名称：" prop="depName">
            <el-input
              v-model="dialogForm.depName"
              type="text"
              clearable
              placeholder="部门名称"
              maxlength="20"
            />
          </el-form-item>

          <el-form-item label="是否安全机构：" prop="isSafety">
            <el-select
              v-model="dialogForm.isSafety"
              placeholder="请选择~"
              clearable
              filterable
            >
              <el-option
                v-for="item in yesOrNoList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位配置：" prop="postIdList">
            <el-checkbox-group v-model="dialogForm.postIdList">
              <el-checkbox
                v-for="(item, index) in postList"
                :key="index"
                :label="item.postId"
                name="postName"
              >{{ item.postName }}</el-checkbox>
            </el-checkbox-group>
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
  </myDialog>
</template>
<script>
import { detail, add, edit, enumList } from '@/api/department'
import { treeList } from '@/api/department'
import treeselect from '@riophae/vue-treeselect'
export default {
  components: { treeselect },
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return '提示'
      }
    },
    id: {
      required: false,
      default() {
        return null
      }
    },
    pid: {
      required: false,
      default() {
        return ''
      }
    },
    isEnt: {
      required: false,
      default() {
        return ''
      }
    },
    treetype: {
      required: false,
      default() {
        return 'add'
      }
    }
  },
  data() {
    return {
      // 登录用户
      seesionLoginUser: JSON.parse(sessionStorage.getItem('loginUser') || '{}'),
      loading: false,
      dialogForm: {
        depName: '',
        postIdList: []
      },
      postList: [],
      yesOrNoList: [],
      orgTreeLists: [],

      entId: null,
      formRules: {
        depName: [
          {
            required: true,
            message: '请输入部门名字',
            trigger: ['blur']
          }
        ]
      }
    }
  },
  async created() {
    await this.gettreelist()
    await this.loadData()
    await this.getenumList()
  },
  methods: {
    cancel(done) {
      this.$emit('close', {})
    },
    selectDep(data) {
      if (data.isEnt !== 1) {
        this.dialogForm.parentId = data.id
        this.dialogForm.entId = data.entId
      }
      this.dialogForm.entId = data.id
    },
    getenumList() {
      enumList().then((res) => {
        this.yesOrNoList = res.yesOrNoList
        this.postList = res.postList
      })
    },
    gettreelist() {
      const entId = this.seesionLoginUser.entId
      treeList({ entId: entId }).then((res) => {
        this.orgTreeLists = res
      })
    },
    loadData() {
      this.loading = true
      detail({ depId: this.id })
        .then((res) => {
          this.loading = false
          if (this.treetype == 'add') {
            if (this.isEnt !== 1) {
              this.dialogForm.parentId = res.entity.depId
              this.dialogForm.entId = res.entity.entId
            } else {
              this.dialogForm.entId = this.pid
              this.dialogForm.parentId = this.id
            }
          } else {
            this.dialogForm = res.entity
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    submitForm() {
      const that = this
      console.log(this.dialogForm)
      if (that.loading) {
        return
      }
      if (that.isEnt) {
        that.dialogForm.parentId = null
      }
      if (!that.isEnt && !this.dialogForm.parentId) {
        this.$message.error('请选择部门')
        return
      }
      that.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          if (this.treetype == 'add') {
            add(that.dialogForm)
              .then((res) => {
                that.loading = false
                that.$message({
                  type: 'success',
                  message: '新增成功'
                })
                that.$emit('close', { reload: true })
              })
              .catch(() => {
                that.loading = false
              })
          } else {
            edit(that.dialogForm)
              .then((res) => {
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
