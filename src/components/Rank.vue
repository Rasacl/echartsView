<!-- 各省疫情状况 -->
<template>
  <div class='com-container'>
    <div class='com-chart' ref='rank_ref'></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0, // 区域缩放的起点值
      endValue: 3, // 区域缩放的终点值
      timerId: null ,// 定时器的标识
      //省份名称
      provincesList:[],
      //现存确诊
      currentConfirmedCount:{
        name:'现存确诊',
        data:[],
        color:['rgba(11,168,44,1)']
      },
      //累计确诊
      confirmedCount:{
        name:'累计确诊',
        data:[],
        color:['rgba(46,114,191,1)']
      },
      //死亡
      deadCount:{
        name:'死亡',
        data:[],
        color:['rgba(80,82,238,1)']
      },
      //治愈
      curedCount:{
        name:'治愈',
        data:[],
        color:['rgba(255,255,0,1)','rgba(	0,255,0,0)']
      },
      allList:[],
      xAxisData:['现存确诊','累计确诊','死亡','治愈']
    }
  },
  created () {

  },
  mounted () {
    this.initChart()
    this.getData()

    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)

  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      const initOption = {
        title: {
          text: '▎ 各省疫情情况',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
         legend: {
        //图例组件，颜色和名字
        right: '10%',
        top: '25%',
        itemGap: 16,
        itemWidth: 18,
        itemHeight: 10,
        selectedMode: false,
        data: this.xAxisData,
        textStyle: {
            color: '#08f1f8',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12,
        },
    },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.post('/provincesList')
      this.allData = ret


      this.allData.map((item) => {
        this.provincesList.push(item.provinceShortName)
        this.currentConfirmedCount.data.push(item.currentConfirmedCount)
        this.confirmedCount.data.push(item.confirmedCount)
        this.deadCount.data.push(item.deadCount)
        this.curedCount.data.push(item.curedCount)
      })
      this.allList.push(this.currentConfirmedCount)
      this.allList.push(this.confirmedCount)
      this.allList.push(this.deadCount)
      this.allList.push(this.curedCount)
      this.updateChart()
      this.startInterval()
    },
    getSeries(){
      return this.allList.map(item => {
        return {
            name: item.name,
            type: 'bar',
            data: item.data,
            barWidth: 10,
            barGap: 0, //柱间距离
            itemStyle: {
                normal: {
                    show: true,
                    color: item.color[0],
                    opacity: 0.8,
                    borderRadius: [5, 5, 0, 0],
                },
            },
        }
    })
    },
    updateChart () {
      const dataOption = {
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        xAxis: [
        {
            // 	boundaryGap: true,//坐标轴两边留白
            data: this.provincesList,
            axisLabel: {
                //坐标轴刻度标签的相关设置。
                //		interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
                //	margin:15,
                textStyle: {
                    color: '#9AAFC2',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 14,
                },
                rotate: 0,
            },
            axisTick: {
                //坐标轴刻度相关设置。
                show: false,
            },
            axisLine: {
                //坐标轴轴线相关设置
                lineStyle: {
                    color: '#506B98',
                },
            },
        },
    ],
    yAxis: [
        {
            nameTextStyle: {
                color: "#9AAFC2",
                lineHeight: 20,
                padding: [0, 0, 10, 0],
            },
            splitNumber: 5,
            axisLabel: {
                textStyle: {
                    color: '#9AAFC2',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 14,
                },
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#506B98',
                },
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ['#fff'],
                    opacity: 0.06,
                },
            },
        },
    ],
        series: this.getSeries()
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        // series: [
        //   {
        //     barWidth: titleFontSize,
        //     itemStyle: {
        //       barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
        //     }
        //   }
        // ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
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
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style lang='less' scoped>
col{
  color:red
}
</style>
