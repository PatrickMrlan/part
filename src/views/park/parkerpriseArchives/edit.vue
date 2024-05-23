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
          <el-form-item label="园区名称：" prop="parkName">
            <el-input
              v-model="dialogForm.parkName"
              type="text"
              placeholder="请输入园区名称"
              clearable
              maxlength="20"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="园区编码：" >
            <el-input
              v-model="dialogForm.parkCode"
              type="text"
              placeholder="请输入园区编码"
              clearable
              maxlength="50"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否开启园区员工注册：" prop="isOpenRegister">
            <el-select
              v-model="dialogForm.isOpenRegister"
              placeholder="请选择是否开启园区员工注册"
              clearable
              collapse-tags
              filterable
            >
              <el-option
                v-for="item in yesOrNoList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
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
          <el-form-item label="联系电话：" prop="contactTel">
            <el-input
              v-model="dialogForm.contactTel"
              type="text"
              placeholder="请输入联系电话"
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
          <el-form-item label="管理员密码：" prop="loginPass">
            <el-input
              v-model="dialogForm.loginPass"
              type="password"
              placeholder="请输入管理员密码"
              :show-password="true"
              auto-complete="new-password"
              clearable
              maxlength="20"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            v-show="dialogForm.loginPass"
            label="重复密码："
            prop="repeatPassword"
          >
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

        <el-col :span="12">
          <el-form-item label="成立日期：" prop="establishDate">
            <el-date-picker
              v-model="dialogForm.establishDate"
              class="input-default"
              type="date"
              :value-format="'yyyy-MM-dd'"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>

        <el-col>
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

        <!-- <el-col :span="12">
          <el-form-item label="营业执照：" prop="businessLicense">
            <el-tooltip
              class="item tips"
              effect="dark"
              content="可上传图片"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            <myUpload
              action="#"
              class="upload-demo"
              accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.pdf,.bmp,.webp"
              multiple
              :file-list="files"
              :on-preview="handlePreview"
              :on-remove="handleRemoveImg"
              :http-request="handleUpload"
              :on-change="handleIntroduceUploadHide"
              :before-upload="beforeUploadImg"
              :before-remove="beforeRemove"
              list-type="picture-card"
              :class="{ hideUploadBox: hideUpload_introduce_before }"
            >
              <div class="uploadImg">
                <i slot="default" class="el-icon-plus" />
              </div>
            </myUpload>
          </el-form-item>
        </el-col> -->
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
import { fileUpload } from "@/api/upload";
import { enumList, add, edit, detail } from "@/api/park/information";
import mapup from "../information/mapup";
export default {
  components: { mapup },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "编辑用户";
      }
    },
    visible: {
      type: Boolean,
      required: true,
      default() {
        return false;
      }
    },
    id: {
      required: false,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,
      yesOrNoList: [],
      dialogForm: {},
      formRules: {
        parkName: [
          { required: true, message: "请输入园区名称！", trigger: "blur" }
        ],
        parkCode:[
          { required: true, message: "请输入园区编码！", trigger: "blur" }
        ],
        contact:[
          { required: true, message: "请输入联系人！", trigger: "blur" }
        ],
        loginCode:[
          { required: true, message: "请输入管理员账号！", trigger: "blur" }
        ],
       
      },
      postForm: {
        longitude: null,
        latitude: null,
        detailedAddress: null
      },
      mapShow: false,
      files: [],
      hideUpload_introduce_before: false
    };
  },
  created() {
    this.getenumList();
    this.loadData();
  },
  methods: {
    getenumList() {
      enumList().then(res => {
        this.yesOrNoList = res.yesOrNoList;
      });
    },
    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: that.id })
        .then(res => {
          console.log(res);
          that.dialogForm = res;
          that.dialogForm.loginPass=""
          if (res.businessLicense) {
            that.files.push({
              link: that.baseURL + res.businessLicense,
              url: that.baseURL + res.businessLicense
            });
            this.hideUpload_introduce_before = true;
          }
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
      console.log(that.dialogForm);
      that.$refs["dialogForm"].validate(valid => {
        if (valid) {
          that.loading = true;
          // 提交表单
          if (that.id) {
            edit(that.dialogForm)
              .then(res => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "修改成功"
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            add(that.dialogForm)
              .then(res => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "添加成功"
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          }
        }
      });
    },
    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`);
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    // 移除模板
    handleRemoveImg(file, fileList) {
      this.files = [];
      this.dialogForm.businessLicense = "";
      this.hideUpload_introduce_before = false;
    },
    beforeUploadImg(file) {
      let name = file.name
        .split(".")
        .pop()
        .toUpperCase();
      if (
        name !== "JPEG" &&
        name !== "JPG" &&
        name !== "PNG" &&
        name !== "GIF" &&
        name !== "BMP"
      ) {
        this.$message({
          type: "error",
          message: "只支持JPEG、JPG、PNG、GIF、BMP文件格式！"
        });
        return false;
      }
    },
    handlePreview(file) {
      if (file && file.fileUrl) {
        window.open(file.fileUrl);
      }
    },

    handleIntroduceUploadHide(type, file, fileList) {
      switch (type) {
        case "management_file":
          this.hideUpload_introduce_before = fileList.length >= 1;
          break;
      }
    },
    // 自定义上传
    handleUpload(file, fileList) {
      const that = this;
      that.loading = true;
      const formData = new FormData();
      formData.append("fileType", 1);
      formData.append("file", file.file);
      formData.append("type", "information_file");
      fileUpload(formData)
        .then(res => {
          this.dialogForm.businessLicense = res.fileUrl;
          this.files.push({
            link: that.baseURL + res.fileUrl,
            url: that.baseURL + res.fileUrl,
            fileName: res.fileName,
            fileId: res.fileId
          });
          that.$message({
            type: "success",
            message: "上传成功！"
          });
          this.hideUpload_introduce_before = true;
        })
        .finally(() => {
          that.loading = false;
        });
    }
  }
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
