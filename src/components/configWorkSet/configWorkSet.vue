<template>
    <div class="page">
        <div class="config">
            <el-row :gutter="30" style="padding-top: 10px">
                <el-col :span="8" class="">
                    <div class="divbord" style="margin-left: 30px">
                        <div class="indiv">体温监测设置</div>
                        <div class="switch">
                            <el-row :gutter="30">
                                <el-col :span="12">
                                    <el-switch
                                            v-model="driverTemperatureCheck"
                                            :active-value="1"
                                            :inactive-value="0"
                                            style="padding-left: 20px"
                                            active-color="#13ce66"
                                            inactive-color="#EAECF0"
                                            :width="48">
                                    </el-switch>
                                    司机体温监测开关
                                </el-col>
                                <el-col :span="12">
                                    <el-switch
                                            v-model="passengerTemperatureCheck"
                                            :active-value="1"
                                            :inactive-value="0"
                                            style="padding-left: 20px"
                                            active-color="#13ce66"
                                            inactive-color="#EAECF0"
                                            :width="48">
                                    </el-switch>
                                    乘客体温监测开关
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8" class="">
                    <div class="divbord">
                        <div class="indiv" style="width: 100px">体温阈值</div>
                        <div class="switch" style="padding-left: 28px">
                            <el-form :model="temForm" :rules="temFormRule" style="display: inline-block; width: 100%"
                                     ref="temForm">
                                <el-form-item label="体温阈值：" prop="temperatureHigh">
                                    <el-input v-model="temForm.temperatureHigh"
                                              style="width: 100px; padding-right: 6px"></el-input>
                                    ℃
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8" class="">
                    <div class="divbord">
                        <div class="indiv">超时限制设置</div>
                        <div class="switch">
                            <el-form :model="outTimeForm" :rules="outTimeRule" ref="outTimeForm"
                                     style="display: inline-block; width: 100%; position: absolute; top: 33%">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="人脸识别:" prop="faceTimeout" class="switch"
                                                      style="padding-left: 20px">
                                            <el-input v-model="outTimeForm.faceTimeout"
                                                      style="width: 80px; padding-right: 5px"></el-input>
                                            秒
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="二维码识别:" prop="qrcodeTimeout" class="switch"
                                                      style="padding-left: 10px">
                                            <el-input v-model="outTimeForm.qrcodeTimeout"
                                                      style="width: 80px; padding-right: 5px"></el-input>
                                            秒
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-button class="btn posbut" @click="confirm">确定</el-button>
        </div>

        <query-form ref="serialForm" class="search">
            <query-item label="License序列号：" query-type="like" prop="serialNumber" class="input">
                <el-input v-model="serialNumber" style="width: 180px"></el-input>
            </query-item>
            <query-item label="设备标识码：" query-type="like" prop="deviceId" class="input">
                <el-input v-model="deviceId" style="width: 180px" @change="deviceIdChange"></el-input>
            </query-item>
            <query-item label="车牌号：" query-type="like" prop="carNo" class="input">
                <el-input v-model="carNo" style="width: 180px" @change="carNoChange"></el-input>
            </query-item>
            <query-item label="创建日期：" query-type="greaterOrEqualsThan" prop="createDate" class="input">
                <el-date-picker v-model="createDate" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期"
                                style="width: 180px"></el-date-picker>
            </query-item>
            <query-item label="更新日期：" query-type="greaterOrEqualsThan" prop="updateDate" class="input">
                <el-date-picker v-model="updateDate" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期"
                                style="width: 180px"></el-date-picker>
            </query-item>
            <query-item label="是否失效：" query-type="equals" prop="delFlag" class="input">
                <el-select v-model="delFlag" placeholder="请选择" style="width: 100px" clearable>
                    <el-option v-for="item in delFlagOptions" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </query-item>
            <el-button class="btn" @click="search">搜索</el-button>
            <el-button class="btn" @click="reset">重置</el-button>
        </query-form>

        <div class="table">
            <el-container class="h100">
                <el-header class="table-head" style="padding-top: 20px"><span class="fw fs18">系统参数详情</span>
                    <div class="h100 fr">
                        <el-button class="btn" @click="newData">新增</el-button>
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
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                    ></el-pagination>
                </el-main>
            </el-container>
        </div>
        <el-dialog :title="title" :visible.sync="editOrAddDialog" width="550px" @close="dialogClose()">
            <el-form :model="editForm" :rules="formrule" ref="formRef" label-width="130px">
                <el-form-item label="License序列号：" prop="serialNumber">
                    <el-input v-model="editForm.serialNumber" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="车牌号：" prop="">
                    <el-select v-model="editForm.carNo" placeholder="请选择" style="width: 300px" clearable>
                        <el-option v-for="item in options" :key="item.carNo" :label="item.carNo"
                                   :value="item.carNo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备标识码：" prop="deviceId">
                    <el-input v-model="editForm.deviceId" style="width: 300px" @change="change"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editOrAddDialog = false">取消</el-button><el-button type="primary" @click="editParams">确定</el-button></span>
        </el-dialog>
    </div>
