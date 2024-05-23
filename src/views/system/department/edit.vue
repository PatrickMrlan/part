<template>
  <myDialog
    :title="title"
    width="860px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <div class="app-form-content">
          <el-col :span="12">
            <el-form-item label="组织名称：" prop="depName">
              <el-input
                v-model="dialogForm.depName"
                type="text"
                class="input-default"
                placeholder="组织名称"
                maxlength="50"
                clearable
              />
            </el-form-item>
            <el-form-item label="组织编码：" prop="depCode">
              <el-input
                v-model="dialogForm.depCode"
                type="text"
                class="input-default"
                placeholder="组织编码"
                maxlength="50"
                clearable
              />
            </el-form-item>
            <el-form-item label="排序：">
              <el-input-number
                v-model="dialogForm.depSort"
                type="text"
                :min="0"
                :max="999"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="pnode" label="父级名称：">
              <el-input
                v-model="pnode.name"
                type="text"
                :disabled="true"
                class="input-default"
              />
            </el-form-item>
            <el-form-item label="组织地址：" prop="depAddress">
              <el-input
                v-model="dialogForm.depAddress"
                type="text"
                class="input-default"
                placeholder="组织地址"
                maxlength="200"
                clearable
              />
            </el-form-item>

            <el-form-item label="联系电话：" prop="depTel">
              <el-input
                v-model="dialogForm.depTel"
                type="text"
                class="input-default"
                placeholder="座机（000-0000）或11为手机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部门负责人：" prop="userName">
              <el-tag
                v-for="(item, index) in tags"
                :key="index"
                closable
                style="margin-right: 10px"
                @close="handleClose(item)"
              >
                {{ item.userName }}
              </el-tag>
              <myButton @click.native="check">选 择</myButton>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                v-model="dialogForm.remark"
                type="textarea"
                :rows="6"
                placeholder="备注"
                :autosize="{ minRows: 4 }"
              /> </el-form-item
          ></el-col>
        </div>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        type="confirm"
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >
        提 交
      </myButton>
    </template>
    <lookup
      v-if="lookupShow"
      :multiple="true"
      :show="lookupShow"
      :tags="tags"
      @close="lookupClose"
    />
  </myDialog>
</template>

<script>
import { detail, edit, add } from "@/api/department";
import lookup from "./lookup.vue";
import { Message } from "element-ui";
export default {
  components: { lookup },
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "编辑组织架构";
      },
    },
    id: {
      type: String,
      required: false,
      default() {
        return null;
      },
    },
    entId: {
      required: false,
      default() {
        return null;
      },
    },
    pnode: {
      type: Object,
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      lookupShow: false,
      operationalData: null,
      dialogForm: {
        depId: null, // 部门id
        entId: null, // 企业id
        parentId: null, // 父级部门
        parentName: null, // 父级名称
        depCode: null, // 部门编码
        depName: null, // 部门名称
        depAddress: null, // 地址
        depTel: null, // 电话
        depSort: 0, // 部门排序
        remark: null, // 备注
        userName: null,
        userIdList: [],
      },
      tags: [],
      formRules: {
        depName: [
          { required: true, message: "请输入组织名称！", trigger: "blur" },
        ],
        depTel: [
          {
            pattern: /^(0\d{2,3}-\d{7,8})|(0\d{10,11})|(1\d{10})$/,
            message: "请输入正确的电话号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detail({ depId: this.id })
        .then((res) => {
          console.log(res);
          that.loading = false;
          that.dialogForm = res.entity;
          that.dialogForm.userIdList = res.userIds;
          that.dialogForm.userName = res.userNames;

          that.tags = res.users;
          that.tags.forEach((item) => {
            item.userName = item.name;
            item.userId = item.id;
          });
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
      if (that.pnode) {
        that.dialogForm.parentId = that.pnode.id;
        that.dialogForm.parentName = that.pnode.title;
      }
      if (that.entId) {
        that.dialogForm.entId = that.entId;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.id) {
            edit(that.dialogForm)
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
            add(that.dialogForm)
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
    check() {
      this.lookupShow = true;
    },
    handleClose(tag) {
      const that = this;
      that.tags.splice(this.tags.indexOf(tag), 1);
      that.dialogForm.userIdList = [];
      that.tags.forEach((item) => {
        that.dialogForm.userIdList.push(item.userId);
      });
    },

    /**
     * 用户选择带回
     */
    lookupClose(data, flag) {
      console.log(data);
      const that = this;
      that.lookupShow = false;
      that.dialogForm.userIdList = [];
      if (flag) {
        that.tags = data;
      }
      if (data.length) {
        that.tags = data;
        that.tags.forEach((item) => {
          that.dialogForm.userIdList.push(item.userId);
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
