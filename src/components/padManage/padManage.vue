<template>
    <div class="page">
        <query-form ref="versionQueryForm" class="search">
            <query-item label="版本号：" query-type="equals" prop="version" class="input">
                <el-input v-model="version" style="width: 180px"></el-input>
            </query-item>
            <query-item label="更新时间：" query-type="greaterOrEqualsThan" prop="createDate" class="input">
                <el-date-picker v-model="createDate" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期"
                                style="width: 180px"></el-date-picker>
            </query-item>
            <query-item label="下发更新时间：" query-type="greaterOrEqualsThan" prop="updateDate" class="input">
                <el-date-picker v-model="updateDate" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期"
                                style="width: 180px"></el-date-picker>
            </query-item>
            <el-button class="btn" @click="search">搜索</el-button>
            <el-button class="btn" @click="reset">重置</el-button>
        </query-form>
        <div class="table">
            <el-container class="h100">
                <el-header class="table-head" style="padding-top: 20px"
                ><span class="fw fs18">系统参数详情</span>
                    <div class="h100 fr">
                        <el-button class="btn" @click="uploading">版本上传</el-button>
                    </div>
                </el-header>
                <el-main class="h100">
                    <el-table :data="tableData" border style="width: 100%" height="calc(100% - 80px)" stripe>
                        <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
                        <el-table-column
                                v-for="(item, i) in tableCOl"
                                :key="`${i}_${item.prop}`"
                                :label="item.label"
                                :type="item.type"
                                align="center"
                                show-overflow-tooltip
                                :prop="item.prop"
                                :width="item.width"></el-table-column>
                    </el-table>
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-sizes="[10, 20, 50, 100, 200, 500]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </el-main>
            </el-container>
        </div>
        <el-dialog title="版本上传" :visible.sync="editOrAddDialog" width="800px" @close="dialogClose()">
            <el-form class="upform" :model="updata" :rules="formrule" ref="formRef" label-position="top"
                     label-width="120px">
                <el-form-item label="版本号(主版本.副版本.子版本, 仅允许输入数字)：" prop="codeVer">
                    <el-input v-model="updata.codeVer" placeholder="请输入新增版本号(主版本.副版本.子版本, 仅允许输入数字)"
                              style="width: 740px"></el-input>
                </el-form-item>
                <el-form-item label="版本更新说明：" prop="updataText">
                    <el-input v-model="updata.updataText" type="textarea" :rows="4" style="width: 740px"></el-input>
                </el-form-item>
                <el-upload
                        ref="upload"
                        :auto-upload="false"
                        accept=".apk"
                        :limit="1"
                        :before-upload="beforeUpload"
                        class="upload-demo"
                        :http-request="updateLoadFile"
                        drag
                        action=""
                        :multiple="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">拖拽上传 或 <em>点击上传</em></div>
                    <div class="el-upload__tip fs16" style="color: #a34c4c" slot="tip">提示：只能上传 .apk 文件!</div>
                </el-upload>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editOrAddDialog = false">取消</el-button>
                <el-button type="primary" @click="updataPAD">上传</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
  export default {
    name: "padManage",
    components: {},

    data() {
      return {
        versions: "",
        version: "",
        createDate: null,
        updateDate: null,

        editOrAddDialog: false,

        // 渲染表格
        tableCOl: [
          {
            label: "版本号",
            type: "",
            width: "160",
            prop: "version"
          },
          {
            label: "更新时间",
            type: "",
            width: "200",
            prop: "updateDate"
          },
          {
            label: "下发更新时间",
            type: "",
            width: "200",
            prop: "useDate"
          },
          {
            label: "版本更新说明",
            type: "",
            width: "",
            prop: "memo"
          },
          {
            label: "已升级设备数量",
            type: "",
            width: "120",
            prop: "count"
          }
        ],
        page: {
          page: 0,
          size: 50,
          sort: {
            updateDate: "asc"
          }
        },
        //分页
        total: 0,
        currentPage: 1,
        pageSize: 50,
        tableData: [],

        updata: {
          codeVer: "",
          updataText: ""
        },
        formrule: {
          codeVer: [
            {required: true, message: "请输入版本号", trigger: "blur"},
            {
              validator: (rule, value, cb) => {
                let reg = /^\d+\.\d+\.\d+$/mg;
                if (reg.test(value)) {
                  cb();
                } else {
                  cb('版本格式不正确');
                }
              }, trigger: 'blur'
            }
          ],
          updataText: [
            {required: true, message: "请输入版本说明", trigger: "blur"}
          ]
        }
      };
    },

    watch: {},

    methods: {
      //搜索按钮
      search() {
        this.page.page = 0;
        this.currentPage = 1;
        this.getParamsData();
      },
      // 表格查询
      async getParamsData() {
        let queryparmas = this.$refs.versionQueryForm.value();
        let parmas = {
          page: this.page,
          query: queryparmas
        };
        const {data: res} = await this.$http.post("/api/appVersion/listVersions", parmas);
        this.tableData = _.get(res, "data.content", []);
        this.total = res.data.totalElements;
      },
      //重置按钮
      reset() {
        this.version = "";
        this.createDate = "";
        this.updateDate = "";
      },

      handleSizeChange(val) {
        this.page.page = 0;
        this.currentPage = 1;
        this.page.size = val;
        this.getParamsData();
      },
      handleCurrentChange(val) {
        this.page.page = val - 1;
        this.getParamsData();
      },

      // 版本上传弹窗
      uploading() {
        this.editOrAddDialog = true;
      },
      // 上传前判断文件类型给提示
      beforeUpload(file) {
        const extension = file.name.substring(file.name.lastIndexOf(".") + 1);

        if (extension !== "apk") {
          this.$message({
            message: "请上传apk类型文件!",
            type: "error"
          });
          return false;
        }
      },
      // 发送请求上传
      updataPAD() {
        this.$refs.formRef.validate(async valid => {
          if (!valid) return;

          this.$refs.upload.submit();

          // this.editOrAddDialog = false;
        });
      },
      updateLoadFile(param) {
        let formData = new FormData();
        formData.append('file', param.file);
        formData.append("version", this.updata.codeVer);
        formData.append("memo", this.updata.updataText);
        this.$http.post('/api/appVersion/upload', formData, {timeout: 60000}).then(res => {
          if (res.data.code === 200) {
            this.$message.success("版本上传成功！");
            this.editOrAddDialog = false;
            this.getParamsData();
          } else {
            this.$message.error("版本上传失败！");
            console.log(res.data.message);
          }
        }).catch(e => {
          this.$message.error("版本上传失败！");
        });
      },
      dialogClose() {
        this.$refs.upload.clearFiles();
        this.$refs.formRef.resetFields();
      }
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => this.getParamsData());
      });
    }
  };
