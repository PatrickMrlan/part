<template>
  <div class="statistic">
    <div class="head shadow">
      <div class="title">
        <div class="text">企业专项统计</div>
      </div>
      <ul>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/major.png" alt="" />
            <span>重大危险源企业</span>
          </p>
          <div>8</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/dust.png" alt="" />
            <span>粉尘涉爆企业</span>
          </p>
          <div>5</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/nitrogen.png" alt="" />
            <span>液氮制冷(气)</span>
          </p>
          <div>0</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/chemistry.png" alt="" />
            <span>危险化学品</span>
          </p>
          <div>4</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/gas.png" alt="" />
            <span>燃气使用</span>
          </p>
          <div>11</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/space.png" alt="" />
            <span>有限空间</span>
          </p>
          <div>5</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/dormitory.png" alt="" />
            <span>设有宿舍的企业</span>
          </p>
          <div>3</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/within.png" alt="" />
            <span>园中园企业</span>
          </p>
          <div>0</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/dust.png" alt="" />
            <span>粉尘涉爆企业</span>
          </p>
          <div>2</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/dust.png" alt="" />
            <span>粉尘涉爆企业</span>
          </p>
          <div>5</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/dust.png" alt="" />
            <span>粉尘涉爆企业</span>
          </p>
          <div>5</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/dust.png" alt="" />
            <span>粉尘涉爆企业</span>
          </p>
          <div>5</div>
        </li>
        <li>
          <p>
            <img src="@/assets/img/parkgrid/dust.png" alt="" />
            <span>粉尘涉爆企业</span>
          </p>
          <div>5</div>
        </li>
      </ul>
    </div>
    <div class="row">
      <div class="shadow echartbox">
        <div class="title">
          <div class="text">企业分级</div>
        </div>
        <div ref="chartColumn1" class="charts" id="chartColumn1"></div>
      </div>
      <div class="shadow echartbox">
        <div class="title">
          <div class="text">企业行业统计</div>
        </div>
        <div ref="chartColumn2" class="charts" id="chartColumn2"></div>
      </div>
      <div class="shadow echartbox">
        <div class="title">
          <div class="text">企业重大危险源统计</div>
        </div>
        <div ref="chartColumn3" class="charts" id="chartColumn3"></div>
      </div>
    </div>
    <div class="row">
      <div class="shadow echartbox1">
        <div class="title">
          <div class="text">风险单元（场所、区域）统计</div>
        </div>
        <div class="towcharts">
          <div ref="chartColumn4" class="charts" id="chartColumn4"></div>
          <div ref="chartColumn13" class="charts" id="chartColumn13"></div>
        </div>
      </div>
      <div class="shadow echartbox">
        <div class="title">
          <div class="text">应急演练统计</div>
        </div>
        <div ref="chartColumn5" class="charts" id="chartColumn5"></div>
      </div>
    </div>
    <div class="row">
      <div class="shadow echartbox1">
        <div class="title">
          <div class="text">隐患排查治理</div>
        </div>
        <div class="towcharts">
          <div ref="chartColumn6" class="charts" id="chartColumn6"></div>
          <div ref="chartColumn14" class="charts" id="chartColumn14">
            <div class="progress">
              <div>
                3
                <span>已超期 2%</span>
              </div>
              <el-progress
                :text-inside="true"
                :stroke-width="26"
                :percentage="2"
              ></el-progress>
            </div>
            <div class="progress">
              <div>
                6
                <span>未整改 23%</span>
              </div>
              <el-progress
                :text-inside="true"
                :stroke-width="24"
                :percentage="23"
                status="success"
              ></el-progress>
            </div>
            <div class="progress">
              <div>
                32
                <span>进行中 26%</span>
              </div>
              <el-progress
                :text-inside="true"
                :stroke-width="22"
                :percentage="26"
                status="warning"
              ></el-progress>
            </div>
            <div class="progress">
              <div>
                62
                <span>已整改 51%</span>
              </div>
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="51"
                status="exception"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
      <div class="shadow echartbox">
        <div class="title">
          <div class="text">履职率统计</div>
        </div>
        <div ref="chartColumn7" class="charts" id="chartColumn7"></div>
      </div>
    </div>
    <div class="row">
      <div class="shadow echartbox1">
        <div class="title">
          <div class="text">建设项目统计</div>
        </div>
        <div class="towcharts">
          <div class="charts">
            <div ref="chartColumn8" id="chartColumn8"></div>
            <div class="chartColumn8">
              <div>
                <p>24</p>
                <div>今年新增</div>
              </div>
            </div>
          </div>
          <div ref="chartColumn15" class="charts" id="chartColumn15"></div>
        </div>
      </div>
      <div class="shadow echartbox">
        <div class="title">
          <div class="text">规上企业年度统计</div>
        </div>
        <div ref="chartColumn9" class="charts" id="chartColumn9"></div>
      </div>
    </div>
    <div class="row">
      <div class="shadow echartbox">
        <div class="title">
          <div class="text">灾害预警统计</div>
        </div>
        <div ref="chartColumn10" class="charts" id="chartColumn10"></div>
      </div>
      <div class="shadow echartbox">
        <div class="title">
          <div class="text">风险预警统计</div>
        </div>
        <div ref="chartColumn11" class="charts" id="chartColumn11"></div>
      </div>
      <div class="shadow echartbox">
        <div class="title">
          <div class="text">应急资源统计</div>
        </div>
        <div ref="chartColumn12" class="charts" id="chartColumn12"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  chartColumn1,
  chartColumn2,
  chartColumn3,
  chartColumn4,
  chartColumn5,
  chartColumn6,
  chartColumn7,
  chartColumn8,
  chartColumn9,
  chartColumn10,
  chartColumn11,
  chartColumn13,
  chartColumn15
} from "./initecharts";
export default {
  data() {
    return {
      option1: {
        title: {
          text: "",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "700",
            fontSize: "20"
          },
          subtext: "",
          subtextStyle: {
            fontSize: "14"
          }
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          bottom: 10,
          left: "center"
        },
        series: [
          {
            type: "pie",
            radius: ["30%", "50%"],
            data: [],
            label: {}
          }
        ]
      }, //饼状图
      option2: {
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          data: [],
          bottom: 10,
          left: "center"
        },
        series: [
          {
            name: "",
            data: [],
            type: "bar",
            label: {
              show: true,
              position: "top"
            },
            itemStyle: {
              color: params => {
                if (params.name == "高危") {
                  return "#5AD8A6";
                } else {
                  return "#5B8FF9";
                }
              }
            }
          }
        ]
      }, //柱状图
      option3: {
        title:{
          text:""
        },
        xAxis: {
          data: []
        },
        legend: {
          data: [],
          bottom: 10,
          left: "center"
        },
        yAxis: {},
        series: []
      } //折线图
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      // 使用 ref 获取 DOM 元素，并初始化图表
      this.chartColumn1 = echarts.init(this.$refs.chartColumn1);
      chartColumn1(this.chartColumn1, this.option1);
      this.chartColumn2 = echarts.init(this.$refs.chartColumn2);
      chartColumn2(this.chartColumn2, this.option2);
      this.chartColumn3 = echarts.init(this.$refs.chartColumn3);
      chartColumn3(this.chartColumn3, this.option1);
      this.chartColumn4 = echarts.init(this.$refs.chartColumn4);
      chartColumn4(this.chartColumn4, this.option1);
      this.chartColumn5 = echarts.init(this.$refs.chartColumn5);
      chartColumn5(this.chartColumn5, this.option2);
      this.chartColumn6 = echarts.init(this.$refs.chartColumn6);
      chartColumn6(this.chartColumn6, this.option2);
      this.chartColumn7 = echarts.init(this.$refs.chartColumn7);
      chartColumn7(this.chartColumn7)
      this.chartColumn13 = echarts.init(this.$refs.chartColumn13);
      chartColumn13(this.chartColumn13, this.option3);
      this.chartColumn8 =echarts.init(this.$refs.chartColumn8);
      chartColumn8(this.chartColumn8);
      this.chartColumn9 = echarts.init(this.$refs.chartColumn9);
      chartColumn9(this.chartColumn9, this.option3);
      this.chartColumn10 = echarts.init(this.$refs.chartColumn10);
      chartColumn10(this.chartColumn10, this.option3);
      this.chartColumn11 = echarts.init(this.$refs.chartColumn11);
      chartColumn11(this.chartColumn11, this.option3);
      this.chartColumn15 = echarts.init(this.$refs.chartColumn15);
      chartColumn15(this.chartColumn15, this.option3)
    }
  }
};
</script>

