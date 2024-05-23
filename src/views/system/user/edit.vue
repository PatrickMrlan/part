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
          <!-- <el-form-item label="选择企业：" prop="entId">
            <el-select
              v-model="dialogForm.entId"
              filterable
              class="input-default"
              placeholder="请选择"
              @change="nodeClick(dialogForm.entId)"
            >
              <el-option
                v-for="item in entList"
                :key="item.entId"
                :label="item.entName"
                :value="item.entId"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="登录账号：" prop="account">
            <el-input
              v-model="dialogForm.account"
              type="text"
              max="20"
              class="input-default"
              placeholder="登录账号"
              maxlength="20"
              autocomplete="off"
            />
          </el-form-item>

          <!-- <el-form-item label="用户级别：">
            <el-select
              v-model="dialogForm.adminLevel"
              placeholder="请选择"
              clearable
              filterable
              class="input-default"
            >
              <el-option
                v-for="(item, index) in adminLevelList"
                :key="index"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="登录密码：" prop="password">
            <el-input
              v-model="dialogForm.password"
              type="password"
              max="20"
              class="input-default"
              placeholder="登录密码"
              maxlength="16"
              autocomplete="new-password"
            />
          </el-form-item>
          <el-form-item
            v-if="seesionLoginUser.isAdmin == 1"
            label="超级管理员："
            prop="isAdmin"
          >
            <el-switch
              v-model="dialogForm.isAdmin"
              active-color="#13ce66"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <!-- <el-form-item label="直属主管：" prop="reportsTo">
            <el-select
              v-model="dialogForm.reportsTo"
              filterable
              clearable
              class="input-default"
              placeholder="请选择"
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>

          </el-form-item> -->
          <!-- <el-form-item label="管理应用：" prop="appIdList">
            <el-select
              v-model="dialogForm.appIdList"
              multiple
              filterable
              clearable
              class="input-default"
              placeholder="请选择"
            >
              <el-option
                v-for="item in appList"
                :key="item.id"
                :label="item.appName"
                :value="item.id"
              />
            </el-select>

          </el-form-item> -->
          <el-form-item label="用户类型：" prop="userType">
            <el-select
              v-model="dialogForm.userType"
              filterable
              class="input-default"
              placeholder="请选择"
            >
              <el-option
                v-for="item in userTypeList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位：" prop="post">
            <el-input
              v-model="dialogForm.post"
              type="text"
              class="input-default"
              placeholder="岗位"
              maxlength="20"
            />
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
          <el-form-item label="用户姓名：" prop="userName">
            <el-input
              v-model="dialogForm.userName"
              type="text"
              class="input-default"
              placeholder="用户姓名"
              maxlength="20"
            />
          </el-form-item>

          <!-- <el-cascader
            v-model="dialogForm.place"
            :options="options_"
            :props="{ value: 'label' }"
            @change="handleChange"
          /> -->
          <el-form-item label="手机号码：" prop="tel">
            <el-input
              v-model="dialogForm.tel"
              type="text"
              class="input-default"
              placeholder="手机号码"
              maxlength="11"
            />
          </el-form-item>
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="dialogForm.birthday"
              class="input-default"
              type="date"
              :value-format="'yyyy-MM-dd'"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
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

        <el-col :span="24" style="margin-top: 10px">
          <el-form-item label="头像：">
            <el-input
              v-show="false"
              v-model.trim="dialogForm.picture"
              readonly
              clearable
              placeholder="请上传封面图片，建议400*400像素的图片"
            />
            <el-upload
              :action="serverUrl"
              accept=".jpg,.gif,.png,.jpeg"
              :data="uploadObjs"
              :file-list="fileList"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-change="handleIntroduceUploadHide"
              :on-remove="handleRemove"
              list-type="picture-card"
              :limit="limitCount"
              :class="{ hideUploadBox: hideUpload_introduce }"
            >
              <div>
                <i slot="default" class="el-icon-plus" />
              </div>
            </el-upload>
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
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" height="80%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </myDialog>
</template>

