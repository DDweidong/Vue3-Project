<template>
    <div class="common-layout">
      <el-container>
        <!-- <el-aside width="200px">Aside</el-aside>-->
        <Aside></Aside>
        
          <el-container >

            <el-header class="new-header">
              <Header/>
            </el-header>

            <el-main>
              <RouterView></RouterView>
            </el-main>

          </el-container>

      </el-container>
    </div>
  </template>

<script setup>
import Aside from '../components/Aside.vue'
import Header from '../components/navHeader.vue'
</script>

<style lang="less" scoped>
.common-layout{
    height: 100%;
    background-color: #f5f5f5;
    .el-container{
      //display:flex ; 
      //flex-direction: column;
      height: 100%;

      .new-header{
        height: 40px;
      }
    }
}
</style>