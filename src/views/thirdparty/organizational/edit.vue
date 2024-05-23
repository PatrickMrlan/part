<template>
  <myDialog
    :title="title"
    width="900px"
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
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- <el-form-item label="选择第三方：" prop="thirdPartyId">
            <el-select
              v-model="dialogForm.thirdPartyId"
              filterable
              class="input-default"
              placeholder="请选择"
              @change="nodeClick(dialogForm.thirdPartyId)"
            >
              <el-option
                v-for="item in entList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->

          <el-form-item label="姓名：" prop="userName">
            <el-input
              v-model="dialogForm.userName"
              type="text"
              class="input-default"
              placeholder="姓名"
              maxlength="20"
              clearable
            />
          </el-form-item>

          <el-form-item label="登录账号：" prop="loginCode">
            <el-input
              v-model="dialogForm.loginCode"
              type="text"
              max="20"
              class="input-default"
              placeholder="登录账号"
              maxlength="20"
              autocomplete="off"
              clearable
            />
          </el-form-item>

          <el-form-item label="办公电话：" prop="officeTel">
            <el-input
              v-model="dialogForm.officeTel"
              type="text"
              placeholder="办公电话"
              maxlength="11"
            />
          </el-form-item>

          <el-form-item label="人员身份：" prop="userIdentity">
            <el-select
              v-model="dialogForm.userIdentity"
              placeholder="人员身份"
              clearable
              filterable
            >
              <el-option
                v-for="item in userIdentityList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="
              dialogForm.userIdentity == 4 || dialogForm.userIdentity == '专家'
            "
            label="专家级别："
            prop="levelTypeValues"
          >
            <el-select
              v-model="dialogForm.levelTypeValues"
              multiple
              collapse-tags
              placeholder="请选择专家级别"
              clearable
              filterable
              class="input-normal"
            >
              <el-option
                v-for="item in expertLevelList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="部门选择：">
            <treeselect
              v-model="dialogForm.depIdList"
              :multiple="true"
              :close-on-select="true"
              :options="depList"
              :default-expand-level="1"
              :normalizer="treeSelectNormalizer"
              :limit="3"
              :limit-text="(count) => `+${count}`"
              no-results-text="未找到相关结果"
              no-options-text="没有可选择的数据"
              placeholder="请选择部门"
            />
          </el-form-item>

          <el-form-item label="手机号码：" prop="userTel">
            <el-input
              v-model="dialogForm.userTel"
              type="text"
              placeholder="手机号码"
              maxlength="11"
              clearable
            />
          </el-form-item>

          <el-form-item label="登录密码：" prop="loginPass">
            <el-input
              v-model="dialogForm.loginPass"
              type="password"
              max="20"
              class="input-default"
              placeholder="登录密码"
              :show-password="true"
              maxlength="20"
              clearable
              autocomplete="new-password"
            />
          </el-form-item>

          <el-form-item
            v-show="dialogForm.loginPass"
            label="重复密码："
            prop="repeatPassword"
          >
            <el-input
              v-model="dialogForm.repeatPassword"
              type="password"
              max="20"
              class="input-default"
              placeholder="重复密码"
              :show-password="true"
              maxlength="20"
              clearable
              autocomplete="new-password"
            />
          </el-form-item>
        </el-col>

        <el-col v-if="roleList.length > 0" :span="24">
          <el-form-item label="角色配置：" prop="roleIdList">
            <el-checkbox-group v-model="dialogForm.roleIdList">
              <el-checkbox
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.roleId"
                name="roleName"
                >{{ item.roleName }}</el-checkbox
              >
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
import {
  detail,
  enumList,
  edit,
  add,
  depTreeList,
} from "@/api/thirdparty/institution";
import { list } from "@/api/department";
import { list as roleList } from "@/api/role";
import treeselect from "@riophae/vue-treeselect";
import json from "../../../assets/json/addressData.json";
import { validatePassword } from "@/utils/validate";