</script>
<style lang="scss" scoped>
    .page {
        width: 100%;
        height: calc(100% - 53px);

        .search {
            display: flex;
            flex-wrap: wrap;
            height: 56px;
            padding-top: 20px;
            margin: 30px 30px 20px 20px;
            border: 1px solid #fff;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 3px 3px 8px 0px rgba(0, 0, 0, 0.2);
        }

        .el-button {
            width: 110px;
            height: 35px;
            border-radius: 25px;
        }

        .input {
            padding-left: 20px;
            font-size: 14px;
        }

        .el-upload-dragger .el-icon-upload {
            margin-top: 20px;
        }

        ::v-deep .el-button:focus,
        .el-button:hover {
            color: #fff;
            background-color: #3ac158;
        }

        ::v-deep .el-upload-dragger {
            width: 740px;
            height: 130px;
        }

        .table {
            height: calc(100% - 130px);
            margin: 20px 30px 20px 20px;
            border: 1px solid #fff;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 3px 3px 8px 0px rgba(0, 0, 0, 0.2);

            .el-button {
                width: 80px;
                height: 30px;
                border-radius: 5px;
            }

            .table-head {
                height: 30px;
                line-height: 30px;
            }

            ::v-deep .el-main {
                height: calc(100% - 33px);
                padding: 10px 20px 20px;
            }
        }

        ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
            background-color: #3ac357;
        }

        ::v-deep .el-pagination__total,
        ::v-deep .btn-prev,
        ::v-deep .el-pager,
        ::v-deep .btn-next {
            margin-top: 3px;
        }

        ::v-deep .el-dialog__body {
            padding: 10px 30px;

            .el-input__inner {
                background-color: #fff;
                font-size: 16px;
            }
        }

        .el-dialog__footer {
            .el-button {
                width: 100px;
                height: 35px;
                border-radius: 5px !important;
            }
        }

        ::v-deep .el-form--label-top .el-form-item__label {
            padding: 0 !important;
        }

        .upform {
            ::v-deep .el-form-item__label {
                font-size: 16px;
                color: #000;
            }

            .el-form-item {
                margin-bottom: 18px;
            }
        }

        // ::v-deep .el-list-enter-active,
        // ::v-deep .el-list-leave-active {
        //   transition: none;
        // }

        // ::v-deep .el-list-enter,
        // ::v-deep .el-list-leave-active {
        //   opacity: 0;
        // }
    }
</style>