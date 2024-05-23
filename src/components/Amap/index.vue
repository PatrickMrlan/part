<template>
  <div id="amap-container">
    <el-input
      v-if="showsearch"
      id="search-input"
      v-model="searchValue"
      class="input-with"
      placeholder="请输入地址"
      clearable
      @clear="handelclearInput"
      @keyup.native.enter="handelSearch"
    >
      <el-button
        slot="append"
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="handelSearch"
      >搜索</el-button>
    </el-input>

    <div id="searchResultPanel" />
    <el-row v-if="showsearch" class="margin-top-10 address">
      当前地址是： {{ formattedAddress }}
      <el-button
        size="small"
        type="primary"
        @click="handelSave"
      >使用该地址</el-button>
    </el-row>

    <div id="custom-amap" />
  </div>
</template>

<script>
const AMap = window.AMap

export default {
  name: 'AMap',
  props: {
    postform: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    showsearch: {
      type: Boolean,
      required: false,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      defaultCity: '北京',
      // 地图对象
      map: null,
      // 定位默认地址 | 搜索后选择的地址
      formattedAddress: null,
      // 地址对应的经纬度信息
      position: {},
      // 检索关键字
      searchValue: '',
      // 检索函数对象
      placeSearch: null,
      // 检索结果数据数据
      searchInfoList: [],
      // 地图标记
      marker: '',
      // 地址解析（正向）
      geocoder: '',
      // 地址名称
      name: '',
      infoWindow: null
    }
  },
  watch: {
    defaultValue() {
      this.searchValue = this.defaultValue
    }
  },
  mounted() {
    this.formattedAddress = this.postform.detailedAddress || this.postform.address
    this.position.lng = this.postform.longitude
    this.position.lat = this.postform.latitude
    // 初始化地图页面
    this.initMap()
  },
  beforeDestroy() {
    // 销毁地图
    this.map.destroy()
  },
  methods: {
    //   初始化地图页面
    initMap() {
      if (
        this.postform.longitude === null ||
        this.postform.latitude === null ||
        this.postform.longitude === ''
      ) {
        this.map = new AMap.Map('custom-amap', {
          resizeEnable: true,
          zoom: 50
        })
      } else {
        this.map = new AMap.Map('custom-amap', {
          resizeEnable: true,
          center: [this.postform.longitude, this.postform.latitude],
          zoom: 50
        })
      }

      // 添加工具栏
      this.map.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView'], () => {
        // 工具条
        const toolbar = new AMap.ToolBar()
        // 比例尺
        const scale = new AMap.Scale()
        // 显示鹰眼
        const overView = new AMap.OverView()
        this.map.addControl(toolbar)
        this.map.addControl(scale)
        this.map.addControl(overView)
      })
      // 添加maker
      this.setMaker()
      // 添加鼠标点选地图选择地址
      if (this.showsearch) {
        this.addAmapGeocoder()
      }

      if (
        this.postform.longitude === null ||
        this.postform.latitude === null ||
        this.postform.longitude === ''
      ) {
        // 添加定位
        this.addAMapGeolocation()
      }

      // 添加检索提示
      this.addAMapAutocompletePlaceSearch()
    },
    // 添加maker
    setMaker() {
      this.marker = new AMap.Marker()
      this.map.add(this.marker)
      // 添加解析地理位置插件
      this.map.plugin('AMap.Geocoder', () => {
        // 异步加载插件
        this.geocoder = new AMap.Geocoder({
          city: this.defaultCity, // 默认：“全国”
          radius: 1000 // 范围，默认：500
        })
      })

      if (!this.showsearch) {
        // 鼠标点击marker弹出自定义的信息窗体
        this.marker.on('mouseover', (e) => {
          this.infoWindow.open(this.map, e.target.getPosition())
        })
        this.marker.on('mouseout', (e) => {
          this.closeInfoWindow()
        })
      }
    },
    // 构建自定义信息窗体
    createInfoWindow(title, content, bottomContent) {
      var info = document.createElement('div')
      info.className = 'custom-info input-card content-window-card'

      // 可以通过下面的方式修改自定义窗体的宽高
      // info.style.width = "400px";
      // 定义顶部标题
      var top = document.createElement('div')
      var titleD = document.createElement('div')
      top.className = 'info-top'
      titleD.innerHTML = title

      top.appendChild(titleD)
      info.appendChild(top)

      // 定义中部内容
      var middle = document.createElement('div')
      middle.className = 'info-middle'
      middle.style.backgroundColor = 'white'
      middle.innerHTML = content
      info.appendChild(middle)

      // 定义底部内容
      var bottom = document.createElement('div')
      bottom.className = 'info-bottom'
      bottom.style.position = 'relative'
      bottom.style.top = '0px'
      bottom.style.margin = '0 auto'
      bottom.innerHTML = bottomContent
      info.appendChild(bottom)
      return info
    },
    // 关闭信息窗体
    closeInfoWindow() {
      this.map.clearInfoWindow()
    },
    // 添加鼠标点选地图选择地址
    addAmapGeocoder() {
      this.map.remove(this.marker)
      // 添加maker
      this.setMaker()
      // 地图添加点击事件
      this.map.on('click', (e) => {
        const lnglat = [e.lnglat.lng, e.lnglat.lat]
        this.marker.setPosition(lnglat)
        this.geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.regeocode) {
            const res = result.regeocode
            const data = {
              // 地址名称
              adress: res.formattedAddress,
              // 纬度lat
              lat: lnglat[1],
              // 经度lng
              lng: lnglat[0]
            }
            this.formattedAddress = res.formattedAddress
            this.position = data
          } else {
            alert(JSON.stringify(result))
          }
        })
      })
    },
    // 添加自动定位
    addAMapGeolocation() {
      this.map.plugin('AMap.Geolocation', () => {
        const geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(200, 200),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'RB'
        })
        // 获取当前位置
        geolocation.getCurrentPosition()
        // 添加定位当前城市成功监听
        AMap.event.addListener(
          geolocation,
          'complete',
          this.onCurrentPositionComplete
        )
        // 添加定位当前城市发生错误监听
        AMap.event.addListener(
          geolocation,
          'error',
          this.onCurrentPositionError
        )
      })
    },
    // 添加检索提示检索
    addAMapAutocompletePlaceSearch() {
      // 自动提示
      this.map.plugin('AMap.Autocomplete', () => {
        const auto = new AMap.Autocomplete({
          city: this.defaultCity,
          input: 'search-input'
        })
        // 添加检索监听
        AMap.event.addListener(auto, 'select', this.onSelectAutocomplete)
      })
      // 检索服务
      AMap.service(['AMap.PlaceSearch'], () => {
        // 构造地点查询类
        this.placeSearch = new AMap.PlaceSearch({
          type: '', // 兴趣点类别
          pageSize: 5, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: this.defaultCity, // 兴趣点城市
          citylimit: false, // 是否强制限制在设置的城市内搜索
          map: this.map, // 展现结果的地图实例
          panel: 'searchResultPanel', // 结果列表将在此容器中进行展示。
          autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        })
      })
      // 添加检索监听
      AMap.event.addListener(
        this.placeSearch,
        'listElementClick',
        this.onSelectSearch
      )
    },
    // 定位当前城市成功回调
    onCurrentPositionComplete(res) {
      // 添加maker
      this.setMaker()
      const lnglat = [res.position.lng, res.position.lat]
      this.marker.setPosition(lnglat)

      this.formattedAddress = res.formattedAddress
      this.position = res.position
    },
    // 定位当前城市发生错误回调
    onCurrentPositionError(err) {
      console.log(err)
    },
    // 按钮触发检索
    handelSearch() {
      this.placeSearch.search(this.searchValue, (status, info) => {
        this.searchInfoList = info.poiList.pois
      })
    },
    // 选择自动提示数据事件回调
    onSelectAutocomplete(e) {
      this.searchValue = e.poi.name
      this.handelSearch()
    },
    // 选择检索数据结果事件回调
    onSelectSearch(e) {
      const res = e.data
      this.formattedAddress = res.cityname + res.adname + res.address
      this.name = res.name
      this.position = res.location
      document.querySelector('#searchResultPanel').innerHTML = ''
    },
    // 清除input里的值，清除搜索结果，再次初始化map
    handelclearInput() {
      document.querySelector('#searchResultPanel').innerHTML = ''
    },
    // 保存当前选择的地址,分发事件
    handelSave() {
      this.searchValue = this.formattedAddress
      const { lat, lng } = this.position
      const data = {
        name: this.name,
        // 地址名称
        address: this.formattedAddress,
        // 纬度lat
        lat,
        // 经度lng
        lng
      }
      this.$emit('getPosition', data)
    }
  }
}
</script>

