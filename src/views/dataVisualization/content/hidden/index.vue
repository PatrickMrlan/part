<template>
  <div style="height: 100vh">
    <div id="map"></div>

    <div class="left">
      <div>
        <div class="title">
          <h3>隐患统计</h3>
          <em>Hidden Disease Statistics</em>
        </div>
        <div class="content">
          <div class="echarts hiddenTotal" ref="echarts1"></div>
          <!-- <div class="info">
            <p>
              <img src="@/assets/img/bigScreen/hidden-major.png" />
              重大隐患
              <strong>4</strong>
              <span>个</span>
            </p>
            <p>
              <img src="@/assets/img/bigScreen/hidden-same.png" />
              一般隐患
              <strong>6</strong>
              <span>个</span>
            </p>
          </div> -->
        </div>
      </div>
      <div>
        <div class="title">
          <h3>隐患趋势</h3>
          <em>Hidden Trends</em>
        </div>
        <div class="content">
          <div class="echarts" ref="echarts2"></div>
        </div>
      </div>
      <div>
        <div class="title">
          <h3>隐患整改统计</h3>
          <em>Rectification statis</em>
        </div>
        <div class="content">
          <div class="echarts" ref="echarts3"></div>
        </div>
      </div>
    </div>

    <div class="right">
      <div>
        <div class="title">
          <h3>公告公示</h3>
          <em>Announcement</em>
        </div>
        <div class="announcement content">
          <div class="swiper-wrapper" id="outterRef1" ref="outterRef1">
            <div
              class="content-container"
              ref="contentRef1"
              @mouseenter="mouseenterEvent1"
              @mouseleave="mouseleaveEvent1"
            >
              <div
                class="item-style"
                ref="itemRef1"
                v-for="(item, index) in AnnouncementDataList"
                :key="index"
              >
                <span class="label" :style="{ color: item.color }">{{
                  item.label
                }}</span>
                <span class="info" :title="item.value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="title">
          <h3>预警信息</h3>
          <em>Warning</em>
        </div>
        <div class="warning content">
          <div class="header">
            <span>预警类型</span>
            <span>预警信息</span>
            <span>预警时间</span>
          </div>
          <div class="swiper-wrapper" id="outterRef2" ref="outterRef2">
            <div
              class="content-container"
              ref="contentRef2"
              @mouseenter="mouseenterEvent2"
              @mouseleave="mouseleaveEvent2"
            >
              <div
                class="item-style"
                ref="itemRef2"
                v-for="(item, index) in warningDataList"
                :key="index"
                :class="index % 2 == 0 ? 'styleActive' : ''"
              >
                <span class="type" :style="{ color: item.color }">{{
                  item.type
                }}</span>
                <span class="info">{{ item.info }}</span>
                <span class="time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="title">
          <h3>实时视频</h3>
          <em>Video</em>
        </div>
        <div class="content">
          <video
            src="@/assets/img/bigScreen/preview.webm"
            poster="@/assets/img/bigScreen/preview.png"
            width="100%"
            height="210"
            controls
            autoplay
            loop
          />
        </div>
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
      map: null,

      // 定时器
      timer1: null,
      timer2: null,

      actual: 0,
      dudget: 0,
      // 展示内容的高度
      config: {
        height1: null,
        height2: null,
      },

      // 轮训的时间
      dvtime1: 50,
      dvtime2: 50,

      warningDataList: [
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#f4404a",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#f99c37",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#f6bd16",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报报警内容报警内容报警内容报警内容报警内容报警内容报警内容报警内容报警内容警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
        {
          type: "大风",
          info: "报警内容报警内容报警内容",
          time: "07/02 14:36",
          color: "#5cb5ff",
        },
      ],

      AnnouncementDataList: [
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
          color: "rgb(191, 119, 255)",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
          color: "rgb(74, 144, 226)",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
        },
        {
          label: "分类标签",
          value: "公告内容公告内容公告内容公告内容公告内容",
        },
      ],

      option: {
        color: ["#f5222d", "#5cb5ff"],
        tooltip: {
          transitionDuration: 0,
          trigger: "item",
        },
        legend: {
          show: false,
          orient: "vertical",
          top: "center",
          icon: "rect",
          textStyle: {
            color: "#fff",
          },
          data: [],
          formatter: function (name) {
            var data = auto_option.series[0].data;
            var total = 0;
            var tarValue;
            for (var i = 0; i < data.length; i++) {
              total += data[i].value;
              if (data[i].name === name) {
                tarValue = data[i].value;
              }
            }
            //var p = ((tarValue / total) * 100).toFixed(2)
            //${tarValue}%
            return `${name}`;
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["55%", "40%"],
            // 饼图位置参数
            center: ["28%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              // 设置不生效
              borderRadius: 3,
              borderWidth: 3,
            },
            label: {
              show: false,
              position: "center",
              formatter: "", //'{b_style|{b}}\n{c_style|{c}%}\n{b_style|{d}%}',
              rich: {
                d_style: {
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 500,
                },
                b_style: {
                  fontSize: 14,
                  color: "rgb(42, 255, 255)",
                  fontWeight: 500,
                  padding: [10, 0, 0, 0],
                },
                c_style: {
                  fontSize: 12,
                  color: "#44ebea",
                  fontWeight: 700,
                },
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14",
                fontWeight: "normal",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(async () => {
      await this.initMap();

      await this.getEmergency1();
      await this.getEmergency2();
      await this.getEmergency3();

      await this.initInfo1();
      await this.initInfo2();
    });
  },
  methods: {
    getEmergency1() {
      let chartColumn = echarts.init(this.$refs.echarts1);

      let ck_seriesData = [
        { name: "重大隐患", value: 4 },
        { name: "一般隐患", value: 6 },
      ];

      let total = 0;
      ck_seriesData.forEach((item) => {
        total += item.value;
      });

      this.option.legend.data = ck_seriesData;
      this.option.series[0].data = ck_seriesData;
      this.option.series[0].label.show = true;
      this.option.series[0].label.formatter =
        "{d_style|总数}" + "\n{b_style|" + total + "}";

      chartColumn.setOption(this.option);
      window.addEventListener("resize", chartColumn.resize);
    },
    getEmergency2() {
      let chartColumn = echarts.init(this.$refs.echarts2);

      let legendData = ["重大隐患", "一般隐患"];
      let xAxisData = ["2月", "3月", "4月", "5月", "6月", "7月"];
      let seriesData = [0, 0, 3, 5, 5, 1];
      let seriesData1 = [0, 0, 4, 3, 6, 5];

      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "20%",
          left: "5%",
          right: "5%",
          bottom: "20%",
          containLabel: true,
        },
        legend: {
          left: "center",
          bottom: "2%",
          itemWidth: 7, // 设置宽度
          itemHeight: 7, // 设置高度
          itemGap: 15, // 设置间距
          textStyle: {
            //图例文字的样式
            color: "#89BFE5",
            fontSize: 12,
          },
        },
        xAxis: {
          boundaryGap: true,
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: "rgba(117, 168, 202, 0.4)",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
          },
        },
        yAxis: [
          {
            type: "value",
            inverse: false,
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(117, 168, 202, 0.3)",
                type: "dashed",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#0A5C95",
              },
            },
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                color: "#fff",
                fontSize: 12,
              },
            },
            nameTextStyle: {
              color: "#89BFE5",
              padding: [0, 0, 0, 15],
              fontSize: 12,
            },
            axisTick: {
              show: false,
            },
          },
        ],

        series: [
          {
            name: legendData[0],
            type: "line",
            symbol: "circle", //设定为实心点
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            label: {
              formatter: function (params) {
                return params.value ? params.value : "";
              },
              show: true,
              position: "top",
              textStyle: {
                color: "#f5222d",
              },
            },
            itemStyle: {
              normal: {
                color: `#f5222d`,
                lineStyle: {
                  //线的颜色
                  color: `#f5222d`,
                  width: 1.5,
                },
                areaStyle: {
                  //新版渐变色实现
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(245, 34, 45, 0.6)",
                      },
                      {
                        offset: 1,
                        color: "rgba(245, 34, 45, 0.2)",
                      },
                    ],
                  },
                },
              },
            },
            data: seriesData,
          },
          {
            name: legendData[1],
            type: "line",
            symbol: "circle", //设定为实心点
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#5cb5ff",
              },
              formatter: function (params) {
                return params.value ? params.value : "";
              },
            },
            itemStyle: {
              normal: {
                color: `#5cb5ff`,
                lineStyle: {
                  //线的颜色
                  color: `#5cb5ff`,
                  width: 1.5,
                },
                areaStyle: {
                  //新版渐变色实现
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(92, 181, 255, 0.6)",
                      },
                      {
                        offset: 1,
                        color: "rgba(92, 181, 255, 0.2)",
                      },
                    ],
                  },
                },
              },
            },
            data: seriesData1,
          },
        ],
      };

      chartColumn.setOption(option);
      window.addEventListener("resize", chartColumn.resize);
    },
    getEmergency3() {
      let chartColumn = echarts.init(this.$refs.echarts3);

      let ck_seriesData = [
        { name: "园区", value: 2 },
        { name: "企业", value: 16 },
      ];
      this.option.series[0].label.show = false;

      this.option.legend.data = ck_seriesData;
      this.option.series[0].data = ck_seriesData;

      this.handleChartLoop(this.option, chartColumn); //定义名称

      chartColumn.setOption(this.option);
      window.addEventListener("resize", chartColumn.resize);
    },

    // 饼图自动轮播
    handleChartLoop(option, myChart) {
      if (!myChart) {
        return;
      }
      let currentIndex = -1; // 当前高亮图形在饼图数据中的下标
      let changePieInterval = setInterval(selectPie, 2000); // 设置自动切换高亮图形的定时器

      // 取消所有高亮并高亮当前图形
      function highlightPie() {
        // 遍历饼图数据，取消所有图形的高亮效果
        for (var idx in option.series[0].data) {
          myChart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: idx,
          });
        }
        // 高亮当前图形
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: currentIndex,
        });
      }

      // 用户鼠标悬浮到某一图形时，停止自动切换并高亮鼠标悬浮的图形
      myChart.on("mouseover", (params) => {
        clearInterval(changePieInterval);
        currentIndex = params.dataIndex;
        highlightPie();
      });

      // 用户鼠标移出时，重新开始自动切换
      myChart.on("mouseout", (params) => {
        if (changePieInterval) {
          clearInterval(changePieInterval);
        }
        changePieInterval = setInterval(selectPie, 2000);
      });

      // 高亮效果切换到下一个图形
      function selectPie() {
        var dataLen = option.series[0].data.length;
        currentIndex = (currentIndex + 1) % dataLen;
        highlightPie();
      }
    },

    initMap() {
      const that = this;
      that.map = new AMap.Map("map", {
        viewMode: "2D", // 默认使用 2D 模式
        zoom: 15, //初始化地图层级
        center: [104.07, 30.67], //初始化地图中心点
        resizeEnable: true, //是否监控地图容器尺寸变化
        mapStyle: "amap://styles/3e8e28cc69947e9f86b9df8e21244445",
      });
    },

    initInfo1() {
      this.config.height1 =
        this.$refs.itemRef1[0].clientHeight * this.AnnouncementDataList.length;

      // 调用定时器
      this.initTimerInterval1();
    },
    initTimerInterval1() {
      this.clearEvent1();
      this.timer1 = setInterval(() => {
        window.requestAnimationFrame(this.scroll1);
      }, this.dvtime1);
    },
    scroll1() {
      const that = this;
      let DOM = document.getElementById("outterRef1");

      // 如果滚动到头则重新滚动
      if (
        DOM.scrollTop >=
        this.config.height1 - this.$refs.outterRef1.clientHeight
      ) {
        DOM.scrollTop = 0;
        setTimeout(() => {
          window.requestAnimationFrame(that.scroll1);
        }, that.dvtime1);
        return;
      }
      DOM.scrollTop++;
    },
    clearEvent1() {
      if (this.timer1) {
        clearInterval(this.timer1);
        this.timer1 = null;
      }
    },
    // 鼠标移入关闭定时器
    mouseenterEvent1() {
      this.clearEvent1();
    },
    // 鼠标移出重新调用定时器
    mouseleaveEvent1() {
      this.initTimerInterval1();
    },

    initInfo2() {
      this.config.height2 =
        this.$refs.itemRef2[0].clientHeight * this.warningDataList.length;

      // 调用定时器
      this.initTimerInterval2();
    },
    initTimerInterval2() {
      this.clearEvent2();
      this.timer2 = setInterval(() => {
        window.requestAnimationFrame(this.scroll2);
      }, this.dvtime2);
    },
    scroll2() {
      const that = this;
      let DOM = document.getElementById("outterRef2");

      // 如果滚动到头则重新滚动
      if (
        DOM.scrollTop >=
        this.config.height2 - this.$refs.outterRef2.clientHeight
      ) {
        DOM.scrollTop = 0;
        setTimeout(() => {
          window.requestAnimationFrame(that.scroll2);
        }, that.dvtime2);
        return;
      }
      DOM.scrollTop++;
    },
    clearEvent2() {
      if (this.timer2) {
        clearInterval(this.timer2);
        this.timer2 = null;
      }
    },
    // 鼠标移入关闭定时器
    mouseenterEvent2() {
      this.clearEvent2();
    },
    // 鼠标移出重新调用定时器
    mouseleaveEvent2() {
      this.initTimerInterval2();
    },
  },
};
</script>
      
      <style lang="less" scoped>
