<template>
  <div>
    <myDialog
      :loading="loading"
      :title="'操作权限配置'"
      :width="850"
      class="dialog-form"
      :visible="true"
      :cancel="cancel"
    >
      <div v-if="isSingle" class="table-classic-wrapper">
        <div class="content">
          <el-table
            :data="menuList"
            style="width: 100%"
            row-key="id"
            default-expand-all
            border
            height="400"
            :tree-props="{
              children: 'children',
              hasChildren: 'hasChildren',
            }"
            select-on-indeterminate
          >
            <el-table-column prop="name" label="菜单" min-width="120" />
            <el-table-column
              label="操作权限"
              prop="sysMenuList"
              align="center"
              min-width="220"
            >
              <template slot-scope="scope">
                <el-checkbox-group
                  v-model="scope.row.checkList"
                  @change="handleCheckedChange(scope.row, $event)"
                >
                  <el-checkbox
                    v-for="item in scope.row.sysMenuList"
                    :key="item.id"
                    :label="item.id"
                  >{{ item.operateName }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column label="全选" width="120" align="center">
              <template slot="header" slot-scope="scope">
                <el-checkbox
                  v-model="outerCheckAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckOuterAllChange(scope, $event)"
                >全选</el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.checkAll"
                  :indeterminate="scope.row.isIndeterminate"
                  @change="handleCheckAllChange(scope.row, $event)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="!isSingle">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="所属角色" name="first">
            <el-checkbox-group v-model="roleIds">
              <el-checkbox
                v-for="(item, i) in roleList"
                :key="i"
                :label="item.id"
                name="roleIds"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane label="特殊权限" name="second">
            <div class="table-classic-wrapper">
              <div class="content">
                <el-table
                  :data="menuList"
                  style="width: 100%"
                  row-key="id"
                  default-expand-all
                  border
                  height="380"
                  :tree-props="{
                    children: 'children',
                    hasChildren: 'hasChildren',
                  }"
                  select-on-indeterminate
                >
                  <el-table-column prop="name" label="菜单" min-width="120" />
                  <el-table-column
                    label="操作权限"
                    prop="sysMenuList"
                    align="center"
                    min-width="220"
                  >
                    <template slot-scope="scope">
                      <el-checkbox-group
                        v-model="scope.row.checkList"
                        @change="handleCheckedChange(scope.row, $event)"
                      >
                        <el-checkbox
                          v-for="item in scope.row.sysMenuList"
                          :key="item.id"
                          :label="item.id"
                        >{{ item.operateName }}</el-checkbox>
                      </el-checkbox-group>
                    </template>
                  </el-table-column>
                  <el-table-column label="全选" width="120" align="center">
                    <template slot="header" slot-scope="scope">
                      <el-checkbox
                        v-model="outerCheckAll"
                        :indeterminate="isIndeterminate"
                        @change="handleCheckOuterAllChange(scope, $event)"
                      >全选</el-checkbox>
                    </template>
                    <template slot-scope="scope">
                      <el-checkbox
                        v-model="scope.row.checkAll"
                        :indeterminate="scope.row.isIndeterminate"
                        @change="handleCheckAllChange(scope.row, $event)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <template slot="footer">
        <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
        <myButton
          :type="'confirm'"
          icon="el-icon-loading"
          :loading="loading"
          @click.native="submit"
        >
          提 交
        </myButton>
      </template>
    </myDialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {
  addGroupPower,
  groupPowerInfo,
  userRole,
  addUserRole
} from '../../../api/user'
import { detail, edit } from '../../../api/role'
export default {
  props: {
    groupId: {
      required: false,
      default() {
        return null
      }
    },
    roleId: {
      required: false,
      default() {
        return null
      }
    },
    userId: {
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      isSingle: true,
      activeName: 'first',
      editPermissionShow: false,
      editId: null,
      menuList: [],
      outerOptions: [],
      outerCheckAll: false,
      role: null,
      roleList: [],
      roleIds: [],
      timeStamp: null
    }
  },
  // watch: {
  //   menuList: {
  //     handler() {},
  //     immediate: true,
  //     deep: true
  //   }
  // },
  computed: {
    outerCheckList: function() {
      var checkList = []
      this.menuList.forEach((item) => {
        if (item.children.length > 0) {
          item.children.forEach((child1) => {
            if (child1.children.length > 0) {
              child1.children.forEach((child2) => {
                checkList = checkList.concat(child2.checkList)
              })
            } else {
              checkList = checkList.concat(child1.checkList)
            }
          })
        } else {
          checkList = checkList.concat(item.checkList)
        }
      })

      return checkList
    },
    isIndeterminate: function() {
      if (
        this.outerCheckList.length > 0 &&
        this.outerCheckList.length < this.outerOptions.length
      ) {
        return true
      }
      return false
    }
  },
  created() {
    if (this.userId) this.isSingle = false
    this.loadData()
  },
  methods: {
    handleClick(e) {
      console.log(e)
    },
    // 根据id加载数据
    loadData() {
      const that = this
      that.selectNodeOperList = []
      if (this.groupId) {
        that.loading = true
        groupPowerInfo({ groupId: this.groupId })
          .then((res) => {
            console.log(res)
            that.initData(res.menuList)
            that.loading = false
          })
          .catch(() => {
            that.loading = false
          })
      }
      if (this.roleId) {
        that.loading = true
        detail({ roleId: this.roleId })
          .then((res) => {
            console.log(res)
            that.initData(res.menuList)
            that.role = {
              roleId: res.role.roleId,
              roleName: res.role.roleName,
              remake: res.role.remake,
              isAdminRole: res.role.isAdminRole
            }
            that.loading = false
          })
          .catch(() => {
            that.loading = false
          })
      }
      if (this.userId) {
        that.loading = true
        userRole({ userId: this.userId })
          .then((res) => {
            console.log(res)
            that.initData(res.menuList)
            that.roleList = res.roleList
            that.roleIds = []
            that.roleList.forEach((item) => {
              if (item.isSelect) that.roleIds.push(item.id)
            })
            that.loading = false
          })
          .catch(() => {
            that.loading = false
          })
      }
    },
    initData(menuList) {
      var that = this
      that.outerOptions = []
      menuList.forEach((item) => {
        item.level = 0
        item.isIndeterminate = false
        item.options = []
        item.checkAll = false
        item.checkList = []

        if (item.sysMenuList && item.sysMenuList.length > 0) {
          item.sysMenuList.forEach((op) => {
            item.options.push(op.id)
            that.outerOptions.push(op.id)
            if (op.isSelect) {
              item.checkList.push(op.id)
            }
          })
        }

        if (item.children && item.children.length > 0) {
          item.children.forEach((child1) => {
            child1.level = 1
            child1.checkAll = false
            child1.isIndeterminate = false
            child1.checkList = []
            child1.options = []
            if (child1.sysMenuList && child1.sysMenuList.length > 0) {
              child1.sysMenuList.forEach((op) => {
                item.options.push(op.id)
                child1.options.push(op.id)

                if (op.isSelect) {
                  item.checkList.push(op.id)
                  child1.checkList.push(op.id)
                }
              })
            }
            if (child1.children && child1.children.length > 0) {
              child1.children.forEach((child2) => {
                child2.level = 2
                child2.checkAll = false
                child2.isIndeterminate = false
                child2.checkList = []
                child2.options = []
                if (child2.sysMenuList && child2.sysMenuList.length > 0) {
                  child2.sysMenuList.forEach((op) => {
                    item.options.push(op.id)
                    child1.options.push(op.id)
                    child2.options.push(op.id)
                    that.outerOptions.push(op.id)

                    if (op.isSelect) {
                      item.checkList.push(op.id)
                      child1.checkList.push(op.id)
                      child2.checkList.push(op.id)
                    }
                  })
                }

                if (
                  child2.checkList.length === child2.options.length &&
                  child2.options.length > 0
                ) {
                  child2.checkAll = true
                }
                if (
                  child2.checkList.length > 0 &&
                  child2.checkList.length < child2.options.length
                ) {
                  child2.isIndeterminate = true
                }
              })
            }
            if (
              child1.checkList.length === child1.options.length &&
              child1.options.length > 0
            ) {
              child1.checkAll = true
            }
            if (
              child1.checkList.length > 0 &&
              child1.checkList.length < child1.options.length
            ) {
              child1.isIndeterminate = true
            }
          })
        }
        if (
          item.checkList.length === item.options.length &&
          item.options.length > 0
        ) {
          item.checkAll = true
        }
        if (
          item.checkList.length > 0 &&
          item.checkList.length < item.options.length
        ) {
          item.isIndeterminate = true
        }
      })
      that.menuList = menuList
      this.timeStamp = new Date().getTime()
      that.outerCheckAll = that.getOuterCheckAll()
    },
    dgCheckAll(data, e) {
      if (data.children && data.children.length === 0) {
        data.checkList = e ? data.options : []
        data.isIndeterminate = false
        if (data.sysMenuList) {
          data.checkAll = e
        }
      }
      if (data.children && data.children.length > 0) {
        data.children.forEach((item) => {
          item.isIndeterminate = false
          item.checkAll = e
          this.dgCheckAll(item, e)
        })
      }
    },
    // 设置每一个全选按钮状态
    dgData() {
      this.menuList.forEach((item) => {
        var checkList = item.checkList
        item.checkList = []
        // if (checkList.length > 0) {
        //   item.checkList = item.checkList.concat(checkList)
        // }
        item.checkAll = false
        item.isIndeterminate = false
        if (item.children && item.children.length > 0) {
          item.children.forEach((child1) => {
            child1.isIndeterminate = false
            if (child1.children && child1.children.length > 0) {
              child1.checkList = []
              child1.checkAll = false
              child1.children.forEach((child2) => {
                child2.isIndeterminate = false
                // if (child2.children && child2.children.length > 0) {
                //   child2.checkList = []
                //   child2.checkAll = false
                //   child2.children.forEach((child3) => {
                //     child3.checkAll = false
                //     child3.isIndeterminate = false
                //     if (
                //       child3.checkList.length === child3.options.length &&
                //       child3.options.length > 0
                //     ) {
                //       child3.checkAll = true
                //     }
                //     if (
                //       child3.checkList.length > 0 &&
                //       child3.checkList.length < child3.options.length
                //     ) {
                //       child3.isIndeterminate = true
                //     }
                //     child2.checkList = child2.checkList.concat(
                //       child3.checkList
                //     )
                //   })
                // }

                child2.checkAll = false
                child2.isIndeterminate = false
                if (
                  child2.checkList.length === child2.options.length &&
                    child2.options.length > 0
                ) {
                  child2.checkAll = true
                }
                if (
                  child2.checkList.length > 0 &&
                    child2.checkList.length < child2.options.length
                ) {
                  child2.isIndeterminate = true
                }
                child1.checkList = child1.checkList.concat(child2.checkList)

                // if (
                //   child2.checkList.length === child2.options.length &&
                //   child2.options.length > 0
                // ) {
                //   child2.checkAll = true
                // }
                // if (
                //   child2.checkList.length > 0 &&
                //   child2.checkList.length < child2.options.length
                // ) {
                //   child2.isIndeterminate = true
                // }
                // child1.checkList = child1.checkList.concat(child2.checkList)
              })
            }
            if (
              child1.checkList.length > 0 &&
              child1.checkList.length < child1.options.length
            ) {
              child1.isIndeterminate = true
            }
            if (
              child1.checkList.length === child1.options.length &&
              child1.options.length > 0
            ) {
              child1.checkAll = true
            }
            item.checkList = item.checkList.concat(child1.checkList)
          })
        } else {
          item.checkList = item.checkList.concat(checkList)
        }
        if (
          item.checkList.length > 0 &&
          item.checkList.length < item.options.length
        ) {
          item.isIndeterminate = true
        }
        if (
          item.checkList.length === item.options.length &&
          item.options.length > 0
        ) {
          item.checkAll = true
        }
      })
    },
    handleCheckAllChange(data, e) {
      this.dgCheckAll(data, e)
      this.dgData()

      this.outerCheckAll = this.getOuterCheckAll()
    },
    handleCheckedChange(data, e) {
      const checkedCount = e.length
      data.checkAll = checkedCount === data.options.length
      data.isIndeterminate =
        checkedCount > 0 && checkedCount < data.options.length
      this.outerCheckAll = this.getOuterCheckAll()
      this.dgData()
    },
    handleCheckOuterAllChange(data, e) {
      this.menuList.forEach((item) => {
        item.checkAll = e
        item.isIndeterminate = false
        if (item.children.length > 0) {
          item.children.forEach((child1) => {
            child1.checkAll = e
            child1.isIndeterminate = false
            if (child1.children.length > 0) {
              child1.children.forEach((child2) => {
                child2.checkAll = e
                child2.isIndeterminate = false
                if (child2.children.length > 0) {
                  child2.children.forEach((child3) => {
                    child3.checkList = e ? child3.options : []
                    child3.checkAll = e
                  })
                } else {
                  child2.checkList = e ? child2.options : []
                  child2.checkAll = e
                }
              })
            } else {
              child1.checkList = e ? child1.options : []
              child1.checkAll = e
            }
          })
        } else {
          item.checkList = e ? item.options : []
          item.checkAll = e
        }
      })
      this.dgData()
    },
    getOuterCheckAll() {
      if (
        this.outerOptions.length > 0 &&
        this.outerOptions.length === this.outerCheckList.length
      ) {
        return true
      }
      return false
    },

    submit() {
      this.loading = true
      if (this.groupId) {
        addGroupPower({
          groupId: this.groupId,
          powerIds: this.outerCheckList
        })
          .then((res) => {
            this.loading = false
            Message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('close', {})
          })
          .catch(() => {
            this.loading = false
          })
      }
      if (this.roleId) {
        console.log(this.role)
        this.role.powerIds = this.outerCheckList
        edit(this.role)
          .then((res) => {
            this.loading = false
            Message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('close', {})
          })
          .catch(() => {
            this.loading = false
          })
      }
      if (this.userId) {
        console.log(this.userId)
        addUserRole({
          powerIds: this.outerCheckList,
          roleIds: this.roleIds,
          userId: this.userId
        })
          .then((res) => {
            this.loading = false
            Message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('close', {})
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 新建数据
    cancel(done) {
      this.$emit('close', {})
    }
  }
}
</script>

<style lang="less" scoped>
// /deep/.el-dialog{
//   height: 485px !important;
// }
/deep/.el-tabs__content{
  min-height: 420px;
}
</style>