export default {
  components: { treeselect },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "编辑用户";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
    entId: {
      type: Number,
      required: false,
      default() {
        return null;
      },
    },
    entDep: {
      type: Object,
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    const validateCofirmPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.dialogForm.loginPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 登录用户
      seesionLoginUser: JSON.parse(sessionStorage.getItem("loginUser") || "{}"),
      loading: false,
      defaultProps: {
        children: "children",
        label: "name",
      },
      entList: [],
      depList: [],
      loginUser: JSON.parse(sessionStorage.getItem("loginUser")),
      dialogForm: {},
      formRules: {
        loginCode: [
          { required: true, message: "请输入登录账号！", trigger: "blur" },
        ],
        loginPass: [
          {
            required: false,
            validator: (rule, value, callback) => {
              validatePassword(rule, value, callback, false, [""]);
            },
            trigger: "change",
          },
        ],
        repeatPassword: [
          { required: true, validator: validateCofirmPass, trigger: "blur" },
        ],
        userTel: [
          { required: true, message: "请输入手机号码！", trigger: "blur" },
          {
            pattern: /^(1\d{10})$/,
            message: "请输入正确的手机号码",
            trigger: "change",
          },
        ],
      },
      userIdentityList: [],
      roleList: [],
      expertLevelList: [],
      selectedList: [], // 选中数据（数组）
    };
  },
  async created() {
    this.options_ = json;
    await this.loadData();
    await this.gettreelist();
    await this.getEnumList();
    await this.getrolelist();
  },
  methods: {
    gettreelist() {
      depTreeList().then((res) => {
        // const idx = this.findIndex(res,"id",this.seesionLoginUser.sysPark.thirdPartyId);
        this.entList = res;
      });
    },
    getrolelist() {
      roleList().then((res) => {
        this.roleList = res.records;
      });
    },
    getEnumList() {
      const that = this;
      that.loading = true;
      // 获取枚举列表
      enumList()
        .then((res) => {
          that.loading = false;
          that.userIdentityList = res.userIdentityList;
          that.expertLevelList = res.expertLevelList;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    cancel(done) {
      this.$emit("close", {});
    },
    findIndex(arr, key, value) {
      return arr.findIndex((obj) => obj[key] === value);
    },
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: that.id })
        .then((res) => {
          console.log(res);
          that.dialogForm = res;
          that.dialogForm.repeatPassword = that.dialogForm.loginPass;
          if (res.userId != null) {
            that.dialogForm.thirdPartyId = res.thirdPartyId;
            that.dialogForm.depIdList = res.depIdList;
          } else {
            that.dialogForm.thirdPartyId = this.entDep.isEnt
              ? this.entDep.id
              : this.entDep.thirdPartyId || this.loginUser.thirdPartyId;
            that.dialogForm.depIdList = this.entDep.isEnt
              ? null
              : [this.entDep.id] || [this.loginUser.depId];
          }
          this.getSelectDepList(this.dialogForm.thirdPartyId);
          that.loading = false;

          // roleList({ userId: res.userId }).then(res => {
          //   console.log(res);
          //   this.roleList = res;
          // });
        })
        .catch(() => {
          that.loading = false;
        });
    },
    nodeClick(data) {
      this.getSelectDepList(data);
    },
    // 获取下拉树的数据
    getSelectDepList(val) {
      list({ entId: val }).then((res) => {
        this.depList = res;
        console.log(this.depList);
      });
    },
    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      // console.log(node)
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    /**
     * 数据提交
     */
    submitForm(formName) {
      // console.log(this.dialogForm);
      const that = this;
      if (that.loading) {
        return;
      }
      if (!that.depList.length) {
        that.dialogForm.depIdList = [];
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", { reload: true });
              })
              .catch((error) => {
                that.$message({
                  type: "warning",
                  message: error.message,
                });
                that.loading = false;
              });
          } else {
            add(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", { reload: true });
              })
              .catch((error) => {
                that.$message({
                  type: "warning",
                  message: error.message,
                });
                that.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
  },
};
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
