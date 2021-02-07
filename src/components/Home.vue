<template>
    <div class="pagehome">
        <header class="header">
            <div class="title">
                <span class="User">{{ userName }}</span>
                <span @click="lagout" class="out">退出</span>
            </div>
        </header>
        <div class="main">
             
            <el-tabs v-model="tabName" tab-position="left" style="height: 100%;  width: 100%">
                <el-tab-pane v-for="item in menu" :key="`device_comp_${item.component}`" :label="item.name"
                             :name="item.component" style="height: 100%">
                    <span slot="label" class="common" :class="item.class">{{ item.name }}</span>
                    <keep-alive :exclude="['padManage']">
                        <component :is="item.component" v-if="tabName === item.component"></component>
                    </keep-alive>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
  import vehicleManage from "./vehicleManage/vehicleManage";
  import padManage from "./padManage/padManage";
  import queryFlightRoute from "./queryFlightRoute/queryFlightRoute";
  import faceManage from "./faceManage/faceManage";
  import configWorkSet from "./configWorkSet/configWorkSet";

  /**
   * 密码检测, 在app使用期间检查密码状态
   * @type {{vm: null, _check(): void, startCheck(*): void, timeout: null, stopCheck(): void}}
   */
  const checkLoginState = {
    vm: null,
    timeout: null,
    _check() {
      this.timeout = setTimeout(() => {
        if (!window.sessionStorage.getItem("token")) {
          this.vm.$alert('当前登录已失效, 请重新登录!', '登录失效', {
            confirmButtonText: '确定',
            callback: action => {
              this.vm.$router.push({path: "/"});
            }
          });
        } else {
          this._check();
        }
      }, 3000);
    },
    startCheck(vm) {
      this.vm = vm;
      this._check();
    },
    stopCheck() {
      this.timeout && clearTimeout(this.timeout);
      this.vm = null;
    }
  };

  export default {
    name: "Home",
    components: {vehicleManage, padManage, queryFlightRoute, faceManage, configWorkSet},
    data() {
      return {
        userName: "",
        tabName: "vehicleManage",
        menu: [
          {
            name: "车载PAD管理",
            component: "vehicleManage",
            class: "car"
          },
          {
            name: "PAD版本管理",
            component: "padManage",
            class: "pad"
          },
          {
            name: "线路班次查看",
            component: "queryFlightRoute",
            class: "route"
          },
          {
            name: "人脸库管理",
            component: "faceManage",
            class: "face"
          },
          {
            name: "运行参数配置",
            component: "configWorkSet",
            class: "config"
          }
        ]
      };
    },
    computed: {
      // userInfo() {
      //   return this.$store.state.userInfo;
      // }
    },
    watch: {},
    methods: {
      handleClick(tab) {
        console.log(tab.label, "tab");
      },
      lagout() {
        // $.ajax(`/xxxx`, {
        //   type: "POST"
        // }).then(res => {
        //   if (res.code == 0) {
        window.sessionStorage.clear();
        this.$router.push({path: "/"});
        //   }
        // });
      }
    },
    created() {
      // let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      // this.userName = userInfo.userName;
      checkLoginState.startCheck(this);
    },
    beforeDestroy() {
      checkLoginState.stopCheck();
    }
  };
</script>

<style lang="scss" scoped>
    .pagehome {
        position: relative;
        width: 100%;
        height: 100%;
        min-width: 1400px;
        background-color: #eaeaea;
        // background-repeat: no-repeat;
        // background-size: 100% 100%;
        .header {
            width: 100%;
            background-color: #373737;
            background-image: url("../assets/image/header.png");
            background-repeat: no-repeat;
            background-position: center left 22px;
            height: 53px;
            font-size: 18px;
            color: #8e8e8e;
            line-height: 53px;

            .title {
                float: right;
                padding-right: 30px;
            }

            .User {
                padding-left: 40px;
                display: inline-block;
                background-image: url("./login/assets/userName.png");
                background-repeat: no-repeat;
                background-position: center left;
                margin-right: 30px;
            }

            .out {
                cursor: pointer;
            }
        }

        .main {
            height: calc(100% - 53px);
            width: 100%;
            position: absolute;
            top: 53px;
        }

        ::v-deep .el-tabs__item {
            font-size: 18px;
            text-align: left;
            line-height: 50px;
            width: 257px;
            height: 50px;
        }

        ::v-deep .el-tabs__content {
            height: 100%;
        }

        ::v-deep .el-tabs__nav-scroll {
            background-color: #fff;
        }

        ::v-deep .el-tabs__active-bar {
            background-color: #3ac259;
            width: 3px;
        }

        ::v-deep .el-tabs__item.is-active {
            color: #000;
            font-weight: 700;
            font-size: 18px;
            background-color: #e4ffea;
        }

        .common {
            background-repeat: no-repeat;
            height: 22px;
            padding-left: 58px;
            background-position: 23px center;
        }

        .car {
            background-image: url("../assets/image/car.png");
        }

        .pad {
            background-image: url("../assets/image/pad.png");
        }

        .route {
            background-image: url("../assets/image/route.png");
        }

        .face {
            background-image: url("../assets/image/face.png");
        }

        .config {
            background-image: url("../assets/image/config.png");
        }
    }
</style>