<style lang="less" scoped>
#amap-container {
  .el-input__clear {
    line-height: 34px;
    // top: 20px;
  }
  #custom-amap {
    height: 80%;
    width: 100%;
    margin-top: 10px;
    border: 1px solid #ccc;
  }
  .input-with {
    // position: fixed;
    // top: 40px;
    z-index: 1;
    width: 580px;
  }
  .address {
    color: #373737;
  }
}
.amap-sug-result {
  z-index: 99999;
}
.content-window-card {
  position: relative;
  box-shadow: none;
  bottom: 0;
  left: 0;
  width: auto;
  padding: 0;
}

.content-window-card p {
  height: 2rem;
}

.custom-info {
  border: solid 1px silver;
}

div.info-top {
  position: relative;
  background: #00dd33;
  border-bottom: 1px solid #ccc;
  border-radius: 5px 5px 0 0;
}

div.info-top div {
  display: inline-block;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  line-height: 31px;
  padding: 0 10px;
  color: #ffffff;
}

div.info-top img {
  position: absolute;
  top: 10px;
  right: 10px;
  transition-duration: 0.25s;
  width: 16px;
  height: 16px;
}

div.info-top img:hover {
  box-shadow: 0px 0px 5px #000;
}

div.info-middle {
  font-size: 12px;
  padding: 10px 6px;
}

div.info-bottom {
  height: 0px;
  width: 100%;
  clear: both;
  text-align: center;
}

div.info-bottom img {
  position: relative;
  z-index: 104;
}

.info-middle img {
  float: left;
  margin-right: 6px;
}

.devinfo .app-row div:first-child {
  width: 70px;
}
.devinfo .app-row div:last-child {
  flex: 1;
}
</style>
