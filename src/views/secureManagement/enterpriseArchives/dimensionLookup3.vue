<template>
  <myDialog
    :title="title"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="90%"
  >
    <div class="main">
      <div class="operation">
        <div class="button-wrap">
          <el-button type="text" class="el-icon-thumb" @click="setMode('PAN')"
            >平移</el-button
          >
          <el-button
            type="text"
            class="el-icon-more-outline"
            @click="setMode('POINT')"
            >点</el-button
          >

          <el-button
            type="text"
            class="el-icon-full-screen"
            @click="setMode('RECT')"
            >矩形</el-button
          >
          <el-button
            type="text"
            class="el-icon-house"
            @click="setMode('POLYGON')"
            >多边形</el-button
          >

          <el-button type="text" class="el-icon-refresh-left" @click="Revoke()"
            >撤销</el-button
          >
          <el-button type="text" @click="getFeatures()">获取标注数据</el-button>
        </div>
        <div class="zoom-icon-wrapper">
          <div class="zoom-icon-plus" @click="zoomIn">+</div>
          <div class="zoom-icon-minus" @click="zoomOut">-</div>
        </div>
      </div>

      <div id="map"></div>
    </div>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
        >提 交</myButton
      >
    </template>
  </myDialog>
</template>
  
  <script>
import AILabel from "ailabel";

