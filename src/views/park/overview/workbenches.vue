<template>
  <div class="workbenches">
    <div class="head">
      <div class="risk shadow">
        <div class="name">
          园区风险单元（场所、区域）<img src="@/assets/img/homeIcon/risk.png" />
        </div>
        <div class="num">
          <span>20</span>
          <div class="echarts1" ref="echarts1" />
        </div>
      </div>
      <div class="shadow">
        <div class="name">建设项目总数</div>
        <div class="level">
          <div class="text"><span>80</span>%</div>
          <div class="pic">
            <img src="@/assets/img/homeIcon/chart-bar.png" />
          </div>
        </div>
        <div class="describe">
          <div>
            <div class="icon red">患</div>
            <span>重大隐患</span>
            <strong>2</strong>
          </div>
          <div>
            <div class="icon blue">患</div>
            <span>一般隐患</span>
            <strong>6</strong>
          </div>
        </div>
      </div>
      <div class="shadow">
        <div class="name">企业建设项目总数</div>
        <div class="level">
          <div class="text"><span>15</span>/26</div>
          <div class="pic">
            <img src="@/assets/img/homeIcon/chart-bar1.png" />
          </div>
        </div>
        <div class="describe">
          超期未完成
          <span class="red">2</span>
        </div>
      </div>
      <div class="shadow">
        <div class="name">部门平均履职率</div>
        <div class="level">
          <div class="text"><span>85</span>%</div>
          <div class="pic">
            <img src="@/assets/img/homeIcon/chart-bar2.png" />
          </div>
        </div>
        <div class="describe">比上月</div>
      </div>
      <div class="shadow">
        <div class="name">安全事故</div>
        <div class="level">
          <div class="text"><span>0</span></div>
          <div class="pic">
            <img src="@/assets/img/homeIcon/chart-bar3.png" />
          </div>
        </div>
        <div class="describe">
          <span class="green">100%</span>
          <img src="@/assets/img/homeIcon/price-down.png" />
          — 比上年
        </div>
      </div>
    </div>

    <div class="content">
      <div class="shadow table" ref="table">
        <el-tabs v-model="activeName" class="tabs">
          <el-tab-pane name="first" label="审批">
            <el-table
              ref="fileTable"
              :data="tableData"
              style="width: 100%"
              :loading="loading"
              highlight-current-row
              :height="resizeHeight"
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
              <el-table-column prop="agent" label="代办事项" />
              <el-table-column
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
                    ></i>
                    <span
                      :style="{
                        color: scope.row.state == '正常' ? '' : '#FF4D4F',
                      }"
                      >{{ scope.row.state }}</span
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="source"
                label="来源"
                width="150"
                align="center"
              />

              <el-table-column
                prop="date"
                label="时间"
                width="150"
                align="center"
              />
              <el-table-column label="操作" width="100" align="center">
                <template>
                  <myHandle>
                    <span title="前往审核">前往审核</span>
                  </myHandle>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="second" label="任务"> 任务 </el-tab-pane>
        </el-tabs>
      </div>
      <div class="shadow notice">
        <div class="title">
          <div class="text">灾害预警</div>
          <div class="more">
            <el-select
              v-model="type"
              filterable
              style="margin-right: 10px; width: 100px"
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="grade"
              filterable
              style="margin-right: 10px; width: 100px"
            >
              <el-option
                v-for="(item, index) in gradeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span>查看更多</span>
          </div>
        </div>
        <ul>
          <li class="notice_active">
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li class="notice_active">
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li class="notice_active">
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="bottom">
      <div class="shadow report">
        <div class="title">
          <div class="text">园区公开事故调查报告</div>
        </div>
        <div class="pageData">
          <div class="info">
            <div class="left">
              <img src="@/assets/img/homeIcon/pageImg.png" />
            </div>
            <div class="right">
              <div class="name">科技园项目工地“6·20”触电事故调查报告</div>
              <div class="date">2023/06/27 09:12:58</div>
              <div class="details">
                <span
                  >2023年6月20日17时30分许，光明区凤凰街道尚智科技园项目工地发生</span
                >
              </div>
            </div>
          </div>
          <p>
            <el-pagination background layout="prev, pager, next" :total="1">
            </el-pagination>
          </p>
        </div>
      </div>
      <div class="shadow menu">
        <div class="title">
          <div class="text">快捷导航</div>
          <div class="more">
            <img src="@/assets/img/homeIcon/setupCheck.png" />
          </div>
        </div>
        <ul>
          <li @click="Touch('/park/parkerpriseArchives/index', '园区基础信息')">
            <img src="@/assets/img/homeIcon/menu_one.png" />
            <p>园区档案</p>
          </li>
          <li @click="Touch('/park/approval/index', '企业审批')">
            <img src="@/assets/img/homeIcon/menu_two.png" />
            <p>一企一档</p>
          </li>
          <li @click="Touch('/park/classification/index', '企业分布')">
            <img src="@/assets/img/homeIcon/menu_three.png" />
            <p>企业分布</p>
          </li>
          <li @click="Touch('/park/organization/index', '机构设置')">
            <img src="@/assets/img/homeIcon/menu_four.png" />
            <p>机构设置</p>
          </li>
          <li @click="Touch('/park/riskidentification/index', '公共风险源（点）')">
            <img src="@/assets/img/homeIcon/menu_two.png" />
            <p>风险分级</p>
          </li>
          <li @click="Touch('', '')">
            <img src="@/assets/img/homeIcon/menu_two.png" />
            <p>隐患排查</p>
          </li>
        </ul>
      </div>
      <div class="shadow warn">
        <div class="title">
          <div class="text">风险预警（<span>3</span>）</div>
          <div class="more">
            <el-select
              v-model="warn"
              filterable
              style="margin-right: 10px; width: 100px"
            >
              <el-option
                v-for="(item, index) in warnList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span>查看更多</span>
          </div>
        </div>
        <ul>
          <li>
            <div class="icon">
              <img src="@/assets/img/homeIcon/taskNot.png" />
            </div>
            <div class="type">任务提醒</div>
            <div class="date">2023/08/12</div>
            <div class="info">机构设置未设置或不合要求！</div>
            <div class="state handle">已处理</div>
          </li>
          <li>
            <div class="icon">
              <img src="@/assets/img/homeIcon/warn.png" />
            </div>
            <div class="type">超期提醒</div>
            <div class="date">2023/08/12</div>
            <div class="info">机构设置未设置或不合要求！</div>
            <div class="state not-handle">未处理</div>
          </li>
          <li>
            <div class="icon">
              <img src="@/assets/img/homeIcon/warnNot.png" />
            </div>
            <div class="type">超期提醒</div>
            <div class="date">2023/08/12</div>
            <div class="info">机构设置未设置或不合要求！</div>
            <div class="state close">已关闭</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-liquidfill/src/liquidFill.js";
