<template>
  <div class="table-classic-wrapper">
    <el-card class="box-card topcard">
      <div class="headbox">
        <div class="warnicon">
          <i class="el-icon-warning " />
        </div>
        <div class="headright">
          <div class="headright_box">
            <p>{{ ledgerobj.auditCount ? ledgerobj.auditCount : 0 }} 个</p>
            <p>待审核</p>
          </div>
          <div class="headright_box">
            <p>
              专职 {{ ledgerobj.zzCount ? ledgerobj.zzCount : 0 }} 名、兼职
              {{ ledgerobj.jzCount ? ledgerobj.jzCount : 0 }} 名
            </p>
            <p>安全生产管理人员</p>
          </div>
          <div class="headright_box">
            <p>{{ ledgerobj.specialCount ? ledgerobj.specialCount : 0 }} 名</p>
            <p>特种作业人员</p>
          </div>
        </div>
      </div>
    </el-card>
    <el-col :span="6" class="leftbox">
      <div class="block">
        <div class="title app-row">
          <div class="flex">组织设置</div>
          <div class="unflex">
            <myButton
              :type="'confirm'"
              @click.native="association"
            >关联机构</myButton>
          </div>
        </div>
        <div class="content">
          <el-tree
            :key="timeStamp"
            v-loading="isLoading"
            :data="depList"
            node-key="id"
            :highlight-current="isHight"
            :default-expanded-keys="defaultShowNodes"
            :default-expand-all="false"
            :current-node-key="nowIndex"
            :expand-on-click-node="false"
            @node-click="nodeClick"
            @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse"
          >
            <span slot-scope="{ data }" class="app-tree-node">
              <span
                :title="data.name"
                class="node-text"
                style="  max-width: 170px;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;"
              >{{ data.name }}</span>
              <span class="node-btn" @click.stop="">
                <i
                  v-if="pageOper.TJ && data.name !== '全部'"
                  class="el-icon-plus"
                  @click.stop="editDictionary('add', data)"
                >&nbsp;</i>
                <i
                  v-if="pageOper.XG && data.isEnt !== 1 && data.name !== '全部'"
                  class="el-icon-edit-outline"
                  @click.stop="editDictionary('edit', data)"
                >&nbsp;</i>
                <i
                  v-if="pageOper.SC && data.isEnt !== 1 && data.name !== '全部'"
                  class="el-icon-delete"
                  @click.stop="deleteDictionary(data)"
                >&nbsp;</i>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="18">
      <div ref="appRowHeight" class="app-list-control app-row">
        <div class="flex">
          <el-input
            v-model="listQuery.keyword"
            placeholder="输入姓名、手机号码进行检索"
            class="input-clong"
            clearable
            @keyup.native.enter="search"
          />

          <el-select
            v-model="listQuery.jobNature"
            placeholder="专职/兼职"
            class="input-lsmall"
            clearable
            filterable
          >
            <el-option
              v-for="item in jobNatureList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="listQuery.sex"
            placeholder="性别"
            class="input-ssmall"
            clearable
            filterable
          >
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="listQuery.workType"
            placeholder="人员类型"
            class="input-small"
            clearable
            filterable
          >
            <el-option
              v-for="item in workTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="listQuery.isSpecial"
            placeholder="是否特种作业"
            class="input-snormal"
            clearable
            filterable
          >
            <el-option
              v-for="item in ifjob"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="listQuery.userState"
            placeholder="账号状态"
            class="input-small"
            clearable
            filterable
          >
            <el-option
              v-for="item in userStateList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>

          <el-button
            icon="el-icon-circle-close"
            style="margin-bottom: 10px"
            circle
            @click="clearAll"
          />
          <myButton
            :type="'search'"
            icon="el-icon-search"
            @click.native="search"
          >搜索</myButton>
        </div>
        <div class="right">
          <myButton
            v-if="pageOper.TJ"
            :type="'confirm'"
            icon="el-icon-plus"
            @click.native="edit(null)"
          >新增用户</myButton>
          <myButton
            v-if="pageOper.SC"
            type="remove"
            icon="el-icon-delete"
            @click.native="remove(null)"
          >删除用户</myButton>
        </div>
      </div>
      <myTable
        ref="fileTable"
        :show-index="true"
        :checked="checked"
        :loading.sync="loading"
        :d-c-authority="pageOper.DC"
        :table-data.sync="tableData"
        :selection="true"
        :row-key="rowKey"
        :total.sync="total"
        :page-index="listQuery.pageIndex"
        custom-label="操作"
        custom-label-width="160px"
        :on-resize-height="116"
        @change="multiple"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
        @getExportTableData="getExportTableData"
      >
        <template slot="custom" slot-scope="scope">
          <myHandle>
            <span
              v-if="pageOper.SH && scope.data.row.userState == '待审核'"
              title="审核"
              @click="process(scope.data.row)"
            >审核</span>
            <span
              v-if="pageOper.XG"
              title="编辑"
              @click="edit(scope.data.row)"
            >编辑</span>
            <span
              v-if="pageOper.SC && scope.data.row.userState != '正常'"
              title="删除"
              @click="remove(scope.data.row)"
            >删除</span>
          </myHandle>
        </template>
      </myTable>
    </el-col>

    <treeedit
      v-if="treeShow"
      :id="treeId"
      :pid="treepid"
      :title="treetit"
      :is-ent="isEnt"
      :treetype="treetype"
      @close="treeColse"
    />

    <edit
      v-if="editShow"
      :id="editId"
      :title="titleName"
      :ent-dep="entDep"
      @close="editColse"
    />
  </div>
