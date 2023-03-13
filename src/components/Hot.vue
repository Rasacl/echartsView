<!-- 国内及全球疫情数据 -->
<template>
  <div class='com-container'>
    <div class='com-chart' ref='hot_ref'></div>
    <div id="date">
      <div class="nationTitle" :style="comStyle">国内数据</div>
      <div class="national">
        <div class="current">
          <div class="currentYerterday">较昨日<span class="yerterdayCouent textcolor">+{{allData ? allData.currentConfirmedIncr : '-'}}</span></div>
          <div class="currentComfir textcolor">{{allData ? allData.currentConfirmedCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">现存确诊</div>
        </div>
        <div class="current">
          <div class="currentYerterday">较昨日<span class="suspectedCouent suColor">+{{allData ? allData.suspectedIncr : '-'}}</span></div>
          <div class="currentComfir suColor">{{allData ? allData.suspectedCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">境外输入</div>
        </div>
         <div class="current">
          <div class="currentYerterday">较昨日<span class="seriousCouent serColor">{{allData ? allData.seriousIncr : '-'}}</span></div>
          <div class="currentComfir serColor">{{allData ? allData.seriousCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">现存无症状</div>
        </div>
      </div>
      <div class="national2">
        <div class="current">
          <div class="currentYerterday">较昨日<span class="yerterdayCouent text1color">+{{allData ? allData.confirmedIncr : '-'}}</span></div>
          <div class="currentComfir text1color">{{allData ? allData.confirmedCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">累计确诊</div>
        </div>
        <div class="current">
          <div class="currentYerterday">较昨日<span class="suspectedCouent su1Color">+{{allData ? allData.deadIncr : '-'}}</span></div>
          <div class="currentComfir su1Color">{{allData ? allData.deadCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">累计死亡</div>
        </div>
         <div class="current">
          <div class="currentYerterday">较昨日<span class="seriousCouent ser1Color">+{{allData ? allData.curedIncr : '-'}}</span></div>
          <div class="currentComfir ser1Color">{{allData ? allData.curedCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">累计治愈数</div>
        </div>
      </div>
      <div class="global" :style="comStyle">全球数据</div>
      <div class="globalData">
        <div class="current">
          <div class="currentYerterday">较昨日<span class="yerterdayCouent textcolor">{{globalStatistics ? globalStatistics.currentConfirmedIncr : '-'}}</span></div>
          <div class="currentComfir textcolor">{{globalStatistics ? globalStatistics.currentConfirmedCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">现存确诊</div>
        </div>
       <div class="current">
          <div class="currentYerterday">较昨日<span class="yerterdayCouent text1color">+{{globalStatistics ? globalStatistics.confirmedIncr : '-'}}</span></div>
          <div class="currentComfir text1color">{{globalStatistics ? globalStatistics.confirmedCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">累计确诊</div>
        </div>
        <div class="current" >
          <div class="currentYerterday">较昨日<span class="suspectedCouent su1Color">+{{globalStatistics ? globalStatistics.deadIncr : '-'}}</span></div>
          <div class="currentComfir su1Color">{{globalStatistics ? globalStatistics.deadCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">累计死亡</div>
        </div>
         <div class="current" :class="[titleFontSize > 15 ? '' : 'isShow']">
          <div class="currentYerterday">较昨日<span class="seriousCouent ser1Color">+{{globalStatistics ? globalStatistics.curedIncr : '-'}}</span></div>
          <div class="currentComfir ser1Color">{{globalStatistics ? globalStatistics.curedCount : '-'}}</div>
          <div class="cerrentTitle" :style="comStyleColor">累计治愈数</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      globalStatistics:null,
      titleFontSize: 0
    }
  },
  created () {
    this.getData()
  },
  computed: {

    comStyle () {
      return {
        fontSize: this.titleFontSize / 2+ 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    comStyleColor(){
      return {
        // fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  mounted () {
    this.initChart()
    // this.getData()

    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
        title: {
          text: '▎ 国内及全球疫情数据',
          left: 20,
          top: 20
        },

      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const {data:ret} = await this.$http.post('/serviceList')
      this.allData = ret[0]
      this.globalStatistics  = ret[0].globalStatistics

    },

    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },

      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },

  },
  watch: {
    theme () {
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
    }
  }
}
</script>

<style lang='less' scoped>
.com-container{
  position: relative;
}
#date{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  padding: 15% 10% 10%;
  box-sizing: border-box;
}
.nationTitle{
  width: 100%;
  position: relative;
  left: -5%;
}
.national{
  margin-top:2% ;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.current{
    display: flex;
    flex-flow: nowrap;
    align-items: center;
    flex-direction: column;
}
.currentYerterday{
  color: #666;
  font-weight: 400;
  font-size: 12px;
}
.textcolor{
    color: rgb(247, 76, 49)
}
.suColor{
    color: rgb(247, 130, 7);
}
.serColor{
  color: rgb(162, 90, 78);
}
.text1color{
    color: rgb(174, 33, 44);
}
.su1Color{
    color: rgb(93, 112, 146);
}
.ser1Color{
      color: rgb(40, 183, 163);
}
.currentComfir{
  font-weight: 700;
  font-size: 18px;
  margin: 1% 0;
}
.national2{
  margin-top: 5%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.global{
  width:100%;
  margin-top: 2%;
  position: relative;
  left: -5%;
}
.globalData{
  margin-top: 3%;
  width: 100%;
  display: flex;
  justify-content: space-between;

}
.isShow{
  display: none;
}
</style>