import draggable from "vuedraggable";
import { moduleList, moduleEdit } from "@/api/system/module.js";

export default {
  components: { draggable },
  data() {
    return {
      activeName: "first",

      type: 0,
      typeList: [
        { label: "全部类型", value: 0 },
        { label: "企业类型", value: 1 },
        { label: "园区类型", value: 2 },
      ],
      grade: 0,
      gradeList: [
        { label: "全部等级", value: 0 },
        { label: "企业公告", value: 1 },
        { label: "园区公告", value: 2 },
      ],

      warn: 0,
      warnList: [
        { label: "全部提醒", value: 0 },
        { label: "任务提醒", value: 1 },
        { label: "超期提醒", value: 2 },
      ],

      loading: false,
      resizeHeight: null,
      tableData: [
        {
          agent: "************审批",
          date: "2016-05-02",
          state: "正常",
          source: "机构设置",
        },
        {
          agent: "************风险分级管控审批",
          date: "2018-11-02",
          state: "超时",
          source: "风险分级管控",
        },
        {
          agent: "******审批",
          date: "2023-09-15",
          state: "正常",
          source: "隐患排查治理",
        },
        {
          agent: "******审批",
          date: "2023-09-15",
          state: "正常",
          source: "隐患排查治理",
        },
        {
          agent: "******审批",
          date: "2023-09-15",
          state: "正常",
          source: "隐患排查治理",
        },
      ],
    };
  },
  mounted() {
    this.getModuleList();
    this.getRisk();
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    getModuleList() {
      moduleList().then((res) => {
        console.log(res);
      });
    },
    Touch(url, name) {
      if (!url) {
        this.$message.warning("该功能正在开发中");
      } else {
        this.$router.push({ path: url, query: { name: name } });
      }
    },
    onResize() {
      let h = 0;
      if (this.$refs.table.offsetHeight) {
        h = window.innerHeight - this.$refs.table.offsetHeight;
        this.resizeHeight = window.innerHeight - h - 50;
      }
    },

    getRisk() {
      var chartColumn = echarts.init(this.$refs.echarts1);
      chartColumn.showLoading();

      let option = {
        tooltip: {
          show: true,
          trigger: "item",
          //{a}(系列名)，{b}(数据项名),{c}(数值),{d}(百分比)
        },

        legend: {
          top: "bottom",
          itemWidth: 10,
          itemHeight: 10,
          left: 0,
          itemGap: 5,
          borderRadius: 4,
          textStyle: {
            color: "#999999",
            fontFamily: "Alibaba PuHuiTi",
            fontSize: 14,
            fontWeight: 400,
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["35%", "65%"],
            center: ["80%", "35%"],
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            data: [
              {
                name: "重大",
                value: 6,
                itemStyle: { color: "rgb(245, 34, 45)" },
              },
              {
                name: "较大",
                value: 3,
                itemStyle: { color: "rgb(249, 156, 55)" },
              },
              {
                name: "一般",
                value: 6,
                itemStyle: { color: "rgb(249, 223, 54)" },
              },
              {
                name: "低",
                value: 5,
                itemStyle: { color: "rgb(92, 181, 255)" },
              },
            ],
            label: {
              show: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      chartColumn.setOption(option);
      chartColumn.hideLoading();
      window.addEventListener("resize", chartColumn.resize);
    },
  },
};
</script>

<style lang="less" scoped>
.workbenches {
  height: calc(100vh - 184px - 58px);
  & > div:nth-of-type(2) {
    height: calc((100% - 140px) / 2 - 48px);
  }
  & > div:nth-of-type(3) {
    height: calc((100% - 140px) / 2);
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

  .head {
    display: flex;
    // grid-template-columns: repeat(auto-fill, calc((100% / 6) - 20px));
    grid-gap: 24px;
    & > div {
      width: calc(100% / 5);
      min-width: 175px;
      min-height: 140px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .name {
        font-size: 16px;
        color: #999999;
        img {
          margin-left: 8px;
          cursor: pointer;
        }
      }
      .level {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #131523;
        .text {
          font-size: 14px;
          span {
            font-size: 28px;
            font-weight: 500;
          }
        }
        .pic {
          min-width: 62px;
          min-height: 62px;
          width: 62px;
          height: 62px;
          background: rgba(0, 88, 255, 0.1);
          border: 1px solid rgba(0, 88, 255, 0.1);
          border-radius: 100%;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
      }
      .describe {
        display: flex;
        align-items: center;
        color: #999999;
        font-size: 12px;
        & > div {
          margin-right: 12px;
          display: flex;
          align-items: center;
          overflow: hidden;
          white-space: nowrap;
          span {
            margin: 0 4px 0 2px;
          }
          strong {
            color: #131523;
          }
        }
        .red {
          color: #ff4d4f;
          margin-left: 5px;
        }
        .green {
          font-size: 16px;
          color: #52c41a;
        }
        .blue {
          color: #3aa0ff;
        }

        .icon {
          min-width: 20px;
          min-height: 20px;
          border-radius: 100%;
          font-size: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: scale(0.8);
        }

        .icon.red {
          border: 1px solid #ff4d4f;
        }
        .icon.blue {
          border: 1px solid #3aa0ff;
        }
      }
    }
    .comprehensive {
      background: linear-gradient(180deg, #fa8c16 0%, #ffa940 100%);
      color: #fff;
      .name {
        color: #fff;
      }
      .level {
        color: #fff;
        .text {
          font-size: 14px;
          span {
            font-size: 28px;
            font-weight: normal;
          }
        }
        img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
      }
    }
    .risk {
      display: block;
      .num {
        position: relative;
        height: calc(100% - 24px);
        span {
          position: absolute;
          top: 50%;
          transform: translateY(-70%);
          font-size: 28px;
          font-weight: bold;
          font-family: "PingFang SC, PingFang SC";
          color: #131523;
        }
        .echarts1 {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .content {
    margin: 24px 0;
    display: flex;
    grid-gap: 24px;
    .table {
      width: 67%;
      min-width: 310px;
    }
    .notice {
      width: 33%;
      min-width: 360px;
      ul {
        padding: 10px 20px;
        height: calc(100% - 50px);
        overflow: auto;
        li {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 14px;
          .label {
            font-size: 12px;
            color: #d46b08;
            background: #ffe7ba;
            border-radius: 3px;
            margin: 0 5px;
            min-width: 30px;
            text-align: center;
          }
          strong {
            width: calc(100% - 80px - 40px - 20px);
            color: #000000;
            font-weight: normal;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          span {
            min-width: 80px;
            color: #999999;
            margin-left: auto;
            text-align: right;
          }
        }
      }
    }
  }

  .bottom {
    display: flex;
    grid-gap: 24px;
    & > div {
      width: calc(100% / 3);
      min-width: 310px;
    }

    .report {
      .pageData {
        height: calc(100% - 50px);
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .info {
          display: flex;
          overflow: auto;
          .left {
            margin-right: 16px;
            min-width: 50%;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          .right {
            font-family: "Microsoft YaHei, Microsoft YaHei";
            padding: 10px 0;
            .name {
              font-size: 18px;
              font-weight: bold;
              color: #000000;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .date {
              font-size: 14px;
              color: #999999;
              margin: 10px 0;
            }
            .details {
              color: #006eff;
              span {
                font-size: 14px;
                color: #000000;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              strong {
                font-weight: 400;
              }
            }
          }
        }
      }
    }

    .menu {
      ul {
        padding: 10px 20px 0;
        height: calc(100% - 50px);
        overflow: auto;
        display: flex;
        flex-wrap: wrap;
        li {
          width: 25%;
          min-width: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 8px;
          cursor: pointer;

          p {
            font-size: 14px;
            color: #000000;
            margin-top: 4px;
          }
        }
      }
    }

    .warn {
      ul {
        padding: 10px 20px 0;
        height: calc(100% - 50px);
        overflow: auto;
        li {
          display: flex;
          align-items: center;
          overflow: hidden;
          height: 30px;
          margin-bottom: 10px;
          & > *:not(:first-child) {
            margin-left: 16px;
            font-size: 14px;
          }
          .icon {
            width: 24px;
            height: 24px;
            img {
              object-fit: contain;
            }
          }

          .type {
            min-width: 58px;
            margin-left: 12px;
            color: #000000;
          }
          .date {
            min-width: 62px;
            font-size: 12px;
            color: #999999;
          }
          .info {
            color: #000000;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .state {
            margin-left: auto;
            min-width: 52px;
            height: 22px;
            border-radius: 4px;
            text-align: center;
            box-sizing: border-box;
            border: 1px solid transparent;
          }

          .not-handle {
            background: #fff1f0;
            border: 1px solid #ffccc7;
            color: #ff4d4f;
          }
          .handle {
            background: #f6ffed;
            border: 1px solid #d9f7be;
            color: #52c41a;
          }
          .close {
            background: #fff;
            border: 1px solid rgba(0, 0, 0, 0.15);
            color: #000000;
          }
        }
      }
    }
  }
}

/deep/.stateIcon {
  display: inline-block;
  margin-right: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/deep/ * {
  &::-webkit-scrollbar {
    width: 5px !important; /*对垂直流动条有效*/
    height: 10px !important;
  }

  //   /*定义滚动条的轨道颜色、内阴影及圆角*/
  //   &::-webkit-scrollbar-track {
  //   }

  /*定义滑块颜色、内阴影及圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.45);
  }

  /*定义两端按钮的样式*/
  &::-webkit-scrollbar-button {
    /* background-color:#00b1fc;
      border-radius: 4px; */
    display: none;
  }

  /*定义右下角汇合处的样式*/
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
</style>
