<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="90%">
    <el-form
      v-loading="loading"
      style="min-height: 100%"
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目名称：" prop="name">
                <el-input
                  v-model="dialogForm.name"
                  type="text"
                  placeholder="请输入第三方名称"
                  clearable
                  maxlength="200"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="建设单位：" prop="build">
                <el-input
                  v-model="dialogForm.build"
                  type="text"
                  placeholder="请输入建设单位"
                  clearable
                  maxlength="200"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目性质：" prop="nature">
                <el-select
                  v-model="dialogForm.nature"
                  placeholder="请选择项目性质"
                  clearable
                  collapse-tags
                  filterable
                >
                  <el-option
                    v-for="item in natureList"
                    :key="item.value"
                    :label="item.key"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目类型：" prop="type">
                <el-select
                  v-model="dialogForm.type"
                  placeholder="请选择项目类型"
                  clearable
                  collapse-tags
                  filterable
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.key"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="详细地址：" prop="address">
                <el-input
                  v-model.trim="dialogForm.address"
                  type="text"
                  class="input-default"
                  placeholder="详细地址"
                  maxlength="100"
                >
                  <template slot="append">
                    <div @click="mapShow = true">
                      <i class="el-icon-location-outline"></i>定位
                    </div>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="用地面积：" prop="area">
                <el-input
                  v-model="dialogForm.area"
                  type="text"
                  placeholder="请输入用地面积"
                  clearable
                  maxlength="20"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <div>
                <el-form-item label="设计单位：">
                  <myButton class="addbtn" @click.native="addDesign"
                    >添加</myButton
                  >

                  <el-table
                    :data="dialogForm.designList"
                    border
                    style="width: 100%"
                  >
                    <el-table-column label="单位名称">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                      </template>
                    </el-table-column>

                    <el-table-column label="单位资质"
                      >>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.aptitude"></el-input>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" width="70">
                      <template slot-scope="scope">
                        <el-button
                          icon="el-icon-delete-solid"
                          @click="delDesign(scope.$index, 1)"
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="12">
              <div>
                <el-form-item label="施工单位：">
                  <myButton class="addbtn" @click.native="addConstruct"
                    >添加</myButton
                  >

                  <el-table
                    :data="dialogForm.constructList"
                    border
                    style="width: 100%"
                  >
                    <el-table-column label="单位名称">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                      </template>
                    </el-table-column>

                    <el-table-column label="单位资质"
                      >>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.aptitude"></el-input>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" width="70">
                      <template slot-scope="scope">
                        <el-button
                          icon="el-icon-delete-solid"
                          @click="delConstruct(scope.$index, 1)"
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="24">
              <el-form-item label="建设内容及规模：" prop="content">
                <el-input
                  v-model="dialogForm.content"
                  type="textarea"
                  placeholder="请输入建设内容及规模"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="工艺简述：" prop="resume">
                <el-input
                  v-model="dialogForm.resume"
                  type="textarea"
                  placeholder="请输入工艺简述"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目备案文件：" prop="businessLicense">
                <el-tooltip
                  class="item tips"
                  effect="dark"
                  content="可上传图片"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                <myUpload
                  action="#"
                  class="upload-demo"
                  accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.pdf,.bmp,.webp"
                  multiple
                  :file-list="meanImgList"
                  :on-preview="handlePreview"
                  :on-remove="
                    (file, fileList) =>
                      handleRemoveImg('meanImg', file, fileList)
                  "
                  :http-request="
                    (file, fileList) => handleUpload('meanImg', file, fileList)
                  "
                  :on-change="
                    (file, fileList) =>
                      handleIntroduceUploadHide('meanImg', file, fileList)
                  "
                  :before-upload="beforeUploadImg"
                  :before-remove="beforeRemove"
                  list-type="picture-card"
                  :class="{ hideUploadBox: hideUpload_introduce_before }"
                >
                  <div class="uploadImg">
                    <i slot="default" class="el-icon-plus" />
                  </div>
                </myUpload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="三同时资料" name="second">
          <el-col :span="24">
            <el-form-item label="三同时资料：" prop="materials">
              <el-checkbox-group v-model="dialogForm.materials">
                <el-checkbox
                  v-for="item in materialList"
                  :label="item.value"
                  :key="item.value"
                  @change="checked"
                  >{{ item.key }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-show="safeShow">
            <div>
              <el-form-item label="安全生产许可证：">
                <myButton class="addbtn" @click.native="addSafe">添加</myButton>

                <el-table
                  :data="dialogForm.safeList"
                  border
                  style="width: 100%"
                >
                  <el-table-column label="证书号">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.number"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="发证时间"
                    >>
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.time"
                        type="date"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>

                  <el-table-column label="开始生效日期"
                    >>
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.startDate"
                        type="date"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>

                  <el-table-column label="有效截止日期"
                    >>
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.endDate"
                        type="date"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>

                  <el-table-column label="证书文件"
                    >>
                    <template slot-scope="scope">
                      <myUpload
                        action="#"
                        class="upload-demo"
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                        :on-preview="handlePreview"
                        :http-request="
                          (file, fileList) =>
                            handleUpload('permitImg', file, fileList)
                        "
                        :before-upload="beforeUploadImg"
                        :on-change="
                          (file, fileList) =>
                            handleIntroduceUploadHide(
                              'permitImg',
                              file,
                              fileList
                            )
                        "
                        :on-remove="
                          (file, fileList) =>
                            handleRemoveImg('permitImg', file, fileList)
                        "
                        :before-remove="beforeRemove"
                        :file-list="scope.row.permitList"
                      >
                        <myButton>点击上传</myButton>
                      </myUpload>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                      <el-button
                        icon="el-icon-delete-solid"
                        @click="delSafe(scope.$index, 1)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-show="facilitiesShow">
            <div>
              <el-form-item label="安全设施：">
                <myButton class="addbtn" @click.native="addFacilities"
                  >添加</myButton
                >

                <el-table
                  :data="dialogForm.facilitiesList"
                  border
                  style="width: 100%"
                >
                  <el-table-column label="报告资料">
                    <template slot-scope="scope">
                      <myUpload
                        action="#"
                        class="upload-demo"
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                        :on-preview="handlePreview"
                        :http-request="
                          (file, fileList) =>
                            handleUpload('safeImg', file, fileList)
                        "
                        :before-upload="beforeUploadImg"
                        :on-change="
                          (file, fileList) =>
                            handleIntroduceUploadHide('safeImg', file, fileList)
                        "
                        :on-remove="
                          (file, fileList) =>
                            handleRemoveImg('safeImg', file, fileList)
                        "
                        :before-remove="beforeRemove"
                        :file-list="safeImgList"
                      >
                        <myButton>点击上传</myButton>
                      </myUpload>
                    </template>
                  </el-table-column>

                  <el-table-column label="验收日期" width="300"
                    >>
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.time"
                        type="date"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                      <el-button
                        icon="el-icon-delete-solid"
                        @click="delFacilities(scope.$index, 1)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-show="fireShow">
            <div>
              <el-form-item label="消防设施：">
                <myButton class="addbtn" @click.native="addFire">添加</myButton>

                <el-table
                  :data="dialogForm.fireList"
                  border
                  style="width: 100%"
                >
                  <el-table-column label="报告资料">
                    <template slot-scope="scope">
                      <myUpload
                        action="#"
                        class="upload-demo"
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                        :on-preview="handlePreview"
                        :http-request="
                          (file, fileList) =>
                            handleUpload('fireImg', file, fileList)
                        "
                        :before-upload="beforeUploadImg"
                        :on-change="
                          (file, fileList) =>
                            handleIntroduceUploadHide('fireImg', file, fileList)
                        "
                        :on-remove="
                          (file, fileList) =>
                            handleRemoveImg('fireImg', file, fileList)
                        "
                        :before-remove="beforeRemove"
                        :file-list="fireImgList"
                      >
                        <myButton>点击上传</myButton>
                      </myUpload>
                    </template>
                  </el-table-column>

                  <el-table-column label="验收日期" width="300"
                    >>
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.time"
                        type="date"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                      <el-button
                        icon="el-icon-delete-solid"
                        @click="delFire(scope.$index, 1)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-show="lightningShow">
            <div>
              <el-form-item label="防雷检查：">
                <myButton class="addbtn" @click.native="addLightning"
                  >添加</myButton
                >

                <el-table
                  :data="dialogForm.lightningList"
                  border
                  style="width: 100%"
                >
                  <el-table-column label="报告资料">
                    <template slot-scope="scope">
                      <myUpload
                        action="#"
                        class="upload-demo"
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                        :on-preview="handlePreview"
                        :http-request="
                          (file, fileList) =>
                            handleUpload('reportImg', file, fileList)
                        "
                        :before-upload="beforeUploadImg"
                        :on-change="
                          (file, fileList) =>
                            handleIntroduceUploadHide(
                              'reportImg',
                              file,
                              fileList
                            )
                        "
                        :on-remove="
                          (file, fileList) =>
                            handleRemoveImg('reportImg', file, fileList)
                        "
                        :before-remove="beforeRemove"
                        :file-list="reportImgList"
                      >
                        <myButton>点击上传</myButton>
                      </myUpload>
                    </template>
                  </el-table-column>

                  <el-table-column label="验收日期" width="300"
                    >>
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.time"
                        type="date"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                      <el-button
                        icon="el-icon-delete-solid"
                        @click="delLightning(scope.$index, 1)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-show="diseaseShow">
            <div>
              <el-form-item label="职业病防护：">
                <myButton class="addbtn" @click.native="addDisease"
                  >添加</myButton
                >

                <el-table
                  :data="dialogForm.diseaseList"
                  border
                  style="width: 100%"
                >
                  <el-table-column label="报告资料">
                    <template slot-scope="scope">
                      <myUpload
                        action="#"
                        class="upload-demo"
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                        :on-preview="handlePreview"
                        :http-request="
                          (file, fileList) =>
                            handleUpload('protectImg', file, fileList)
                        "
                        :before-upload="beforeUploadImg"
                        :on-change="
                          (file, fileList) =>
                            handleIntroduceUploadHide(
                              'protectImg',
                              file,
                              fileList
                            )
                        "
                        :on-remove="
                          (file, fileList) =>
                            handleRemoveImg('protectImg', file, fileList)
                        "
                        :before-remove="beforeRemove"
                        :file-list="protectImgList"
                      >
                        <myButton>点击上传</myButton>
                      </myUpload>
                    </template>
                  </el-table-column>

                  <el-table-column label="验收日期" width="300"
                    >>
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.time"
                        type="date"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                      <el-button
                        icon="el-icon-delete-solid"
                        @click="delDisease(scope.$index, 1)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-show="environmentShow">
            <div>
              <el-form-item label="生态环境保护设施：">
                <myButton class="addbtn" @click.native="addEnvironment"
                  >添加</myButton
                >

                <el-table
                  :data="dialogForm.environmentList"
                  border
                  style="width: 100%"
                >
                  <el-table-column label="报告资料">
                    <template slot-scope="scope">
                      <myUpload
                        action="#"
                        class="upload-demo"
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.bmp,.webp"
                        :on-preview="handlePreview"
                        :http-request="
                          (file, fileList) =>
                            handleUpload('environmentImg', file, fileList)
                        "
                        :before-upload="beforeUploadImg"
                        :on-change="
                          (file, fileList) =>
                            handleIntroduceUploadHide(
                              'environmentImg',
                              file,
                              fileList
                            )
                        "
                        :on-remove="
                          (file, fileList) =>
                            handleRemoveImg('environmentImg', file, fileList)
                        "
                        :before-remove="beforeRemove"
                        :file-list="environmentImgList"
                      >
                        <myButton>点击上传</myButton>
                      </myUpload>
                    </template>
                  </el-table-column>

                  <el-table-column label="验收日期" width="300"
                    >>
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.time"
                        type="date"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                      <el-button
                        icon="el-icon-delete-solid"
                        @click="delEnvironment(scope.$index, 1)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton :loading="loading" @click.native="submit('dialogForm')">
        提 交
      </myButton>
    </template>

    <mapup
      v-if="mapShow"
      :show="mapShow"
      :postform="postForm"
      @close="mapupclose"
    />
  </myDrawer>
</template>
<script>
import { fileUpload } from "@/api/upload";
import { add, edit, detail } from "@/api/park/sameTime";
import mapup from "./mapup.vue";
import { Message } from "element-ui";
export default {
  components: { mapup },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "编辑三同时";
      },
    },
    visible: {
      type: Boolean,
      required: true,
      default() {
        return false;
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
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,

      dialogForm: {
        name: null,
        build: null,
        nature: null,
        type: null,
        address: null,
        longitude: null,
        latitude: null,
        area: null,
        constructList: [],
        designList: [],
        safeList: [],

        facilitiesList: [],
        fireList: [],
        lightningList: [],
        diseaseList: [],
        environmentList: [],

        materials: [],
        material: null,
      },
      activeName: "first",
      natureList: [],
      typeList: [],
      materialList: [],
      certificateList: [],

      meanImgList: [],
      imgList: [],
      permitList: [],
      permitImgList: [],
      safeList: [],
      safeImgList: [],
      fireList: [],
      fireImgList: [],
      reportList: [],
      reportImgList: [],
      protectList: [],
      protectImgList: [],
      environmentImgList: [],
      environmentList: [],

      safeShow: false,
      facilitiesShow: false,
      fireShow: false,
      lightningShow: false,
      diseaseShow: false,
      environmentShow: false,

      formRules: {},
      postForm: {
        longitude: null,
        latitude: null,
        detailedAddress: null,
      },
      mapShow: false,
      files: [],
      hideUpload_introduce_before: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    checked() {
      this.$forceUpdate();
      console.log(this.dialogForm.materials);

      if (this.dialogForm.materials.includes(0)) {
        this.safeShow = true;
      } else {
        this.safeShow = false;
      }

      if (this.dialogForm.materials.includes(1)) {
        this.facilitiesShow = true;
      } else {
        this.facilitiesShow = false;
      }

      if (this.dialogForm.materials.includes(2)) {
        this.fireShow = true;
      } else {
        this.fireShow = false;
      }

      if (this.dialogForm.materials.includes(3)) {
        this.lightningShow = true;
      } else {
        this.lightningShow = false;
      }

      if (this.dialogForm.materials.includes(4)) {
        this.diseaseShow = true;
      } else {
        this.diseaseShow = false;
      }

      if (this.dialogForm.materials.includes(5)) {
        this.environmentShow = true;
      } else {
        this.environmentShow = false;
      }
    },

    addConstruct() {
      this.dialogForm.constructList.push({
        name: null,
        aptitude: null,
      });
    },

    delConstruct(index) {
      if (this.dialogForm.constructList.length > 1) {
        this.dialogForm.constructList.splice(index, 1);
      } else {
        Message.error("至少保留一条");
      }
    },

    addDesign() {
      this.dialogForm.designList.push({
        name: null,
        aptitude: null,
      });
    },

    delDesign(index) {
      if (this.dialogForm.designList.length > 1) {
        this.dialogForm.designList.splice(index, 1);
      } else {
        Message.error("至少保留一条");
      }
    },

    addSafe() {
      this.dialogForm.safeList.push({
        number: null,
        startDate: null,
        endDate: null,
        time: null,
      });
    },

    delSafe(index) {
      if (this.dialogForm.safeList.length > 1) {
        this.dialogForm.safeList.splice(index, 1);
      } else {
        Message.error("至少保留一条");
      }
    },

    addFacilities() {
      this.dialogForm.facilitiesList.push({
        time: null,
      });
    },

    delFacilities(index) {
      if (this.dialogForm.facilitiesList.length > 1) {
        this.dialogForm.facilitiesList.splice(index, 1);
      } else {
        Message.error("至少保留一条");
      }
    },

    addFire() {
      this.dialogForm.fireList.push({
        time: null,
      });
    },

    delFire(index) {
      if (this.dialogForm.fireList.length > 1) {
        this.dialogForm.fireList.splice(index, 1);
      } else {
        Message.error("至少保留一条");
      }
    },

    addLightning() {
      this.dialogForm.lightningList.push({
        time: null,
      });
    },

    delLightning(index) {
      if (this.dialogForm.lightningList.length > 1) {
        this.dialogForm.lightningList.splice(index, 1);
      } else {
        Message.error("至少保留一条");
      }
    },

    addDisease() {
      this.dialogForm.diseaseList.push({
        time: null,
      });
    },

    delDisease(index) {
      if (this.dialogForm.diseaseList.length > 1) {
        this.dialogForm.diseaseList.splice(index, 1);
      } else {
        Message.error("至少保留一条");
      }
    },

    addEnvironment() {
      this.dialogForm.environmentList.push({
        time: null,
      });
    },

    delEnvironment(index) {
      if (this.dialogForm.environmentList.length > 1) {
        this.dialogForm.environmentList.splice(index, 1);
      } else {
        Message.error("至少保留一条");
      }
    },

    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: that.id })
        .then((res) => {
          console.log(res);
          this.dialogForm = res.entity;
          this.natureList = res.natureList;
          this.typeList = res.typeList;
          this.materialList = res.materialList;

          if (this.dialogForm.imgList == null) {
            this.dialogForm.imgList = [];
          }
          if (this.dialogForm.permitList == null) {
            this.dialogForm.permitList = [];
          }
          if (this.dialogForm.safeList == null) {
            this.dialogForm.safeList = [];
          }
          if (this.dialogForm.fireList == null) {
            this.dialogForm.fireList = [];
          }
          if (this.dialogForm.reportList == null) {
            this.dialogForm.reportList = [];
          }
          if (this.dialogForm.protectList == null) {
            this.dialogForm.protectList = [];
          }
          if (this.dialogForm.environmentList == null) {
            this.dialogForm.environmentList = [];
          }

          if (
            this.dialogForm.designList == null ||
            this.dialogForm.designList.length == 0
          ) {
            this.dialogForm.designList = [
              {
                name: null,
                aptitude: null,
              },
            ];
          }

          if (
            this.dialogForm.constructList == null ||
            this.dialogForm.constructList.length == 0
          ) {
            this.dialogForm.constructList = [
              {
                name: null,
                aptitude: null,
              },
            ];
          }

          if (
            this.dialogForm.facilitiesList == null ||
            this.dialogForm.facilitiesList.length == 0
          ) {
            this.dialogForm.facilitiesList = [
              {
                time: null,
              },
            ];
          }

          if (
            this.dialogForm.fireList == null ||
            this.dialogForm.fireList.length == 0
          ) {
            this.dialogForm.fireList = [
              {
                time: null,
              },
            ];
          }

          if (
            this.dialogForm.lightningList == null ||
            this.dialogForm.lightningList.length == 0
          ) {
            this.dialogForm.lightningList = [
              {
                time: null,
              },
            ];
          }

          if (
            this.dialogForm.diseaseList == null ||
            this.dialogForm.diseaseList.length == 0
          ) {
            this.dialogForm.diseaseList = [
              {
                time: null,
              },
            ];
          }

          if (
            this.dialogForm.environmentList == null ||
            this.dialogForm.environmentList.length == 0
          ) {
            this.dialogForm.environmentList = [
              {
                time: null,
              },
            ];
          }

          if (
            this.dialogForm.safeList == null ||
            this.dialogForm.safeList.length == 0
          ) {
            this.dialogForm.safeList = [
              {
                time: null,
                startDate: null,
                endDate: null,
              },
            ];
          }

          if (that.dialogForm.material == null) {
            that.dialogForm.materials = [];
          } else {
            let arr = [];
            that.dialogForm.material.split(",").forEach((item) => {
              arr.push(Number(item));
            });
            that.dialogForm.materials = arr;
          }
        })
        .finally(() => {
          that.loading = false;
        });
    },
    // 地图弹窗
    mapupclose(data) {
      this.mapShow = false;
      if (data != null) {
        this.dialogForm.address = data.address;
        this.dialogForm.longitude = data.lng;
        this.dialogForm.latitude = data.lat;

        this.postForm.address = data.address;
        this.postForm.longitude = data.lng;
        this.postForm.latitude = data.lat;
      }
    },
    cancel(done) {
      this.$emit("close", {});
    },

    submit() {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs["dialogForm"].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            add(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", {
                  reload: true,
                  returnData: that.dialogForm.tenantType,
                });
              })
              .catch(() => {
                that.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`);
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    // 移除模板
    handleRemoveImg(type, file, fileList) {
      // 图标
      if (type == "meanImg") {
        this.dialogForm.imgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.dialogForm.imgList.splice(i, 1);
          }
        });
        this.meanImgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.meanImgList.splice(i, 1);
          }
        });
      }

      if (type == "permitImg") {
        this.dialogForm.permitList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.dialogForm.permitList.splice(i, 1);
          }
        });
        this.permitImgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.permitImgList.splice(i, 1);
          }
        });
      }

      if (type == "safeImg") {
        this.dialogForm.safeList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.dialogForm.safeList.splice(i, 1);
          }
        });
        this.safeImgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.safeImgList.splice(i, 1);
          }
        });
      }

      if (type == "fireImg") {
        this.dialogForm.fireList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.dialogForm.fireList.splice(i, 1);
          }
        });
        this.fireImgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.fireImgList.splice(i, 1);
          }
        });
      }

      if (type == "reportImg") {
        this.dialogForm.reportList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.dialogForm.reportList.splice(i, 1);
          }
        });
        this.reportImgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.reportImgList.splice(i, 1);
          }
        });
      }

      if (type == "protectImg") {
        this.dialogForm.protectList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.dialogForm.protectList.splice(i, 1);
          }
        });
        this.protectImgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.protectImgList.splice(i, 1);
          }
        });
      }

      if (type == "environmentImg") {
        this.dialogForm.environmentList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.dialogForm.environmentList.splice(i, 1);
          }
        });
        this.environmentImgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.environmentImgList.splice(i, 1);
          }
        });
      }
    },

    beforeUploadImg(file) {
      let name = file.name.split(".").pop().toUpperCase();
      if (
        name !== "JPEG" &&
        name !== "JPG" &&
        name !== "PNG" &&
        name !== "GIF" &&
        name !== "BMP"
      ) {
        this.$message({
          type: "error",
          message: "只支持JPEG、JPG、PNG、GIF、BMP文件格式！",
        });
        return false;
      }
    },
    handlePreview(file) {
      if (file && file.fileUrl) {
        window.open(file.fileUrl);
      }
    },

    handleIntroduceUploadHide(type, file, fileList) {
      switch (type) {
        case "management_file":
          this.hideUpload_introduce_before = fileList.length >= 1;
          break;
      }
    },

    // 自定义上传图片
    handleUpload(type, file, fileList) {
      const that = this;
      const formData = new FormData();
      formData.append("fileType", 1);
      formData.append("file", file.file);
      formData.append("type", type);

      fileUpload(formData).then((res) => {
        res.sourceType = type;

        // 封面图片
        if (type == "meanImg") {
          that.dialogForm.imgList.push(res);
          that.meanImgList.push({
            link: that.baseURL + res.fileUrl,
            url: that.baseURL + res.fileUrl,
            fileName: res.fileName,
            fileId: res.fileId,
          });
        }

        if (type == "permitImg") {
          that.dialogForm.permitList.push(res);
          that.permitImgList.push({
            link: that.baseURL + res.fileUrl,
            url: that.baseURL + res.fileUrl,
            fileName: res.fileName,
            fileId: res.fileId,
          });
        }

        if (type == "safeImg") {
          that.dialogForm.safeList.push(res);
          that.safeImgList.push({
            link: that.baseURL + res.fileUrl,
            url: that.baseURL + res.fileUrl,
            fileName: res.fileName,
            fileId: res.fileId,
          });
        }

        if (type == "fireImg") {
          that.dialogForm.fireList.push(res);
          that.fireImgList.push({
            link: that.baseURL + res.fileUrl,
            url: that.baseURL + res.fileUrl,
            fileName: res.fileName,
            fileId: res.fileId,
          });
        }

        if (type == "reportImg") {
          that.dialogForm.reportList.push(res);
          that.reportImgList.push({
            link: that.baseURL + res.fileUrl,
            url: that.baseURL + res.fileUrl,
            fileName: res.fileName,
            fileId: res.fileId,
          });
        }

        if (type == "protectImg") {
          that.dialogForm.protectList.push(res);
          that.protectImgList.push({
            link: that.baseURL + res.fileUrl,
            url: that.baseURL + res.fileUrl,
            fileName: res.fileName,
            fileId: res.fileId,
          });
        }

        that.$message({
          type: "success",
          message: "上传成功！",
        });
      });
    },
  },
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

/** 问号提示 **/
/deep/.tips {
  font-size: 16px;
  cursor: pointer;
}
/deep/input[type="file"] {
  display: none;
}
/** 上传文件 **/
/deep/ .upload-demo > div:first-of-type {
  display: inline;
}

/deep/.hideUploadBox > .el-upload--picture-card {
  display: none !important;
}
.addbtn {
  margin-bottom: 10px;
  // background-color: #37e0b6;
}
</style>
