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
          <el-form-item label="姓名：" prop="name">
            <el-input
              v-model="dialogForm.name"
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
              auto-complete="new-password"
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
              maxlength="16"
              clearable
              show-password
              auto-complete="new-password"
            />
          </el-form-item>

          <el-form-item label="专职/兼职：" prop="jobNature">
            <el-select
              v-model="dialogForm.jobNature"
              placeholder="专职/兼职"
              class="input-lsmall"
              clearable
              filterable
            >
              <el-option
                v-for="item in jobNatureList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="人员类型：" prop="workType">
            <el-select
              v-model="dialogForm.workType"
              placeholder="人员类型"
              clearable
              filterable
              @change="workTypeChange"
            >
              <el-option
                v-for="item in workTypeList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-show="jobShow" label="作业类型：" prop="jobType">
            <el-select
              v-model="dialogForm.jobType"
              placeholder="作业类型"
              clearable
              filterable
            >
              <el-option
                v-for="item in jobTypeList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="部门选择：" prop="depIdList">
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

          <el-form-item label="手机号码：" prop="tel">
            <el-input
              v-model="dialogForm.tel"
              type="text"
              placeholder="手机号码"
              clearable
              maxlength="11"
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
              clearable
              show-password
              class="input-default"
              placeholder="重复密码"
              maxlength="16"
              auto-complete="new-password"
            />
          </el-form-item>

          <el-form-item label="性别：" prop="sex">
            <el-select
              v-model="dialogForm.sex"
              placeholder="性别"
              clearable
              filterable
            >
              <el-option
                v-for="item in sexList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="dialogForm.birthday"
              class="input-default"
              type="date"
              clearable
              :value-format="'yyyy-MM-dd'"
              placeholder="选择日期"
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
import { detail, enumList, edit, add } from "@/api/security/institution";
import { list as treeList } from "@/api/department";
import { detail as entlist } from "@/api/user";
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
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        loginCode: [
          { required: true, message: "请输入管理账号！", trigger: "blur" },
        ],
        repeatPassword: [
          { required: true, validator: validateCofirmPass, trigger: "blur" },
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
        tel: [
          { required: true, message: "请输入手机号码！", trigger: "blur" },
          {
            pattern: /^(1\d{10})$/,
            message: "请输入正确的手机号码",
            trigger: "change",
          },
        ],
        workType: [
          { required: true, message: "请选择人员类型！", trigger: "change" },
        ],
      },
      jobNatureList: [],
      workTypeList: [],
      sexList: [],
      jobTypeList: [],
      jobShow: false,
      roleList: [],
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
      entlist().then((res) => {
        // const idx = this.findIndex(res.entList,'entId',this.seesionLoginUser.entId)
        // this.entList.push(res.entList[idx]);
        this.entList = res.entList;
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
          that.jobNatureList = res.jobNatureList;
          that.workTypeList = res.workTypeList;
          that.sexList = res.sexList;
          that.jobTypeList = res.jobTypeList;
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
          if (!that.dialogForm.birthday) {
            that.dialogForm.birthday = "";
          }
          if (res.userId != null) {
            that.dialogForm.entId = res.entId;
            that.dialogForm.depIdList = res.depIdList;
          } else {
            that.dialogForm.entId = this.entDep.isEnt
              ? this.entDep.id
              : this.entDep.entId || this.loginUser.entId;
            that.dialogForm.depIdList = this.entDep.isEnt
              ? null
              : [this.entDep.id] || [this.loginUser.depId];
          }

          this.getSelectDepList(this.dialogForm.entId);
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
    // 特种作业选择
    workTypeChange() {
      if (this.dialogForm.workType === 2) {
        this.jobShow = true;
      } else {
        this.jobShow = false;
      }
    },
    nodeClick(data) {
      this.getSelectDepList(data);
    },
    // 获取下拉树的数据
    getSelectDepList(val) {
      treeList({ entId: val }).then((res) => {
        this.depList = res;
        console.log(res);
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
              .catch(() => {
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
              .catch(() => {
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
