<template>
    <div style="height: 100vh">
      <div id="map"></div>
  
      <div class="left">
        <div class="statistics">
          <div class="title">
            <h3>企业统计</h3>
            <em>Enterprise statistics</em>
          </div>
          <div class="content">
            <div class="totle">
              <div class="pic">
                <img src="@/assets/img/bigScreen/statistics-total-pic.png" />
              </div>
              <div class="num">
                <p>企业总数</p>
                <p>20<span>个</span></p>
              </div>
            </div>
            <div class="echarts" ref="echarts1"></div>
          </div>
        </div>
  
        <div class="dataList content">
          <ul v-if="dataList.length > 0">
            <li v-for="(item, index) in dataList" :key="index" :title="item.name">
              <div class="num">
                <p>{{ item.name }}</p>
                <p>{{ item.num || 0 }}<span>个</span></p>
              </div>
            </li>
          </ul>
          <div class="empty" v-else>暂无数据</div>
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
        await this.getEnterpriseStatistics();
        await this.initInfo1();
        await this.initInfo2();
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
  
      getEnterpriseStatistics() {
        let chartColumn = echarts.init(this.$refs.echarts1);
  
        let ck_seriesData = [
          { name: "Ⅰ级风险", value: 3 },
          { name: "Ⅱ级风险", value: 3 },
          { name: "Ⅲ级风险", value: 4 },
          { name: "Ⅳ级风险", value: 6 },
          { name: "未评级", value: 5 },
        ];
        let option = {
          color: ["#f4404a", "#f99c37", "#f6bd16", "#5cb5ff", "#ccc"],
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
            data: ck_seriesData,
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
              radius: ["45%", "70%"],
              // 饼图位置参数
              center: ["50%", "50%"],
              avoidLabelOverlap: false,
              itemStyle: {
                // 设置不生效
                borderRadius: 3,
                borderWidth: 3,
              },
              label: {
                show: false,
                position: "center",
                formatter: "{d_style|{d}%}\n{b_style|{b}}\n{c_style|{c}个}", //'{b_style|{b}}\n{c_style|{c}%}\n{b_style|{d}%}',
                rich: {
                  d_style: {
                    color: "#fff",
                    fontSize: 16,
                  },
                  b_style: {
                    fontSize: 12,
                    color: "#fff",
                    padding: [5, 0, 5, 0],
                    fontWeight: 500,
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
              data: ck_seriesData,
            },
          ],
        };
        handleChartLoop(option, chartColumn); //定义名称
        // 饼图自动轮播
        function handleChartLoop(option, myChart) {
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
        }
  
        chartColumn.setOption(option);
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
    background: url(../../../../assets/img/bigScreen/title-bg.png) no-repeat center
      center;
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
      height: 30%;
      .content {
        display: flex;
  
        & > div {
          width: 50%;
          height: 100%;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .totle {
          .pic {
            filter: hue-rotate(163deg);
            margin-right: 10px;
          }
          .num {
            p:first-child {
              font-size: 14px;
              color: #fff;
              font-weight: bold;
            }
            p:last-child {
              font-family: "D-DIN-PRO-FVS SemiBold";
              color: rgb(68, 235, 234);
              filter: drop-shadow(rgba(68, 235, 234, 0.4) 0px 2px 4px);
              font-size: 26px;
              font-weight: bold;
              span {
                color: rgba(239, 244, 255, 0.65);
                font-size: 12px;
                margin-left: 5px;
              }
            }
          }
        }
      }
    }
    .dataList {
      width: 100%;
      height: 70%;
      padding: 20px 10px;
      overflow: auto;
      .empty {
        font-size: 18px;
        height: 100%;
        color: #909399;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      & > ul {
        display: flex;
        flex-wrap: wrap;
        gap: 5px 0;
        li {
          width: calc(50% - 5px);
          height: 80px;
          background: url(../../../../assets/img/bigScreen/dataList-bg.png) no-repeat;
          filter: hue-rotate(156deg);
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .num {
            margin-left: 60px;
            width: 50%;
            p:first-child {
              font-size: 14px;
              color: #fff;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            p:last-child {
              font-family: "D-DIN-PRO-FVS SemiBold";
              color: #ffdd1f;
              filter: drop-shadow(rgba(255, 221, 31, 0.4) 0px 2px 4px);
              font-size: 16px;
              font-weight: bold;
              span {
                color: rgba(239, 244, 255, 0.65);
                font-size: 12px;
                margin-left: 5px;
              }
            }
          }
        }
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
  
  