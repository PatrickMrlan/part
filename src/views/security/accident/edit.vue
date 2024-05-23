<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="1000px">
    <el-form
      v-loading="loading"
      style="min-height: 100%"
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
    >
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="事故原因：" prop="accidentReason">
            <el-input
              v-model="dialogForm.accidentReason"
              type="text"
              placeholder="请输入事故原因"
              clearable
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事故类型：" prop="accidentType">
            <el-select
              v-model="dialogForm.accidentType"
              placeholder="请选择事故类型"
              clearable
              filterable
            >
            <el-option v-for="item in enumList.accidentTypeList" 
            :key="item.value" 
            :label="item.key" 
            :value="item.value" 
            />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事故等级：" prop="accidentLevel">
            <el-select
              v-model="dialogForm.accidentLevel"
              placeholder="请选择事故类型"
              clearable
              filterable
            >
            <el-option v-for="item in enumList.accidentLevelList" 
            :key="item.value" 
            :label="item.key" 
            :value="item.value" 
            />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发生时间：" prop="occurTime">
            <el-date-picker
              v-model="dialogForm.occurTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联企业：" prop="enId"  v-if="aTypeNum==1">
            <el-select
              v-model="dialogForm.enId"
              placeholder="请选择关联企业"
              clearable
              filterable
            >
            <el-option v-for="item in enumList.entList" 
            :key="item.entId" 
            :label="item.entName" 
            :value="item.entId" 
            />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提交企业：" prop="entName" v-if="aTypeNum==1">
            <el-input
              v-model="dialogForm.entName"
              type="text"
              placeholder="请输入提交企业"
              clearable
              disabled
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="死亡人数：" prop="deathNum">
            <el-input-number v-model="dialogForm.deathNum" :precision="0" :step="1" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="重伤人数：" prop="seriousInjuryNum">
            <el-input-number v-model="dialogForm.seriousInjuryNum" :precision="0" :step="1" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="轻伤人数：" prop="minorWoundNum">
            <el-input-number v-model="dialogForm.minorWoundNum" :precision="0" :step="1" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        
        <el-col :span="9">
          <el-form-item label="损失金额（元）：" prop="damagesAmount">
            <el-input-number v-model="dialogForm.damagesAmount" :precision="2" :step="0.1" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事故描述：" prop="accidentDes">
            <el-input
              v-model="dialogForm.accidentDes"
              type="textarea"
              placeholder="请输入事故描述"
              clearable
              maxlength="500"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="事故附件：" prop="fileList">
            <el-tooltip
                    class="item tips"
                    effect="dark"
                    content="可上传图片、文档"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  <myUpload
                    action="#"
                    class="upload-demo"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.docx,.doc,.xls,.xlsx"
                    multiple
                    :file-list="dialogForm.fileList"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :http-request="handleUpload"
                    :before-upload="beforeUpload"
                    :before-remove="beforeRemove"
                    list-type="picture-card"
                  >
                    <div class="uploadImg">
                      <i slot="default" class="el-icon-plus" />
                    </div>
                  </myUpload>      
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
  </myDrawer>
</template>

<script>
import { fileUpload } from "@/api/upload";
import { enumList, detail, edit ,add} from "@/api/security/accident";
export default {
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
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
    },
    aTypeNum: {
      type:Number,
      required: false,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,
      dialogForm: {
        deathNum:0,
        seriousInjuryNum:0,
        minorWoundNum:0,
        damagesAmount:0,
        entName:null,
        fileList:[],
        enId:null,
      },
      formRules: {
        accidentReason: [
          {
            required: true,
            message: "请输入事故原因",
            trigger: ["change", "blur"]
          },
        ],
        accidentType: [
          {
            required: true,
            message: "请选择事故类型",
            trigger: ["change", "blur"]
          },
        ],
        accidentLevel: [
          {
            required: true,
            message: "请选择事故等级",
            trigger: ["change", "blur"]
          },
        ],
        occurTime: [
          {
            required: true,
            message: "请选择发生时间",
            trigger: ["change", "blur"]
          },
        ],
        enId: [
          {
            required: true,
            message: "请选择关联企业",
            trigger: ["change", "blur"]
          },
        ],
        entName: [
          {
            required: true,
            message: "请输入提交企业",
            trigger: ["change", "blur"]
          },
        ],
        accidentDes: [
          {
            required: true,
            message: "请输入事故描述",
            trigger: ["change", "blur"]
          }
        ],
        
      },
      options: [],
      hideUpload_introduce_before: false,
      loginUser: {},
      enumList:[],
      
    };
  },
   created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
     this.getenumList();
    if (this.id) {
       this.loadData();
    }
  },
  methods: {
    cancel(done) {
      this.$emit("close", {});
    },
    //获取枚举
    getenumList() {
      enumList().then(res => {
        this.enumList = res;
        this.dialogForm.entName=res.entName;
        if(res.entList&&res.entList.length&&this.aTypeNum==0){
          this.dialogForm.enId=res.entList[0].entId;
        }
      });
    },
    

    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: that.id })
        .then(res => {
          that.dialogForm = res;
          if (this.dialogForm.fileList && this.dialogForm.fileList.length) {
            this.dialogForm.fileList.forEach((item) => {
              item.link = this.baseURL + item.fileUrl;
              // item.url = this.baseURL + item.fileUrl;
              item.url = require("@/assets/img/fileCover.png");
            });
          }else{
            this.dialogForm.fileList =[];
          }
          



          that.dialogForm = JSON.parse(JSON.stringify(that.dialogForm));
        })
        .finally(() => {
          that.loading = false;
        });
    },
    submit(fromName) {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[fromName].validate(valid => {
        if (valid) {
          that.loading = true;

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
            that.dialogForm.entId=that.loginUser.entId;
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
    handleRemove(file, fileList) {
      this.dialogForm.fileList.forEach((item, index) => {
        if (file.fileId == item.fileId) {
          this.dialogForm.fileList.splice(index, 1);
        }
      });
    },
    beforeUpload(file) {
      let name = file.name
        .split(".")
        .pop()
        .toUpperCase();
      if (
        name !== "PDF" &&
        name !== "DOCX" &&
        name !== "DOC" &&
        name !== "XLS" &&
        name !== "XLSX" &&
        name !== "JPG" &&
        name !== "JPEG" &&
        name !== "PNG" &&
        name !== "GIF" &&
        name !== "BMP" &&
        name !== "WEBP"
      ) {
        this.$message({
          type: "error",
          message: "不支持上传当前文件！"
        });
        return false;
      }
    },
    handlePreview(file) {
      if (file && file.fileUrl) {
        window.open(this.baseURL + file.fileUrl);
      }
    },

    // 自定义上传
    handleUpload(file, fileList) {
      const that = this;
      that.loading = true;
      const formData = new FormData();
      formData.append("fileType", 4);
      formData.append("file", file.file);
      formData.append("type", "security_accident");
      fileUpload(formData)
        .then(res => {
          
          
          res.link = that.baseURL + res.fileUrl;
          res.fileName = res.fileName;
          res.fileId = res.fileId;
          res.url = require("@/assets/img/fileCover.png");
          
          that.dialogForm.fileList.push(res);
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
