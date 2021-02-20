<template>
    <div class="page">
        <query-form ref="form" class="search">
            <query-item label="设备标识码：" query-type="equals" prop="deviceId" class="input">
                <el-input v-model="deviceId" style="width: 180px"></el-input>
            </query-item>
            <query-item label="车牌号：" query-type="like" prop="carNo" class="input">
                <el-input v-model="carNo" style="width: 180px"></el-input>
            </query-item>
            <query-item label="线路：" query-type="like" prop="lineId" class="input">
				<el-input v-model="lineId" style="width: 180px"></el-input>
            </query-item>
            <query-item label="班次：" query-type="like" prop="shiftNo" class="input">
				<el-input v-model="shiftNo" style="width: 180px"></el-input>
            </query-item>
            <query-item label="PAD设备版本号：" query-type="like" prop="appVersion" class="input">
                <el-input v-model="appVersion" style="width: 180px"></el-input>
            </query-item>
            <query-item label="网络状态：" query-type="equals" prop="isOnline" class="input">
                <el-select v-model="isOnline" placeholder="请选择" style="width: 180px" clearable>
                    <el-option v-for="item in optionOnline" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </query-item>
            <el-button class="btn" @click="search">搜索</el-button>
            <el-button class="btn" @click="reset">重置</el-button>
        </query-form>

        <div class="table">
            <el-container class="h100">
                <el-header class="table-head" style="padding-top: 20px"
                ><span class="fw fs18">系统参数详情</span>
                    <div class="h100 fr">
                        <el-button class="btn" @click="newData">新增</el-button>
                        <el-button class="btn" @click="upgrade">一键升级</el-button>
                    </div>
                </el-header>
                <el-main class="h100">
                    <el-table :data="tableData" border style="width: 100%" height="calc(100% - 80px)" stripe>
                        <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
                        <template v-for="(item, i) in tableCOl">
                            <el-table-column
                                    :key="`${i}_${item.prop}`"
                                    :label="item.label"
                                    :type="item.type"
                                    show-overflow-tooltip
                                    :formatter="item.formatter"
                                    align="center"
                                    :prop="item.prop"
                                    :width="item.width">
                            </el-table-column>
                        </template>

                        <el-table-column label="操作" align="center" width="120">
                            <template slot-scope="scope">
                                <!-- <div v-if="item.label == '操作'"> -->
                                <span style="margin-right: 20px"><i class="el-icon-delete"
                                                                    @click="deletes(scope.row)"></i></span>
                                <span><i class="el-icon-edit" @click="edits(scope.row)"></i></span>
                                <!-- </div>
                                <div v-else>{{ scope.row[item.prop] }}</div> -->
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-sizes="[10, 20, 50, 100, 200, 500]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                    ></el-pagination>
                </el-main>
            </el-container>
        </div>
        <!-- 编辑的弹窗 -->
        <el-dialog :title="title" :visible.sync="editOrAddDialog" width="550px" @close="dialogClose()">
            <el-form :model="editForm" :rules="formrule" ref="formRef" label-width="120px">
                <el-form-item label="识别标识码：" prop="deviceId">
                    <el-input v-model="editForm.deviceId" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="车牌号：" prop="carNo">
                    <el-input v-model="editForm.carNo" style="width: 300px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editOrAddDialog = false">取消</el-button>
                <el-button type="primary" @click="editParams">确定</el-button></span>
        </el-dialog>
    </div>
