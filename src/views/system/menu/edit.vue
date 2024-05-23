<template>
  <myDialog
    :title="title"
    width="500px"
    :loading="loading"
    class="dialog-form menuManage"
    :top="'15vh'"
    :visible="true"
    :cancel="cancel"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="父级菜单：" prop="depId">
        <treeselect
          v-model="dialogForm.parentId"
          :multiple="false"
          :close-on-select="true"
          :options="menuTree"
          :default-expand-level="2"
          :normalizer="treeSelectNormalizer"
          no-results-text="未找到相关结果"
          no-options-text="没有可选择的数据"
          placeholder="应用菜单"
          class="input-default"
        />
      </el-form-item>

      <el-form-item label="菜单名称：" prop="menuName">
        <el-input v-model.trim="dialogForm.menuName" class="input-default" />
      </el-form-item>
      <el-form-item label="链接地址：" prop="menuUrl">
        <el-input v-model.trim="dialogForm.menuUrl" class="input-default" />
      </el-form-item>
      <el-form-item   label="图标：" prop="icon">
        <el-input
          v-model="dialogForm.icon"
          class="input-default"
          clearable
          @focus="iconShow = true"
        >
          <template v-if="dialogForm.icon" slot="prepend" 
            ><i :class="dialogForm.icon"
          /></template>
        </el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="isMenu">
        <el-input-number v-model="dialogForm.sort" :min="1" :max="999" />
      </el-form-item>
      <!-- <el-form-item label="是否菜单：" prop="sort">
        <el-select
          v-model="dialogForm.isMenu"
          placeholder="请选择"
          class="input-default"
        >
          <el-option
            v-for="(item, i) in yesOrNoList"
            :key="i"
            :value="item.key"
            :label="item.key"
            >{{ item.key }}</el-option
          >
        </el-select>
      </el-form-item> -->
      <el-form-item
        v-if="operationalData"
        label="操作权限："
        prop="operationalIdList"
      >
        <el-checkbox-group v-model="dialogForm.operationalIdList">
          <el-checkbox
            v-for="(item, i) in operationalData"
            :key="i"
            :label="item.operId"
            name="operationalIdList"
          >
            {{ item.operName }}
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
        确 定
      </myButton>
    </template>
    <iconList :show="iconShow" @close="iconColse" />
  </myDialog>
</template>

<script>
import {
  menuDetail,
  menuAdd,
  menuEdit,
  operateList,
  treeList,
} from "../../../api/menu";
import { Message } from "element-ui";
import iconList from "./icon.vue";
import treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { iconList, treeselect },
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "菜单编辑";
      },
    },
    appId: {
      required: true,
      default() {
        return null;
      },
    },
    appName: {
      required: true,
      default() {
        return null;
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
    pid: {
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
      iconShow: false,
      operationalData: null,
      yesOrNoList: [],
      menuTree: [],
      dialogForm: {
        appId: null,
        id: null,
        menuName: null,
        menuUrl: null,
        sort: 0,
        parentId: null,
        icon: null,
      },
      formRules: {
        menuName: [
          { required: true, message: "请输入菜单名称！", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请输入菜单排序值！", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.dialogForm.parentId = this.pid;
    this.dialogForm.id = this.id;
    this.getMenuList();
    this.getOperational();
    // this.loadData();
  },
  computed: {
    level: function () {
      var lev = 0;
      if (this.menuTree.length > 0) {
        this.menuTree.forEach((item) => {
          if (this.dialogForm.parentId == item.id) {
            lev = 2;
          }
          if (item.children && item.children.length > 0) {
            item.children.forEach((child) => {
              if (this.dialogForm.parentId == child.id) {
                lev = 3;
              }
            });
          }
        });
      }
      return lev;
    },
  },
  methods: {
    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      // console.log(node);
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    getMenuList() {
      const that = this;
      treeList({ appId: this.appId })
        .then((res) => {
          that.menuTree = res.menuList;
          that.menuTree.forEach((item) => {
            item.level = 1;
            if (item.children.length > 0) {
              item.children.forEach((child1) => {
                child1.level = 2;
                if (child1.children.length > 0) {
                  child1.children.forEach((child2) => {
                    child2.level = 3;
                  });
                }
              });
            }
          });
          console.log(that.menuTree);
          if (that.id) {
            that.loadData();
          }
        })
        .catch(() => {});
    },
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      menuDetail({ id: this.id, appId: this.appId })
        .then((res) => {
          that.loading = false;
          that.dialogForm = {
            id: res.data.id,
            menuName: res.data.menuName,
            menuUrl: res.data.menuUrl,
            sort: res.data.sort < 0 ? 1 : res.data.sort,
            parentId: res.data.parentId == null ? that.pid : res.data.parentId,
            icon: res.data.icon,
          };
          // 处理页面权限信息
          // if (
          //   res.sysMenu.sysOperationalList &&
          //   res.sysMenu.sysOperationalList.length > 0
          // ) {
          //   res.sysMenu.sysOperationalList.map((item) => {
          //     that.dialogForm.operationalIdList.push(item.operId);
          //   });
          // }
          console.log(that.dialogForm);
        })
        .catch(() => {
          that.loading = false;
        });
    },
    // 获取菜单信息
    getOperational() {
      const that = this;
      that.loading = true;
      operateList()
        .then((res) => {
          that.loading = false;
          console.log(res);
          // that.operationalData = res;
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
      that.dialogForm.appId = that.appId;
      // if (that.pnode) {
      //   that.dialogForm.parentId = that.pnode.id;
      // }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (this.id) {
            menuEdit(that.dialogForm)
              .then((res) => {
                that.loading = false;
                Message({
                  type: "success",
                  message: "操作成功",
                });
                this.$emit("close", {
                  reload: true,
                  menuId: that.dialogForm.menuId,
                });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            menuAdd(that.dialogForm)
              .then((res) => {
                that.loading = false;
                Message({
                  type: "success",
                  message: "操作成功",
                });
                this.$emit("close", {
                  reload: true,
                  menuId: that.dialogForm.menuId,
                });
              })
              .catch(() => {
                that.loading = false;
              });
          }
        } else {
          return false;
        }
      });
      console.log(that.dialogForm);
    },
    // 新建数据
    cancel(done) {
      this.$emit("close", {});
    },
    iconColse(data) {
      this.iconShow = false;
      console.log(data);
      this.dialogForm.icon = data.name;
    },
  },
};
</script>

<style lang="less">
.menuManage {
  .vue-treeselect__menu {
    max-height: 200px !important;
  }
}
</style>
