<template>
    <div class="container">
        <div class="header">我的订单</div>
        <van-tabs v-model:active="active" @click-tab="onClickTab">
            <van-tab title="全部" name="" />
            <van-tab title="待支付" name="1" />
            <van-tab title="待服务" name="2" />
            <van-tab title="已完成" name="3" />
            <van-tab title="已取消" name="4" />
        </van-tabs>
        <van-row  v-for="item in order" :key="item.out_trade_no" @click="goDetail(item)" >
          <van-col span="5">
            <van-image width="50" height="50" radius="5" :src="item.serviceImg" />
          </van-col>
          <van-col span="14">
            <div class="text1">{{ item.service_name }}</div>
            <div class="text2">
              <div>{{ item.hospital_name }}</div>
              <div>预约时间: {{ item.starttime }}</div>
            </div>
          </van-col>
          <van-col span="5" class="text2" :style="{color:colorMap[trade_state] }">
            {{ item.trade_state }}
            <counter :second="item.timer" v-if="item.trade_state==='待支付'" />
          </van-col>
        </van-row>
        <div class="bottom-text">没有更多了</div>
    </div>
</template>

<script setup>
import { ref ,getCurrentInstance,onMounted } from 'vue';
import counter from '../../components/counter.vue';
import { useRouter } from 'vue-router'

//获取当前vue实例
const { proxy }=getCurrentInstance()

onMounted(()=>{
  getOrderList(' ')
})

//订单状态
const colorMap={
  '待支付':'#ffa200',
  '待服务':'#1da6fd',
  '已完成':'#21c521',
}

//订单列表
const order=ref([])
//获取订单数据
const getOrderList= async (state)=>{
    const { data }=await proxy.$api.orderList( { state } )
    //待支付
    data.data.forEach(item =>{
      item.timer=item.order_start_time+7200000-Date.now()
    })
    order.value=data.data
}
//点击事件
const onClickTab=(item)=>{
    getOrderList(item.name)
}

//tab栏
const active=ref(" ")

//跳转详情
const router=useRouter()
const goDetail=(item)=>{
    router.push(`/detail?oid=${item.out_trade_no}`)
}

</script>

<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
  }
  .header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
  }
  .van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    .text1 {
      font-size: 16px;
      line-height: 25px;
      font-weight: bold;
    }
    .text2 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }
  }
  .bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
  }
</style>