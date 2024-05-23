<template>
  <div
    ref="treeWrapper"
    v-loading="loading"
    class="tree_wrapper"
    :style="{ height: heightWrapper + 'px' }"
  >
    <div class="tree_title">
      <div>{{ title }}</div>
      <div class="title-right"><slot name="title" /></div>
    </div>
    <div
      id="tree_content"
      ref="treeContent"
      class="tree_content"
      :style="{ height: heightContent + 'px' }"
    >
      <div v-for="(item, i) in treeData" :key="i">
        <div
          class="treeItem"
          :class="currentNode == item[nodeId] ? 'activeNode' : ''"
          :style="styleVar"
          @click="handlerNode(item)"
        >
          <i
            v-show="item.children && item.children.length > 0"
            class="icon"
            :class="
              !item.isExpand ? 'el-icon-arrow-right' : 'el-icon-arrow-down'
            "
            @click.stop="checkExpand(item)"
          />
          <div class="item_title" :title="item[label]">{{ item[label] }}</div>
          <div class="item_right"><slot :data="item" name="item" /></div>
        </div>
        <div
          v-if="item.children && item.isExpand && item.children.length > 0"
          class="tree_children"
        >
          <div v-for="(item, n) in item.children" :key="n">
            <div
              class="treeItem"
              :class="currentNode == item[nodeId] ? 'activeNode' : ''"
              :style="styleVar"
              @click="handlerNode(item)"
            >
              <div
                :style="{ paddingLeft: item.level * 22 + 'px' }"
                style="display: flex"
              >
                <i
                  v-show="item.children && item.children.length > 0"
                  class="icon"
                  :class="
                    !item.isExpand
                      ? 'el-icon-arrow-right'
                      : 'el-icon-arrow-down'
                  "
                  @click.stop="checkExpand(item)"
                />
                <div class="item_title" :title="item[label]">
                  {{ item[label] }}
                </div>
                <div class="item_right">
                  <slot :data="item" name="item" />
                </div>
              </div>
            </div>
            <div
              v-if="item.isExpand && item.children.length > 0"
              class="tree_children"
            >
              <div v-for="(item, n) in item.children" :key="n">
                <div
                  class="treeItem"
                  :class="currentNode == item[nodeId] ? 'activeNode' : ''"
                  :style="{
                    styleVar,
                    paddingLeft: item.level * 22 + 10 + 'px',
                  }"
                  @click="handlerNode(item)"
                >
                  <div
                    :style="{ paddingLeft: item.level * 22 + 'px' }"
                    style="display: flex"
                  >
                    <i
                      v-show="item.children && item.children.length > 0"
                      class="icon"
                      :class="
                        !item.isExpand
                          ? 'el-icon-arrow-right'
                          : 'el-icon-arrow-down'
                      "
                      @click.stop="checkExpand(item)"
                    />
                    <div class="item_title" :title="item[label]">
                      {{ item[label] }}
                    </div>
                    <div class="item_right">
                      <slot :data="item" name="item" />
                    </div>
                  </div>
                </div>
                <div
                  v-if="item.isExpand && item.children.length > 0"
                  class="tree_children"
                >
                  <div v-for="(item, n) in item.children" :key="n">
                    <div
                      class="treeItem"
                      :class="currentNode == item[nodeId] ? 'activeNode' : ''"
                      :style="{
                        styleVar,
                        paddingLeft: item.level * 22 + 10 + 'px',
                      }"
                      @click="handlerNode(item)"
                    >
                      <div
                        :style="{ paddingLeft: item.level * 22 + 'px' }"
                        style="display: flex"
                      >
                        <i
                          v-show="item.children && item.children.length > 0"
                          class="icon"
                          :class="
                            !item.isExpand
                              ? 'el-icon-arrow-right'
                              : 'el-icon-arrow-down'
                          "
                          @click.stop="checkExpand(item)"
                        />
                        <div class="item_title" :title="item[label]">
                          {{ item[label] }}
                        </div>
                        <div class="item_right">
                          <slot :data="item" name="item" />
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="item.isExpand && item.children.length > 0"
                      class="tree_children"
                    >
                      <div v-for="(item, n) in item.children" :key="n">
                        <div
                          class="treeItem"
                          :class="
                            currentNode == item[nodeId] ? 'activeNode' : ''
                          "
                          :style="{
                            styleVar,
                            paddingLeft: item.level * 22 + 10 + 'px',
                          }"
                          @click="handlerNode(item)"
                        >
                          <div
                            :style="{ paddingLeft: item.level * 22 + 'px' }"
                            style="display: flex"
                          >
                            <i
                              v-show="item.children && item.children.length > 0"
                              class="icon"
                              :class="
                                !item.isExpand
                                  ? 'el-icon-arrow-right'
                                  : 'el-icon-arrow-down'
                              "
                              @click.stop="checkExpand(item)"
                            />
                            <div class="item_title" :title="item[label]">
                              {{ item[label] }}
                            </div>
                            <div class="item_right">
                              <slot :data="item" name="item" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="total != null" class="app-pager" style="text-align: center;">
      <el-pagination
        :current-page.sync="pageIndexNew"
        background
        :page-size="20"
        :pager-count="5"
        layout="prev, pager, next"
        :total="total"
        :hide-on-single-page="true"
        @current-change="pagerCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyTree',
  props: {
    loading: {
      type: Boolean,
      required: true,
      default() {
        return false
      }
    },
    treeList: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    title: {
      type: String,
      required: true,
      default() {
        return ''
      }
    },
    defaultExpandAll: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    },
    nodeClick: {
      type: Function,
      required: false,
      default() {
        return null
      }
    },
    label: {
      type: String,
      required: false,
      default() {
        return 'title'
      }
    },
    nowIndex: {
      required: false,
      default() {
        return null
      }
    },
    nodeId: {
      required: false,
      default() {
        return 'id'
      }
    },
    onResizeHeight: {
      required: false,
      default() {
        return true
      }
    },
    total: {
      type: Number,
      required: false,
      default() {
        return null
      }
    },
    curPageIndex: {
      type: Number,
      required: false,
      default() {
        return 1
      }
    }
  },
  data() {
    return {
      menuShow: false,
      treeData: [],
      activeColor: '#409eff',
      currentNode: this.nowIndex,
      heightWrapper: null,
      heightContent: null,
      pageIndexNew: 1,
      listQuery: {
        pageIndex: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapGetters('app', ['themeColor']),
    styleVar() {
      return {
        '--activeColor': this.themeColor
      }
    }
  },

  created() {
    this.activeColor = this.themeColor
    this.treeData = JSON.parse(JSON.stringify(this.treeList))
    this.treeData.forEach((item) => {
      item.isExpand = this.defaultExpandAll
      item.level = 0
      if (item.children && item.children.length > 0) {
        item.children.forEach((child1) => {
          child1.isExpand = this.defaultExpandAll
          child1.level = 1
          if (child1.children && child1.children.length > 0) {
            child1.children.forEach((child2) => {
              child2.isExpand = this.defaultExpandAll
              child2.level = 2
              if (child2.children && child2.children.length > 0) {
                child2.children.forEach((child3) => {
                  child3.isExpand = this.defaultExpandAll
                  child3.level = 3
                  if (child3.children && child3.children.length > 0) {
                    child3.children.forEach((child4) => {
                      child4.isExpand = this.defaultExpandAll
                      child4.level = 4
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  mounted() {
    this.pageIndexNew = this.curPageIndex
    console.log(this.curPageIndex)
    setTimeout(() => {
      this.changeButtonColor()
    }, 0)
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.heightWrapper = window.innerHeight
      this.heightContent = window.innerHeight
      const h1 = this.$refs.treeWrapper.offsetTop
      const h2 = this.$refs.treeContent.offsetTop
      if (this.onResizeHeight) {
        this.heightWrapper = this.heightWrapper - h1 - 18
        this.heightContent = this.heightContent - h2 - 35
      } else {
        this.heightWrapper = this.heightWrapper - h1 - 260
        this.heightContent = this.heightContent - h2 - 292
      }
      if (this.total != null) {
        this.heightContent = this.heightContent - 32
      }
    },
    dgArr(arr) {},
    checkExpand(data) {
      data.isExpand = !data.isExpand
      this.$forceUpdate()
    },
    handlerNode(data) {
      this.currentNode = data[this.nodeId]
      this.$emit('node-click', this.currentNode)
      // console.log(this.currentNode);
    },
    /**
     * 改变按钮颜色
     */
    changeButtonColor() {
      var number = document.querySelectorAll(
        '.app-pager .el-pagination .el-pager .number'
      )
      var active = document.querySelectorAll(
        '.app-pager .el-pagination .el-pager .active'
      )
      number.forEach((item) => {
        item.style.background = '#f4f4f5'
      })
      active.forEach((item) => {
        item.style.background = this.themeColor
      })
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.pageIndexNew = pageIndex
      // this.changeButtonColor();
      this.$emit('pageCurrentChange', pageIndex)
    }
  }
}
</script>

<style lang="less">
.tree_wrapper {
  max-height: calc(100vh - 115px);
  // overflow: auto;
  box-sizing: border-box;
  border: 1px solid #eee;
  margin-right: 16px;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  .tree_title {
    height: 35px;
    font-size: 14px;
    color: #333;
    padding: 0 10px;
    box-sizing: border-box;
    background-color: #fafafa;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title-right {
      cursor: pointer;
    }
  }
  .tree_content {
    width: 100%;
    overflow: auto;
    .activeNode {
      // background-color: var(--activeColor) !important;
      background-color: var(--activeColor) !important;
      color: #fff;
    }
    .treeItem {
      padding: 0 10px;
      display: flex;
      align-items: center;
      line-height: 30px;
      position: relative;
      cursor: pointer;
      .icon {
        flex-shrink: 0;
        cursor: pointer;
        padding-right: 10px;
      }
      .item_title {
        display: inline-block;
        max-width: calc(100% - 50px);
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .item_right {
        position: absolute;
        right: 10px;
        font-size: 16px;
        display: none;
      }
      &:hover {
        background: #f0f0f0;
      }
      &:hover .item_right {
        display: block;
      }
    }
    // .activeNode:hover {
    //   background: #409eff;
    // }
  }
}
</style>
