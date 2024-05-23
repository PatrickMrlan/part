<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="600px">
    <el-form
      v-loading="loading"
      style="min-height: 100%"
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="企业名称：" prop="entName">
            <el-input
              v-model="dialogForm.entName"
              type="text"
              placeholder="请输入企业名称"
              clearable
              maxlength="20"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="企业统一社会信用代码：" prop="entCode">
            <el-input
              v-model="dialogForm.entCode"
              type="text"
              placeholder="请输入统一社会信用代码"
              clearable
              maxlength="50"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="企业位置：" prop="entLocation">
            <el-select
              v-model="dialogForm.entLocation"
              placeholder="请选择企业位置"
              :disabled="parkbol"
            >
              <el-option
                v-for="item in entLocationlist"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="dialogForm.entLocation == '1'">
          <el-form-item label="所在园区：" prop="entLocation">
            <el-select
              v-model="dialogForm.parkId"
              placeholder="请选择所在园区"
              :disabled="parkbol"
            >
              <el-option
                v-for="item in parkList"
                :key="item.parkId"
                :label="item.parkName"
                :value="item.parkId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系人：" prop="contact">
            <el-input
              v-model="dialogForm.contact"
              type="text"
              placeholder="请输入联系人"
              clearable
              maxlength="20"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系人手机号：" prop="contactTel">
            <el-input
              v-model="dialogForm.contactTel"
              type="text"
              placeholder="请输入联系人手机号"
              clearable
              maxlength="11"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="管理员账号：" prop="loginCode">
            <el-input
              v-model="dialogForm.loginCode"
              type="text"
              placeholder="请输入管理员账号"
              clearable
              auto-complete="new-password"
              maxlength="20"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="登录密码：" prop="loginPass">
            <el-input
              v-model="dialogForm.loginPass"
              type="password"
              placeholder="请输入登录密码"
              :show-password="true"
              auto-complete="new-password"
              clearable
              maxlength="20"
            />
          </el-form-item>
        </el-col>

       

        <el-col :span="12">
          <el-form-item label="详细地址：" prop="address">
            <el-input
              v-model.trim="dialogForm.address"
              type="text"
              class="input-default"
              placeholder="详细地址"
              maxlength="100"
            >
              <template slot="append">
                <div @click="mapShow = true">
                  <i class="el-icon-location-outline"></i>定位
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营状况：" prop="performance">
            <el-select
              v-model="dialogForm.performance"
              placeholder="经营状况"
              class="input-normal"
              clearable
            >
              <el-option
                v-for="item in performanceList"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogForm.loginPass">
          <el-form-item label="重复密码：" prop="repeatPassword">
            <el-input
              v-model="dialogForm.repeatPassword"
              auto-complete="new-password"
              :show-password="true"
              type="password"
              placeholder="请输入重复密码"
              clearable
              maxlength="20"
            />
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

    <mapup
      v-if="mapShow"
      :show="mapShow"
      :postform="postForm"
      @close="mapupclose"
    />
  </myDrawer>
</template>
<script>
import { enumList, addEnt, editEnt, detail } from "@/api/system/enterprise";
import { parkList } from "@/api/register";
import mapup from "./mapup";
import { validatePassword } from "@/utils/validate";

export default {
  components: { mapup },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "编辑用户";
      },
    },
    visible: {
      type: Boolean,
      required: true,
      default() {
        return false;
      },
    },
    id: {
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
      baseURL: process.env.VUE_APP_BASE_API,
      loginUser: {},
      loading: false,
      yesOrNoList: [],
      parkList: [],
      parkbol: false,
      entLocationlist: [
        { key: "园内企业", value: "1" },
        { key: "园外企业", value: "2" },
      ],
      dialogForm: {},
      formRules: {
        loginCode: [
          { required: true, message: "请输入管理账号！", trigger: "blur" },
        ],
        entName: [
          { required: true, message: "请输入企业名称！", trigger: "blur" },
        ],
        entCode: [
          {
            required: true,
            message: "请输入统一社会信用代码！",
            trigger: "blur",
          },
        ],
        contact: [
          { required: true, message: "请输入联系人！", trigger: "blur" },
        ],
        contactTel: [
          {
            required: true,
            message: "请输入联系手机号！",
            trigger: "blur",
          },
          {
            pattern: /^(1\d{10})$/,
            message: "请输入正确的手机号码",
            trigger: "change",
          },
        ],
        address: [
          { required: true, message: "请输入企业注册地址！", trigger: "blur" },
        ],
        repeatPassword: [
          { required: true, message: "请输入重复密码！", trigger: "blur" },
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
      },
      postForm: {
        longitude: null,
        latitude: null,
        detailedAddress: null,
      },
      mapShow: false,
      performanceList:[],
    };
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    if (this.loginUser.sysPark) {
      this.parkbol = true;
    }
    this.loadData();
    this.getenumList();
    this.getPark();
  },
  methods: {
    getPark() {
      var that = this;
      parkList().then((res) => {
        that.parkList = res;
      });
    },
    getenumList() {
      enumList().then((res) => {
        this.yesOrNoList = res.yesOrNoList;
        this.performanceList =res.performanceList;
      });
    },
    loadData() {
      const that = this;
      that.loading = true;

      detail({ entId: that.id })
        .then((res) => {
          that.dialogForm = res.sysEnterprise;
          that.dialogForm.contacts = res.sysEnterprise.contact;
          that.dialogForm.loginPass = "";
          that.dialogForm.tel = res.sysEnterprise.contactTel;
          if (this.loginUser.sysPark) {
            this.dialogForm.entLocation = "1";
            this.dialogForm.parkId = this.loginUser.sysPark.parkId;
          }

          that.dialogForm = JSON.parse(JSON.stringify(that.dialogForm));
        })
        .finally(() => {
          that.loading = false;
        });
    },
    // 地图弹窗
    mapupclose(data) {
      this.mapShow = false;
      if (data != null) {
        this.dialogForm.address = data.address;
        this.dialogForm.longitude = data.lng;
        this.dialogForm.latitude = data.lat;

        this.postForm.address = data.address;
        this.postForm.longitude = data.lng;
        this.postForm.latitude = data.lat;
      }
    },
    cancel(done) {
      this.$emit("close", {});
    },
    submit() {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs["dialogForm"].validate((valid) => {
        if (valid) {
          that.loading = true;
          // 提交表单
          if (that.id) {
            editEnt(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "修改成功",
                });
                that.$emit("close", { reload: true });
              })
              .catch((error) => {
                // that.$message({
                //   type: "success",
                //   message: error.message
                // });
                that.loading = false;
              });
          } else {
            addEnt(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "添加成功",
                });
                that.$emit("close", { reload: true });
              })
              .catch((error) => {
                // that.$message({
                //   type: "success",
                //   message: error.message
                // });
                that.loading = false;
              });
          }
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
/deep/input[type="file"] {
  display: none;
}
/** 上传文件 **/
/deep/ .upload-demo > div:first-of-type {
  display: inline;
}

/deep/.hideUploadBox > .el-upload--picture-card {
  display: none !important;
}
</style>
