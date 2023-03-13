<!--国内地图分布-->
<template>
  <div class='com-container' @dblclick="revertMap">
    <div class='com-chart' ref='map_ref'></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      mapData: {}, // 所获取的省份的地图矢量数据
      dataList : [
  {
    name: "北京",
    value: 54,
  },
  {
    name: "天津",
    value: 13,
  },
  {
    name: "上海",
    value: 40,
  },
  {
    name: "重庆",
    value: 75,
  },
  {
    name: "河北",
    value: 13,
  },
  {
    name: "河南",
    value: 83,
  },
  {
    name: "云南",
    value: 11,
  },
  {
    name: "辽宁",
    value: 19,
  },
  {
    name: "黑龙江",
    value: 15,
  },
  {
    name: "湖南",
    value: 69,
  },
  {
    name: "安徽",
    value: 60,
  },
  {
    name: "山东",
    value: 39,
  },
  {
    name: "新疆",
    value: 4,
  },
  {
    name: "江苏",
    value: 31,
  },
  {
    name: "浙江",
    value: 104,
  },
  {
    name: "江西",
    value: 36,
  },
  {
    name: "湖北",
    value: 1052,
  },
  {
    name: "广西",
    value: 33,
  },
  {
    name: "甘肃",
    value: 7,
  },
  {
    name: "山西",
    value: 9,
  },
  {
    name: "内蒙古",
    value: 7,
  },
  {
    name: "陕西",
    value: 22,
  },
  {
    name: "吉林",
    value: 4,
  },
  {
    name: "福建",
    value: 18,
  },
  {
    name: "贵州",
    value: 5,
  },
  {
    name: "广东",
    value: 98,
  },
  {
    name: "青海",
    value: 1,
  },
  {
    name: "西藏",
    value: 0,
  },
  {
    name: "四川",
    value: 44,
  },
  {
    name: "宁夏",
    value: 4,
  },
  {
    name: "海南",
    value: 22,
  },
  {
    name: "台湾",
    value: 3,
  },
  {
    name: "香港",
    value: 5,
  },
  {
    name: "澳门",
    value: 5,
  },
]
    }
  },
  created () {
    // 在组件创建完成之后 进行回调函数的注册
    // this.$socket.registerCallBack('nationalList', this.getData)
  },
  mounted () {
    this.initChart()
    this.getData()

    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // this.$socket.unRegisterCallBack('nationalList')
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      // 获取中国地图的矢量数据
      // http://localhost:8999/static/map/china.json
      // 由于我们现在获取的地图矢量数据并不是位于KOA2的后台, 所以咱们不能使用this.$http
      const ret = await axios.get('http://localhost:8080/static/map/china.json')
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▎ 疫情分布',
          left: 20,
          top: 20
        },
        // geo: {
        //   type: 'map',
        //   map: 'china',
        //   top: '5%',
        //   bottom: '5%',
        //   itemStyle: {
        //     areaColor: '#2E72BF',
        //     borderColor: '#333'
        //   }
        // },
        // legend: {
        //   left: '5%',
        //   bottom: '5%',
        //   orient: 'vertical'
        // }
        tooltip: {
    triggerOn: "click",
    formatter: function (e, t, n) {
      return 0.5 == e.value
        ? e.name + "：有疑似病例"
        : '现存确诊' + "<br />" + e.name + "：" + e.value;
    },
  },
  visualMap: {
    min: 0,
    max: 1000,
    left: 26,
    bottom: 0,
    showLabel: !0,
    text: ["高", "低"],
    pieces: [
      {
        gt: 100,
        label: "> 1000 人",
        color: "#7f1100",
      },
      {
        gte: 10,
        lte: 100,
        label: "100 - 999 人",
        color: "#ff5428",
      },
      {
        gte: 1,
        lt: 10,
        label: "1 - 99 人",
        color: "#ff8c71",
      },
      {
        value: 0,
        color: "#ffffff",
      },
    ],
    show: !0,
  },
  geo: {
    map: "china",
    roam: !1,
    scaleLimit: {
      min: 1,
      max: 2,
    },
    zoom: 1,
    top: '5%',
    bottom: '5%',
    label: {
      normal: {
        show: !0,
        fontSize: "14",
        color: "rgba(0,0,0,0.7)",
      },
    },
    itemStyle: {
      normal: {
        //shadowBlur: 50,
        //shadowColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: "rgba(0, 0, 0, 0.2)",
      },
      emphasis: {
        areaColor: "#f2d5ad",
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        borderWidth: 0,
      },
    },
  },
      }
      this.chartInstance.setOption(initOption)

    },
     async getData () {
       setInterval(async () => {
         // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const ret = await this.$http.post('/provincesList')
      this.allData = ret.data
      for(let i = 0; i < this.dataList.length; i++){
        for(let s = 0; s < this.allData.length; s++){
          if(this.allData[s].provinceShortName == this.dataList[i].name){
            this.dataList[i].value = this.allData[s].currentConfirmedCount
            break
          }
        }
      }
      this.updateChart()
       }, 5000);

    },
    updateChart () {
      const dataOption = {
        series: [{
      // name: "确诊病例",
      type: "map",
      geoIndex: 0,
      data: [...this.dataList],
    },
  ],
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 回到中国地图
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      console.log('主题切换了')
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.getData()
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style lang='less' scoped>
</style>
