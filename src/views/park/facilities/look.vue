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
      label-width="140px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="设备名称：" prop="deviceName">
            <el-input
              v-model="dialogForm.deviceName"
              type="text"
              class="input-default"
              placeholder="设备名称"
              maxlength="200"
              disabled
              clearable
            />
          </el-form-item>

          <el-form-item label="设备编号：" prop="deviceCode">
            <el-input
              v-model="dialogForm.deviceCode"
              type="text"
              class="input-default"
              placeholder="设备编号"
              maxlength="200"
              disabled
              clearable
            />
          </el-form-item>

          <el-form-item label="规格型号：" prop="deviceModel">
            <el-input
              v-model="dialogForm.deviceModel"
              type="text"
              class="input-default"
              placeholder="规格型号"
              maxlength="200"
              disabled
              clearable
            />
          </el-form-item>

          <el-form-item label="生产厂商：" prop="manufacturer">
            <el-input
              v-model="dialogForm.manufacturer"
              type="text"
              class="input-default"
              placeholder="生产厂商"
              maxlength="200"
              disabled
              clearable
            />
          </el-form-item>

          <el-form-item label="使用部门：" prop="department">
            <el-input
              v-model="dialogForm.department"
              type="text"
              class="input-default"
              placeholder="使用部门"
              maxlength="200"
              disabled
              clearable
            />
          </el-form-item>

          <el-form-item label="安装位置：" prop="address">
            <el-input
              v-model="dialogForm.address"
              type="text"
              class="input-default"
              placeholder="安装位置"
              maxlength="200"
              disabled
              clearable
            />
          </el-form-item>

          <el-form-item label="资产负责人：" prop="responsible">
            <el-input
              v-model="dialogForm.responsible"
              type="text"
              class="input-default"
              placeholder="资产负责人"
              maxlength="200"
              disabled
              clearable
            />
          </el-form-item>

          <el-form-item label="使用状态：" prop="useState">
            <el-input
              v-model="dialogForm.useState"
              type="text"
              class="input-default"
              placeholder="使用状态"
              maxlength="200"
              disabled
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
    </template>
  </myDialog>
</template>

<script>
import { detail, edit, add, enumList } from "@/api/park/facilities";

export default {
  components: {},
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "查看详情";
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
  },
  data() {
    return {
      loading: false,

      dialogForm: {
        deviceName: null,
        deviceLargeCategory: null,
        deviceSubclass: null,
        deviceCodeName: null,
        deviceModel: null,
        manufacturer: null,
        address: null,
        isUseRegistration: null,
        responsible: null,
        department: null,
        useState: null,
      },
      isUseRegistration: [],
      deviceSubclassList: [],
      deviceLargeCategoryList: [],
      yesOrNoList: [],
      formRules: {},
    };
  },
  async created() {
    await this.loadData();
    await this.getEnumList();
  },
  methods: {
    cancel(done) {
      this.$emit("close", {});
    },

    getEnumList() {
      const that = this;
      that.loading = true;
      // 获取枚举列表
      enumList()
        .then((res) => {
          this.yesOrNoList = res.yesOrNoList;
          this.deviceSubclassList = res.deviceSubclassList;
          this.deviceLargeCategoryList = res.deviceLargeCategoryList;
        })
        .catch(() => {
          that.loading = false;
        });
    },

    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: that.id })
        .then((res) => {
          console.log(res);
          that.dialogForm = res;

          that.loading = false;
        })
        .catch(() => {
          that.loading = false;
        });
    },

    /**
     * 数据提交
     */
    submit(formName) {
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
