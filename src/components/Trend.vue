<!-- 全球疫情 -->
<template>
     <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
</div>

</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  data () {
    return {
      chartInstane: null,
      allData: null, // 从服务器中获取的所有数据
      titleFontSize: 0,// 指明标题的字体大小
      echartsData:[]
    }
  },
  created () {

  },
  mounted () {
    this.getData()
    this.initChart()


    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)

  },
  computed: {
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    },
    ...mapState(['theme'])
  },
  methods: {
    initChart () {
      this.chartInstane = this.$echarts.init(this.$refs.trend_ref, this.theme)
      const initOption = {
        title: {
          text: '▎ 全球疫情数据',
          left: 20,
          top: 20
        },
  tooltip: {
    trigger: 'item'
  },

  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
    }
  ]
      }
      this.chartInstane.setOption(initOption)
    },
    // ret 就是服务端发送给客户端的图表的数据
    async getData () {
      // await this.$http.get()
      // 对allData进行赋值
      const { data: ret } = await this.$http.post('/serviceList')
      this.allData = ret[0].globalStatistics
      for(let key in this.allData){
        if(key == 'currentConfirmedCount'){
          this.echartsData.push({name:'现存确诊',value:this.allData[key]})
        }else if(key == 'confirmedCount'){
          this.echartsData.push({name:'累计确诊',value:this.allData[key]})
        }else if(key == 'deadCount'){
          this.echartsData.push({name:'累计死亡',value:this.allData[key]})
        }else if(key == 'curedCount'){
          this.echartsData.push({name:'累计治愈',value:this.allData[key]})
        }
      }
      this.updateChart()
    },
    updateChart () {
      // const seriesArr = valueArr.map((item, index) => {
      //   return {
      //     name: item.name,
      //     type: 'line',
      //     data: item.data,
      //     stack: this.choiceType,
      //     areaStyle: {
      //       color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //         {
      //           offset: 0,
      //           color: colorArr1[index]
      //         }, // %0的颜色值
      //         {
      //           offset: 1,
      //           color: colorArr2[index]
      //         } // 100%的颜色值
      //       ])
      //     }
      //   }
      // })
      // // 图例的数据
      // const legendArr = valueArr.map(item => {
      //   return item.name
      // })
      const dataOption = {
        series: [
          {
            data:this.echartsData
          }
        ]
      }
      this.chartInstane.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {

      }
      this.chartInstane.setOption(adapterOption)
      this.chartInstane.resize()
    },
    handleSelect (currentType) {
      this.updateChart()
    }
  },
  watch: {
    theme () {
      console.log('主题切换了')
      this.chartInstane.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con {
    background-color: #222733;
  }
}
</style>
