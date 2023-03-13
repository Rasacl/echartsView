<!-- 实时新闻 -->
<template>
  <div class='com-container'>
    <div class='com-chart' ref='stock_ref'></div>
    <diV id="news">
      <div id="newsList">
        <div class="newsItem" v-for="(item,index) in allData" :key="index">
          <div class="logo" :style="comStyleColor">最新</div>
          <div class="title" :style="comStyleColor" @click="goNews(item)">{{item.title}}</div>
        </div>
      </div>
    </diV>
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
      titleFontSize:0,
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

  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '▎实时新闻',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.post('/newsList')
      this.allData = ret

    },

    screenAdapter () {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },

      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    goNews(item){
      window.location.href = item.sourceUrl
    }

  },
  computed: {
    comStyle () {
      return {
        fontSize: this.titleFontSize *2 + 'px',
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
  watch: {
    theme () {
      console.log('主题切换了')
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
#news{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
#newsList{
width: 100%;
height: 100%;
margin-top: 10%;
padding: 0% 3% 14% 4%;
box-sizing: border-box;
overflow-y: scroll;
}
#newsList::-webkit-scrollbar{
  width: 10px;
}
#newsList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
#newsList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
  border-radius: 0;
  background: rgba(0, 0, 0, 0);
}
.newsItem{
  display: flex;
  align-items: center;
  margin-top: 5%;
}
.logo{
  margin-right: 4%;
  width: 50px;
  height: 20px;
  padding:3px;
  background-color: red;
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}
.title{
  cursor: pointer;
}
</style>
