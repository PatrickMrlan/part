<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="600px">
    <el-form
      v-loading="loading"
      style="min-height: 100%"
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="处罚文号：" prop="punishCode">
            <el-input
              v-model="dialogForm.punishCode"
              type="text"
              placeholder="请输入处罚文号"
              clearable
              maxlength="100"
            />
          </el-form-item>
        </el-col>
       
        <el-col :span="12">
          <el-form-item label="处罚类型：" prop="punishType">
            <el-select
              v-model="dialogForm.punishType"
              placeholder="请选择处罚类型"
              clearable
              filterable
            >
            <el-option v-for="item in enumList.punishTypeList" 
            :key="item.value" 
            :label="item.key" 
            :value="item.value" 
            />
            </el-select>
          </el-form-item>
        </el-col>
       
        <el-col :span="12">
          <el-form-item label="处罚日期" prop="punishDate">
            <el-date-picker
              v-model="dialogForm.punishDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发文机构：" prop="orgName">
            <el-input
              v-model="dialogForm.orgName"
              type="text"
              placeholder="请输入发文机构"
              clearable
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联企业：" prop="enId" v-if="aTypeNum==1">
            <el-select
              v-model="dialogForm.enId"
              placeholder="请选择关联企业"
              :disabled="aTypeShow"
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
       
      
        <el-col :span="24">
          <el-form-item label="处罚原因：" prop="punishReason">
            <el-input
              v-model="dialogForm.punishReason"
              type="textarea"
              placeholder="请输入处罚原因"
              clearable
              maxlength="500"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="处罚文件：" prop="fileList">
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
import { enumList, detail, edit ,add} from "@/api/security/punish";
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
        punishCode: [
          {
            required: true,
            message: "请输入处罚文号",
            trigger: ["change", "blur"]
          },
        ],
        punishType: [
          {
            required: true,
            message: "请选择处罚类型",
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
        punishDate: [
          {
            required: true,
            message: "请选择处罚时间",
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
        punishReason: [
          {
            required: true,
            message: "请输入处罚原因",
            trigger: ["change", "blur"]
          }
        ],
        
      },
      options: [],
      hideUpload_introduce_before: false,
      loginUser: {},
      enumList:[],
      aTypeShow:false,
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
        if(this.aTypeNum==0){
          this.aTypeShow=true;
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
      formData.append("type", "security_punish");
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
