<template>
  <myDialog
    title="画区域"
    width="1000px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'10vh'"
  >
    <div class="main">
      <el-row :gutter="20">
        <div ref="appRowHeight" class="app-list-control app-row">
          <!-- <el-tooltip
            class="item tips"
            effect="dark"
            content="点击编辑地块，单击保存点位，双击放开点位，点击保存区域即可保存"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip> -->
          <div class="item_tips">
            点击编辑地块，单击保存点位，双击放开点位，点击保存区域即可保存
          </div>

          <div class="flex" />
          <div class="right">
            <div
              class="ebox"
              style="padding: 10px 0; display: flex; justify-content: end"
            >
              <el-button-group v-if="!isIndex">
                <el-button
                  v-if="isAdd"
                  type="primary"
                  icon="el-icon-circle-plus-outline"
                  style="margin-right: 10px"
                  @click="drawRectangle"
                  >绘制区域</el-button
                >
                <el-button
                  v-else
                  type="primary"
                  icon="el-icon-edit"
                  style="margin-right: 10px"
                  @click="editRectangle(tableData[0].polygonItem)"
                  >编辑区域</el-button
                >
                <!--<el-button type="warning" icon="el-icon-delete" @click="cancelRectangle">取消编辑</el-button> -->
                <el-button
                  type="success"
                  icon="el-icon-success"
                  style="margin-right: 10px"
                  @click="saveRectangle"
                  >保存区域</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleRectangle"
                  >删除区域</el-button
                >
              </el-button-group>
            </div>
          </div>
        </div>
        <section class="section">
          <!-- 地图 -->
          <div id="container" style="width: 100%; height: 50vh" />

          <!-- 控制按钮组 -->
        </section>
      </el-row>
    </div>
  </myDialog>
</template>

<script>
import { Message } from "element-ui";

