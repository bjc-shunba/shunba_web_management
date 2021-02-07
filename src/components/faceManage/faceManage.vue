<template>
    <div class="page">
        <query-form ref="form" class="search">
            <query-item label="用户ID：" query-type="like" prop="memberId" class="input">
                <el-input v-model="memberId" style="width: 180px"></el-input>
            </query-item>
            <query-item label="用户姓名：" query-type="like" prop="name" class="input">
                <el-input v-model="name" style="width: 180px"></el-input>
            </query-item>
            <query-item label="用户类别：" query-type="equals" prop="memberType" class="input">
                <el-select v-model="memberType" placeholder="请选择" style="width: 100px" clearable>
                    <el-option :key="1" label="乘客" :value="1"></el-option>
                    <el-option :key="2" label="司机" :value="2"></el-option>
                </el-select>
            </query-item>
            <query-item label="手机号码：" query-type="like" prop="phone" class="input">
                <el-input v-model="phone" style="width: 180px"></el-input>
            </query-item>

            <query-item label="更新时间：" query-type="greaterOrEqualsThan" prop="updateDate" class="input">
                <el-date-picker v-model="updateDate" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期"
                                style="width: 180px"></el-date-picker>
            </query-item>
            <query-item label="是否有照片：" query-type="equals" prop="hasImage" class="input">
                <el-select v-model="hasImage" placeholder="请选择" style="width: 100px" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </query-item>
            <el-button class="btn" @click="search">搜索</el-button>
            <el-button class="btn" @click="reset">重置</el-button>
        </query-form>

        <div class="table">
            <el-container class="h100">
                <el-header class="table-head" style="padding-top: 20px"><span class="fw fs18">人脸库数据详情</span></el-header>
                <el-main class="h100">
                    <el-table :data="tableData" border style="width: 100%" height="calc(100% - 80px)" stripe>
                        <el-table-column
                                v-for="(item, i) in tableCOl"
                                :key="`${i}_${item.prop}`"
                                :label="item.label"
                                :type="item.type"
                                align="center"
                                show-overflow-tooltip
                                :formatter="item.formatter"
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
                            :total="total"></el-pagination>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
  export default {
    name: "queryFilghtRoute",
    components: {},
    data() {
      return {
        memberId: "",
        memberType: null,
        phone: "",
        name: "",
        updateDate: "",

        page: {
          page: 0,
          size: 50
        },

        options: [
          {
            value: 1,
            label: "是"
          },
          {
            value: 0,
            label: "否"
          }
        ],
        hasImage: null,
        //分页
        total: 0,
        currentPage: 1,
        pageSize: 50,
        tableData: [],
        // 渲染表格
        tableCOl: [
          {
            label: "序号",
            type: "index",
            width: "60",
            prop: ""
          },
          {
            label: "用户ID",
            type: "",
            width: "",
            prop: "memberId"
          },
          {
            label: "用户姓名",
            type: "",
            width: "",
            prop: "name"
          },
          {
            label: "用户类别",
            type: "",
            width: "",
            prop: "memberType",
            formatter: this.typeFormatter
          },
          {
            label: "手机号码",
            type: "",
            width: "",
            prop: "phone"
          },
          {
            label: "更新时间",
            type: "",
            width: "",
            prop: "updateDate"
          },
          {
            label: "是否有照片",
            type: "",
            width: "",
            prop: "hasImage",
            formatter: this.hasImageFormatter
          }
        ]
      };
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
        const {data: res} = await this.$http.post("/api/member/listMember", parmas);
        this.tableData = _.get(res, "data.content", []);
        this.total = res.data.totalElements;
      },

      typeFormatter(row, column, cellValue, index) {
        if (cellValue == 2) {
          return "司机";
        } else {
          return "乘客";
        }
      },
      hasImageFormatter(row, column, cellValue, index) {
        if (cellValue == 0) return "否";
        else return "有";
      },
      //重置按钮
      reset() {
        this.memberId = "";
        this.memberType = "";
        this.phone = "";
        this.name = "";
        this.updateDate = "";
        this.hasImage = null;
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
