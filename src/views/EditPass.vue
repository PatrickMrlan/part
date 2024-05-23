<template>
  <el-form
    ref="dialogForm"
    :model="dialogForm"
    :rules="formRules"
    label-width="100px"
    style="width: 400px; margin: 20px 0"
  >
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="旧密码：" prop="oldPassWord">
          <el-input
            v-model="dialogForm.oldPassWord"
            type="password"
            show-password
            max="20"
            class="input-default"
            placeholder="旧密码"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item
          style="margin-top: 30px"
          label="新密码："
          prop="newPassWord"
        >
          <el-input
            v-model.trim="dialogForm.newPassWord"
            type="password"
            show-password
            max="20"
            class="input-default"
            placeholder="新密码"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item
          style="margin-top: 40px"
          label="重复密码："
          prop="cofirmPassWord"
        >
          <el-input
            v-model="dialogForm.cofirmPassWord"
            type="password"
            show-password
            max="20"
            class="input-default"
            placeholder="重复密码"
            maxlength="20"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <div class="footer-item">
      <el-button
        type="primary"
        :loading="loading"
        @click="submitForm('dialogForm')"
      >
        提 交
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { editPass } from "../api/login";
import { Message } from "element-ui";
import { removeToken } from "../utils/cookie";
import { validatePassword } from "@/utils/validate";

export default {
  name: "UserCenter",
  data() {
    return {
      loading: false,
      dialogForm: {},
      formRules: {
        oldPassWord: [
          { required: true, message: "请输入旧密码！", trigger: "blur" },
        ],
        newPassWord: [
          {
            required: true,
            validator: (rule, value, callback) => {
              validatePassword(rule, value, callback, true, [""]);
            },
            trigger: "change",
          },
        ],
        cofirmPassWord: [
          { required: true, message: "请再次输入密码！", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this;

      that.$refs[formName].validate((valid) => {
        if (valid) {
          editPass(that.dialogForm)
            .then((res) => {
              Message({
                type: "success",
                message: "操作成功,请重新登录",
              });
              removeToken();
              sessionStorage.clear();
              this.$router.push({
                path: "/login",
              });
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  line-height: 40px;
  display: flex;
  justify-content: center;
}
.user-center-wrapper {
  .user-avatar {
    float: left;
    width: 150px;
    height: 150px;
  }
}
input {
  border: 1px solid #ccc;
  padding: 7px 0px;
  border-radius: 3px;
  padding-left: 5px;
}
label {
  display: inline-block;
  width: 100px;
  text-align: right;
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
</style>