</template>

<script>
import { list, enumList, ledger, del, audit } from '@/api/security/institution'
import { remove as depdel } from '@/api/department'
import { treeList } from '@/api/department'
import edit from './edit'
import treeedit from './treeedit'

export default {
  components: { edit, treeedit },
  data() {
    return {
      // 登录用户
      seesionLoginUser: JSON.parse(sessionStorage.getItem('loginUser') || '{}'),
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      depList: [], // 部门数组
      timeStamp: 0,
      nowIndex: null,
      defaultShowNodes: [],
      isHight: true,
      loading: false,
      isLoading: false,
      jobNatureList: [], // 枚举
      sexList: [],
      userStateList: [],
      workTypeList: [],
      jobTypeList: [],
      ifjob: [
        {
          key: '否',
          val: 0
        },
        {
          key: '是',
          val: 1
        }
      ],
      // 查询列表参数对象
      listQuery: {
        entId: null,
        depId: null,
        keyword: null,
        userState: null,
        jobNature: null,
        isSpecial: null,
        sex: null,
        workType: null,
        pageIndex: 1,
        pageSize: 10
      },
      ledgerobj: {},
      tableData: [],
      checked: [
        { key: '账号', val: 'loginCode', align: 'center', width: '100px' },
        { key: '姓名', val: 'name', align: 'center', width: '100px' },
        { key: '性别', val: 'sex', align: 'center', width: '80px' },
        { key: '电话', val: 'tel', align: 'center', width: '120px' },
        { key: '生日', val: 'birthday', align: 'center', width: '120px' },
        { key: '部门', val: 'depNames', align: 'center' },
        {
          key: '是否特种作业',
          width: '120px',
          val: 'nodeName',
          align: 'center'
        },
        { key: '人员类型', val: 'workType', align: 'center', width: '120px' },
        { key: '专职/兼职', width: '100px', val: 'jobNature', align: 'center' },
        { key: '账号状态', val: 'userState', align: 'center' }
      ],
      total: 0,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      treeShow: false,
      treeId: null,
      treepid: null,
      treetit: '',
      isEnt: null,
      treetype: '',
      // 新增/修改 标题
      titleName: null,
      editShow: false,
      editId: null,
      entList: [], // 企业数组
      deptree: [],
      userId: null,
      isHight: true,
      workTypeList: [],
      // 多选数据暂存数组
      multipleSelection: [],
      entId: null,
      entDep: null
    }
  },
  async created() {
    if (this.multiple) {
      this.customLabel = null
    }
    await this.getEnumList()
    await this.getledger()
    await this.getTreeList()
  },

  methods: {
    // 树节点展开
    handleNodeExpand(data) {
      // 保存当前展开的节点
      let flag = false
      this.defaultShowNodes.some(item => {
        if (item === data.id) { // 判断当前节点是否存在， 存在不做处理
          flag = true
          return true
        }
      })
      if (!flag) { // 不存在则存到数组里
        this.defaultShowNodes.push(data.id)
      }
    },
    // 树节点关闭
    handleNodeCollapse(data) {
      this.defaultShowNodes.some((item, i) => {
        if (item === data.id) {
          // 删除关闭节点
          this.defaultShowNodes.length = i
        }
      })
    },

    getEnumList() {
      const that = this
      that.loading = true
      // 获取枚举列表
      enumList()
        .then(res => {
          that.loading = false
          that.jobNatureList = res.jobNatureList
          that.workTypeList = res.workTypeList
          that.sexList = res.sexList
          that.userStateList = res.userStateList
          that.jobTypeList = res.jobTypeList
        })
        .catch(() => {
          that.loading = false
        })
    },
    // 台账
    getledger() {
      ledger().then(res => {
        this.ledgerobj = res
      })
    },
    // 点击tree树的子节点
    nodeClick: function(data) {
      this.isHight = true
      // console.log(data);
      if (data.isEnt) {
        this.listQuery.entId = data.id
        this.listQuery.depId = null
      } else {
        this.listQuery.depId = data.id
        this.listQuery.entId = null
      }
      this.entDep = data
      this.search()
    },
    /**
     * 清空全部条件
     */
    clearAll() {
      this.listQuery.entId = null
      this.listQuery.depId = null
      this.listQuery.keyword = null
      this.listQuery.userState = null
      this.listQuery.jobNature = null
      this.listQuery.isSpecial = null
      this.listQuery.sex = null
      this.listQuery.workType = null
      this.search()
    },
    rowKey(row) {
      return row.id
    },
    getTreeList() {
      const entId = this.seesionLoginUser.entId
      this.isLoading = true
      treeList({ entId: entId }).then(res => {
        this.depList = res
        this.isLoading = false
        this.timeStamp = new Date().getTime()

        this.nowIndex = this.depList[0].id
        this.listQuery.entId = this.nowIndex
        console.log(this.nowIndex)

        if (this.depList.length > 0) {
          this.entDep = this.depList[0]
        }

        this.depList.unshift({
          id: null,
          name: '全部'
        })
        this.getMainData()
      })
    },
    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = e
    },
    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      // console.log(node);
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      }
    },
    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this
      this.loading = true
      list(that.listQuery)
        .then(res => {
          that.loading = false
          that.entList.forEach(item => {
            if (item.isSelect === '1') {
              that.entId = item.id
            }
          })
          that.tableData = res.records
          that.listQuery.pageSize = res.size
          that.listQuery.pageIndex = res.current
          that.total = res.total
        })
        .catch(() => {
          that.loading = false
        })
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1
      this.tableData = []
      this.getMainData()
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.getMainData()
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex
      this.getMainData()
    },

    /**
     * 1. 获取导出表格的数据
     * 2. 调用子组件的方法实现导出
     */
    getExportTableData(total) {
      const that = this
      that.loading = true
      that.listQuery.pageIndex = 1
      that.listQuery.pageSize = total
      list(that.listQuery)
        .then(res => {
          that.$refs.fileTable.exportTable(res.records)
        })
        .finally(() => {
          that.loading = false
        })
    },
    // 审核
    process(data) {
      console.log(data)
      this.$confirm('请选择审核是否通过？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '同意',
        cancelButtonText: '拒绝'
      })
        .then(() => {
          const index = this.findIndex(this.userStateList, 'key', '正常')
          const obj = {
            id: data.id,
            value: this.userStateList[index].value
          }
          audit(obj).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getMainData()
          })
        })
        .catch(action => {
          if (action === 'cancel') {
            const index = this.findIndex(this.userStateList, 'key', '已禁用')
            const obj = {
              id: data.id,
              value: this.userStateList[index].value
            }
            audit(obj).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getMainData()
            })
          }
        })
    },
    findIndex(arr, key, value) {
      return arr.findIndex(obj => obj[key] === value)
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      // data 为 null 时添加
      if (data == null) {
        this.editId = null
        this.titleName = '新增用户'
      } else {
        this.editId = data.id
        this.titleName = '修改用户'
      }
      this.editShow = true
    },
    /**
     * 关闭编辑页面
     */
    treeColse(data) {
      this.treeShow = false
      if (data.reload) {
        this.getTreeList()
      }
    },
    editColse(data) {
      this.editShow = false
      if (data.reload) {
        this.getMainData()
      }
    },
    /**
     * 删除/批量删除事件
     */
    remove(data) {
      const that = this
      let deleteData = []

      let isNormalAccountFound = false // 增加一个标志来跟踪是否找到正常账户

      if (data == null) {
        for (const item of that.multipleSelection) {
          if (item.userState == '正常') {
            that.$message({
              type: 'warning',
              message: '正常账号不能删除!'
            })
            isNormalAccountFound = true
            break // 找到正常账号后立即停止循环
          }
          deleteData.push(item.parkUserId)
        }
      } else {
        deleteData = [data.parkUserId]
      }

      if (isNormalAccountFound || deleteData.length === 0) {
        // 检查标志或者deleteData为空
        if (!isNormalAccountFound) {
          that.$message({
            type: 'warning',
            message: '请选择需要删除的数据!'
          })
        }
        return
      }
      this.$confirm('确认删除选中的' + deleteData.length + '条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true

          del(deleteData)
            .then(res => {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getMainData()
            })
            .finally(() => {
              that.loading = false
              that.multipleSelection = []
              that.$refs.fileTable.$refs.multipleTable.clearSelection()
            })
        })
        .catch(() => {
          // 取消删除
        })
    },
    editDictionary(type, data) {
      this.treeShow = true
      this.treetype = type
      if (type == 'add') {
        this.treeId = null
        if (data.isEnt === 0) {
          this.treepid = data.entId
          this.treeId = data.id
          this.isEnt = data.isEnt
        } else {
          this.treepid = data.id
          this.treeId = data.id
          this.isEnt = data.isEnt
        }
        this.treetit = '新增部门'
      } else {
        this.treepid = data.entId
        this.treeId = data.id
        this.treetit = '编辑部门'
      }
    },
    deleteDictionary(data) {
      var that = this
      this.$confirm('确认删除' + data.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          that.isLoading = true
          depdel({ depId: data.id })
            .then(res => {
              that.isLoading = false
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getTreeList()
            })
            .finally(() => {
              that.isLoading = false
            })
        })
        .catch(() => {
          // 取消删除
        })
    },
    // 关联机构
    association() {
      this.$router.push({
        path: '/security/institution/organtabel',
        query: {
          name: '关联机构'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.warnicon i {
  font-size: 60px;
  color: #ffb219;
  margin-right: 10px;
}
.headbox {
  display: flex;
  align-items: center;
  font-size: 14px;
  .headright {
    display: flex;
    &_box {
      margin: 0 30px;
    }
    .headright_box {
      margin: 0 20px;
      p {
        text-align: center;
      }
    }
  }
}
// .headright_box > :nth-child(1) {
//   font-weight: 600;
// }

/deep/.topcard {
  margin-bottom: 20px;
}
.block {
  height: calc(100vh - 290px);
  min-height: calc(100vh - 295px);
  overflow: auto;
}
.input-clong {
  width: 216px !important;
}
.input-lsmall {
  width: 110px !important;
}
.input-snormal {
  width: 130px !important;
}
.input-ssmall {
  width: 75px !important;
}
</style>
