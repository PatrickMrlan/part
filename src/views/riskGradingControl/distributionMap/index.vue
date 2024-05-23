<template>
  <div class="table-classic-wrapper">
    <div class="main">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-tabs type="border-card">
            <el-tab-pane label="风险列表">
              <ul class="layerObjectList">
                <li v-for="(item, index) in layerObjectData" :key="index">
                  <div class="label" :style="{ background: item.color }">
                    {{ item.riskLevel }}
                  </div>
                  <span>{{ item.riskPointName }}</span>
                </li>
              </ul>
              <div class="bottom">
                <div>
                  <div class="label"></div>
                  <span>重大风险</span>
                </div>
                <div>
                  <div class="label"></div>
                  <span>较大风险</span>
                </div>
                <div>
                  <div class="label"></div>
                  <span>一般风险</span>
                </div>
                <div>
                  <div class="label"></div>
                  <span>低风险</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="18">
          <div class="operation">
            <div class="button-wrap">
              <div>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  title="放大"
                  @click="zoomIn()"
                />
                <el-button
                  type="primary"
                  icon="el-icon-minus"
                  title="缩小"
                  @click="zoomOut()"
                />
              </div>
            </div>
          </div>
          <div class="map" id="map" ref="map"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
    
<script>
import AILabel from "ailabel";
import { toRaw } from "@vue/reactivity";
import { mapGetters } from "vuex";
import { fourColor, detail } from "@/api/system/enterprise";

var that;
export default {
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,

      imgUrl: null,

      drawingStyle: {},
      mode: "",
      itemName: "",
      editId: "", //待填充图形id
      deleteIconId: "delete01",
      gMap: null, //AILabel实例
      gFirstFeatureLayer: null, //矢量图层实例(矩形，多边形等矢量)
      allFeatures: null, //所有features

      loginUser: null,

      layerObjectData: [],
    };
  },
  computed: {
    ...mapGetters("app", ["themeColor"]),
  },
  created() {
    that = this;
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser") || "{}");

    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;

      await detail({ entId: this.loginUser.entId })
        .then((res) => {
          that.$nextTick(() => {
            that.imgUrl = res.sysEnterprise.planView;
          });
        })
        .catch(() => {
          that.loading = false;
        });

      await fourColor()
        .then((res) => {
          this.loading = false;
          this.layerObjectData = res;

          that.$nextTick(() => {
            that.initMap();
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },

    initMap() {
      that.gMap = new AILabel.Map("map", {
        center: { x: 250, y: 150 }, // 为了让图片居中
        zoom: 500,
        mode: "PAN", // 绘制线段
        refreshDelayWhenZooming: true, // 缩放时是否允许刷新延时，性能更优
        zoomWhenDrawing: true,
        panWhenDrawing: true,
        zoomWheelRatio: 5, // 控制滑轮缩放缩率[0, 10), 值越小，则缩放越快，反之越慢
        withHotKeys: true, // 关闭快捷键

        gFirstImageLayer: null,
        gFirstTextLayer: null,
      });
      // this.addEvent();
      // 图片层添加
      that.gFirstImageLayer = new AILabel.Layer.Image(
        "first-layer-image", // id
        {
          src: that.imgUrl,
          width: 500,
          height: 300,
          crossOrigin: false, // 如果跨域图片，需要设置为true
          position: {
            // 左上角相对中心点偏移量
            x: 0,
            y: 0,
          },
          // 网格
          // grid: {
          //   // 3 * 3
          //   columns: [{ color: "#9370DB" }, { color: "#FF6347" }],
          //   rows: [{ color: "#9370DB" }, { color: "#FF6347" }],
          // },
        }, // imageInfo
        { name: "第一个图片图层" }, // props
        { zIndex: 5 } // style
      );
      // 添加到gMap对象
      that.gMap.addLayer(that.gFirstImageLayer);
      // 添加矢量图层
      that.gFirstFeatureLayer = new AILabel.Layer.Feature(
        "first-layer-feature", // id
        { name: "第一个矢量图层" }, // props
        { zIndex: 10 } // style
      );
      that.gFirstTextLayer = new AILabel.Layer.Text(
        "first-layer-text", // id
        { name: "第一个文本图层" }, // props
        { zIndex: 12, opacity: 1 } // style
      );
      that.gMap.addLayer(that.gFirstFeatureLayer);
      that.gMap.addLayer(that.gFirstTextLayer);

      that.EchoData(this.layerObjectData);

      window.onresize = function () {
        this.gMap && this.gMap.resize();
      };
    },

    /**
     * @author elongpaox
     * @method EchoData 回显数据
     */
    EchoData(data) {
      if (data && data.length > 0) {
        let newallFeatures = [];

        data.forEach((item) => {
          let layerLocation = JSON.parse(item.layerLocation);
          layerLocation.style.fillStyle = item.color;
          layerLocation.style.strokeStyle = item.color;
          newallFeatures.push(layerLocation);
        });

        newallFeatures.forEach(({ id, props, shape, style, type }) => {
          if (type === "RECT") {
            const rectFeature = new AILabel.Feature.Rect(
              id, // id
              shape, // shape
              props,
              style
            );
            this.gFirstFeatureLayer.addFeature(rectFeature);
          } else if (type === "POLYGON") {
            const polygonFeature = new AILabel.Feature.Polygon(
              id, // id
              shape, // shape
              props, // props
              style // style
            );
            this.gFirstFeatureLayer.addFeature(polygonFeature);
          } else if (type == "POINT") {
            const gFirstFeaturePoint = new AILabel.Feature.Point(
              id, // id
              shape, // shape
              props, // props
              style // style
            );
            that.gFirstFeatureLayer.addFeature(gFirstFeaturePoint);
          }
        });
        that.loading = false;
      }
    },

    zoomIn() {
      this.gMap.zoomIn();
    },
    zoomOut() {
      this.gMap.zoomOut();
    },
  },
};
</script>
    
<style lang="less" scoped>
/deep/.layerObjectList {
  height: calc(100vh - 290px);
  overflow: auto;
  padding: 0 0 10px 0;

  // 滚动条整体部分
  &::-webkit-scrollbar {
    width: 8px;
    height: 10px;
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
  li {
    font-size: 14px;
    padding: 5px 10px;
    display: flex;
    .label {
      width: 60px;
      background: #fafafa;
      border-radius: 4px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
      padding: 0 5px;
      margin-right: 5px;
      white-space: nowrap;
    }
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  & > div {
    width: calc(50% - 5px);
    display: flex;
    align-items: center;
    .label {
      width: 30px;
      height: 20px;
      border-radius: 5px;
    }

    span {
      margin-left: 5px;
      font-size: 14px;
    }
  }

  & > div:nth-child(1) {
    .label {
      background: #f4404a;
    }
  }
  & > div:nth-child(2) {
    .label {
      background: #f99c37;
    }
  }
  & > div:nth-child(3) {
    .label {
      background: #f6bd16;
    }
  }
  & > div:nth-child(4) {
    .label {
      background: #5cb5ff;
    }
  }
}

.operation {
  padding-bottom: 10px;
}

#map {
  overflow: hidden;
  position: relative;
  height: calc(100vh - 210px);
  border: 1px dashed #ccc;
}
</style>
    