#map {
  width: 100%;
  height: 100vh;
  // background: transparent !important;
  position: absolute;
  top: 0;
  left: 0;
}

.title {
  width: 100%;
  height: 40px;
  background: url(../../../../assets/img/bigScreen/title-bg.png) no-repeat
    center center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-family: "微软雅黑";
  backdrop-filter: blur(5px);

  h3 {
    font-size: 16px;
    color: #fff;
    font-weight: bold;
    margin-right: 10px;
  }
  em {
    font-size: 14px;
    color: rgb(170, 186, 197);
  }
}
.content {
  width: 100%;
  height: calc(100% - 40px);
  backdrop-filter: blur(10px);
}

.left,
.right {
  width: 25%;
  height: calc(100% - 140px);
  position: absolute;
  top: 120px;
}

.left {
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > div {
    height: calc(100% / 3);
  }
  .content {
    background: url(../../../../assets/img/bigScreen/content-bg.png) no-repeat
      center center;
    background-size: 100% 100%;
    display: flex;

    & > div {
      width: 100%;
      height: 100%;
    }

    .hiddenTotal {
      width: 100%;

      background: url(../../../../assets/img/bigScreen/hidden-total-bg.png)
        no-repeat center center;

    }
  }
}
.right {
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > div {
    height: calc(100% / 3);
  }
  .content {
    background: url(../../../../assets/img/bigScreen/content-bg2.png) no-repeat
      center center;
    background-size: 100% 100%;
  }

  .announcement {
    .item-style {
      .label {
        color: rgb(212, 107, 8);
        font-family: "微软雅黑";
        min-width: 60px;
      }
      .info {
        color: #fff;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .warning {
    padding: 0 5px;
    .header {
      padding: 0 10px;
      height: 30px;
      display: flex;
      align-items: center;
      color: #fff;
      span:first-child {
        width: 120px;
      }
      span:nth-child(2) {
        text-align: center;
        width: 100%;
      }
      span:last-child {
        text-align: right;
        width: 120px;
      }
    }
    .swiper-wrapper {
      height: calc(100% - 30px);
      .item-style {
        .type {
          color: rgb(212, 107, 8);
          font-family: "微软雅黑";
          width: 120px;
        }
        .info {
          color: #fff;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .time {
          width: 120px;
          color: #fff;
          text-align: right;
        }
      }
    }
  }
}

/deep/ * {
  &::-webkit-scrollbar {
    width: 8px !important; /*对垂直流动条有效*/
    height: 10px !important;
  }

  //   /*定义滚动条的轨道颜色、内阴影及圆角*/
  //   &::-webkit-scrollbar-track {
  //   }

  /*定义滑块颜色、内阴影及圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.45);
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

.swiper-wrapper {
  padding: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // 默认是隐藏超出
  overflow: hidden;

  // 鼠标移入可滚动列表
  &:hover {
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 1px;
    // display: none;
  }

  // 内容超出展示
  .content-container {
    overflow: visible;
    height: 100%;
    width: 100%;
    transition: all 0.5s linear;

    .item-style {
      width: 100%;
      height: 30px;
      display: flex;
      align-items: center;
      padding: 0 5px;
    }
    .styleActive {
      background: #072949;
    }
  }
}
</style>
      
      