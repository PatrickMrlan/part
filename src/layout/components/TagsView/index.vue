<template>
  <div class="tags-nav-wrapper clear-fix">
    <el-button type="text" class="btn-con" @click="handleMove(240)">
      <i class="icon el-icon-arrow-left" />
    </el-button>
    <div
      ref="tagsViews"
      class="tags-views"
      @DOMMouseScroll="handlescroll"
      @mousewheel="handlescroll"
    >
      <div
        ref="tagsCont"
        class="tags-cont"
        :style="{ left: tagsContLeft + 'px' }"
      >
        <transition-group>
          <router-link
            v-for="item in visitedViews"
            ref="tagsItem"
            :key="item.name + item.path"
            :to="{ path: item.path, query: { name: item.title } }"
          >
            <TagItem
              :class="{ active: isActive(item) }"
              :fixed="item.meta.fixed"
              @on-close="handleSelectedClose(item)"
            >{{ item.title }}</TagItem>
          </router-link>
        </transition-group>
      </div>
    </div>
    <el-button type="text" class="btn-con" @click="handleMove(-240)">
      <i class="icon el-icon-arrow-right" />
    </el-button>
    <div class="btn-con btn-close">
      <el-dropdown @command="handleCloseCtrl">
        <span class="el-dropdown-link">
          <i class="icon el-icon-circle-close" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters, mapMutations, mapState } from 'vuex'
import TagItem from './TagItem'

