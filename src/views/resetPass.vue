<template>
  <el-dialog
    title="修改密码"
    class="dialog-form"
    width="500px"
    :visible="true"
    :before-close="cancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :destroy-on-close="false"
    :v-loading="loading"
    top="10vh"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <div style="color: red; margin-bottom: 10px; text-align: center">
            <p>{{ msg }}</p>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="登录账户：" prop="userCode">
            <el-input
              v-model="dialogForm.userCode"
              max="20"
              placeholder="登录账户"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="旧密码：" prop="oldPassword">
            <el-input
              v-model="dialogForm.oldPassword"
              type="password"
              max="20"
              placeholder="旧密码"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="新密码：" prop="newPassword">
            <el-input
              v-model="dialogForm.newPassword"
              type="password"
              show-password
              max="20"
              placeholder="新密码"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="重复密码：" prop="replyPassword">
            <el-input
              v-model="dialogForm.replyPassword"
              type="password"
              max="20"
              placeholder="重复密码"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit('dialogForm')"
        >提 交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { Message } from "element-ui";
import { editDefaultPass } from "@/api/login";
import { validatePassword } from "@/utils/validate";

export default {
  props: {
    editPassCode: {
      required: true,
      default() {
        return "";
      },
    },
    msg: {
      required: true,
      default() {
        return "";
      },
    },
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.dialogForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      dialogForm: {
        userCode: null, // 账户
        oldPassword: null, // 旧密码
        newPassword: null, // 新密码
        replyPassword: null, // 重复密码
        editPassCode: null, // 鉴权码
      },
      formRules: {
        userCode: [
          { required: true, message: "请输入账户！", trigger: "blur" },
        ],
        oldPassword: [
          { required: true, message: "请输入旧密码！", trigger: "blur" },
        ],
        newPassword: [
          {
            required: true,
            validator: (rule, value, callback) => {
              validatePassword(rule, value, callback, true, [""]);
            },
            trigger: "change",
          },
        ],
        replyPassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    console.log(this.editPassCode);
    this.dialogForm.editPassCode = this.editPassCode;
  },
  mounted() {},
  methods: {
    /**
     * 数据提交
     */
    submit(formName) {
      const that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");

          editDefaultPass(that.dialogForm)
            .then((res) => {
              Message({
                type: "success",
                message: "操作成功,请重新登录",
              });
              this.$emit("close", {});
              sessionStorage.clear();
              this.$router.push({
                path: "/login",
              });
            })
            .catch((error) => {
              this.msg = error.message;
            });
        } else {
          return false;
        }
      });
    },
    cancel() {
      console.log("取消");
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-form-item {
  margin-bottom: 30px !important;
}
</style>