<style lang="less" scoped>
.statistic {
  height: calc(100vh - 184px - 58px);
  box-sizing: border-box;
  overflow: auto;
  padding: 5px;
  .head {
    width: 100%;
    height: 220px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0px 3px 6px 1px rgba(21, 34, 50, 0.16);
    box-sizing: border-box;
    min-width: 1072px;
    margin-bottom: 20px;
    ul {
      display: flex;
      flex-wrap: wrap;
      height: calc(100% - 50px);
      padding: 10px;
      li {
        width: calc(100% / 7);
        height: 50%;
        padding: 12px;
        box-sizing: border-box;
        p {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
          span {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.45);
          }
        }
        div {
          text-align: center;
          font-size: 24px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
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
  }
}
.row {
  display: flex;
  justify-content: space-between;
  height: 386px;
  width: 100%;
  margin-bottom: 20px;
  .echartbox {
    width: 32.3%;
    .charts {
      width: 100%;
      height: calc(386px - 50px);
    }
  }
  .echartbox1 {
    width: 66.17%;
    .towcharts {
      display: flex;
      .charts {
        width: 50%;
        height: calc(386px - 50px);
      }
      #chartColumn14 {
        padding: 30px;
        .progress {
          margin: 2% 0;
          div {
            font-weight: 700;
            font-size: 20px;
            span {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFangSC-Regular;
              font-weight: normal;
              color: rgba(153, 153, 153, 0.88);
            }
          }
        }
      }
    }
  }
}
#chartColumn8 {
  height: calc(386px - 150px);
  width: 100%;
}
.chartColumn8 {
  height: 100px;
}
</style>
