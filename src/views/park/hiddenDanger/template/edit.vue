<template>
  <myDialog
    :title="title"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="500px"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="模板分类：" prop="categoryId">
            <treeselect
              v-model="dialogForm.categoryId"
              :multiple="false"
              :close-on-select="true"
              :options="treeList"
              :default-expand-level="1"
              :normalizer="treeSelectNormalizer"
              :limit-text="(count) => `+${count}`"
              no-results-text="未找到相关结果"
              no-options-text="没有可选择的数据"
              placeholder="请选择标准分类"
            />
          </el-form-item>
          <el-form-item label="模板名称：" prop="templateName">
            <el-input
              v-model.trim="dialogForm.templateName"
              type="text"
              placeholder="请输入模板名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="模板类型：" prop="templateType">
            <el-select
              v-model="dialogForm.templateType"
              filterable
              :disabled="type ? true : false"
              class="input-normal"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in enumList.templateTypeList"
                :key="index"
                :label="item.key"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input
              v-model.trim="dialogForm.remark"
              type="textarea"
              placeholder="请输入备注"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
        >提 交</myButton
      >
    </template>
  </myDialog>
</template>

<script>
import {
  add,
  enumList,
  detail,
  edit,
  listCategory,
} from "@/api/hazard/template";

import treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { treeselect },

  props: {
    title: {
      required: true,
      default() {
        return "";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
    categoryId: {
      required: false,
      default() {
        return null;
      },
    },
    type: {
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
        categoryId: null, // 模板分类id
        remark: null, // 模板备注
        sendEntId: null, // 下发企业ID
        templateName: null, // 模板名称
        templateType: null, // 模板类型
      },
      treeList: [],
      enumList: {},

      formRules: {
        categoryId: [
          {
            required: true,
            message: "请选择模板分类",
            trigger: ["change", "blur"],
          },
        ],
        templateName: [
          {
            required: true,
            message: "请输入模板名称",
            trigger: ["change", "blur"],
          },
        ],
        templateType: [
          {
            required: true,
            message: "请选择模板类型",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  created() {
    console.log(this.type);
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      await listCategory()
        .then((res) => {
          this.treeList = res;
        })
        .catch(() => {
          this.loading = false;
        });

      await enumList()
        .then((res) => {
          this.enumList = res;

          if (this.type) {
            this.dialogForm.templateType = "私有模板";
          }
        })
        .catch(() => {
          this.loading = false;
        });

      if (this.id) {
        await detail({ templateId: this.id })
          .then((res) => {
            this.dialogForm = res;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.dialogForm.categoryId = this.categoryId;
        this.loading = false;
      }
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

    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      this.$refs[formName].validate((valid) => {
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
                that.$emit("close", { reload: true, type: "table" });
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
                that.$emit("close", { reload: true, type: "table" });
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
    // 取消
    cancel(done) {
      this.$emit("close", {});
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
</style>