<template>
  <div style="height: 100vh">
    <div id="map"></div>

    <div class="left">
      <div class="statistics">
        <div class="title">
          <h3>风险统计</h3>
          <em>Risk statistics</em>
        </div>
        <div class="content">
          <div class="riskTotal">
            <div>
              <div class="name">企业风险</div>
              <div class="num">73</div>
            </div>
            <div>
              <div class="name">公共风险</div>
              <div class="num">2</div>
            </div>
          </div>
          <div class="echarts" ref="echarts1"></div>
        </div>
      </div>

      <div class="dataList content">
        <div class="echarts" ref="echarts2"></div>
        <div class="echarts" ref="echarts3"></div>
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

      option: {
        title: {
          show: true, //false
          text: "", //主标题文本
          textStyle: {
            color: "#fff",
            fontWeight: "normal",
            fontSize: 16, //字体大小
          },
          left: "center",
          top: "10px",
        },

        color: ["#f4404a", "#f99c37", "#f6bd16", "#5cb5ff"],
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(0,0,0,.6)",
          borderColor: "rgba(147, 235, 248, .8)",
          textStyle: {
            color: "#FFF",
          },
        },
        grid: {
          left: "2%",
          right: "5%",
          bottom: "5%",
          top: "60px",
          containLabel: true,
        },

        legend: {
          show: true,
          orient: "horizontal",
          formatter: ["{a|{name}}"].join("\n"),
          top: "30px",
          textStyle: {
            fontSize: 12,
            color: "#fff",
            height: 8,
            rich: {
              a: {
                verticalAlign: "bottom",
              },
            },
          },
          data: ["重大风险", "较大风险", "一般风险", "低风险"],
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#BDD8FB",
              fontSize: 12,
            },
          },
          axisLabel: {
            // interval:0,
            color: "#BDD8FB",
            fontSize: 12,
          },
          axisTick: {
            show: false,
          },
          data: ["6月", "7月", "8月", "9月", "10月", "11月"],
        },
        yAxis: {
          type: "value",
          min: 0,
          minInterval: 1,
          nameTextStyle: {
            fontSize: 12,
            color: "#BDD8FB",
            align: "center",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.15)",
              // type: 'dashed', // dotted 虚线
            },
          },
          splitArea: { show: false },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
            fontFamily: "Bebas",
            color: "#BDD8FB",
          },
        },
        series: [
          {
            type: "line",
            smooth: true, // 是否曲线
            name: "重大风险", // 图例对应类别
            data: [8, 6, 8, 7, 8, 6], // 纵坐标数据
          },
          {
            type: "line",
            smooth: true,
            name: "较大风险",
            data: [20, 18, 16, 14, 18, 16],
          },
          {
            type: "line",
            smooth: true,
            name: "一般风险",
            data: [21, 22, 20, 20, 20, 18],
          },
          {
            type: "line",
            smooth: true,
            name: "低风险",
            data: [34, 31, 29, 32, 30, 33],
          },
        ],
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

      dataList: [
        {
          name: "重大危险源企业",
          num: 8,
        },
        {
          name: "粉尘涉爆企业",
          num: 5,
        },
        {
          name: "液氨制冷（气）",
          num: 0,
        },
        {
          name: "危险化学品",
          num: 4,
        },
        {
          name: "燃气使用",
          num: 11,
        },
        {
          name: "有限空间",
          num: 5,
        },
        {
          name: "设有宿舍的企业",
          num: 3,
        },
        {
          name: "园中园企业",
          num: 0,
        },
        {
          name: "出租企业",
          num: 2,
        },
        {
          name: "承租企业",
          num: 20,
        },
        {
          name: "规上企业",
          num: 10,
        },
        {
          name: "安全生产标准化企业",
          num: 6,
        },
        {
          name: "安全文化建设示范单位",
          num: 4,
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(async () => {
      await this.initMap();
      await this.initInfo1();
      await this.initInfo2();

      await this.getEcharts1();
      await this.getEcharts2();
      await this.getEcharts3();
    });
  },
  methods: {
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

    getEcharts1() {
      let chartColumn = echarts.init(this.$refs.echarts1);

      const data1 = [6, 0];
      const data2 = [16, 2];
      const data3 = [18, 0];
      const data4 = [22, 0];
      var barWidth = 30;
      let option = {
        tooltip: {
          trigger: "axis",
        },
        //图表大小位置限制
        grid: {
          left: "2%",
          right: "5%",
          bottom: "5%",
          top: "5%",
          containLabel: true,
        },
        xAxis: {
          data: ["企业风险", "公共风险"],
          //坐标轴
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#214776",
            },
            textStyle: {
              color: "#fff",
              fontSize: "10",
            },
          },
          type: "category",
          axisLabel: {
            textStyle: {
              color: "#C5DFFB",
              fontWeight: 500,
              fontSize: "14",
            },
          },
          axisTick: {
            textStyle: {
              color: "#fff",
              fontSize: "16",
            },
            show: false,
          },
          axisLine: {
            //坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              type: "dashed", //线的类型 虚线
              color: "#DEDEDE",
            },
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed", //线的类型 虚线0
              opacity: 0.2, //透明度
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          //坐标值标注
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff",
            },
          },
        },
        series: [
          {
            name: "重大风险",
            type: "bar",
            barGap: "50%",
            data: data1,
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  x2: 1,
                  y: 0,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: "rgba(244, 64, 74, .85)" },
                    { offset: 0.5, color: "rgba(244, 64, 74, .85)" },
                    { offset: 0.5, color: "rgba(244, 64, 74, 1)" },
                    { offset: 1, color: "rgba(244, 64, 74, 1)" },
                  ],
                },
                //柱形图上方标题
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#fff",
                    fontSize: 8,
                  },
                },
              },
            },
          },

          {
            name: "较大风险",
            type: "bar",
            barGap: "50%",
            data: data2,
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  x2: 1,
                  y: 0,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: "rgba(249, 156, 55, .85)" },
                    { offset: 0.5, color: "rgba(249, 156, 55, .85)" },
                    { offset: 0.5, color: "rgba(249, 156, 55, 1)" },
                    { offset: 1, color: "rgba(249, 156, 55, 1)" },
                  ],
                },
                //柱形图上方标题
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#fff",
                    fontSize: 8,
                  },
                },
              },
            },
          },
          {
            name: "一般风险",
            type: "bar",
            barGap: "50%",
            data: data3,
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  x2: 1,
                  y: 0,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: "rgba(246, 189, 22, .85)" },
                    { offset: 0.5, color: "rgba(246, 189, 22, .85)" },
                    { offset: 0.5, color: "rgba(246, 189, 22, 1)" },
                    { offset: 1, color: "rgba(246, 189, 22, 1)" },
                  ],
                },
                //柱形图上方标题
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#fff",
                    fontSize: 8,
                  },
                },
              },
            },
          },
          {
            name: "低风险",
            type: "bar",
            barGap: "50%",
            data: data4,
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  x2: 1,
                  y: 0,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: "rgba(92, 181, 255, .85)" },
                    { offset: 0.5, color: "rgba(92, 181, 255, .85)" },
                    { offset: 0.5, color: "rgba(92, 181, 255, 1)" },
                    { offset: 1, color: "rgba(92, 181, 255, 1)" },
                  ],
                },
                //柱形图上方标题
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#fff",
                    fontSize: 8,
                  },
                },
              },
            },
          },
        ],
      };
      chartColumn.setOption(option);
      window.addEventListener("resize", chartColumn.resize);
    },

    getEcharts2() {
      let chartColumn = echarts.init(this.$refs.echarts2);
      this.option.title.text = "企业风险走势";

      chartColumn.setOption(this.option);
      window.addEventListener("resize", chartColumn.resize);
    },
    getEcharts3() {
      let chartColumn = echarts.init(this.$refs.echarts3);
      this.option.title.text = "公共风险走势";
      chartColumn.setOption(this.option);
      window.addEventListener("resize", chartColumn.resize);
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
  .content {
    background: url(../../../../assets/img/bigScreen/content-bg.png) no-repeat
      center center;
    background-size: 100% 100%;
  }
  .statistics {
    width: 100%;
    height: 50%;
    .content {
      & > div {
        height: 50%;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .riskTotal {
        & > div {
          width: 100%;
          height: 100%;
          background: url(../../../../assets/img/bigScreen/risk-total-bg.webp)
            no-repeat center center;
          background-size: 70% auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .name {
            font-size: 14px;
            font-weight: bold;
            color: #fff;
          }
          .num {
            font-family: "D-DIN-PRO-FVS SemiBold";
            color: rgb(68, 235, 234);
            font-size: 24px;
          }
        }
      }
    }
  }
  .dataList {
    width: 100%;
    height: 50%;
    padding: 20px 10px;

    & > div {
      height: 50%;
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
  
  