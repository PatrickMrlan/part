<template>
  <myDialog
    :title="title"
    :width="500"
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
      label-width="100px"
    >
      <el-form-item label="分组名称：" prop="groupName">
        <el-input
          v-model="dialogForm.groupName"
          type="text"
          class="input-default"
          placeholder="分组名称"
          clearable
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="dialogForm.sort" :min="1" :max="999" />
      </el-form-item>
      <el-form-item label="备注：" prop="remake">
        <el-input
          v-model="dialogForm.remake"
          type="textarea"
:rows="6"
          max="50"
          class="input-default"
          placeholder="备注"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item v-if="roleList" label="所属角色：" prop="roleIds">
        <el-checkbox-group v-model="dialogForm.roleIds">
          <el-checkbox
            v-for="(item, i) in roleList"
            :key="i"
            :label="item.roleId"
            name="roleIds"
          >
            {{ item.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      <myButton
        :type="'confirm'"
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >
        提 交
      </myButton>
    </template>
  </myDialog>
</template>

<script>
import { detailGroup, editGroup, addGroup } from "../../../api/user";
import { list } from "../../../api/department";
import { Message } from "element-ui";
import treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { treeselect },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "编辑分组";
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
    return {
      loading: false,
      roleList: [],
      dialogForm: {
        groupName: null,
        id: null,
        remake: null,
        sort: 0,
        roleIds: [],
      },
      formRules: {
        groupName: [
          { required: true, message: "请输入分组名称！", trigger: "blur" },
          {
            max: 20,
            message: "人员姓名长度不能大于20",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    this.dialogForm.id = this.id;
    this.loadData();
  },
  methods: {
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detailGroup({ id: that.id })
        .then((res) => {
          console.log(res);
          that.dialogForm = {
            id: that.id,
            groupName: res.groupName,
            remake: res.remake,
            sort: res.sort,
            roleIds: [],
          };
          that.roleList = res.roleList;
          that.roleList.forEach((item) => {
            if (item.isSelect) {
              that.dialogForm.roleIds.push(item.roleId);
            }
          });

          that.loading = false;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.id) {
            editGroup(that.dialogForm)
              .then((res) => {
                that.loading = false;
                Message({
                  type: "success",
                  message: "操作成功",
                });
                this.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            addGroup(that.dialogForm)
              .then((res) => {
                that.loading = false;
                Message({
                  type: "success",
                  message: "操作成功",
                });
                this.$emit("close", { reload: true });
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
.vue-treeselect {
  width: 300px;
  .vue-treeselect__control {
    height: 32px;
    line-height: 32px;
  }
  .vue-treeselect__input {
    height: 32px;
    line-height: 32px;
  }
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
