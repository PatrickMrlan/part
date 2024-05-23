<template>
  <div class="table-classic-wrapper">
    <div id="container"></div>
    <div class="leftbox">
      <div class="leftbox_top">
        <div class="leftbox-title">
          <img src="@/assets/img/parkgrid/ent.png" class="parkimg" />
          {{ detailInfo.parkName }}
        </div>
        <div class="searchbox">
          <el-select
            v-model="listQuery.keyword"
            placeholder="网格"
            class="input-normal"
            clearable
          >
            <!-- <el-option
            v-for="item in industrySectorList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          >
          </el-option> -->
          </el-select>
          <el-input
            v-model="listQuery.keyword"
            placeholder="企业名称"
            class="input-long"
            @keyup.enter.native="search"
            clearable
          ></el-input>
          <el-button
            v-if="pageOper.CX"
            icon="el-icon-search"
            type="primary"
            @click.native="search"
          ></el-button>
        </div>
      </div>
      <div class="leftbox_btm">
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/ent.png"
                alt=""
              />
              全部
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/risk.png"
                alt=""
              />
              高危行业
            </div>
            <div>
              <el-switch
                v-model="listQuery.value1"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/Industry.png"
                alt=""
              />
              工贸行业
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
          <div class="checkbox">
            <el-checkbox-group v-model="checkedCities">
              <el-checkbox
                class="checkitem"
                v-for="city in cities"
                :label="city"
                :key="city"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/major.png"
                alt=""
              />
              重大危险源行业
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/dust.png"
                alt=""
              />
              粉尘制爆行业
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/nitrogen.png"
                alt=""
              />
              液氮制冷(气)行业
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/chemistry.png"
                alt=""
              />
              危险化学品行业
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
          <div class="checkbox">
            <el-checkbox-group v-model="checkedCities">
              <el-checkbox
                class="checkitem"
                v-for="city in cities1"
                :label="city"
                :key="city"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/gas.png"
                alt=""
              />
              燃气使用
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
          <div class="checkbox">
            <el-checkbox-group v-model="checkedCities">
              <el-checkbox
                class="checkitem"
                v-for="city in cities2"
                :label="city"
                :key="city"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/space.png"
                alt=""
              />
              有限空间
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/dormitory.png"
                alt=""
              />
              设有宿舍的企业
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="switchbox">
          <div class="switchbox_top">
            <div>
              <img
                class="switchicon"
                src="@/assets/img/parkgrid/within.png"
                alt=""
              />
              园中园企业
            </div>
            <div>
              <el-switch
                v-model="listQuery.value"
                active-color="rgb(0, 110, 255)"
                inactive-color="#cfcfcf"
              >
              </el-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rightbox">
      <div class="rightbox_tit">企业数量</div>
      <div ref="chartColumn" class="charts"></div>
    </div>
    <!-- <div class="gridbox">
      <img src="@/assets/img/parkgrid/grids.png" alt="" />
    </div> -->
  </div>
