<!-- ▎疫情小贴士 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
    <div class="tiplist">
      <div
        class="tipItem"
        v-for="(item, index) in allData"
        :key="index"
        :style="comStyle"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: [], // 服务器返回的数据
    };
  },
  created() {},
  mounted() {
    this.initChart();
    this.getData();

    window.addEventListener("resize", this.screenAdapter);
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter();
  },
  destroyed() {
    // 在组件销毁的时候, 需要将监听器取消掉
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.seller_ref,
        this.theme
      );
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: "▎疫情小贴士",
          left: 20,
          top: 20,
        },
      };
      this.chartInstance.setOption(initOption);
    },
    // 获取服务器的数据
    async getData() {
      // http://127.0.0.1:8888/api/seller
      const { data: ret } = await this.$http.post("/serviceList");
      this.allData.push(ret[0].remark3);
      this.allData.push(ret[0].remark1);
      this.allData.push(ret[0].remark2);
      this.allData.push(ret[0].note1);
      this.allData.push(ret[0].note2);
      this.allData.push(ret[0].note3);
    },

    // 当浏览器的大小发生变化的时候, 会调用的方法, 来完成屏幕的适配
    screenAdapter() {
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      // 和分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize();
    },
  },
  computed: {
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).titleColor,
      };
    },
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      console.log("主题切换了");
      this.chartInstance.dispose(); // 销毁当前的图表
      this.initChart(); // 重新以最新的主题名称初始化图表对象
      this.screenAdapter(); // 完成屏幕的适配
    },
  },
};
</script>

<style lang="less" scoped>
.com-container {
  position: relative;
}
.tiplist {
  width: 100%;
  height: 100%;
  margin-top: 12%;
  padding: 0 6% 2%;
  position: absolute;
  overflow-y: scroll;
  top: 0;
  left: 0;
  box-sizing: border-box;
}
.tiplist::-webkit-scrollbar{
  width: 10px;
}
.tiplist::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.tiplist::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
  border-radius: 0;
  background: rgba(0, 0, 0, 0);
}
.tipItem {
  margin-top: 3%;
  width: 100%;
  font-size: 12px;
}
</style>