export default {
  name: "Dashboard",
  props: {
    centArray: {
      type: Array,
      required: false,
      default() {
        return [104.06, 30.67];
      }
    },

    gridArea: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    isIndex: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      keyword: null,
      tableData: [],
      title: "画区域",
      loading: false,
      polyEditor: null,
      polyEditorList: [],
      baseId: null,
      map: null,
      isAdd: true,
      fenceAlarmList: [],
      cent: []
    };
  },
  created() {
    // this.init()
  },

  mounted() {
    console.log(this.centArray);
    this.$nextTick(() => {
      this.initMap();
      if (this.gridArea) {
        this.isAdd = false;
        this.init();
      }
    });
  },
  methods: {
    // 地图初始化
    initMap() {
      var that = this;

      this.map = new AMap.Map("container", {
        resizeEnable: true, // 窗口大小调整
        center: that.centArray, // 中心
        zoom: 15, // 放大级别
        showLabel: true // 是否显示地图文字标记
      });
      // 添加工具栏
      this.map.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.PolyEditor"], () => {
        const toolbar = new AMap.ToolBar(); // 工具条
        const scale = new AMap.Scale(); // 比例尺
        this.map.addControl(toolbar);
        this.map.addControl(scale);
      });
    },
    // 绘制多边形
    drawRectangle() {
      const that = this;
      const mouseTool = new AMap.MouseTool(that.map);
      mouseTool.polygon({
        // polygon：绘制多边形【线段：polyline;矩形：rectangle;圆：circle】
        strokeColor: "red",
        strokeOpacity: 0.4,
        strokeWeight: 6,
        fillColor: "#1791fc",
        fillOpacity: 0.2,
        // strokeStyle还支持 solid
        strokeStyle: "solid"
        // strokeDasharray: [30,10],
      });
      mouseTool.on("draw", function(event) {
        // event.obj 为绘制出来的覆盖物对象
        const polygonItem = event.obj;

        that.tableData.push({
          fenceName: null,
          polygonItem: polygonItem
        });
        that.isAdd = false;
        mouseTool.close();

        const paths = polygonItem.getPath(); // 取得绘制的多边形的每一个点坐标

        const path = []; // 编辑的路径
        paths.forEach(v => {
          path.push([v.lng, v.lat]);
        });

        // This.paths = path // 将新增数据放入paths数组里
        that.editRectangle(polygonItem); // 绘制完成,默认进入编辑状态
        // This.polygonItem.push(event.obj)
        // This.map.remove(event.obj); // 删除多边形
      });
    },
    // 编辑区域
    editRectangle(polygonItem) {
      var that = this;
      that.polyEditor && this.polyEditor.close();
      //   const path = this.paths
      // 新增的进入编辑状态
      const polygon = polygonItem;
      that.map.add(polygon);
      // 缩放地图到合适的视野级别
      that.map.setFitView([polygon]);

      that.polyEditor = new AMap.PolyEditor(that.map, polygon);
      that.polyEditor.open();

      //   polyEditor.on('addnode', function(event) {
      //   })

      that.polyEditor.on("adjust", function(event) {
        var data = that.tableData.filter(item => {
          return item.polygonItem === polygonItem;
        });
        data.polygonItem = polygonItem;
        console.info("触发事件：adjust", event);
        console.info("修改后的经纬度：", polygon.getPath());
      });

      //   polyEditor.on('removenode', function(event) {
      //     console.info('触发事件：removenode', event)
      //     console.info('修改后的经纬度：', polygon.getPath())
      //   })

      that.polyEditor.on("end", function(event) {
        console.info("触发事件： end", event);
        console.info("end修改后的经纬度：", polygon.getPath());
        // event.target 即为编辑后的多边形对象
      });
    },

    computeSignedArea(path) {
      const radius = 6371009;
      const len = path.length;
      if (len < 3) return 0;
      let total = 0;
      const prev = path[len - 1];
      let prevTanLat = Math.tan((Math.PI / 2 - (prev.lat / 180) * Math.PI) / 2);
      let prevLng = (prev.lng / 180) * Math.PI;
      for (const i in path) {
        const tanLat = Math.tan(
          (Math.PI / 2 - (path[i].lat / 180) * Math.PI) / 2
        );
        const lng = (path[i].lng / 180) * Math.PI;
        total += this.polarTriangleArea(tanLat, lng, prevTanLat, prevLng);
        prevTanLat = tanLat;
        prevLng = lng;
      }
      return Math.abs(total * (radius * radius));
    },

    polarTriangleArea(tan1, lng1, tan2, lng2) {
      const deltaLng = lng1 - lng2;
      const t = tan1 * tan2;
      return 2 * Math.atan2(t * Math.sin(deltaLng), 1 + t * Math.cos(deltaLng));
    },

    // 保存区域
    saveRectangle() {
      var that = this;

      that.polyEditor && that.polyEditor.close();
      that.isAdd = true;

      // if (that.tableData.length === 0) {
      //   Message({
      //     type: "error",
      //     message: "请绘制区域",
      //   });
      //   return;
      // }
      if (that.tableData.length) {
        var data = that.tableData[0];
        const paths = data.polygonItem.getPath(); // 取得绘制的多边形的每一个点坐标
        var area = that.computeSignedArea(paths);
        var mu = (area * 0.0015).toFixed(2);
        const path = []; // 编辑的路径
        paths.forEach(v => {
          path.push(v.lng + "," + v.lat);
        });
        var gridArea = path.join(";");
      } else {
        var mu = 0;
        var gridArea = null;
      }

      this.$emit("close", {
        mu: mu,
        gridArea: gridArea
      });

      that.init();
      // console.log(this.paths, this.path); //=>保存 成功（重新刷新页面）
    },
    // 删除区域
    deleRectangle(index) {
      index = 0;
      var that = this;
      if (that.tableData.length === 0) {
        Message({
          type: "error",
          message: "没有要删除的区域"
        });
        return;
      }
      this.$confirm("确认删除选中的区域?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.tableData[index].polygonItem.setPath();
          that.tableData.splice(index, 1);
          that.isAdd = true;
        })
        .catch(() => {
          // 取消删除
        });
    },
    cancel(done) {
      this.$emit("close", {});
      console.log(this.gridArea);
    },
    // 获取后台数据
    init() {
      const that = this;

      that.path = [];
      that.tableData = [];

      that.map && that.map.clearMap(); // 删除地图所有覆盖物
      var paths = [];
      if (that.gridArea) {
        var gridAreaList = that.gridArea.split(";");

        gridAreaList.forEach(item => {
          var split = item.split(",");
          paths.push(split);
        });

        //   that.initMap()
        const polygon = new AMap.Polygon({
          path: paths,
          strokeColor: "#FF33FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: "#1791fc",
          zIndex: 50
        });
        that.tableData.push({
          polygonItem: polygon
        });
        that.map.add(polygon);
        //   that.map.setFitView()

        that.map.setFitView();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-tooltip {
  margin-left: 50px;
  margin-top: 15px;
}
.item_tips {
  margin-left: 50px;
  margin-top: 15px;
}
</style>
