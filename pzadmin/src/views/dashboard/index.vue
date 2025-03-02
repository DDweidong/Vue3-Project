<template>
    <panel-head :route="route"/>

    <el-card style="max-width: 100%">
    <template #header>
      <div class="card-header">
        <span>用户：{{userInfo.name }}</span>
      </div>
    </template>
    <img
      :src="userInfo.avatar"
      style="width: 260px"
    />
    <template #footer>
        权限：{{ permissName(right) }}
    </template>
  </el-card>

  <el-card style="max-width: 100% ;margin-top: 40px;">
    <template #header>
      <div class="card-header">
        <span>订单服务</span>
      </div>
    </template>
    <p class="text item" style="margin-bottom: 10px;">待支付：{{dzf}}</p>
    <p class="text item" style="margin-bottom: 10px;">待服务：{{dfw}}</p>
    <p class="text item" style="margin-bottom: 10px;">已完成：{{ywc}}</p>
    <p class="text item" style="margin-bottom: 10px;">已取消：{{yqx}}</p>
    <p class="text item" style="margin-bottom: 10px;"><strong>总计</strong>：{{orderData.total}}</p>
  </el-card>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { reactive ,onMounted,ref } from 'vue';
import { authAdmin,menuSelectlist,updateUser,adminOrder } from '../../api'

//
const route=useRoute()

onMounted(()=>{
    const user=JSON.parse(localStorage.getItem('pz_userInfo'))
    Object.assign(userInfo,user)
    //
    getListData()
    //
    menuSelectlist().then(({ data })=>{
        options.value=data.data
    })
    //
    getOrderData()
})

//用户信息
const userInfo=reactive({
    name:'',
    avatar:''
})
//组别名称
const right=ref()
const options=ref([])
const permissName=(id)=>{
    const data=options.value.find( el => el.id===id )
    return data? data.name:'超级管理员'
}

//
const paginationData=reactive({
    pageNum:1,
    pageSize:10
})
//列表数据
const tableData=reactive({
    list:[],
    total:0
})

//用户列表数据
const getListData=()=>{
    authAdmin(paginationData).then(({data})=>{
        const { list,total }=data.data
        tableData.list=list
        tableData.total=total
        //console.log(tableData.list[0].permissions_id)
        right.value=tableData.list[0].permissions_id
    })
}

//订单列表
const orderPaginationData=reactive({
    pageNum:1,
    pageSize:10
})
//列表数据
const orderData=reactive({
    list:[],
    total:0
})
const getOrderData=( params={} )=>{
    adminOrder( { ...orderPaginationData,...params } ).then(({ data })=>{
        const { list,total }=data.data
        orderData.list=list
        orderData.total=total
        //
        list.forEach(el => {
            if(el.trade_state==='待支付') dzf.value++
            else if(el.trade_state==='待服务') dfw.value++
            else if(el.trade_state==='已完成') ywc.value++
            else yqx.value++
        });
    })
}

//订单数
const dzf=ref(0)
const dfw=ref(0)
const yqx=ref(0)
const ywc=ref(0)


</script>

<style lang="less" scoped>
.container{
    display: flex;
    justify-content: space-between;
    height: 300px;

    .left{
        background-color: #fff;
        height: 100%;
    }

    .right{
        background-color: #fff;
        height: 100%;
    }
}
</style>