<template>
  <div class="businessPortraits">
    <div class="left shadow">
      <h3>珞石机械（成都）有限公司</h3>
      <div class="contactsInfo">
        <div class="riskIcon">
          <img src="@/assets/img/homeIcon/riskIcon.png" />
        </div>
        <div class="detail">
          <div class="user">
            <img src="@/assets/img/homeIcon/risk-user.png" />
            <span>安全负责人：</span>
            <strong>李连达</strong>
          </div>
          <div class="tel">
            <img src="@/assets/img/homeIcon/risk-tel.png" />
            <span>负责人电话：</span>
            <strong>18244285977</strong>
          </div>
        </div>
      </div>
      <div class="pic">
        <img src="@/assets/img/homeIcon/riskImg.png" />
      </div>
      <ul class="config">
        <li>
          <div>租赁</div>
          <p>场地性质</p>
        </li>
        <li>
          <div>5<span>km²</span></div>
          <p>场地面积</p>
        </li>
        <li>
          <div>规下/小型</div>
          <p>单位规模</p>
        </li>
        <li>
          <div>500</div>
          <p>从业人数</p>
        </li>
      </ul>
      <div class="classification">
        <div class="item">国民经济分类行业性质</div>
        <ul>
          <li><span>C 制造业</span></li>
          <li><span>33 金属制品业</span></li>
          <li><span>工贸行业</span></li>
          <li><span>机械行业</span></li>
          <li><span>43 金属制品、机械和设备修理业等</span></li>
        </ul>
      </div>
    </div>
    <div class="middle shadow">
      <div class="header">
        <div
          v-for="(item, index) in headList"
          :key="index"
          :class="nowIndex == index ? 'header_active' : ''"
          @click="nowIndex = index"
        >
          {{ item }}
        </div>
      </div>
      <div class="pic">
        <img src="@/assets/img/homeIcon/riskPosImg.png" />
      </div>
      <ul>
        <li>
          <div class="item">
            <div class="name">风险</div>
            <el-switch v-model="switch1" />
          </div>
          <div class="con">
            <el-checkbox-group v-model="checkList1">
              <el-checkbox label="重大风险" :disabled="switch1">
                <div class="zone red"></div>
                <span>重大风险</span>
                <span>6</span>
              </el-checkbox>
              <el-checkbox label="一般风险" :disabled="switch1">
                <div class="zone yellow"></div>
                <span>一般风险</span>
                <span>6</span>
              </el-checkbox>
              <el-checkbox label="较大风险" :disabled="switch1">
                <div class="zone orange"></div>
                <span>较大风险</span>
                <span>3</span>
              </el-checkbox>
              <el-checkbox label="低风险" :disabled="switch1">
                <div class="zone blue"></div>
                <span>低风险</span>
                <span>4</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
        <li>
          <div class="item">
            <div class="name">隐患</div>
            <el-switch v-model="switch2" />
          </div>
          <div class="con">
            <el-checkbox-group v-model="checkList2">
              <el-checkbox label="重大隐患" :disabled="switch2">
                <img src="@/assets/img/homeIcon/risk-red.png" />
                <span>重大隐患</span>
                <span>2</span>
              </el-checkbox>
              <el-checkbox label="一般隐患" :disabled="switch2">
                <img src="@/assets/img/homeIcon/risk-blue.png" />
                <span>一般隐患</span>
                <span>6</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
        <li>
          <div class="item">
            <div class="name">其他</div>
            <el-switch v-model="switch3" />
          </div>
          <div class="con">
            <el-checkbox-group v-model="checkList3">
              <el-checkbox label="重大危险源" :disabled="switch3">
                <img src="@/assets/img/homeIcon/other1.png" />
                <span>重大危险源</span>
                <span>2</span>
              </el-checkbox>
              <el-checkbox label="视频监控" :disabled="switch3">
                <img src="@/assets/img/homeIcon/other2.png" />
                <span>视频监控</span>
                <span>2</span>
              </el-checkbox>
              <el-checkbox label="紧急集合点" :disabled="switch3">
                <img src="@/assets/img/homeIcon/other3.png" />
                <span>紧急集合点</span>
                <span>2</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
      </ul>
    </div>
    <div class="right">
      <div class="shadow">
        <div class="title">
          <span>风险统计</span>
        </div>
        <div class="echarts" ref="echarts1"></div>
      </div>
      <div class="shadow">
        <div class="title">
          <span>隐患整改统计</span>
        </div>
        <div class="echarts" ref="echarts2"></div>
      </div>
      <div class="shadow">
        <div class="title">
          <span>管控预警</span>
          <div class="more">
            <el-select v-model="warn" filterable style="width: 80px">
              <el-option
                v-for="(item, index) in warnList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <ul>
          <li>
            <div class="pic">
              <img src="@/assets/img/homeIcon/other3.png" />
            </div>
            <div class="info">
              <p>336</p>
              <p>要求检查数量</p>
            </div>
          </li>
          <li>
            <div class="pic">
              <img src="@/assets/img/homeIcon/other3.png" />
            </div>
            <div class="info">
              <p>275</p>
              <p>已检查数量</p>
            </div>
          </li>
          <li>
            <div class="pic">
              <img src="@/assets/img/homeIcon/chart-bar2.png" />
            </div>
            <div class="info">
              <p>81.85</p>
              <p>当日管控率</p>
            </div>
          </li>
          <li>
            <div class="pic">
              <img src="@/assets/img/homeIcon/chart-bar.png" />
            </div>
            <div class="info">
              <p>0 <span>处</span></p>
              <p>发现隐患</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-liquidfill/src/liquidFill.js";
