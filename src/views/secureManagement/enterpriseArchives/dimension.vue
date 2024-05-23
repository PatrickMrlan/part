<template>
  <div class="table-classic-wrapper" v-loading="loading">
    <div class="flex">
      <myUpload
        action="#"
        class="upload-demo"
        accept=".jpg,.jpeg,.png,.gif,.bmp"
        :file-list="imgList"
        :on-preview="handlePreview"
        :http-request="handleUpload"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
      >
        <myButton>上传底图</myButton>
      </myUpload>
      <myButton icon="el-icon-check" @click.native="saveData">保存</myButton>
    </div>
    <div class="main">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-tabs type="border-card" v-model="layerObjectType">
            <el-tab-pane
              label="风险单元（场所、区域）"
              name="1"
              class="tabPane"
            >
            </el-tab-pane>
            <el-tab-pane
              label="设施设备"
              name="2"
              class="tabPane"
            ></el-tab-pane>
            <ul class="layerObjectList">
              <li
                v-for="(item, index) in layerObjectData"
                :key="index"
                @click="nowClick(item)"
                :class="
                  item.myValue == layerObjectId ? 'layerObjectListActive' : ''
                "
                :style="{
                  backgroundColor:
                    item.myValue == layerObjectId ? themeColor : '',
                }"
              >
                {{ item.myLabel }}
              </li>
            </ul>
          </el-tabs>
        </el-col>
        <el-col :span="18">
          <div class="operation">
            <div class="button-wrap">
              <el-radio-group v-model="modeValue" @change="setMode">
                <el-radio-button label="PAN">平移</el-radio-button>
                <el-radio-button label="POINT">点</el-radio-button>
                <el-radio-button label="RECT">矩形</el-radio-button>
                <el-radio-button label="POLYGON">多边形</el-radio-button>
              </el-radio-group>
              <div>
                <el-button
                  type="primary"
                  style="margin-left: 10px"
                  icon="el-icon-refresh-left"
                  @click="Revoke()"
                  >撤销</el-button
                >
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

              <!-- <el-button type="text" @click="getFeatures()"
                >获取标注数据</el-button
              > -->
            </div>
          </div>
          <div class="map" id="map" ref="map"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { fileUpload } from "@/api/upload";
import AILabel from "ailabel";
import { toRaw } from "@vue/reactivity";
import { mapGetters } from "vuex";
import {
  detail,
  layerList,
  layerEdit,
  planViewEdit,
} from "@/api/system/enterprise";
import { list as riskPointList } from "@/api/risk/riskPoint";
import { list as deviceList } from "@/api/park/facilities";

