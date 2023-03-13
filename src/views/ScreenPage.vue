<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="" />
      </div>
      <span class="logo" @click="openLoop">
        <!-- <img :src="logoSrc" alt="" /> -->
        国内风险地区查询
      </span>
      <span class="title">新冠疫情实时监控系统</span>
      <div class="title-right">
        <!-- <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme"> -->
        <span class="datetime">{{ nowTime ? nowTime : "-" }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div
          id="left-top"
          :class="[fullScreenStatus.trend ? 'fullscreen' : '']"
        >
          <!-- 全球疫情 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('trend')"
              :class="[
                'iconfont',
                fullScreenStatus.trend
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.seller ? 'fullscreen' : '']"
        >
          <!-- ▎疫情小贴士 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('seller')"
              :class="[
                'iconfont',
                fullScreenStatus.seller
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.map ? 'fullscreen' : '']"
        >
          <!--国内地图分布-->
          <Map ref="map"></Map>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('map')"
              :class="[
                'iconfont',
                fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.rank ? 'fullscreen' : '']"
        >
          <!-- 各省疫情状况 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('rank')"
              :class="[
                'iconfont',
                fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
         <!-- 国内及全球疫情数据 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('hot')"
              :class="[
                'iconfont',
                fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.stock ? 'fullscreen' : '']"
        >
          <!-- 实时新闻 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('stock')"
              :class="[
                'iconfont',
                fullScreenStatus.stock
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
    </div>
    <div id="loop" v-if="isShowLoop">
      <div id="interLoop">
        <span id="closeLoop" @click="closeLoop">关闭</span>
        <input type="text" v-model="provincesName" id="provincesName" />
        <button id="searn" @click="search">搜索</button>
        <ul id="list" v-if="searchProvince" ref="content">
          <li
            id="listItem"
            v-for="(item, index) in searchProvince"
            :key="index"
          >
            <span
              >{{ item.dangerLevel == 1 ? "高风险地区" : "中风险区" }}
            </span>
            <span>{{ item.cityName }}：</span>
            <span>{{ item.areaName }}</span>
          </li>
        </ul>
        <div id="noDre" v-else>暂无中高风险地区～</div>
      </div>
    </div>
  </div>
</template>

<script>
import Hot from "@/components/Hot.vue";
import Map from "@/components/Map.vue";
import Rank from "@/components/Rank.vue";
import Seller from "@/components/Seller.vue";
import Stock from "@/components/Stock.vue";
import Trend from "@/components/Trend.vue";
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  created() {
    // 注册接收到数据的回调函数
    this.$socket.registerCallBack("fullScreen", this.recvData);
    this.$socket.registerCallBack("themeChange", this.recvThemeChange);
  },
  mounted() {
    this.getTime();
  },
  destroyed() {
    this.$socket.unRegisterCallBack("fullScreen");
    this.$socket.unRegisterCallBack("themeChange");
  },
  data() {
    return {
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false,
      },
      nowTime: "",
      provincesName: "",
      allData: null,
      searchProvince: null,
      isShowLoop:false
    };
  },
  methods: {
    changeSize(chartName) {
      // 将数据发送给服务端
      const targetValue = !this.fullScreenStatus[chartName];
      this.$socket.send({
        action: "fullScreen",
        socketType: "fullScreen",
        chartName: chartName,
        value: targetValue,
      });
    },
    // 接收到全屏数据之后的处理
    recvData(data) {
      // 取出是哪一个图表需要进行切换
      const chartName = data.chartName;
      // 取出, 切换成什么状态
      const targetValue = data.value;
      this.fullScreenStatus[chartName] = targetValue;
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter();
      });
    },
    handleChangeTheme() {
      // 修改VueX中数据
      // this.$store.commit('changeTheme')
      this.$socket.send({
        action: "themeChange",
        socketType: "themeChange",
        chartName: "",
        value: "",
      });
    },
    recvThemeChange() {
      this.$store.commit("changeTheme");
    },
    getTime() {
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      let newMonth = month < 10 ? "0" + month : month;
      let newDay = day < 10 ? "0" + day : day;
      this.nowTime = year + "-" + newMonth + "-" + newDay;
    },
    async getData() {
      // 获取服务器的数据, 对this.allData进行赋值之后,
      const { data: ret } = await this.$http.post("/provincesList");
      this.allData = ret;
    },
    search() {
      this.searchProvince = null
      for (let i = 0; i < this.allData.length; i++) {
        if (
          this.provincesName == this.allData[i].provinceName ||
          this.provincesName == this.allData[i].provinceShortName
        ) {
          if (this.allData[i].dangerAreas.length) {
            this.searchProvince = this.allData[i].dangerAreas;
          }
        }
      }
    },
    openLoop(){
      this.getData();
      this.isShowLoop = true
    },
    closeLoop(){
      this.isShowLoop = false
      this.provincesName = ''
      this.searchProvince = null
      }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend,
  },
  computed: {
    logoSrc() {
      return "/static/img/" + getThemeValue(this.theme).logoSrc;
    },
    headerSrc() {
      return "/static/img/" + getThemeValue(this.theme).headerBorderSrc;
    },
    themeSrc() {
      return "/static/img/" + getThemeValue(this.theme).themeSrc;
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor,
      };
    },

    ...mapState(["theme"]),
  },
};
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
  position: relative;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 20px;
    margin-right: 15px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    font-size: 14px;
    cursor: pointer;
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 50%;
      position: relative;
    }
    #right-bottom {
      height: 34%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
#loop {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
#interLoop {
  width: 50%;
  height: 70%;
  background-color: #161522;
  padding: 15px;
  position: relative;
  #closeLoop{
    position: absolute;
    top: 10px;
    right: 12px;
    cursor: pointer;
  }
  #provincesName {
    width: 60%;
    height: 30px;
    margin: 10px 15px 5px 0;
    outline: none;
  }
  #searn {
    width: 20%;
    height: 35px;
    outline: none;
    background-color: rgb(9, 181, 233);
    border-radius: 7px;
    cursor: pointer;
  }
  #list{
    height: 90%;
    overflow-y:auto ;
  #listItem{
    list-style: none;
    font-size: 14px;
    margin-top: 3px;
  }
  }
  #noDre{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