</template>
<script>
  function getNumberOrElse(value, valueElse) {
    if (typeof value === 'number') {
      return value;
    }

    value = Number.parseFloat(value);

    return typeof value === 'number' ? value : valueElse;
  }

  export default {
    name: "padManage",
    components: {},

    computed: {
      // 弹窗标题
      title() {
        return this.isAdd ? "新增" : "编辑";
      },

      editCarNo() {
        return this.editForm.carNo;
      }
    },
    data() {
      let temperatureHigh = (rule, value, cb) => {
        if (36.0 <= Number(value) && Number(value) <= 42.0) return cb();
        cb(new Error("阈值范围(36.0 ~ 42.0 ℃)"));
      };
      return {
        driverTemperatureCheck: 1,
        passengerTemperatureCheck: 1,
        // temperatureHigh: "",
        // faceTimeout: "30",
        // qrcodeTimeout: "30",

        temForm: {
          temperatureHigh: ""
        },
        outTimeForm: {
          faceTimeout: "",
          qrcodeTimeout: ""
        },
        temFormRule: {
          temperatureHigh: [
            {
              required: true,
              message: "请输入体温阈值",
              trigger: "blur"
            },
            {
              pattern: /^[1-9]+\d*(\.\d{0,1})?$|^0?\.\d{0,1}$/,
              message: "至多保留一位小数(36.0 ~ 42.0 ℃)"
            },
            {
              validator: temperatureHigh,
              trigger: "blur"
            }
          ]
        },
        outTimeRule: {
          faceTimeout: [
            {
              required: true,
              message: "请输入超时时间",
              trigger: ["blur"]
            },
            {
              pattern: /(^[1-9]\d*$)/,
              message: "请输入正整数"
            }
          ],
          qrcodeTimeout: [
            {
              required: true,
              message: "请输入超时时间",
              trigger: "blur"
            },
            {
              pattern: /(^[1-9]\d*$)/,
              message: "请输入正整数"
            }
          ]
        },
        page: {
          page: 0,
          size: 20,
          /**
           * 2021-03-15
           * 应客户要求, 添加按车牌号升序排序配置
           */
          sort: {
            carNo: 'asc'
          }
        },
        serialNumber: "",
        deviceId: "",
        carNo: "",
        createDate: "",
        updateDate: "",
        delFlag: 0,
        delFlagOptions: [
          {
            value: 0,
            label: "否"
          },
          {
            value: 1,
            label: "是"
          }
        ],
        carNoId: [],
        options: [],
        select: null,
        //分页
        total: 0,
        currentPage: 1,
        pageSize: 20,
        tableData: [{code: 23}],
        // 渲染表格
        tableCOl: [
          {
            label: "License序列号",
            type: "",
            width: "160",
            prop: "serialNumber"
          },
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
            label: "创建日期",
            type: "",
            width: "160",
            prop: "createDate"
          },
          {
            label: "更新日期",
            type: "",
            width: "160",
            prop: "updateDate"
          },
          {
            label: "是否失效",
            type: "",
            width: "100",
            prop: "delFlag",
            formatter: this.delFlagFormatter
          },
          {
            label: "失败原因",
            type: "",
            width: "",
            prop: "reason"
          }
        ],
        // 新增状态
        isAdd: true,
        // 表单是否显示
        editOrAddDialog: false,
        // 修改的表单数据对象
        editForm: {
          serialNumber: "",
          carNo: "",
          deviceId: ""
        },

        // 表单校验
        formrule: {
          serialNumber: [
            {
              required: true,
              message: "请输入设备标识码",
              trigger: "blur"
            }
          ],
          deviceId: [
            {
              required: true,
              message: "请输入车牌号",
              trigger: "blur"
            }
          ]
        }
      };
    },

    watch: {
      editCarNo(val) {
        console.log(val, this.carNoId, "carNo");
        if (val) this.editForm.deviceId = this.carNoId.find(item => item.carNo == val).deviceId;
      }
    },

    methods: {
      async setConfig() {
        const {data: res} = await this.$http.post("/api/sys-config/find-all/by-key", [
          "driverTemperatureCheck",
          "passengerTemperatureCheck",
          "temperatureHigh",
          "faceTimeout",
          "qrcodeTimeout"
        ]);
        res.data.forEach(item => {
          switch (item.jian) {
            case "driverTemperatureCheck": {
              this.driverTemperatureCheck = getNumberOrElse(item.zhi, 1);
              break;
            }
            case "passengerTemperatureCheck": {
              this.passengerTemperatureCheck = getNumberOrElse(item.zhi, 1);
              break;
            }
            case "temperatureHigh": {
              this.temForm.temperatureHigh = getNumberOrElse(item.zhi, 38.3);
              break;
            }
            case "faceTimeout": {
              this.outTimeForm.faceTimeout = getNumberOrElse(item.zhi, 30);
              break;
            }
            case "qrcodeTimeout": {
              this.outTimeForm.qrcodeTimeout = getNumberOrElse(item.zhi, 30);
              break;
            }
          }
        });
      },
      async setOption() {
        const {data: res} = await this.$http.post("/api/device/listDevice", {});
        this.options = res.data.filter(item => item.carNo);
        this.carNoId = res.data.map(item => {
          return {
            deviceId: item.deviceId,
            carNo: item.carNo
          };
        });
        console.log(res, "option");
      },
      // 配置确认
      confirm() {
        const rule1 = new Promise((resolve, reject) => {
          this.$refs["temForm"].validate(valid => {
            if (valid) {
              resolve();
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        });
        const rule2 = new Promise((resolve, reject) => {
          this.$refs["outTimeForm"].validate(valid => {
            if (valid) {
              resolve();
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        });

        Promise.all([rule1, rule2]).then(async () => {
          const {data: res} = await this.$http.post("/api/sys-config/update-all", [
            {jian: "driverTemperatureCheck", name: "司机体温监测开关", zhi: this.driverTemperatureCheck},
            {jian: "passengerTemperatureCheck", name: "乘客体温监测开关", zhi: this.passengerTemperatureCheck},
            {jian: "temperatureHigh", name: "体温阈值", zhi: this.temForm.temperatureHigh},
            {jian: "faceTimeout", name: "人脸识别", zhi: this.outTimeForm.faceTimeout},
            {jian: "qrcodeTimeout", name: "二维码识别", zhi: this.outTimeForm.qrcodeTimeout}
          ]);
          console.log(res, "司机体温监测开关");
          if (res.code == 200) this.$message.success("设置配置成功！");
          else this.$message.error("设置配置失败！");
        });
      },
      // 请求表格数据
      async getParamsData() {
        let queryparmas = this.$refs.serialForm.value();
        console.log(this.$refs.serialForm.value());
        let parmas = {
          page: this.page,
          query: queryparmas
        };
        const {data: res} = await this.$http.post("/api/serial/listSerial", parmas);
        console.log(res, "getParamsData");
        this.tableData = _.get(res, "data.content", []);
        this.total = res.data.totalElements;
      },
      delFlagFormatter(row, column, cellValue, index) {
        if (cellValue == 0) {
          return "否";
        } else if (cellValue == 1) {
          return "是";
        }
      },
      //搜索按钮
      search() {
        this.page.page = 0;
        this.currentPage = 1;
        this.getParamsData();
      },
      //重置按钮
      reset() {
        this.serialNumber = "";
        this.deviceId = "";
        this.carNo = "";
        this.createDate = "";
        this.updateDate = "";
        this.delFlag = "";
      },
      deviceIdChange(val) {
        this.carNo = "";
      },
      carNoChange(val) {
        this.deviceId = "";
      },
      change(val) {
        this.carNo = "";
      },

      // 编辑按钮
      edits(row) {
        this.isAdd = false;
        this.editForm = _.cloneDeep(row);
        this.editOrAddDialog = true;
      },
      // 弹窗确定按钮事件
      editParams() {
        this.$refs.formRef.validate(async valid => {
          if (!valid) return;
          let parmas;
          if (this.isAdd) {
            parmas = {
              serialNumber: this.editForm.serialNumber,
              carNo: this.editForm.carNo,
              deviceId: this.editForm.deviceId
            };
          } else {
            parmas = this.editForm;
          }
          const {data: res} = await this.$http.post("/api/serial/update", parmas);
          if (_.get(res, "code", null) == 200) {
            this.$message.success("修改参数成功！");
            this.getParamsData();
          } else if (_.get(res, "code", null) == 10001) {
            this.$message.error(_.get(res, "message", "修改参数失败！"));
          } else this.$message.error("修改参数失败！");
          this.editOrAddDialog = false;
          this.editOrAddDialog = false;
        });
      },

      dialogClose() {
        this.editForm = {
          serialNumber: "",
          carNo: "",
          deviceId: ""
        };
        this.$refs.formRef.resetFields();
      },
      deletes(row) {
        this.$confirm("确认删除相关所有数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.delete("/api/serial/delete-by-id?id=" + row.id).then(res => {
            console.log(res, "sadasdas");
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

      handleSizeChange(val) {
        console.log(val, "handleSizeChange");
        this.page.page = 0;
        this.currentPage = 1;
        this.page.size = val;
        this.getParamsData();
      },

      handleCurrentChange(val) {
        console.log(val, "handleCurrentChange");
        this.page.page = val - 1;
        this.getParamsData();
      },

      // 新增
      newData() {
        this.isAdd = true;
        // this.editForm = null;
        this.editOrAddDialog = true;
      }
    },
    mounted() {
      this.setConfig();
      this.setOption();
      this.getParamsData();
    }
  };
</script>
<style lang="scss" scoped>
    .page {
        width: 100%;
        height: calc(100% - 53px);

        .divbord {
            position: relative;
            height: 100px;
            border: 1px solid #aaedb7;
            border-radius: 5px;

            ::v-deep .el-form-item__label {
                font-size: 16px;
                color: #000;
            }

            .indiv {
                position: absolute;
                width: 130px;
                height: 25px;
                background-color: #fff;
                top: -12px;
                left: 15px;
                text-align: center;
                font-size: 18px;
                color: #3ac158;
                font-weight: 700;
            }

            .switch {
                line-height: 90px;
            }
        }

        .config {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            height: 182px;
            padding-top: 20px;
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

            .posbut {
                position: absolute;
                right: 30px;
                bottom: 20px;
            }
        }

        .search {
            display: flex;
            flex-wrap: wrap;
            height: 108px;
            padding-top: 20px;
            margin: 20px 30px 20px 20px;
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

        ::v-deep .el-button:focus,
        .el-button:hover {
            color: #fff;
            background-color: #3ac158;
        }

        .table {
            height: calc(100% - 405px);
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
    }
</style>