</template>
<script>
  export default {
    name: "vehicleManage",
    components: {},

    computed: {
      // 弹窗标题
      title() {
        return this.isAdd ? "新增" : "编辑";
      }
    },

    data() {
      return {
        deviceId: "",
        carNo: "",
        lineId: "",
        shiftNo: "",
        appVersion: "",
        isOnline: "",

        page: {
          page: 0,
          size: 50
        },
        optionOnline: [
          {
            value: 0,
            label: "离线"
          },
          {
            value: 1,
            label: "在线"
          }
        ],
        // 渲染表格
        tableCOl: [
          {
            label: "设备标识码",
            type: "",
            width: "160",
            prop: "deviceId"
          },
          {
            label: "车牌号",
            type: "",
            width: "160",
            prop: "carNo"
          },
          {
            label: "线路",
            type: "",
            width: "",
            prop: "lineId"
          },
          {
            label: "班次",
            type: "",
            width: "180",
            prop: "shiftNo"
          },
          {
            label: "PAD设备版本号",
            type: "",
            width: "160",
            prop: "appVersion"
          },
          {
            label: "存储空间(M)",
            type: "",
            width: "120",
            prop: "space"
          },
          {
            label: "网络状态",
            type: "",
            width: "120",
            prop: "isOnline",
            formatter: this.onlineformatter
          }
        ],
        //分页
        total: 0,
        currentPage: 1,
        pageSize: 50,
        tableData: [],
        // 新增状态
        isAdd: true,
        // 表单是否显示
        editOrAddDialog: false,
        // 修改的表单数据对象
        editForm: {
          deviceId: "",
          carNo: ""
        },

        // 表单校验
        formrule: {
          deviceId: [
            {
              required: true,
              message: "请输入识别标识码",
              trigger: "blur"
            }
          ],
          carNo: [
            {
              required: true,
              message: "请输入车牌号",
              trigger: "blur"
            }
          ]
        }
      };
    },

    watch: {},

    methods: {
      // 请求表格数据
      async getParamsData() {
        let queryparmas = this.$refs.form.value();
        console.log(this.$refs.form.value());
        let parmas = {
          page: this.page,
          query: queryparmas
        };
        const {data: res} = await this.$http.post("/api/device/listDevice", parmas);
        this.tableData = _.get(res, "data.content", []);
        this.total = res.data.totalElements;
      },
      onlineformatter(row, column, cellValue, index) {
        if (cellValue == 0) {
          return "离线";
        } else if (cellValue == 1) {
          return "在线";
        }
      },
      // 搜索
      search() {
        this.page.page = 0;
        this.currentPage = 1;
        this.getParamsData();
      },

      // 重置
      reset() {
        this.deviceId = "";
        this.carNo = "";
        this.lineId = "";
        this.shiftId = "";
        this.appVersion = "";
        this.isOnline = "";
      },

      // 新建按钮
      newData() {
        this.isAdd = true;
        this.editOrAddDialog = true;
      },

      upgrade() {
        this.$http.get("/api/appVersion/use-newest").then(res => {
          let code = _.get(res, "data.code", null);
          if (code === 200) {
            this.$message.success("操作成功！");
          } else if (code === 10003) {
            this.$message.error("所有版本均已下发!");
          } else this.$message.error("操作失败, 请稍后重试！");
        }).catch(e => {
          this.$message.error("操作失败, 请稍后重试！");
        });
      },

      // 弹窗确定按钮事件
      editParams() {
        this.$refs.formRef.validate(async valid => {
          if (!valid) return;
          let parmas;
          if (this.isAdd) {
            parmas = {
              deviceId: this.editForm.deviceId,
              carNo: this.editForm.carNo
            };
          } else {
            parmas = this.editForm;
          }
          const {data: res} = await this.$http.post("/api/device/updateDevice", parmas);
          if (_.get(res, "code", null) == 200) {
            this.$message.success("修改参数成功！");
            this.getParamsData();
          } else if (_.get(res, "code", null) == 10001) {
            this.$message.error(_.get(res, "message", "修改参数失败！"));
          } else this.$message.error("修改参数失败！");
          this.editOrAddDialog = false;
        });
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

      dialogClose() {
        this.editForm = {
          deviceId: "",
          carNo: ""
        };
        this.$refs.formRef.resetFields();
      },

      deletes(row) {
        this.$confirm("确认删除相关所有数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.delete("/api/device/deleteDevice?deviceId=" + row.deviceId).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getParamsData();
            } else {
              this.$message.error("删除失败！");
            }
          });
        });
      },

      // 编辑按钮
      edits(row) {
        console.log(row, "row");
        this.isAdd = false;
        this.editForm = _.cloneDeep(row);
        this.editOrAddDialog = true;
      }
    },
    mounted() {
      this.getParamsData();
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
            height: 125px;
            padding-top: 20px;
            margin: 30px 30px 20px 20px;
            border: 1px solid #fff;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 3px 3px 8px 0px rgba(0, 0, 0, 0.2);

            .el-button {
                width: 110px;
                height: 35px;
                border-radius: 25px;
            }
        }

        .input {
            padding-left: 20px;
            font-size: 14px;
        }

        .btn {
            margin-left: 20px;
        }

        .table {
            height: calc(100% - 200px);
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
        }

        ::v-deep .el-main {
            height: calc(100% - 30px);
            padding: 10px 20px 20px;
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

        ::v-deep .el-button:focus,
        .el-button:hover {
            color: #fff;
            background-color: #3ac158;
        }
    }
</style>
