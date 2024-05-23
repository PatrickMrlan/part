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
          <el-form-item label="上级分类：" prop="categoryFatherId">
            <treeselect
              v-model="dialogForm.categoryFatherId"
              :multiple="false"
              :close-on-select="true"
              :options="treeList"
              :default-expand-level="1"
              :normalizer="treeSelectNormalizer"
              :limit-text="(count) => `+${count}`"
              no-results-text="未找到相关结果"
              no-options-text="没有可选择的数据"
              placeholder="请选择上级分类"
            />
          </el-form-item>
          <el-form-item label="分类名称：" prop="categoryName">
            <el-input
              v-model.trim="dialogForm.categoryName"
              type="text"
              placeholder="请输入分类名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="分类排序：" prop="categoryOrder">
            <el-input-number
              v-model.trim="dialogForm.categoryOrder"
              placeholder="请输入分类排序"
              :precision="0"
              :min="0"
              :max="999"
            />
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
  enumListCategory,
  addCategory,
  detailCategory,
  editCategory,
  listCategory,
} from "@/api/hazard/standard";

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
        categoryFatherId: null, // 父级分类ID
        categoryId: null, // 隐患排查标准分类ID
        categoryName: null, // 分类名称
        categoryOrder: null, // 分类排序
        remark: null, // 备注
      },

      formRules: {
        categoryName: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: ["change", "blur"],
          },
        ],
        categoryOrder: [
          {
            required: true,
            message: "请输入分类排序",
            trigger: ["change", "blur"],
          },
        ],
      },

      treeList: [],
    };
  },
  created() {
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

      await detailCategory({ categoryId: this.id })
        .then((res) => {
          if (this.type == "add") {
            this.dialogForm.categoryFatherId = res.categoryId;
          } else {
            this.dialogForm = res;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
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

    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.id && that.type == "edit") {
            editCategory(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", { reload: true, type: "tree" });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            addCategory(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", { reload: true, type: "tree" });
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
</style>