var that;
export default {
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,
      imgList: [],
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

      layerObjectType: "1",
      layerObjectId: null,

      layerObjectData: [],
      modeValue: "PAN",
    };
  },
  created() {
    that = this;
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser") || "{}");

    this.loadData();
  },
  computed: {
    ...mapGetters("app", ["themeColor"]),
  },
  watch: {
    mode(mode) {
      this.gMap.setMode(mode);
      this.setDrawingStyle(mode);
    },
    layerObjectType: {
      handler: function (newVal) {
        this.getLayerObjectData(newVal);
        this.layerObjectId = null;
      },
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    getActiveFeature() {
      this.allFeatures = this.gFirstFeatureLayer.getAllFeatures();
      this.deIcon();
      this.gMap.setActiveFeature(null);
      if (this.allFeatures.length > 0) {
        for (let i = 0; i < this.allFeatures.length; i++) {
          const element = this.allFeatures[i];
          if (element.id == that.layerObjectId) {
            this.gMap.setActiveFeature(element);
            if (element.type != "POINT") {
              // 增加删除按钮
              that.addDeleteIcon(element, element.shape);
            }
            break;
          }
        }
      }
    },

    nowClick(data) {
      this.layerObjectId = data.myValue;
      this.getActiveFeature();
    },
    getLayerObjectData(type) {
      if (type == 1) {
        riskPointList({ pageIndex: 1, pageSize: 99999999 })
          .then((res) => {
            that.layerObjectData = res.records;

            if (that.layerObjectData && that.layerObjectData.length > 0) {
              that.layerObjectData.forEach((item) => {
                item.myLabel = item.riskPointName;
                item.myValue = item.riskPointId;
              });
              that.layerObjectId = that.layerObjectData[0].myValue;
            }
          })
          .catch(() => {
            that.loading = false;
          });
      } else if (type == 2) {
        deviceList({ pageIndex: 1, pageSize: 99999999 })
          .then((res) => {
            that.layerObjectData = res.records;

            if (that.layerObjectData && that.layerObjectData.length > 0) {
              that.layerObjectData.forEach((item) => {
                item.myLabel = item.deviceName;
                item.myValue = item.deviceId;
              });
              that.layerObjectId = that.layerObjectData[0].myValue;
            }
          })
          .catch(() => {
            that.loading = false;
          });
      }
    },

    async loadData() {
      that.loading = true;

      await detail({ entId: this.loginUser.entId })
        .then((res) => {
          that.$nextTick(() => {
            that.imgUrl = res.sysEnterprise.planView;
            that.initMap();
          });
        })
        .catch(() => {
          that.loading = false;
        });

      await layerList()
        .then((res) => {
          that.$nextTick(() => {
            that.EchoData(res);
          });
          that.loading = false;
        })
        .catch(() => {
          that.loading = false;
        });
    },

    /**
     * @author elongpaox
     * @method EchoData 回显数据
     */
    EchoData(data) {
      if (data && data.length > 0) {
        let newallFeatures = [];

        data.forEach((item) => {
          console.log(item);
          newallFeatures.push(JSON.parse(item.layerLocation));
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
        this.getActiveFeature();
      }
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
      this.addEvent();
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

      window.onresize = function () {
        this.gMap && this.gMap.resize();
      };
    },

    zoomIn() {
      if (!this.imgUrl) {
        return this.$message.info("请先上传底图!");
      }

      this.gMap.zoomIn();
    },
    zoomOut() {
      if (!this.imgUrl) {
        return this.$message.info("请先上传底图!");
      }

      this.gMap.zoomOut();
    },
    setMode(mode) {
      if (!this.imgUrl) {
        this.modeValue = "PAN";
        return this.$message.info("请先上传底图!");
      }
      if (!this.layerObjectId && mode !== "PAN") {
        this.modeValue = "PAN";
        console.log(this.modeValue);

        return this.$message.info(
          this.layerObjectType == 1
            ? "请选择对应风险场所！"
            : "请选择对应设施设备！"
        );
      }
      this.mode = mode;
    },

    /**
     * @author elongpaox
     * @method getCenter 获取一组坐标的中心点
     * @param {Array} points 坐标集合
     * @param {Number} w 图片宽度
     * @param {Number} h 图片高度
     * @returns
     */
    isPOLYGON(points = [], w, h) {
      let flag = true;
      points.forEach((point) => {
        if (
          flag &&
          (point.x < 0 || point.x > w || point.y < 0 || point.y > h)
        ) {
          flag = false;
        }
      });
      return flag;
    },

    // 获取所有features
    getFeatures() {
      if (!this.imgUrl) {
        return this.$message.info("请先上传底图!");
      }
      if (!this.layerObjectId) {
        return this.$message.info(
          this.layerObjectType == 1
            ? "请选择对应风险场所！"
            : "请选择对应设施设备！"
        );
      }
      this.allFeatures = this.gFirstFeatureLayer.getAllFeatures();
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
            strokeStyle: "#0099CC",
            lineWidth: 3,
            fill: true,
            fillStyle: "#0099CC",
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
            fillStyle: "#0099CC", //填充色
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
          {
            name,
            layerObjectType: that.layerObjectType,
            layerObjectId: that.layerObjectId,
          }, // props
          drawingStyle // style
        );
        that.gFirstFeatureLayer.addFeature(rectFeature);
      }
      //多边形
      else if (type === "POLYGON") {
        const polygonFeature = new AILabel.Feature.Polygon(
          id, // id
          { points: data }, // shape
          {
            name,
            layerObjectType: that.layerObjectType,
            layerObjectId: that.layerObjectId,
          }, // props

          drawingStyle // style
        );
        that.gFirstFeatureLayer.addFeature(polygonFeature);
      }
      //点
      else if (type == "POINT") {
        const gFirstFeaturePoint = new AILabel.Feature.Point(
          id, // id
          { x: data.x, y: data.y, r: 5 }, // shape
          {
            name,
            layerObjectType: that.layerObjectType,
            layerObjectId: that.layerObjectId,
          }, // props

          { fillStyle: "#FF8C00", zIndex: 5, lineWidth: 2 } // style
        );
        that.gFirstFeatureLayer.addFeature(gFirstFeaturePoint);
      }
    },
    // // 画完取名
    // getName(mode) {
    //   return this.$prompt("请输入名字", {
    //     confirmButtonText: "确定",
    //     showCancelButton: false,
    //   })
    //     .then(({ value }) => {
    //       this.itemName = value;
    //       return value;
    //     })
    //     .catch(() => {
    //       return null;
    //     });
    // },
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
        let { width, height } = this.gFirstImageLayer.imageInfo;

        if (type === "RECT") {
          if (
            data.x < 0 ||
            data.y < 0 ||
            data.width + data.x >= width ||
            data.height + data.y >= height
          ) {
            this.$message.error("超出边界!");
            return;
          }
        } else if (type == "POINT") {
          if (data.x < 0 || data.y < 0 || data.x >= width || data.y >= height) {
            this.$message.error("超出边界!");
            return;
          }
        } else if (type === "POLYGON") {
          if (!this.isPOLYGON(data, width, height)) {
            this.$message.error("超出边界!");
            return;
          }
        }
        this.allFeatures = this.gFirstFeatureLayer.getAllFeatures();

        let result = false;
        if (that.allFeatures.length > 0) {
          result = that.allFeatures.some((item) => {
            return item.id == that.layerObjectId;
          });
        }

        if (result) {
          return that.$message.warning("该风险场所或设施设备已有标注");
        } else {
          that.addFeature(data, type, that.layerObjectId);
        }

        // return
        // that.getName(type).then((id) => {
        //   if (id) {
        // } else {
        //   this.$message({
        //     type: "info",
        //     message: "请填写名字",
        //   });
        // }
        // });
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
        console.log('remove');
        // that.gFirstFeatureLayer.removeFeatureById(that.editId);
      });
    },
    //撤销
    Revoke() {
      console.log("撤销");
      if (!this.imgUrl) {
        return this.$message.info("请先上传底图!");
      }

      this.getFeatures();
      this.allFeatures.pop();
      //刷新map
      this.gMap.refresh();
      console.log(this.allFeatures, "--所有操作--");
    },

    saveData() {
      if (!this.imgUrl) {
        return this.$message.info("请先上传底图!");
      }

      if (!this.layerObjectId) {
        return this.$message.info(
          this.layerObjectType == 1
            ? "请选择对应风险场所！"
            : "请选择对应设施设备！"
        );
      }

      // 标注数据
      const allFeatures = toRaw(this.gFirstFeatureLayer.getAllFeatures());
      const alllText = toRaw(this.gFirstTextLayer.getAllTexts());
      let newalllText = [];
      let newallFeatures = [];
      alllText.forEach(({ props, type, style, textInfo, id }) => {
        newalllText.push(
          Object.assign(
            {},
            {
              props,
              type,
              style,
              textInfo,
              id,
            }
          )
        );
      });
      allFeatures.forEach(({ props, type, style, shape, id }) => {
        newallFeatures.push(
          Object.assign({}, { props, type, style, shape, id })
        );
      });

      planViewEdit({
        entId: that.loginUser.entId,
        url: that.imgUrl,
      }).then((res) => {});

      let dataArr = [];

      if (newallFeatures && newallFeatures.length > 0) {
        newallFeatures.forEach((item) => {
          dataArr.push({
            layerObjectType: item.props.layerObjectType,
            layerObjectId: item.props.layerObjectId,
            layerLocation: JSON.stringify(item),
          });
        });
      }

      layerEdit(dataArr).then((res) => {
        console.log(res);
      });

      // if (localStorage.getItem("gMapData")) {
      //   let data = JSON.parse(localStorage.getItem("gMapData"));
      //   data[this.imgList[this.imglistInedx].id] = {
      //     newalllText,
      //     newallFeatures,
      //   };
      //   localStorage.setItem("gMapData", JSON.stringify(data));
      // } else {
      //   localStorage.setItem(
      //     "gMapData",
      //     JSON.stringify({
      //       [this.imgList[this.imglistInedx].id]: {
      //         newalllText,
      //         newallFeatures,
      //       },
      //     })
      //   );
      // }
      this.$message.success("保存成功");
    },

    beforeUpload(file) {
      const name = file.name.split(".").pop().toUpperCase();
      if (
        name !== "JPG" &&
        name !== "JPEG" &&
        name !== "PNG" &&
        name !== "GIF" &&
        name !== "BMP"
      ) {
        this.$message({
          type: "error",
          message: "不支持上传当前文件！",
        });
        return false;
      }
    },
    handlePreview(file) {
      if (file && file.fileId) {
        window.open(this.baseURL + file.fileUrl);
      }
    },
    // 自定义上传
    handleUpload(file, fileList) {
      that.loading = true;
      const formData = new FormData();
      formData.append("fileType", 4);
      formData.append("file", file.file);
      formData.append("type", "type");
      fileUpload(formData)
        .then((res) => {
          that.imgList = [];
          res.link = that.baseURL + res.fileUrl;
          res.fileId = res.fileId;
          res.id = res.fileId;
          res.fileUrl = res.link;
          res.src = res.link;
          res.zoom = 5000;
          res.width = 1920;
          res.height = 1080;

          if (that.imgUrl) {
            that
              .$confirm("再次上传底图将会替换原来的底图和删除标注！", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                that.gMap.removeLayerById("first-layer-image");
                that.gFirstTextLayer && that.gFirstTextLayer.removeAllTexts();
                that.gFirstFeatureLayer &&
                  that.gFirstFeatureLayer.removeAllFeatures();
                that.gMap.markerLayer.removeAllMarkers();

                that.imgUrl = res.fileUrl;
                that.imgList.push(res);

                that.$nextTick(() => {
                  that.initMap();
                });
              })
              .catch(() => {
                return;
              });
          } else {
            that.imgUrl = res.fileUrl;
            that.imgList.push(res);

            that.$nextTick(() => {
              that.initMap();
            });
          }
        })
        .finally(() => {
          that.loading = false;
        });
    },
    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`);
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    // 移除图片
    handleRemove(dataList, file, fileList) {
      this.fileList.forEach((item, index) => {
        if (file.fileId == item.fileId) {
          this.fileList.splice(index, 1);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.table-classic-wrapper {
  height: 100%;
  .flex {
    justify-content: end;
  }
}

.button-wrap {
  padding-bottom: 10px;
  position: relative;
  z-index: 99;
  display: flex;
  align-items: center;
}

#map {
  /* margin: 0 auto; */
  overflow: hidden;
  position: relative;
  height: calc(100vh - 250px);
  border: 1px dashed #ccc;
}
/deep/.layerObjectList {
  height: calc(100vh - 280px);
  overflow: auto;

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
    cursor: pointer;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 5px 10px;
  }
  .layerObjectListActive {
    color: #fff;
  }
  li:not(:last-child) {
    margin-bottom: 5px;
  }
  li:hover {
    background: #eee;
  }
}

/deep/.zoom-icon-plus {
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

/deep/.zoom-icon-plus:hover {
  border-color: #4169e1;
}

/deep/.zoom-icon-minus {
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

/deep/.zoom-icon-minus:hover {
  border-color: #4169e1;
}
/* 删除图标 */
/deep/#delete01 {
  width: 20px;
  height: 20px;
}

/deep/input[type="file"] {
  display: none;
}
/** 上传文件 **/
/deep/ .upload-demo > div:first-of-type {
  display: inline;
}

/deep/.el-upload-list {
  display: none !important;
}
</style>