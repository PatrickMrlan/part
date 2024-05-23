<template>
  <div class="box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabPane"
        :key="index"
        :name="item.name"
        :isType="item.isType"
        :value="item.value"
      >
        <template slot="label">
          <div>{{ item.name }}({{ item.num }})</div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="content">
      <div class="searchBox app-row">
        <div class="flex">
          <el-input
            v-model="listQuery.keyword"
            placeholder="请输入措施名称"
            clearable
            class="input-long"
          />
          <!-- <el-select
            class="input-normal"
            placeholder="是否管控"
            filterable
          ></el-select> -->

          <myButton type="search" icon="el-icon-search" @click.native="search"
            >搜索</myButton
          >
        </div>
        <div class="right"></div>
      </div>

      <ul class="tableList" v-loading="loading" v-if="tableList.length">
        <li class="boxShadow" v-for="(item, index) in tableList" :key="index">
          <div class="li_item">
            <div class="measure">
              <div class="info">
                <div class="pic">
                  <img src="@/assets/img/enterprise/measure-listIcon.png" />
                </div>
                <div class="name">
                  <p>措施名称</p>
                  <p>{{ item.measureName }}</p>
                </div>
              </div>
              <div class="middle">
                <div class="sort">
                  <div>措施分类</div>
                  <div v-show="item.measureType || item.measureClassification">
                    <span>{{ item.measureTypeKey }}</span>
                    <span>{{ item.measureClassificationKey }}</span>
                  </div>
                </div>
                <div class="type">
                  <div>事故类型</div>
                  <div>{{ item.accidentTypeKey }}</div>
                </div>
              </div>
              <div class="operate">
                <my-handle>
                  <span @click="edit(item, false)">编辑</span>
                  <span @click="remove(item)">删除</span>
                </my-handle>
              </div>
            </div>
            <el-collapse-transition>
              <div class="table" v-show="item.isExpand">
                <el-table
                  :data="item.measureStandardList"
                  style="width: 100%"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  size="small"
                  highlight-current-row
                  border
                  :header-cell-style="{
                    height: '50px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }"
                  :cell-style="{
                    fontSize: '14px',
                  }"
                  :row-style="{
                    cursor: 'pointer',
                  }"
                >
                  <el-table-column
                    type="index"
                    align="center"
                    width="50"
                    label="序号"
                  />
                  <el-table-column
                    prop="inspectionStandards"
                    label="检查标准"
                  />
                  <el-table-column prop="postName" label="责任人" />
                  <el-table-column
                    prop="inspectionFrequency"
                    label="检查频率"
                  />
                  <!-- <el-table-column prop="addTime" label="最近巡检时间" /> -->
                  <!-- <el-table-column prop="addTime" label="下次巡检时间" /> -->

                  <el-table-column label="操作" align="center" width="120">
                    <my-handle>
                      <span @click="edit(item, true)">编辑</span>
                      <!-- <span>删除</span> -->
                    </my-handle>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-transition>
          </div>

          <div class="li_bottom">
            <div @click="edit(item, true)">
              <i class="el-icon-plus" /><span>添加检查标准</span>
            </div>
            <div
              @click="clickExpand(item)"
              v-show="
                item.measureStandardList && item.measureStandardList.length
              "
            >
              <span>{{ item.isExpand ? "收拢" : "展开" }}</span
              ><i
                :class="
                  item.isExpand ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                "
              />
            </div>
          </div>
        </li>
      </ul>
      <div v-else>
        <el-empty :image-size="200"></el-empty>
      </div>
    </div>

    <editMeasure
      v-if="editMeasureShow"
      :title="titleName"
      :id="editId"
      :isDisabled="isDisabled"
      @close="editClose"
    />
  </div>
</template>
  
  <script>
import { list, deleteMajor, measureType } from "@/api/risk/measures";

import editMeasure from "../editMeasure.vue";