<script>
import { detail, edit, add, listByEntId } from "@/api/user";
import { list } from "@/api/department";
import { list as roleList } from "@/api/role";
import { Message } from "element-ui";
import treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
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
    entDep: {
      type: Object,
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      // 登录用户
      seesionLoginUser: JSON.parse(sessionStorage.getItem("loginUser") || "{}"),
      serverUrl: process.env.VUE_APP_BASE_API + "/admin/fileUpload", // 这里写你要上传的图片服务器地址
      loading: false,
      defaultProps: {
        children: "children",
        label: "name",
      },
      entList: [],
      depList: [],
      fileList: [],
      loginUser: JSON.parse(sessionStorage.getItem("loginUser")),
      dialogImageUrl: null,
      dialogVisible: false,
      userList: [],
      roleList: [], //角色列表
      userTypeList: [],
      dialogForm: {
        userId: null,
        entId: null, // 企业id
        depId: null, // 部门id
        account: null, // 登录账户
        password: null, // 登录密码
        picture: null, // 图片头像
        tel: null, // 联系电话
        userName: null, // 用户姓名
        birthday: "", // 生日
        adminLevel: null,
      },
      uploadObjs: {
        fileType: 1,
        type: "sys_user_img",
      },
      birthday: "",
      adminLevelList: [],
      appList: [],
      hideUpload_introduce: false,
      limitCount: 1,
      formRules: {
        entId: [
          { required: true, message: "请选择关联企业！", trigger: "blur" },
        ],
        depId: [
          { required: true, message: "请选择所属组织架构！", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入用户姓名！", trigger: "blur" },
          {
            max: 20,
            message: "用户姓名长度不能大于20",
            trigger: ["blur", "change"],
          },
        ],
        account: [
          { required: true, message: "请输入登录账号！", trigger: "blur" },
          {
            max: 20,
            message: "登录账号长度不能大于20",
            trigger: ["blur", "change"],
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
        password: [
          {
            required: false,
            validator: (rule, value, callback) => {
              validatePassword(rule, value, callback, false, [""]);
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  async created() {
    this.options_ = json;
    await this.loadData();
    await this.getrolelist();
  },
  methods: {
    getrolelist() {
      roleList().then((res) => {
        this.roleList = res.records;
        console.log(this.roleList);
      });
    },
    getUserList(entId) {
      var that = this;
      listByEntId({ entId: entId, userId: that.id }).then((res) => {
        that.userList = res;
      });
    },
    nodeClick(data) {
      this.getSelectDepList(data);
      //   this.getUserList(data)
    },

    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detail({ userId: that.id })
        .then((res) => {
          that.loading = false;
          // that.entList = res.entList;
          that.adminLevelList = res.adminLevelList;
          that.appList = res.appList;
          that.userTypeList = res.userTypeList;
          that.dialogForm = res.user;
          that.dialogForm.entId = that.loginUser.entId;
          this.getSelectDepList(that.dialogForm.entId);
          if (!that.dialogForm.birthday) {
            that.dialogForm.birthday = "";
          }
          console.log(that.dialogForm);
          if (res.user.picture) {
            that.fileList = [
              { url: process.env.VUE_APP_BASE_API + res.user.picture },
            ];
            that.hideUpload_introduce = true;
          }

          if (res.user.userId != null) {
            that.dialogForm.entId = res.user.entId;
            that.dialogForm.depIdList = res.user.depIdList;
            console.log(that.dialogForm.depIdList);
          } else {
            that.dialogForm.entId = this.entDep.isEnt
              ? this.entDep.id
              : this.entDep.entId || this.loginUser.entId;
            that.dialogForm.depIdList = this.entDep.isEnt
              ? null
              : [this.entDep.id] || [this.loginUser.depId];
          }

          //   if (res.user.entId) {
          //     this.getSelectDepList(res.user.entId)
          //   }
          //   this.getUserList(this.dialogForm.entId)

          //   // 当选中了部门的时候与是新增用户的时候
          //   if (this.depId && !res.user.entId) {
          //     this.getSelectDepList(this.entId)

          //     this.dialogForm.depId = this.depId
          //   }
        })
        .catch(() => {
          that.loading = false;
        });
    },

    // 获取下拉树的数据
    getSelectDepList(val) {
      list({ entId: val }).then((res) => {
        this.depList = res;
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
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false;
                Message({
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
                Message({
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
    cancel(done) {
      this.$emit("close", {});
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 主封面图片上传成功
    handleSuccess(file, fileList) {
      console.log(fileList);
      this.dialogForm.picture = fileList.response.data.fileUrl;
    },
    // 移除主封面图片
    handleRemove(file, fileList) {
      this.dialogForm.picture = null;
      this.hideUpload_introduce = fileList.length >= this.limitCount;
    },
    handleIntroduceUploadHide(file, fileList) {
      this.hideUpload_introduce = fileList.length >= this.limitCount;
    },
  },
};
</script>

<style lang="less" scoped>
.vue-treeselect {
  width: 300px;
  .vue-treeselect__control {
    height: 32px;
    line-height: 32px;
  }
  .vue-treeselect__input {
    height: 32px;
    line-height: 32px;
  }
}
.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 18px;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
/deep/.el-upload__input {
  display: none !important;
}
/deep/.hideUploadBox > .el-upload--picture-card {
  display: none;
}
</style>
