<template>
  <div class="table-classic-wrapper">
    <el-card class="box-card topcard">
      <div class="headbox">
        <div class="warnicon">
          <i class="el-icon-warning " />
        </div>
        <div class="headright">
          <div class="headright_box">
            <p>{{ selfLedger.selfCount ? selfLedger.selfCount : 0 }}</p>
            <p>企业自查数量</p>
          </div>
          <div class="headright_box">
            <p>{{ selfLedger.noSelfCount ? selfLedger.noSelfCount : 0 }}</p>
            <p>外部检查数量</p>
          </div>
        </div>

      </div>
    </el-card>
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="隐患排查名称"
          clearable
          class="input-long"
          @keyup.native.enter="search"
        />

        <el-select
          v-model="listQuery.hazardState"
          filterable
          class="input-normal"
          clearable
          placeholder="请选择隐患状态"
        >
          <el-option
            v-for="(item, index) in enumList.hazardStateList"
            :key="index"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <myButton
          v-if="pageOper.CX"
          type="search"
          icon="el-icon-search"
          @click.native="search"
        >搜索</myButton>
      </div>
      <div class="right">
        <myButton
          v-if="pageOper.TJ"
          icon="el-icon-plus"
          @click.native="edit(null)"
        >添加</myButton>
        <!-- <myButton
          v-if="pageOper.SC"
          type="remove"
          icon="el-icon-delete"
          @click.native="remove(null)"
          >删除</myButton
        > -->
      </div>
    </div>

    <myTable
      ref="fileTable"
      :row-key="rowKey"
      :show-index="true"
      :selection="false"
      :checked="checked"
      :loading.sync="loading"
      :table-data.sync="tableData"
      :d-c-authority="pageOper.DC"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      custom-label="操作"
      custom-label-width="220px"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span title="二维码" @click="qrCode('cay_2',scope.data.row)">
            二维码
          </span>
          <span
            v-if="
              pageOper.XG &&
                scope.data.row.resultCount > 0 &&
                scope.data.row.hazardState == '进行中'
            "
            title="去整改"
            @click="goRect(scope.data.row)"
          >
            去整改
          </span>
          <span v-if="pageOper.DC" title="导出" @click="exportData(scope.data.row)">
            导出
          </span>
          <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
            编辑
          </span>
          <span v-if="pageOper.SC" title="删除" @click="remove(scope.data.row)">
            删除
          </span>
        </myHandle>
      </template>
    </myTable>

    <edit
      v-if="editShow"
      :id="editId"
      :visible="editShow"
      :title="titleName"
      @close="editClose"
    />

    <rectDialog
      v-if="rectShow"
      :id="editId"
      :title="titleName"
      @close="editClose"
    />
    <qrCode
      v-if="qrCodeShow"
      :url="qrUrl"
      @close="qrClose"
    />
  </div>
</template>
<script>
import { list, enumList, remove, exportData, selfLedger } from '@/api/security/danger'
import edit from './edit.vue'
import rectDialog from './rectDialog.vue'
import { mapGetters } from 'vuex'
import qrCode from '../hazard/task/qrCode'

export default {
  components: { edit, rectDialog, qrCode },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,

      loading: false,
      pageOper: this.getPageOper(this.$route),

      listQuery: {
        keyword: null,
        hazardState: null,
        taskId: null,
        pageIndex: 1,
        pageSize: 10
      },
      qrCodeShow: false,
      qrUrl: null,

      tableData: [],
      total: 0,
      multipleSelection: [],
      checked: [
        { key: '隐患排查名称', val: 'hazardName' },
        { key: '检查类型', val: 'examType', width: 120, align: 'center' },
        { key: '隐患数量', val: 'resultCount', width: 100, align: 'center' },
        { key: '状态', val: 'hazardState', width: 120, align: 'center' }
      ],
      titleName: null,
      editShow: false,
      rectShow: false,
      editId: null,

      enumList: {},
      selfLedger: {}
    }
  },
  created() {
    this.getSelfLedger()
    this.getMainData()
  },
  computed: {
    ...mapGetters('app', ['themeColor'])
  },
  methods: {
    rowKey(row) {
      return row.hazardId
    },
    getSelfLedger() {
      this.loading = true
      selfLedger()
        .then((res) => {
          console.log(res)
          this.selfLedger = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    search() {
      this.tableData = []
      this.listQuery.pageIndex = 1
      this.getMainData()
    },
    qrCode(str, data) {
      this.qrUrl = str + data.hazardId

      this.qrCodeShow = true
    },
    qrClose() {
      this.qrCodeShow = false
    },
    /**
     * 分页数据加载
     */
    getMainData() {
      enumList().then((res) => {
        this.enumList = res
      })

      this.loading = true
      list(this.listQuery)
        .then((res) => {
          console.log(res)
          this.tableData = res.records
          this.total = res.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    exportData(data) {
      this.loading = true
      exportData({ id: data.hazardId })
        .then((res) => {
          if (res) {
            window.open(this.baseURL + res)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    edit(data) {
      if (data) {
        this.titleName = '编辑隐患排查'
        this.editId = data.hazardId
      } else {
        this.titleName = '新增隐患排查'
        this.editId = null
      }
      this.editShow = true
    },

    goRect(data) {
      this.editId = data.hazardId
      this.titleName = '待整改列表'
      this.rectShow = true
    },

    /**
     * 关闭侧边框
     */
    editClose(data) {
      this.editShow = false
      this.rectShow = false
      if (data.reload) {
        this.getMainData()
      }
    },

    remove(data) {
      const that = this

      // if (data == null) {
      //   that.multipleSelection.forEach((item) => {
      //     deleteData.push(item.hazardId);
      //   });
      // } else {
      //   deleteData = [data.hazardId];
      // }

      // if (deleteData.length === 0) {
      //   that.$message({
      //     type: "warning",
      //     message: "请选择需要删除的数据!",
      //   });
      //   return;
      // }
      that
        .$confirm('确认删除选中的这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.loading = true

          remove({ id: data.hazardId })
            .then((res) => {
              that.loading = false
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

    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = e
    },

    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.getConfigureList()
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex
      this.getConfigureList()
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
        .then((res) => {
          that.$refs.fileTable.exportTable(res.records)
        })
        .finally(() => {
          that.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.filter {
  display: flex;
  align-items: center;
  & > div {
    padding: 1px 5px;
    background: #ccc;
    border-radius: 3px;
    margin-right: 5px;
    cursor: pointer;
    color: #000;
  }
}.warnicon i {
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
      margin: 0 20px;
    }
    .headright_box{
        margin: 0 20px;
        p {
        text-align: center;
      }
    }
  }
}
.headright_box > :nth-child(1) {
  font-size: 18px;
  font-weight: 600;
}
/deep/.topcard {
  margin-bottom: 20px;
}
.input-with {
  width: 280px !important;
}
.fileName {
  color: rgb(30, 119, 235);
}
</style>