export default {
  props: {
    title: {
      required: true,
      default() {
        return "";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      imgUrl: "",
      drawingStyle: {},
      mode: "",
      itemName: "",
      editId: "", //待填充图形id
      deleteIconId: "delete01",
      gMap: null, //AILabel实例
      gFirstFeatureLayer: null, //矢量图层实例(矩形，多边形等矢量)
      allFeatures: null, //所有features
    };
  },
  watch: {
    mode(mode) {
      this.gMap.setMode(mode);
      this.setDrawingStyle(mode);
    },
  },
  mounted() {
    let that = this;
    this.$nextTick(() => {
     
    });
  },
  beforeDestroy() {
    this.gMap.destroy();
  },
  methods: {
    zoomIn() {
      this.gMap.zoomIn();
    },
    zoomOut() {
      this.gMap.zoomOut();
    },
    setMode(mode) {
      this.mode = mode;
    },
    // 获取所有features
    getFeatures() {
      this.allFeatures = this.gFirstFeatureLayer.getAllFeatures();
      console.log("--allFeatures--", this.gFirstFeatureLayer);
      console.log("--allFeatures--", this.allFeatures);
    },
    // 初始样式
    setDrawingStyle(mode) {
      let drawingStyle = {};
      switch (mode) {
        //平移
        case "PAN": {
          break;
        }
        //点
        case "POINT": {
          this.drawingStyle = { fillStyle: "#FF8C00" };
          this.gMap.setDrawingStyle(drawingStyle);
          break;
        }

        //矩形
        case "RECT": {
          this.drawingStyle = {
            strokeStyle: "#0f0",
            lineWidth: 3,
            fill: true,
            fillStyle: "#FF6666",
            globalAlpha: 0.3,
          };
          this.gMap.setDrawingStyle(drawingStyle);
          break;
        }
        //多边形
        case "POLYGON": {
          this.drawingStyle = {
            strokeStyle: "#0099CC", //边框颜色
            fill: true, //是否填充
            fillStyle: "#FF6666", //填充色
            globalAlpha: 0.3,
            lineWidth: 3,
          };
          this.gMap.setDrawingStyle(drawingStyle);
          break;
        }
        default:
          break;
      }
    },

    // 添加图形
    addFeature(data, type, id) {
      let that = this;
      let drawingStyle = this.drawingStyle;

      //矩形
      if (type === "RECT") {
        const rectFeature = new AILabel.Feature.Rect(
          id, // id
          data, // shape
          { name }, // props
          drawingStyle // style
        );
        that.gFirstFeatureLayer.addFeature(rectFeature);
      }
      //多边形
      else if (type === "POLYGON") {
        const polygonFeature = new AILabel.Feature.Polygon(
          id, // id
          { points: data }, // shape
          { name }, // props
          drawingStyle // style
        );
        that.gFirstFeatureLayer.addFeature(polygonFeature);
      }
      //点
      else if (type == "POINT") {
        const gFirstFeaturePoint = new AILabel.Feature.Point(
          id, // id
          { x: data.x, y: data.y, r: 5 }, // shape
          { name }, // props
          { fillStyle: "#FF8C00", zIndex: 5, lineWidth: 2 } // style
        );
        that.gFirstFeatureLayer.addFeature(gFirstFeaturePoint);
      }

      this.getFeatures();
    },
    // 画完取名
    getName(mode) {
      return this.$prompt("请输入填写名字", {
        confirmButtonText: "确定",
        showCancelButton: false,
      })
        .then(({ value }) => {
          this.itemName = value;
          return value;
        })
        .catch(() => {
          return null;
        });
    },
    // 增加删除图标
    addDeleteIcon(feature, shape) {
      let gMap = this.gMap;
      let that = this;
      // 添加delete-icon
      // let points = that.getPoints(feature);
      console.log(shape, "shape");
      const gFirstMarker = new AILabel.Marker(
        that.deleteIconId, // id
        {
          src: "https://s1.aigei.com/src/img/png/45/45aabfc232a34e5b9bfaf75412973c08.png?|watermark/3/image/aHR0cHM6Ly9zMS5haWdlaS5jb20vd2F0ZXJtYXJrLzUwMC0xLnBuZz9lPTE3MzU0ODgwMDAmdG9rZW49UDdTMlhwemZ6MTF2QWtBU0xUa2ZITjdGdy1vT1pCZWNxZUpheHlwTDpjYWQ1NHVoRlhGUUViSGR3Vm02aXctVTJoWVE9/dissolve/40/gravity/NorthWest/dx/18/dy/21/ws/0.0/wst/0&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:C11LKqsRLbAqQo2uVPETYDya0QU=",
          position: { x: shape.x + shape.width, y: shape.y - 15 }, // 矩形右上角 根据图形动态调整
          offset: {
            x: -20,
            y: -4,
          },
        }, // markerInfo
        { name: "delete" } // props
      );
      gFirstMarker.events.on("click", (marker) => {
        // 首先删除当前marker
        gMap.markerLayer.removeMarkerById(marker.id);
        // 删除对应text
        // gFirstTextLayer.removeTextById(textId);
        // 删除对应feature
        that.gFirstFeatureLayer.removeFeatureById(feature.id);
      });
      gMap.markerLayer.addMarker(gFirstMarker);

      // that.gFirstFeatureLayer
    },
    // 删除 删除按钮
    deIcon() {
      this.gMap.markerLayer.removeAllMarkers();
    },
    // 增加事件
    addEvent() {
      let that = this;
      let gMap = this.gMap;
      gMap.events.on("drawDone", (type, data) => {
        console.log("--type, data--", type, data);
        // that.addFeature(data, type);
        if (type == "CLEARMASK" || type == "DRAWMASK") {
          that.addFeature(data, type);
        } else {
          that.getName(type).then((id) => {
            if (id) {
              that.addFeature(data, type, id);
            } else {
              this.$message({
                type: "info",
                message: "请填写名字",
              });
            }
          });
        }
      });
      gMap.events.on("boundsChanged", (data) => {
        console.log("--map boundsChanged--", data);
        return "";
      });
      // 双击编辑 在绘制模式下双击feature触发选中
      gMap.events.on("featureSelected", (feature) => {
        this.editId = feature.id;
        console.log("--map featureSelected--", feature, "双击编辑");
        //设置编辑feature
        gMap.setActiveFeature(feature);
        if (feature.type != "POINT") {
          // 增加删除按钮
          that.addDeleteIcon(feature, feature.shape);
        }
      });
      //右键 目前只针对点双击选中右键触发
      gMap.events.on("featureDeleted", (feature) => {
        if (feature.type == "POINT") {
          // 根据id删除对应feature
          that.gFirstFeatureLayer.removeFeatureById(feature.id);
        }
      });
      // 单机空白取消编辑
      gMap.events.on("featureUnselected", () => {
        // 取消featureSelected
        that.editId = "";
        that.deIcon();
        gMap.setActiveFeature(null);
      });
      // 更新完
      gMap.events.on("featureUpdated", (feature, shape) => {
        console.log(feature);
        // 更新或者移动需要重新设置删除图标
        that.deIcon();
        feature.updateShape(shape);
        if (feature.type != "POINT") {
          that.addDeleteIcon(feature, shape);
        }
      });

      // 删除
      gMap.events.on("FeatureDeleted", () => {
        console.log(2222222);
        // that.gFirstFeatureLayer.removeFeatureById(that.editId);
      });
    },
    // 获取坐标 需要自行添加
    getPoints(feature) {
      switch (feature.type) {
        case "RECT":
          return feature.getPoints();
        case "LINE":
          return [feature.shape.start, feature.shape.end];
        case "POLYLINE":
          return feature.shape.points;
        case "POLYGON":
          return feature.shape.points;
        default:
          return [];
      }
    },
    //填充事件
    Fill() {
      console.log("填充事件");
      let fill = this.gFirstFeatureLayer.getFeatureById(this.editId);
      console.log("--填充对象--", fill);
      fill.style.fillStyle = "#FFDAB9";
      fill.style.fill = true;
      //刷新map
      this.gMap.refresh();
    },
    //撤销
    Revoke() {
      console.log("撤销");
      this.getFeatures();
      this.allFeatures.pop();
      //刷新map
      this.gMap.refresh();
      console.log(this.allFeatures, "--所有操作--");
    },

    // 取消
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>
   
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style>
.main {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.button-wrap {
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  position: relative;
  z-index: 99;
}

#map {
  /* margin: 0 auto; */
  overflow: hidden;
  position: relative;
  height: 600px;
  width: 800px;
  border: 1px dashed #ccc;
}

.zoom-icon-wrapper {
  position: absolute;
  /* left: 20px; */
  /* top: 20px; */
  z-index: 1000;
}

.zoom-icon-plus {
  width: 30px;
  height: 30px;
  line-height: 20px;
  text-align: center;
  border: 3px solid #6495ed;
  font-size: 20px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  color: #ff8c00;
  cursor: pointer;
}

.zoom-icon-plus:hover {
  border-color: #4169e1;
}

.zoom-icon-minus {
  margin-top: 6px;
  width: 30px;
  height: 30px;
  line-height: 20px;
  text-align: center;
  border: 3px solid #6495ed;
  font-size: 25px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  color: #ff8c00;
  cursor: pointer;
}

.zoom-icon-minus:hover {
  border-color: #4169e1;
}
/* 删除图标 */
#delete01 {
  width: 20px;
  height: 20px;
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>