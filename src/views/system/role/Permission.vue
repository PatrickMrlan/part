<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :before-close="cancel"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
          <div>
            <el-tree
              :data="menuList"
              show-checkbox
              node-key="id"
              :expand-on-click-node="true"
              :default-expand-all="true"
              :props="defaultProps"
              :default-checked-keys="dialogForm.menuOperIdList"
              @check-change="treeCheckChange"
            />
          </div>
      <div class="footer-item">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="submitForm('dialogForm')"
        >
          提 交
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script>
import { detail, edit } from "../../../api/role";
import { Message } from "element-ui";
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "授权";
      },
    },
    id: {
      type: String,
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      drawer: true,
      loading: false,
      menuList: null,
      defaultProps: {
        children: "children",
        label: "name",
      },
      roleTypeList: [],
      dialogForm: {
        roleId: null,
        roleName: null,
        description: null,
        roleType: null,
        menuOperIdList: [],
      },
      formRules: {
        roleName: [
          { required: true, message: "请输入角色名称！", trigger: "blur" },
          {
            max: 20,
            message: "角色名称长度不能大于20",
            trigger: ["blur", "change"],
          },
        ],
        description: [
          {
            max: 50,
            message: "角色描述长度不能大于50",
            trigger: ["blur", "change"],
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
      console.log(this.id);
      detail({ roleId: this.id })
        .then((res) => {
          that.loading = false;
          that.roleTypeList = res.roleTypeList;
          that.dialogForm = {
            roleId: res.sysRole.roleId,
            roleName: res.sysRole.roleName,
            description: res.sysRole.description,
            roleType: res.sysRole.roleType,
            menuOperIdList: [],
          };

          for (const i in res.menuList) {
            that.setOperChildren(res.menuList[i]);
          }
          that.menuList = res.menuList;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    setOperChildren(item) {
      if (item.children.length > 0) {
        for (let i = 0; i < item.children.length; i++) {
          this.setOperChildren(item.children[i]);
        }
      } else if (
        item.sysMenuOperationalList != null &&
        item.sysMenuOperationalList.length > 0
      ) {
        for (let j = 0; j < item.sysMenuOperationalList.length; j++) {
          item.children.push({
            id: item.sysMenuOperationalList[j].menuOperId,
            name: item.sysMenuOperationalList[j].operName,
          });
          if (item.sysMenuOperationalList[j].isSelect) {
            this.dialogForm.menuOperIdList.push(
              item.sysMenuOperationalList[j].menuOperId
            );
          }
        }
        return;
      } else {
        return;
      }
    },
    treeCheckChange(data, ischeck, children) {
      if (ischeck) {
        this.dialogForm.menuOperIdList.push(data.id);
      } else {
        const index = this.dialogForm.menuOperIdList.indexOf(data.id);
        if (index > -1) {
          this.dialogForm.menuOperIdList.splice(index, 1);
        }
      }
    },
    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this;
      console.log(that.dialogForm);
      if (that.loading) {
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
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
// .input-default textarea{
//   height: 44vh;
// }
/deep/.el-drawer__header{
    font-size: 18px;
    font-weight: bold;
}
</style>