export default {
  components: { editMeasure },

  props: {},
  data() {
    return {
      loading: false,
      activeName: "",

      listQuery: {
        keyword: null,
        accidentId: null,
        measureClassification: null,
        measureType: null,
        riskPointId: null,
      },
      tableList: [],
      tabPane: [],

      editRiskSourceShow: false,
      editMeasureShow: false,
      editId: null,
      titleName: null,
      isDisabled: false,
    };
  },

  async mounted() {
    await this.getMeasure();
  },
  watch: {},
  beforeDestroy() {},
  methods: {
    clickExpand(data) {
      data.isExpand = !data.isExpand;
      this.$forceUpdate();
    },

    /**
     * 查询按钮事件
     */
    search() {
      this.tableData = [];
      this.getMainData();
    },

    handleClick(tab, event) {
      this.listQuery.measureType = null;
      this.listQuery.measureClassification = null;

      if (tab.$attrs.isType) {
        this.listQuery.measureType = tab.$attrs.value;
      } else {
        this.listQuery.measureClassification = tab.$attrs.value;
      }

      this.getMainData();
    },

    getMeasure() {
      const that = this;
      measureType({ riskPointId: that.$route.query.id }).then((res) => {
        that.tabPane = res;
        that.activeName = that.tabPane[0].name;

        if (that.tabPane[0].isType) {
          that.listQuery.measureType = that.tabPane[0].value;
        } else {
          that.listQuery.measureClassification = that.tabPane[0].value;
        }
        this.getMainData();
      });
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;

      that.loading = true;
      that.listQuery.riskPointId = that.$route.query.id;

      list(that.listQuery)
        .then((res) => {
          that.tableList = res.list;
          that.tableList.forEach((item) => {
            item.isExpand = false;
          });
        })
        .finally(() => {
          that.loading = false;
        });
    },

    edit(data, flag) {
      if (data.accidentId) {
        this.titleName = "管控措施";
        this.editId = data.accidentId;
        this.editMeasureShow = true;
        this.isDisabled = flag;
      }
    },

    /**
     * 关闭编辑页面
     */
    editClose(data) {
      if (data.reload) {
        this.getMeasure();
        this.getMainData();
      }
      this.editMeasureShow = false;
    },

    // 列表删除
    remove(data) {
      const that = this;

      this.$confirm("确认删除此条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;

          deleteMajor(data)
            .then((res) => {
              that.$message({
                type: "success",
                message: "操作成功",
              });
              this.getMeasure();
              this.getMainData();
            })
            .finally(() => {
              that.loading = false;
            });
        })
        .catch(() => {
          // 取消删除
        });
    },
  },
};
</script>
  
  <style lang="less" scoped>
.boxShadow {
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.16);
}
.box {
  height: 100%;
}

/deep/.el-tabs__nav-scroll,
.content {
  padding: 0 20px;
  height: calc(100% - 54px - 16px);
}

.tableList {
  height: calc(100% - 54px);
  overflow: auto;

  li {
    margin: 4px 4px 2px 2px;
    .li_item {
      padding: 16px;
      .measure {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .info {
          display: flex;
          align-items: center;
          width: 40%;
          .pic {
            margin-right: 16px;
          }
          .name {
            font-size: 14px;
            p:first-child {
              color: #999999;
            }
            p:last-child {
              font-weight: bold;
              color: #000000;
            }
          }
        }
        .middle {
          display: flex;
          width: 40%;

          & > div {
            margin: 0 20px;
          }
          .sort,
          .type {
            display: flex;
            flex-direction: column;
            grid-gap: 4px;
            div {
              font-size: 14px;
              color: #999999;
              span {
                background: #e4e4e4;
                border-radius: 2px;
                font-size: 12px;
                color: #565656;
                padding: 5px;
                margin: 0 4px 0 0;
              }
            }
            div:last-child {
              font-size: 14px;
              color: #000000;
            }
          }
        }
      }
      .table {
        margin-top: 10px;
      }
    }
    .li_bottom {
      height: 32px;
      background: #f7f7f7;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      & > div {
        font-size: 14px;
        color: #006eff;
        cursor: pointer;
        i {
          margin: 0 2px;
        }
      }
      & > div:last-child {
        color: #8a8a8a;
      }
    }
  }
  li:not(:last-child) {
    margin-bottom: 20px;
  }
}

// 滚动条整体部分
&::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
// 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
&::-webkit-scrollbar-button {
  display: none;
}
// 滚动条的轨道（里面装有Thumb）
&::-webkit-scrollbar-track {
  background: transparent;
}
// 滚动条的轨道（里面装有Thumb）
&::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
// 滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
&::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  cursor: pointer;
  border-radius: 4px;
}
/deep/.my_table {
  margin-bottom: 20px;
}
</style>