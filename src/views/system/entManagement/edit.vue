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
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="机构全称：" prop="entFullName">
            <el-input
              v-model.trim="dialogForm.entFullName"
              type="text"
              class="input-default"
              placeholder="机构全称"
              clearable
              @change="changeEntFullName"
            />
          </el-form-item>
          <el-form-item label="联系电话：" prop="contactTel">
            <el-input
              v-model.trim="dialogForm.contactTel"
              type="text"
              class="input-default"
              placeholder="联系电话"
              maxlength="20"
              clearable
            />
          </el-form-item>
          <el-form-item v-if="loginUser.isAdmin" label="机构类型：">
            <el-select
              v-model="dialogForm.entType"
              placeholder="请选择"
              filterable
              class="input-default"
            >
              <el-option
                v-for="(item, index) in entTypeList"
                :key="index"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="地址：" prop="address">
            <el-input
              v-model.trim="dialogForm.address"
              type="text"
              maxlength="100"
              class="input-default"
              placeholder="地址"
              clearable
            />
          </el-form-item>
          <el-form-item label="联系人：" prop="contact">
            <el-input
              v-model.trim="dialogForm.contact"
              type="text"
              maxlength="50"
              class="input-default"
              placeholder="联系人"
              clearable
            />
          </el-form-item>

        </el-col>

        <el-col :span="12">

          <el-form-item label="机构管理员：" prop="userNames">
            <el-input
              v-model="dialogForm.userNames"
              type="text"
              class="input-default"
              placeholder="机构管理员"
              @focus="lookupShow = !lookupShow"
            />
          </el-form-item>
          <el-form-item
            v-if="
              loginUser.isAdmin &&
                (dialogForm.entType === '企业' || dialogForm.entType === '1')
            "
            prop="platformId"
            label="所属集团："
          >
            <el-select
              v-model="dialogForm.platformId"
              placeholder="请选择"
              filterable
              class="input-default"
            >
              <el-option
                v-for="item in groupList"
                :key="item.entFullName"
                :label="item.entFullName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="排序：" prop="sort">
            <el-input
              v-model="dialogForm.sort"
              type="number"
              min="1"
              max="999"
              class="input-default"
              placeholder="排序"
            />
          </el-form-item>

          <el-form-item label="账号：" prop="account">
            <el-input
              v-model.trim="dialogForm.account"
              type="text"
              maxlength="50"
              class="input-default"
              placeholder="请输入账号"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="社会信用代码："
            prop="unifiedSocialCreditIdentifier"
          >
            <el-input
              v-model.trim="dialogForm.unifiedSocialCreditIdentifier"
              type="text"
              maxlength="50"
              class="input-default"
              placeholder="请输入社会信用代码"
              clearable
            />
          </el-form-item>
          <el-form-item label="开户银行：" prop="bankOfDeposit">
            <el-input
              v-model.trim="dialogForm.bankOfDeposit"
              type="text"
              maxlength="50"
              class="input-default"
              placeholder="请输入开户银行"
              clearable
            />
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

    <lookup
      v-if="lookupShow"
      :multiple="true"
      :show="lookupShow"
      :tags="tags"
      @close="lookupClose"
    />
  </myDialog>
</template>

<script>
import { detail, edit, add } from '@/api/system/entManagement'
import lookup from '../department/lookup.vue'
import { Message } from 'element-ui'
export default {
  components: { lookup },
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
    },
    width: {
      required: false,
      default() {
        return '1000'
      }
    }
  },
  data() {
    return {
      loading: false,
      lookupShow: false,

      menuList: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loginUser: JSON.parse(sessionStorage.getItem('loginUser')),
      entTypeList: [],
      groupList: [],
      dialogForm: {},
      formRules: {
        entFullName: [
          { required: true, message: '请输入机构全称！', trigger: 'blur' }
        ],
        entShortName: [
          { required: true, message: '请输入机构简称！', trigger: 'blur' }
        ],
        platformId: [
          { required: true, message: '请选择所属集团！', trigger: 'change' }
        ],
        contactTel: [
          { required: true, message: '请输入联系电话！', trigger: ['change', 'blur'] },
          {
            // pattern: /^(0|86|17951)?(1)[0-9]{10}$/ || /^[0][1-9]{2,3}-[0-9]{5,10}$/,
            pattern: /^(0\d{2,3}-\d{7,8})|(0\d{10,11})|(1\d{10})$/,
            message: '请输入正确的联系电话',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {

    changeEntFullName() {
      this.dialogForm.entShortName = this.dialogForm.entFullName
    },

    // 根据id加载数据
    loadData() {
      const that = this
      that.loading = true
      console.log(that.id)
      detail({ id: that.id })
        .then((res) => {
          that.loading = false
          that.dialogForm = res.entity
          that.entTypeList = res.entTypeList
          that.groupList = res.groupList
        })
        .catch(() => {
          that.loading = false
        })
    },
    check() {
      this.lookupShow = true
    },
    /**
     * 用户选择带回
     */
    lookupClose(data) {
      console.log(data)
      const that = this
      that.lookupShow = false

      if (data.length) {
        that.dialogForm.userIdList = data.map((item) => item.userId)
        that.dialogForm.userNames = data.map((item) => item.userName).join(',')
      }
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