export default {
  name: 'TagsView',
  components: { TagItem },
  data() {
    return {
      tagsContLeft: 0,
      contPadding: 4,
      menu: [],
      selectedTag: {}
    }
  },
  computed: {
    ...mapState('app', {
      state: (state) => state
    }),
    ...mapGetters(['visitedViews']),
    routes() {
      return this.$router.options.routes
    }
  },
  watch: {
    $route(val) {
      console.log(val);
      this.addTags()
      this.getTagElement(val)
      this.selectedTag = val
    }
  },
  mounted() {
    this.filterFixedMeun(JSON.parse(sessionStorage.getItem('menuList')))
    this.initTags()
    this.addTags()

  },
  methods: {
    
    ...mapMutations([
      'addVisitedView',
      'delVisitedView',
      'delAllVisitedView',
      'delOthersVisitedView'
    ]),
    isActive(tag) {
      if (tag.path === this.$route.path) {
        this.menu.forEach((t) => {
          if (t.name === tag.title) {
            tag.pid = t.pid
            const menuList = JSON.parse(sessionStorage.getItem('menuList'))
            menuList.forEach((item, index) => {
              item.children.forEach((key, val) => {
                if (tag.pid === key.id) {
                  this.state.topActive = index + ''
                  key.children.forEach((i, j) => {
                    if (tag.title === i.name && tag.pid === i.pid) {
                      this.state.leftActive = val + '-' + j
                      this.state.topid = item.id
                    }
                  })
                }
              })
            })
          }
        })
      }
      return tag.path === this.$route.path
    },
    filterFixedMeun(menuList) {
      menuList.forEach((item) => {
        if (item.children.length > 0) {
          this.filterFixedMeun(item.children)
        } else {
          if (item.menuUrl) {
            this.menu.push({
              fullPath: item.menuUrl,
              path: item.menuUrl,
              name: item.name,
              id: item.id,
              pid: item.pid,
              meta: { icon: item.icon, title: item.name }
            })
          }
        }
      })
    },
    filterFixedTags(routes, basePath = '/') {
      // console.log(routes)
      let tags = []
      routes.forEach((item) => {
        if (item.meta && item.meta.fixed) {
          const tagPath = path.resolve(basePath, item.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: item.name,
            meta: { ...item.meta }
          })
        }
        if (item.children) {
          const tempTags = this.filterFixedTags(item.children, item.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const fixedTags = this.filterFixedTags(this.routes)
      // console.log(fixedTags)
      for (const tag of fixedTags) {
        if (tag.name) {
          
          this.addVisitedView(tag)

        }
      }
    },
    addTags() {
      let flag = 0
      const { name } = this.$route
      if (name) {
        this.addVisitedView(this.$route)


        this.menu.forEach((item) => {
          if (
            item.path === this.$route.path &&
            item.name === this.$route.query.name
          ) {
            flag = 1
          }
        })
        if (flag === 0) {
          // console.log(this.$route);
          this.addVisitedView(this.$route)
        }
      }
      return false
    },
    handlescroll(e) {
      const type = e.type
      let distance = 0
      // mousewheel非火狐浏览器鼠标滚动事件; DOMMouseScroll火狐浏览器鼠标滚动事件
      if (type === 'mousewheel' || type === 'DOMMouseScroll') {
        // mousewheel 事件中的 event.wheelDelta 属性值：若滚轮是向上滚动，返回值为正，反之为负；且返回的值，均为 120 的倍数，即：幅度大小 = 返回的值 / 120
        // DOMMouseScroll 事件中的 event.detail 属性值：返回的值，与 event.wheelDelta 正好相反，即滚轮是向上滚动，返回值为负，反之为正；返回的值，均为 3 的倍数，即：幅度大小 = 返回的值 / 3
        distance = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleMove(distance)
    },
    handleMove(offset) {
      const viewWidth = this.$refs.tagsViews.offsetWidth
      const contWidth = this.$refs.tagsCont.offsetWidth
      if (offset > 0) {
        this.tagsContLeft = Math.min(0, this.tagsContLeft + offset)
      } else {
        if (viewWidth < contWidth) {
          if (this.tagsContLeft < -(contWidth - viewWidth)) {
            // this.tagsContLeft = this.tagsContLeft
          } else {
            this.tagsContLeft = Math.max(
              this.tagsContLeft + offset,
              viewWidth - contWidth
            )
          }
        } else {
          this.tagsContLeft = 0
        }
      }
    },
    getTagElement(route) {
      this.$nextTick(() => {
        const tagsItemArr = this.$refs.tagsItem
        const index = tagsItemArr.findIndex((item) => {
          const fullPath = route.fullPath.split('?')[0]
          return item.to.path === fullPath
        })
        const tag = tagsItemArr[index].$el
        this.moveToCurrentTag(tag)
      })
    },
    moveToCurrentTag(tag) {
      const viewWidth = this.$refs.tagsViews.offsetWidth
      const contWidth = this.$refs.tagsCont.offsetWidth
      if (contWidth < viewWidth) {
        this.tagsContLeft = 0
      } else if (tag.offsetLeft < -this.tagsContLeft) {
        // 标签在可视区域左侧
        this.tagsContLeft = -tag.offsetLeft + this.contPadding
      } else if (
        tag.offsetLeft > -this.tagsContLeft &&
        tag.offsetLeft + tag.offsetWidth < -this.tagsContLeft + viewWidth
      ) {
        // 标签在可视区域
        this.tagsContLeft = Math.min(
          0,
          viewWidth - tag.offsetWidth - tag.offsetLeft - this.contPadding
        )
      } else {
        // 标签在可视区域右侧
        this.tagsContLeft = -(
          tag.offsetLeft -
          (viewWidth - this.contPadding - tag.offsetWidth)
        )
      }
    },
    handleSelectedClose(view) {
      this.delVisitedView(view)
      if (this.isActive(view)) {
        this.showLastView()
      }
    },
    showLastView() {
      const lastView = this.visitedViews.slice(-1)[0]
      if (lastView) {
        this.$router.push(lastView.fullPath)
      }
    },
    handleCloseCtrl(type) {
      if (type === 'all') {
        this.delAllVisitedView()
        this.showLastView()
      }
      if (type === 'other') {
        if (this.selectedTag) {
          this.delOthersVisitedView(this.selectedTag)
        }
      }
      this.tagsContLeft = 0
    }
  }
}
</script>

<style lang="less" scoped>
.tags-nav-wrapper {
  width: 100%;
  height: 40px;
  .icon {
    font-size: 18px;
  }
  .btn-con {
    float: left;
    width: 28px;
    height: 40px;
    padding: 8px 7px 8px 3px;
    border-top: solid 1px #f0f0f0;
    border-bottom: solid 1px #f0f0f0;
    box-sizing: border-box;
  }
  .btn-close {
    width: 40px;
    padding-top: 10px;
    padding-left: 11px;
    border-left: solid 1px #f0f0f0;
    cursor: pointer;
  }
  .tags-views {
    position: relative;
    float: left;
    width: calc(100% - 96px);
    height: 40px;
    background: #f0f0f0;
    box-shadow: inset 0 0 3px 2px #6464641a;
    overflow: hidden;
    .tags-cont {
      position: absolute;
      padding: 0 4px;
      overflow: visible;
      white-space: nowrap;
      transition: left 0.5s ease;
    }
  }
}

</style>