export default {
  data() {
    return {
      warn: 0,
      warnList: [
        { label: "今日", value: 0 },
        { label: "昨日", value: 1 },
        { label: "明日", value: 2 },
      ],

      switch1: false,
      switch2: false,
      switch3: false,

      checkList1: [],
      checkList2: [],
      checkList3: [],

      nowIndex: 0,

      headList: ["风险一张图", "应急一张图", "园区公共设施", "全屏"],
    };
  },
  mounted() {
    this.getRisk();
    this.getRisk2();
  },
  methods: {
    getRisk() {
      var chartColumn = echarts.init(this.$refs.echarts1);
      chartColumn.showLoading();

      const chartData = [
        {
          value: 6,
          name: "重大风险",
        },
        {
          value: 3,
          name: "较大风险",
        },
        {
          value: 6,
          name: "一般风险",
        },
        {
          value: 5,
          name: "低风险",
        },
      ];
      const color = ["#F5222DD9", "#FFA940D9", "#F9DF36FF", "#1890FFD9"];
      const sum = chartData.reduce((per, cur) => per + cur.value, 0);
      let option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          top: "center",
          right: "0%",
          itemWidth: 15,
          itemHeight: 10,
          textStyle: {
            color: "#373737",
            fontSize: "12px",
            rich: {
              name: {
                color: "rgba(0,0,0,0.65)",
                width: 50,
                padding: [0, 0, 0, 2],
              },

              percent: {
                color: "rgba(0,0,0,0.45)",
                padding: [0, 0, 0, 10],
              },
              value: {
                color: "rgba(0,0,0,0.65)",
                padding: [0, 0, 0, 10],
              },
            },
          },

          formatter: function (name) {
            let obj = {};
            if (name) {
              obj = chartData.find((item) => item.name === name);
            }
            return `{name|${name}}{value|${obj.value || 0}}{percent|${
              obj.value && ((obj.value / sum) * 100).toFixed(0)
            }%}`;
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            roundCap: true,
            radius: ["40%", "85%"],
            center: ["30%", "50%"],
            startAngle: 180, //起始角度
            data: chartData,
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 2,
              color: function (params) {
                return color[params.dataIndex];
              },
            },
            labelLine: {
              length: 8,
              length2: 16,
              lineStyle: {
                width: 1,
              },
            },
            label: {
              show: false,
              fontFamily: "ysbth",
              position: "outside",
              padding: [0, -4, 0, -4],
              formatter(params) {
                if (params.name === "") {
                  return "";
                }
                return `${params.percent.toFixed(0)}%`;
              },
              color: "#fff",
              fontSize: "14px",
              lineHeight: 10,
            },
          },
        ],
      };

      chartColumn.setOption(option);
      chartColumn.hideLoading();
      window.addEventListener("resize", chartColumn.resize);
    },

    getRisk2() {
      var chartColumn = echarts.init(this.$refs.echarts2);
      chartColumn.showLoading();
      var completed = [1, 2, 3];
      var not = [7, 8, 9];

      var obj = {
        ydata: ["已整改", "进行中", "未整改"],
        legend: ["一般隐患", "重大隐患"],
        barData: [
          {
            name: "一般隐患",
            data: completed,
          },
          {
            name: "重大隐患",
            data: not,
          },
        ],
      };
      let serData = [];
      obj.barData.forEach((item) => {
        serData.push({
          name: item.name,
          type: "bar",
          stack: "all",
          color: item.color,
          data: item.data,
          label: {
            show: true,
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            },
          },
        });
      });

      var option = {
        //你的代码
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        color: ["#0893D4", "#F6424C"],
        //图表选择栏
        legend: {
          top: "5%",
          left: "center",
          orient: "horizontal", //图例方向【horizontal/vertical】
          itemHeight: 12, //修改icon图形大小
          itemWidth: 12, //修改icon图形大小
          selectedMode: false, //不允许点击图例
          itemGap: 30,
          textStyle: {
            fontSize: 14,
          },
          data: obj.legend,
        },
        //图标离容器的距离
        grid: {
          left: "0%",
          right: "7%",
          bottom: "0%",
          top: "20%",
          //是否包含坐标轴
          containLabel: true,
        },
        //x坐标轴
        xAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
            },
            boundaryGap: true,
            axisLine: {
              show: true,
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "#5d85a0",
                width: 1,
                type: "solid",
              },
            },
          },
        ],
        //y坐标轴
        yAxis: [
          {
            type: "category",
            name: "",
            data: obj.ydata,
            splitLine: {
              show: false,
            },
            // inverse: true,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "#5d85a0",
                width: 1,
                type: "solid",
              },
            },
          },
        ],
        // 数据展示区域
        series: serData,
      };

      chartColumn.setOption(option);
      chartColumn.hideLoading();
      window.addEventListener("resize", chartColumn.resize);
    },
  },
};
</script>

