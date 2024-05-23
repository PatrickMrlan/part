<template>
  <div id="table-classic-wrapper" class="table-classic-wrapper">
    <el-col :span="6">
      <div class="block mh">
        <div class="title app-row">
          <div class="flex">组织架构</div>
        </div>
        <div class="content">
          <el-tree
            :key="timeStamp"
            :data="entList"
            node-key="id"
            :highlight-current="isHight"
            :default-expanded-keys="defaultShowNodes"
            :default-expand-all="false"
            :current-node-key="nowIndex"
            :expand-on-click-node="false"
            @node-click="nodeClick"
          >
            <span slot-scope="{ data }" class="app-tree-node">
              <span :title="data.name" class="node-text">{{ data.name }}</span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="18">
      <div
        ref="appRowHeight"
        class="app-list-control app-row"
        style="justify-content: flex-end"
      >
        <div class="right">
          <myButton
            v-if="pageOper.TJ"
            :type="'confirm'"
            icon="el-icon-plus"
            @click.native="addDept(null)"
          >添加
          </myButton>
        </div>
      </div>
      <div class="content">
        <el-table
          :data="treeData"
          style="width: 100%"
          row-key="id"
          default-expand-all
          border
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          select-on-indeterminate
          :height="screenHeight"
        >
          <el-table-column prop="name" label="组织机构名称" />
          <el-table-column prop="menuUrl" label="组织机构地址" />
          <el-table-column prop="icon" label="联系电话" sortable />
          <el-table-column
            label="操作"
            align="center"
            width="140"
            class="app-table-oper"
            fixed="right"
          >
            <template slot-scope="scope">
              <myHandle>
                <span
                  v-if="pageOper.TJ"
                  title="添加"
                  @click="addDept(scope.row)"
                >添加</span>
                <span
                  v-if="pageOper.XG"
                  title="编辑"
                  @click="editDept(scope.row)"
                >编辑</span>
                <span
                  v-if="pageOper.SC"
                  title="删除"
                  @click="deleteDept(scope.row)"
                >
                  删除
                </span>
              </myHandle>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <edit
      v-if="editShow"
      :id="editId"
      :title="titleName"
      :pnode="selectNode"
      :ent-id="nowIndex"
      @close="editColse"
    />
  </div>
</template>

<script>
import { list, remove } from '@/api/department'
// import { treeList } from '@/api/system/entManagement'
import { treeList } from "@/api/department";
import { Message } from 'element-ui'
// import { getTableList } from '../../../api'
import edit from './edit'
// import Pagination from '../../../components/Pagination'
// import Upload from '../../../components/Upload'

export default {
  name: 'Table',
  // components: { Pagination, Upload, edit },
  components: { edit },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      // 登录用户
      seesionLoginUser: JSON.parse(sessionStorage.getItem("loginUser") || "{}"),
      loading: false,
      editShow: false,
      treeData: [],
      // 新增/修改 标题
      titleName: null,
      titleTypeName: null,

      selectNode: null,
      editId: null,
      userList: [],
      selectDepId: null,
      screenHeight: null,
      nowIndex: null,
      entList: [],
      timeStamp: 0,
      entTotal: null,
      pageIndex: 1,
      isHight: true,
      defaultShowNodes: []
    }
  },
  mounted() {
    this.getEntList()
    setTimeout(() => {
      this.onResize()
    }, 0)
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.screenHeight = window.innerHeight
      const h = this.$refs.appRowHeight.offsetTop
      this.screenHeight = this.screenHeight - h - 60
      console.log(h, this.screenHeight)
    },
    pageCurrentChange() {
      console.log()
      this.getEntList()
    },
    getEntList() {
      const entId = this.seesionLoginUser.entId;
      treeList({ entId: entId }).then((res) => {
        res[0].children=[]
        this.entList = res
        this.entTotal = res.length
        this.timeStamp = new Date().getTime()
        this.entList.forEach((item) => {
          this.defaultShowNodes.push(item.entId)
        })
        this.nowIndex = this.entList[0].entId
        console.log(this.nowIndex,this.entList)

        this.getMainData()
      })
    },
    getMainData() {
      this.loading = true
      list({ entId: this.nowIndex })
        .then((res) => {
          // console.log(res)
          this.loading = false
          this.treeData = res
        })
        .catch(() => {
          this.loading = false
        })
    },
    nodeClick: function(data) {
      this.isHight = true
      this.nowIndex = data.id
      this.getMainData()
    },
    /**
     * 编辑页关闭事件
     */
    editColse(data) {
      this.editShow = false
      if (data.reload) {
        this.getMainData()
      }
    },
    addDept(data) {
      this.selectNode = data
      this.editId = null
      this.editShow = true
      this.titleName = '新增部门'
    },
    editDept(data) {
      this.selectNode = null
      this.editId = data.id + ''
      this.editShow = true
      this.titleName = '修改部门'
    },
    deleteDept(data) {
      console.log(data)
      this.$confirm('确认删除' + data.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          remove({ depId: data.id, value: data.title })
            .then((res) => {
              this.loading = false
              Message({
                type: 'success',
                message: '操作成功'
              })
              this.getMainData()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          // 取消删除
        })
    }
  }
}
</script>

<style lang="less" scoped>
.table-classic-wrapper {
  .content {
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  }
  .el-card {
    min-height: 656px;
  }

  .control-btns {
    margin-bottom: 20px;
  }

  .search-form {
    padding-top: 18px;
    margin-bottom: 15px;
    background-color: #f7f8fb;
  }

  .el-table thead {
    font-weight: 600;

    th {
      background-color: #f2f3f7;
    }
  }

  .upload-box,
  .export-data {
    width: 300px;
    margin: 0 auto 30px;
  }

  .upload-box {
    width: 156px;

    .files-upload {
      color: #20a0ff;
    }
  }

  .hints {
    font-size: 12px;
    color: #aaa;
    text-align: center;
  }
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #f56c6c;
}

/deep/#roleLeft {
  display: none;
}

/deep/.el-col-14 {
  width: 100% !important;
}
.mh{
  height: calc(100vh - 170px);
  min-height: calc(100vh - 175px);
  overflow: auto;
}
</style>

