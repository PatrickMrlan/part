<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="40%">
    <el-form
      style="min-height: 100%"
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      v-loading="loading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="标准分类：" prop="categoryId">
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否重大隐患：" prop="isMajorRisk">
            <el-select
              v-model="dialogForm.isMajorRisk"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in isMajorRiskList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label="风险类型："
            prop="accidentTypeList"
            class="labelFloat"
          >
            <el-checkbox-group
              v-model="dialogForm.accidentTypeList"
              size="mini"
            >
              <el-checkbox
                v-for="(item, index) in enumList.riskAccidentTypeList"
                :key="index"
                :label="item.dictCode"
                border
                >{{ item.dictName }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="检查内容：" prop="checkContent">
            <el-input
              v-model="dialogForm.checkContent"
              type="textarea"
              maxlength="500"
              show-word-limit
              placeholder="请输入检查内容"
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>
          <el-form-item label="主要事故隐患或问题：" prop="mainRisk">
            <el-input
              v-model="dialogForm.mainRisk"
              type="textarea"
              maxlength="500"
              show-word-limit
              placeholder="请输入主要事故隐患或问题"
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>

          <el-form-item label="不合规的名称、条款和内容：" prop="accordance">
            <el-input
              v-model="dialogForm.accordance"
              type="textarea"
              maxlength="500"
              show-word-limit
              placeholder="请输入不合规的名称、条款和内容"
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>

          <el-form-item label="法律法规：" prop="laws">
            <el-input
              v-model="dialogForm.laws"
              type="textarea"
              maxlength="500"
              show-word-limit
              placeholder="请输入法律法规"
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>

          <el-form-item label="整改方案：" prop="rectifyPlan">
            <el-input
              v-model="dialogForm.rectifyPlan"
              type="textarea"
              maxlength="500"
              show-word-limit
              placeholder="请输入整改方案"
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>

          <el-form-item label="处罚方式：" prop="punishMethod">
            <el-input
              v-model="dialogForm.punishMethod"
              type="textarea"
              maxlength="500"
              show-word-limit
              placeholder="请输入处罚方式"
              :autosize="{ minRows: 4 }"
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
      >
        提 交
      </myButton>
    </template>
  </myDrawer>
</template>

<script>
import {
  add,
  enumList,
  detail,
  edit,
  listCategory,
} from "@/api/hazard/standard";

import treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { treeselect },

  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
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
    categoryId: {
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
        categoryId: null, // 标准分类Id
        checkContent: null, // 检查内容
        accordance: null, // 不合规的名称、条款和内容
        isMajorRisk: null, // 是否重大隐患
        laws: null, // 法律法规
        mainRisk: null, // 主要事故隐患或问题
        punishMethod: null, // 处罚方式
        rectifyPlan: null, // 整改方案
        accidentTypeList: [], // 风险类型
      },
      formRules: {
        categoryId: [
          {
            required: true,
            message: "请选择标准分类",
            trigger: ["change", "blur"],
          },
        ],
        isMajorRisk: [
          {
            required: true,
            message: "请选择是否重大隐患",
            trigger: ["change", "blur"],
          },
        ],
        accidentTypeList: [
          {
            required: true,
            message: "请选择风险类型",
            trigger: ["change", "blur"],
          },
        ],
        checkContent: [
          {
            required: true,
            message: "请输入检查内容",
            trigger: ["change", "blur"],
          },
        ],
      },
      treeList: [],
      enumList: {},

      isMajorRiskList: [
        {
          label: "否",
          value: 0,
        },
        {
          label: "是",
          value: 1,
        },
      ],
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

      await enumList()
        .then((res) => {
          this.enumList = res;
        })
        .catch(() => {
          this.loading = false;
        });

      if (this.id) {
        await detail({ standardId: this.id })
          .then((res) => {
            this.dialogForm = res;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      }else{
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

    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-input-group__append {
  cursor: pointer;
}

/** 输入框、下拉框的宽度 **/
/deep/.el-cascader,
/deep/.el-select,
/deep/.el-input-number,
/deep/.el-date-editor,
/deep/.el-switch,
/deep/.el-input {
  width: 100% !important;
}

/deep/.labelFloat {
  & > label {
    float: none;
  }

  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
}
</style>