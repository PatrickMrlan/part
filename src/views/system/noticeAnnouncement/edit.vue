<template>
  <myDialog
    :title="title"
    width="500px"
    class="dialog-form"
    :visible="show"
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
        <el-form-item label="通知标题：" prop="noticeTitle">
          <el-input
            v-model.trim="dialogForm.noticeTitle"
            type="text"
            class="input-default"
            placeholder="通知标题"
            clearable
          />
        </el-form-item>

        <el-form-item label="通知人员类型：" prop="noticeType">
          <el-select
            v-model="dialogForm.noticeType"
            placeholder="请选择"
            class="input-default"
            clearable
            filterable
            @change="changeNoticeType"
          >
            <el-option
              v-for="(item, i) in noticeTypeList"
              :key="i"
              :value="item.key"
              :label="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="接收人或单位：" prop="objectId">
          <el-tag
            v-for="(item, index) in tags"
            :key="index"
            closable
            @close="handleClose(item)"
            style="margin-right: 10px"
          >
            {{ item.showName }}
          </el-tag>
          <myButton @click.native="isShowLookup">选 择</myButton>
        </el-form-item>
        <el-form-item label="通知内容：" prop="noticeContent">
          <el-input
            v-model="dialogForm.noticeContent"
            type="textarea"
:rows="6"
            class="input-default"
            placeholder="通知内容"
            clearable
          />
        </el-form-item>
      </el-row>
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
    <lookup
      v-if="lookupShow"
      :multiple="true"
      :title="titleName"
      :show="lookupShow"
      :tags="tags"
      @close="lookupClose"
    />
  </myDialog>
</template>
  
<script>
import { detail, edit, add } from "@/api/system/noticeAnnouncement";
import { Message } from "element-ui";
import lookup from "./lookup.vue";
export default {
  components: { lookup },

  props: {
    title: {
      type: String,
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
    show: {
      required: false,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      loading: false,

      dialogForm: {
        noticeTitle: null, // 通知标题
        noticeContent: null, // 通知内容
        noticeType: null, // 通知人员类型
        objectId: null, // 通知接收人或单位的ids
        objectNames: null,
      },
      noticeTypeList: [],
      lookupShow: false,
      titleName: null,
      tags: [],
      formRules: {
        noticeTitle: [
          { required: true, message: "请输入通知标题！", trigger: "chenge" },
        ],
        noticeContent: [
          { required: true, message: "请输入通知内容！", trigger: "blur" },
        ],
        noticeType: [
          { required: true, message: "请选择通知人员！", trigger: "blur" },
        ],
        objectId: [
          {
            required: true,
            message: "请选择通知接收人或单位！",
            trigger: "change",
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
      detail({ id: that.id })
        .then((res) => {
          console.log(res);
          that.loading = false;
          that.noticeTypeList = res.noticeTypeList;
          that.dialogForm = res.entity;

          that.tags = res.objectList;
          that.tags.forEach((item) => {
            item.showId = item.id;
            item.showName = item.name;
          });
          console.log(that.tags);
        })
        .catch(() => {
          that.loading = false;
        });
    },
    // 显示查找带回的看板
    isShowLookup() {
      const that = this;
      switch (that.dialogForm.noticeType) {
        case "人员":
          that.titleName = "选择用户";
          break;
        case "部门":
          that.titleName = "选择部门";
          break;
        case "企业":
          that.titleName = "选择企业";
          break;
        case "分组":
          that.titleName = "选择用户分组";
          break;
      }
      this.lookupShow = true;
    },
    // 改变通知人员类型
    changeNoticeType() {
      this.dialogForm.objectId = null;
      this.dialogForm.objectNames = null;
      this.tags = [];
    },
    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this;
      console.log(that.dialogForm.powerIds);
      if (that.loading) {
        return;
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
    handleClose(tag) {
      const that = this;
      console.log(tag);
      console.log(that.tags);

      that.tags.forEach((item, index) => {
        if (item.id == tag.id) {
          that.tags.splice(index, 1);
        }
      });
      console.log(that.tags);
      that.dialogForm.objectId = "";
      that.sendDataChange();
    },
    /**
     * 查找带回
     */
    lookupClose(data, flag) {
      const that = this;
      that.lookupShow = false;
      if (flag) {
        that.tags = data;
      }
      that.lookupShow = false;
      if (data.length) {
        that.tags = data;
        console.log(that.tags);
        that.sendDataChange();
      }
    },
    sendDataChange() {
      const that = this;
      console.log(that.dialogForm.objectId);
      console.log(that.dialogForm.noticeType);

      that.tags.forEach((item) => {
        console.log(item);
        if (!that.dialogForm.objectId) {
          console.log(111);
          switch (that.dialogForm.noticeType) {
            case "人员":
              that.dialogForm.objectId = item.userId || item.id;
              item.showName = item.userName || item.name;
              item.showId = item.userId || item.id;
              break;
            case "部门":
              that.dialogForm.objectId = item.id;
              item.showName = item.name;
              item.showId = item.id;
              break;
            case "企业":
              that.dialogForm.objectId = item.entId || item.id;
              item.showName = item.entFullName || item.name;
              item.showId = item.entId || item.id;
              break;
            case "分组":
              that.dialogForm.objectId = item.id;
              item.showName = item.groupName || item.name;
              item.showId = item.id;
              break;
          }
        } else {
          console.log(222);
          switch (that.dialogForm.noticeType) {
            case "人员":
              that.dialogForm.objectId =
                that.dialogForm.objectId + "," + item.userId || item.id;
              item.showName = item.userName || item.name;
              item.showId = item.userId || item.id;
              break;
            case "部门":
              that.dialogForm.objectId =
                that.dialogForm.objectId + "," + item.id;
              item.showName = item.name;
              item.showId = item.id;
              break;
            case "企业":
              that.dialogForm.objectId =
                that.dialogForm.objectId + "," + item.entId || item.id;
              item.showName = item.entFullName || item.name;
              item.showId = item.entId || item.id;
              break;
            case "分组":
              that.dialogForm.objectId =
                that.dialogForm.objectId + "," + item.id;
              item.showName = item.groupName || item.name;
              item.showName = item.id;
              break;
          }
        }
      });
      console.log(that.tags);
    },
  },
};
</script>
  
  <style lang="less" scoped>
.input-default textarea {
  height: 44vh;
}
</style>
  