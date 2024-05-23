<template>
  <div>
    <div class="head">
      <div class="comprehensive shadow">
        <div class="name">企业综合风险等级</div>
        <div class="level">
          <div class="text">
            <span>II 级</span>
          </div>
          <img src="@/assets/img/homeIcon/refresh.png" />
        </div>
        <div class="describe">
          <img src="@/assets/img/homeIcon/price-up.png" />
          近30天上升一个等级
        </div>
      </div>
      <div class="risk shadow">
        <div class="name">
          风险单元（场所、区域）<img src="@/assets/img/homeIcon/risk.png" />
        </div>
        <div class="num">
          <span>{{ customData.riskPointsNum || "0%" }}</span>
          <div ref="echarts1" class="echarts1" />
        </div>
      </div>
      <div class="shadow">
        <div class="name">隐患整改率</div>
        <div class="level">
          <div class="text">
            <span>{{ customData.rectRate || "0%" }}</span>
          </div>
          <div class="pic">
            <img src="@/assets/img/homeIcon/chart-bar.png" />
          </div>
        </div>
        <div class="describe">
          <div>
            <div class="icon red">患</div>
            <span>重大隐患</span>
            <strong>{{ customData.majorResultCount || 0 }}</strong>
          </div>
          <div>
            <div class="icon blue">患</div>
            <span>一般隐患</span>
            <strong>{{customData.sameAsCount || 0 }}</strong>
          </div>
        </div>
      </div>
      <div class="shadow">
        <div class="name">安全检查完成情况</div>
        <div class="level">
          <div class="text">
            <span>{{ customData.completeNum || 0 }}</span
            >/{{ customData.measureStandardNum || 0 }}
          </div>
          <div class="pic">
            <img src="@/assets/img/homeIcon/chart-bar1.png" />
          </div>
        </div>
        <div class="describe">
          超期未完成
          <span class="red">{{customData.inCompleteNum || 0 }}</span>
        </div>
      </div>
      <div class="shadow">
        <div class="name">制度完整性</div>
        <div class="level">
          <div class="text">
            <span>{{ customData.integrity || "0%" }}</span>
          </div>
          <div class="pic">
            <img src="@/assets/img/homeIcon/chart-bar2.png" />
          </div>
        </div>
        <div class="describe">比上月</div>
      </div>
      <div class="shadow">
        <div class="name">安全事故</div>
        <div class="level">
          <div class="text">
            <span>{{ customData.yearCount || 0 }}</span>
          </div>
          <div class="pic">
            <img src="@/assets/img/homeIcon/chart-bar3.png" />
          </div>
        </div>
        <div class="describe">
          <span class="green">{{ customData.accidentRate || "0%" }}</span>
          <img src="@/assets/img/homeIcon/price-down.png" />
          — 比上年
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-liquidfill/src/liquidFill.js";

export default {
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {
          statistics: {},
        };
      },
    },
  },
  data() {
    return {
      loading: false,

      customData: {},
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getRisk();
    });

    this.$nextTick(() => {
      if (this.data && this.data.statistics) {
        this.customData = this.data.statistics;
      }
    });
  },
  methods: {
    getRisk() {
      var chartColumn = echarts.init(this.$refs.echarts1);
      chartColumn.showLoading();

      const option = {
        tooltip: {
          show: true,
          trigger: "item",
          // {a}(系列名)，{b}(数据项名),{c}(数值),{d}(百分比)
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
                value: this.customData.majorCount || 0,
                itemStyle: { color: "rgb(245, 34, 45)" },
              },
              {
                name: "较大",
                value: this.customData.moreCount || 0,
                itemStyle: { color: "rgb(249, 156, 55)" },
              },
              {
                name: "一般",
                value: this.customData.generaCount || 0,
                itemStyle: { color: "rgb(249, 223, 54)" },
              },
              {
                name: "低",
                value: this.customData.lowCount || 0,
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
  flex-wrap: wrap;
  // grid-template-columns: repeat(auto-fill, calc((100% / 6) - 20px));
  grid-gap: 24px;
  width: 100%;
  & > div {
    width: calc(100% / 6 - 20px);
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
</style>
