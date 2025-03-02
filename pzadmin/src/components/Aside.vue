<template>
    <el-menu
        :style="{ width:!iscollapse?'230px':'64px' }"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="Aside-containter"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="iscollapse"
        :router=ture
        :default-active="active"
      >
      <p class="logo">{{ iscollapse?"DD":'DD陪诊' }}</p>
        <tree-menu :userouter="router" :useindex="1" ></tree-menu>
      </el-menu>
</template>

<script setup>
import TreeMenu from './treeMenu.vue'
import { useRouter,useRoute } from 'vue-router';
import { reactive ,computed } from 'vue';
import {useStore} from 'vuex'

//路由对应菜单高亮显示，没有实现
const route=useRoute();

//const router=reactive(useRouter().options.routes[0].children)//数组
//console.log(router)
const store=useStore()
const router=computed(()=>store.state.menu.routerList)

const iscollapse=computed(()=>store.state.menu.iscollapse)
const active=computed(()=>store.state.menu.menuActive)

const handleOpen=()=>{}
const handleClose=()=>{}

</script>

<style scoped>
.Aside-containter{
    height: 100%;
    .logo{
        color: #fff;
        font-size: 24px;
        text-align: center;
        height: 50px;
        line-height: 50px;
    }
}
</style>