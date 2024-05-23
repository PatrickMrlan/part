<template>
  <div>
    <div ref="table" class="shadow table">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane name="first" label="审批">
          <el-table
            ref="fileTable"
            :data="tableData"
            style="width: 100%"
            :loading="loading"
            highlight-current-row
            height="250px"
            :header-cell-style="{
              height: '50px',
              fontSize: '14px',
              color: '#000000E0',
            }"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            />
            <el-table-column prop="describeInfo" label="代办事项" />
            <!-- <el-table-column
              prop="state"
              label="状态"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <div>
                  <i
                    class="stateIcon"
                    :style="{
                      backgroundColor:
                        scope.row.state == '正常' ? '#52C41A' : '#FF4D4F',
                    }"
                  />
                  <span
                    :style="{
                      color: scope.row.state == '正常' ? '' : '#FF4D4F',
                    }"
                  >{{ scope.row.state }}</span>
                </div>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="sourceType"
              label="来源"
              width="150"
              align="center"
            />

            <el-table-column
              prop="addTime"
              label="时间"
              width="150"
              align="center"
            />
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <myHandle>
                  <span
                    title="前往审核"
                    @click="goPage(scope.row.url)"
                  >前往审核</span>
                </myHandle>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- <el-tab-pane name="second" label="任务"> 任务 </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {
          approval: {}
        }
      }
    }

  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      resizeHeight: null,
      tableData: [
        // {
        //   agent: '************审批',
        //   date: '2016-05-02',
        //   state: '正常',
        //   source: '机构设置'
        // },
        // {
        //   agent: '************风险分级管控审批',
        //   date: '2018-11-02',
        //   state: '超时',
        //   source: '风险分级管控'
        // },
        // {
        //   agent: '******审批',
        //   date: '2023-09-15',
        //   state: '正常',
        //   source: '隐患排查治理'
        // },
        // {
        //   agent: '******审批',
        //   date: '2023-09-15',
        //   state: '正常',
        //   source: '隐患排查治理'
        // },
        // {
        //   agent: '******审批',
        //   date: '2023-09-15',
        //   state: '正常',
        //   source: '隐患排查治理'
        // }
      ]
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      if (this.data && this.data.approval && this.data.approval.messageList) {
        this.tableData = this.data.approval.messageList
      }
    })
  },
  methods: {
    goPage(url) {
      if (url) {
        this.$router.push({
          path: url
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
// .table {
//   width: 67%;
// }

/deep/.stateIcon {
  display: inline-block;
  margin-right: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.shadow {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0px 3px 6px 1px rgba(21, 34, 50, 0.16);
  box-sizing: border-box;
  .title {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    border-bottom: 2px solid #e7eaef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    white-space: nowrap;
    .text {
      font-size: 16px;
      font-family: "Microsoft YaHei, Microsoft YaHei";
      color: #262626;
      display: flex;
      align-items: center;
      span {
        color: #006eff;
      }
    }
    .text::before {
      content: "";
      height: 21px;
      width: 4px;
      background: #1182fb;
      margin-right: 5px;
    }

    .more {
      cursor: pointer;
      display: flex;
      align-items: center;
      span {
        font-size: 12px;
        color: #006eff;
      }
    }
  }
}
</style>
