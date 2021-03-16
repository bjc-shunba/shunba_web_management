<template>
    <div class="page">
        <query-form ref="form" class="search" label-width="6em">
            <query-item label="线路：" query-type="startWith" prop="lineId" class="input">
                <el-input v-model="lineId" style="width: 180px"></el-input>
            </query-item>
            <query-item label="班次编号：" query-type="startWith" prop="shiftNo" class="input">
                <el-input v-model="shiftNo" style="width: 180px"></el-input>
            </query-item>
            <query-item label="时刻表开始：" query-type="equals" prop="startTimeDate" class="input">
                <time-range-picker v-model="startTime"></time-range-picker>
            </query-item>
            <query-item label="时刻表结束：" query-type="equals" prop="endTimeDate" class="input">
                <time-range-picker v-model="endTime"></time-range-picker>
            </query-item>
            <query-item label="车牌号：" query-type="like" prop="carNo" class="input">
                <el-input v-model="carNo" style="width: 180px"></el-input>
            </query-item>
            <query-item label="司机ID：" query-type="like" prop="driverId" class="input">
                <el-input v-model="driverId" style="width: 180px"></el-input>
            </query-item>
            <query-item label="司机姓名：" query-type="like" prop="driverName" class="input">
                <el-input v-model="driverName" style="width: 180px"></el-input>
            </query-item>
            <query-item label="司机手机：" query-type="like" prop="driverPhone" class="input">
                <el-input v-model="driverPhone" style="width: 180px"></el-input>
            </query-item>
            <el-button class="btn" @click="search">搜索</el-button>
            <el-button class="btn" @click="reset">重置</el-button>
        </query-form>

        <div class="table">
            <el-container class="h100">
                <el-header class="table-head" style="padding-top: 20px"><span class="fw fs18">线路班次详情</span></el-header>
                <el-main class="h100">
                    <el-table :data="tableData" border style="width: 100%" height="calc(100% - 80px)" stripe>
                        <el-table-column
                                v-for="(item, i) in tableCOl"
                                :key="`${i}_${item.prop}`"
                                :label="item.label"
                                :type="item.type"
                                align="center"
                                show-overflow-tooltip
                                :prop="item.prop"
                                :width="item.width">
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
                            :total="total">
                    </el-pagination>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
  import TimeRangePicker from './TimeRangePicker';

  export default {
    name: "queryFilghtRoute",
    components: {TimeRangePicker},
    data() {
      return {
        startTime: null,
        endTime: null,
        lineId: "",
        shiftNo: "",
        carNo: "",
        driverId: "",
        driverName: "",
        driverPhone: "",

        page: {
          page: 0,
          size: 50,
          /**
           * 2021-03-15
           * 应客户要求, 添加按 时刻开始时间降序以及线路id升序排序(字母顺序)配置
           */
          sort: {
            startTimeDate: 'desc',
            lineId: "asc"
          }
        },

        // 渲染表格
        tableCOl: [
          {
            label: "序号",
            type: "index",
            width: "",
            prop: ""
          },
          {
            label: "线路",
            type: "",
            width: "",
            prop: "lineId"
          },
          {
            label: "班次编号",
            type: "",
            width: "",
            prop: "shiftNo"
          },
          {
            label: "时刻表开始",
            type: "",
            width: "",
            prop: "startTime"
          },
          {
            label: "时刻表结束",
            type: "",
            width: "",
            prop: "endTime"
          },
          {
            label: "车牌号",
            type: "",
            width: "",
            prop: "carNo"
          },
          {
            label: "司机ID",
            type: "",
            width: "",
            prop: "driverId"
          },
          {
            label: "司机姓名",
            type: "",
            width: "",
            prop: "driverName"
          },
          {
            label: "司机手机",
            type: "",
            width: "",
            prop: "driverPhone"
          }
        ],
        //分页
        total: 0,
        currentPage: 1,
        pageSize: 50,
        tableData: []
      };
    },
    computed: {
      selectStart() {
        if (!this.endTime) return;
        return `00:00:00 - ` + this.$moment(this.endTime).format(`HH:mm:00`);
      },
      selectEnd() {
        if (!this.startTime) return;
        return this.$moment(this.startTime).format(`HH:mm:00`) + ` - 23:59:59`;
      }
    },
    watch: {},
    methods: {
      //搜索按钮
      search() {
        this.page.page = 0;
        this.currentPage = 1;
        this.getParamsData();
        // this.$moment(this.startTime).valueOf();
        // this.$moment(this.endTime).valueOf();
      },
      // 请求表格数据
      async getParamsData() {
        let queryparmas = this.$refs.form.value();
        console.log(this.$refs.form.value());
        let parmas = {
          page: this.page,
          query: queryparmas
        };
        const {data: res} = await this.$http.post("/api/shift/customer-search", parmas);
        this.tableData = _.get(res, "data.content", []);
        this.total = res.data.totalElements;
      },
      //重置按钮
      reset() {
        this.startTime = null;
        this.endTime = null;
        this.lineId = "";
        this.shiftNo = "";
        this.carNo = "";
        this.driverId = "";
        this.driverName = "";
        this.driverPhone = "";
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
            height: calc(100% - 198px);
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
                height: calc(100% - 30px);
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
