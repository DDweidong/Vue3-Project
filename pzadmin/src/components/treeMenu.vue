<template>
        <template v-for="(item ,index) in props.userouter" >

          <el-menu-item 
            v-if="!(item.children)||item.children.length==0" 
            :index="`${props.useindex}-${item.meta.id}`"
            :key="`${props.useindex}-${item.meta.id}`"
            @click="handleclick(item,`${props.useindex}-${item.meta.id}`)"
          >
            <el-icon :size="20">
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.name }}</span>
          </el-menu-item>

          <el-sub-menu :index="`${props.useindex}-${item.meta.id}`"  v-else >
            <template #title>
              <el-icon :size="20">
                <component :is="item.meta.icon"></component>
              </el-icon>
              <span>{{ item.meta.name }}</span>
            </template>
            <tree-menu :userouter="item.children" :useindex="`${props.useindex}-${item.meta.id}`"></tree-menu>
          </el-sub-menu>

        </template>
        
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useStore } from 'vuex';

const props=defineProps(["userouter","useindex"])
//console.log(props.userouter)
const router=useRouter()
const route=useRoute()

const store=useStore()

const handleclick=(item,actice)=>{
  //console.log(item,actice)
  //添加数据,meta对象
  store.commit('addselection',item.meta)
  store.commit('updataMenuActive',actice)
  router.push(item.meta.path)
}

</script>


<style lang="less" scoped>
</style>