</template>
<script>
import * as echarts from "echarts";
import { detail } from "@/api/park/information";
export default {
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      loginUser: {},
      detailInfo: {},
      mapcenter: [103.7025, 30.641194],
      listQuery: {
        value: null,
        value1: true,
        keyword: null
      },
      chartColumn: {},
      cities: [
        "冶金行业",
        "有色行业",
        "建筑行业",
        "机械行业",
        "轻工行业",
        "纺织行业",
        "烟草行业",
        "商贸行业"
      ],
      cities1: ["生产", "储存", "经营", "使用"],
      cities2: ["生产", "储存"],
      checkedCities: []
    };
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    if (this.loginUser.sysPark) {
      this.getMainData();
    } else {
      this.$message({
        type: "warning",
        message: "当前用户暂无园区!"
      });
    }
  },
  mounted() {
    this.initMap();
    this.initChart();
    // this.onResize();
    // window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    getMainData() {
      detail({ id: this.loginUser.sysPark.parkId })
        .then(res => {
          this.mapcenter = [res.longitude, res.latitude];
          this.detailInfo = res;
          console.log(res);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 地图初始化
    initMap() {
      var that = this;
      // let publicZooms = [3, 20];
      // let publicZindex = 999;
      // let styleObjArr = [
      //   {
      //     url: require("../../../assets/img/parkgrid/marker1.png"), // 图标地址
      //     size: new AMap.Size(30, 30), // 图标大小
      //     anchor // 偏移量
      //     // zIndex: publicZindex,
      //   },
      //   {
      //     url: require("../../../assets/img/parkgrid/marker2.png"), // 图标地址
      //     size: new AMap.Size(30, 30), // 图标大小
      //     anchor // 偏移量
      //     // zIndex: publicZindex,
      //   },
      //   {
      //     url: require("../../../assets/img/parkgrid/marker3.png"), // 图标地址
      //     size: new AMap.Size(30, 30), // 图标大小
      //     anchor // 偏移量
      //     // zIndex: publicZindex,
      //   },
      //   {
      //     url: require("../../../assets/img/parkgrid/marker4.png"), // 图标地址
      //     size: new AMap.Size(30, 30), // 图标大小
      //     anchor // 偏移量
      //     // zIndex: publicZindex,
      //   },
      //   {
      //     url: require("../../../assets/img/parkgrid/marker5.png"), // 图标地址
      //     size: new AMap.Size(30, 30), // 图标大小
      //     anchor // 偏移量
      //     // zIndex: 500,
      //   }
      // ];
      this.map = new AMap.Map("container", {
        resizeEnable: true, // 窗口大小调整
        center: this.mapcenter, // 中心
        zoom: 15, // 放大级别
        showLabel: true // 是否显示地图文字标记
      });

      let marker = new window.AMap.Marker({
        position: [103.7025, 30.641194], //要展示marker的经度、纬度。数据格式就是数组里放入经纬度数据
        icon: require("../../../assets/img/parkgrid/marker1.png"), //显示的图标
        offset: [-16, -32] //图标偏移量，展示时会默认以图标的左上角为原点，不设置偏移量会导致地图放大缩小时造成图标偏移的情况，偏移量设置为图标宽度的负一半，负整个高度。
      });
      that.map.add(marker);
    },
    onResize() {
      let h = 0;
      if (this.$refs.table.offsetHeight) {
        h = window.innerHeight - this.$refs.table.offsetHeight;
        this.resizeHeight = window.innerHeight - h - 50;
      }
    },
    search() {},
    initChart(data) {
      // 使用 ref 获取 DOM 元素，并初始化图表
      this.chartColumn = echarts.init(this.$refs.chartColumn);
      this.chartColumn.showLoading();
      const options = {
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          top: "5%",
          left: "right"
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 30,
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: "Ⅰ级风险" },
              { value: 735, name: "Ⅱ级风险" },
              { value: 580, name: "Ⅲ级风险" },
              { value: 484, name: "Ⅳ级风险" },
              { value: 300, name: "未知风险" }
            ],

            center: ["20%", "45%"]
          }
        ]
      };
      // 使用配置项和数据显示图表
      this.chartColumn.setOption(options);
      this.chartColumn.hideLoading();
      window.addEventListener("resize", this.chartColumn.resize);
    }
  }
};
</script>

<style lang="less" scoped>
/** 输入框、下拉框的宽度 **/
/deep/.el-cascader,
/deep/.el-select,
/deep/.el-input-number,
/deep/.el-date-editor,
/deep/.el-switch,
/deep/.el-input {
  width: 100% !important;
}
.table-classic-wrapper {
  position: relative;
}
#container {
  width: 100%;
  height: calc(100vh - 164px);
}
.leftbox {
  width: 25%;
  min-width: 210px;
  max-width: 300px;
  background: #fff;
  position: absolute;
  left: 30px;
  top: 5%;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  .leftbox_top {
    padding: 10px;
    box-sizing: border-box;
  }
  .leftbox-title {
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .parkimg {
      height: 25px;
      width: 25px;
      margin-right: 5px;
    }
  }
  .searchbox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .searchipt {
      display: flex;
      align-items: center;
    }
  }
}
.input-long {
  margin: 0;
}
/deep/.searchButton {
  margin: 0;
}
.leftbox_btm {
  width: 100%;
  height: calc(100vh - 310px);
  overflow: auto;
  border-top: 1px solid #cfcfcf;
  box-sizing: border-box;
  padding: 10px;
  box-sizing: border-box;

  .switchbox {
    color: #333;
    font-size: 14px;
    margin: 10px 0;
    display: flex;
    flex-wrap: wrap;
    border-radius: 5px;
    background-color: #fafafa;
    border: 1px solid #e7eaef;
    box-sizing: border-box;
    .switchbox_top {
      padding: 5px 10px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .switchicon {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
    }
    .checkbox {
      width: 100%;
      padding: 5px 10px;
      background-color: #ffffff;
      .checkitem {
        width: 50%;
        margin: 0;
      }
    }
  }
}
.switchbox_top > :nth-child(1) {
  display: flex;
  align-items: center;
}
.rightbox {
  padding: 10px;
  width: 25%;
  height: 200px;
  background: #fff;
  position: absolute;
  right: 30px;
  top: 5%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  .rightbox_tit {
    font-size: 18px;
    font-weight: 500;
  }
  .charts {
    width: 100%;
    height: 90%;
    padding: 8px;
  }
}

.gridbox {
  position: absolute;
  right: 350px;
  top: 10%;
  display: flex;
  height: 80%;
  width: 35%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