<style lang="less" scoped>
.businessPortraits {
  height: calc(100vh - 184px - 48px);
  display: flex;
  grid-gap: 24px;

  .left,
  .right {
    width: 25%;
    min-height: 100%;
  }
  .middle {
    width: 50%;
    min-height: 100%;
    border-radius: 20px 20px 0 0 !important;
    overflow: auto;
    padding: 0 0 20px 0;
    position: relative;
    .header {
      display: flex;
      background-color: rgb(245, 245, 245);
      position: sticky;
      top: 0;
      width: 100%;

      & > div {
        font-size: 14px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 25%;
        border-radius: 20px 20px 0 0;
        box-shadow: 0px 2px 6px 1px rgba(21, 34, 50, 0.16);
        background: #e6e8eb;
        cursor: pointer;
        position: relative;
      }
      .header_active {
        color: #000000;
        background: #fff;
        z-index: 10;
      }
    }
    .pic {
      margin: 16px;
      width: calc(100% - 32px);
      background: #fafafa;
      border-radius: 5px;
      border: 1px solid #e7eaef;
      img {
        width: 100%;
      }
    }
    ul {
      display: flex;
      grid-gap: 16px;
      padding: 0 16px;
      li:nth-of-type(2) {
        width: 20% !important;
      }
      li {
        border-radius: 5px;
        border: 1px solid #e7eaef;
        width: 40%;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 36px;
          padding: 0 12px;
          background: #fafafa;
          border-bottom: 1px solid #e7eaef;
          .name {
            font-size: 14px;
            color: #000000;
          }
        }
        .con {
          padding: 10px 5px;
          .zone {
            width: 20px;
            height: 12px;
          }
          .red {
            background: #f5222dd9;
          }
          .yellow {
            background: #f9df36;
          }
          .orange {
            background: #f99c37;
          }
          .blue {
            background: #5cb5ff;
          }
          /deep/.el-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
          }
          /deep/.el-checkbox {
            display: flex;
            align-items: center;
            margin-right: 20px !important;
          }
          /deep/.el-checkbox__label {
            display: flex;
            align-items: center;
            span {
              margin-left: 5px;
            }
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
  }

  .left {
    background: linear-gradient(180deg, #ffdabd 0%, #fafafa 14%, #ffffff 100%);
    padding: 20px;
    overflow: auto;
    h3 {
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      color: #343434;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 36px;
    }
    .contactsInfo {
      display: flex;
      align-items: center;
      .riskIcon {
        width: 118px;
        height: 118px;
      }
      .detail {
        width: calc(100% - 118px);
        & > div {
          display: flex;
          align-items: center;
          height: 40px;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 5px;
          padding: 8px;
          font-size: 14px;
          margin: 4px 0;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          span {
            color: #262626;
            margin-left: 8px;
            min-width: 96px;
          }
          strong {
            color: #006eff;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .pic {
      width: 100%;
      padding: 10px 0 20px;
      border-bottom: 1px solid #e7eaef;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 4px;
      }
    }
    .config {
      display: flex;
      grid-gap: 5px;
      flex-wrap: wrap;
      padding: 20px 0;
      border-bottom: 1px solid #e7eaef;
      li {
        width: calc(100% / 4 - 5px);
        min-width: 70px;
        text-align: center;
        div {
          font-size: 18px;
          font-weight: bold;
          color: #565656;
          white-space: nowrap;
          span {
            font-size: 14px;
          }
        }
        p {
          font-size: 14px;
          color: #999999;
        }
      }
    }
    .classification {
      display: flex;
      grid-gap: 10px;
      padding: 20px 10px;
      border-bottom: 1px solid #e7eaef;
      .item {
        min-width: 84px;
        width: 84px;
        font-size: 14px;
        color: #999999;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        grid-gap: 8px;
        li {
          background: #e4e4e4;
          border-radius: 2px;
          padding: 0 8px;
        }
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    grid-gap: 24px;
    & > div {
      height: calc(100% / 3);
      padding: 10px 20px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        height: 35px;
        color: #000000;
      }
      .echarts {
        height: calc(100% - 35px);
      }
      ul {
        height: calc(100% - 35px);
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        padding: 20px;

        li {
          width: 50%;
          min-width: 150px;
          display: flex;
          align-items: center;
          grid-gap: 10px;
          margin-bottom: 20px;
          .pic {
            width: 52px;
            height: 52px;
            background: rgba(0, 88, 255, 0.1);
            border: 1px solid rgba(0, 88, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .info {
            p:nth-of-type(1) {
              font-size: 20px;
              font-weight: bold;
              color: #131523;
            }
            p:nth-of-type(2) {
              font-size: 14px;
              color: rgba(153, 153, 153, 0.88);
            }
            span {
              font-size: 14px;
              font-weight: normal;
              color: rgba(0, 0, 0, 0.88);
            }
          }
        }
      }
    }
  }
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