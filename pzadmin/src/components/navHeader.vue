<template>
    <div class="header-container">

        <div class="header-left flex-box">
            <el-icon class="icon" style="size: 30px;" @click="store.commit('collapseMenu')"><Fold /></el-icon>
            <ul class="tag flex-box">
                <li v-for="(item,index) in selectionMenu" 
                    :key="item.name" 
                    class="tag_item flex-box"
                    :class="{selected:route.path===item.path}"
                >
                    <el-icon :size="15" >
                         <component :is="item.icon"></component>
                    </el-icon>
                    <RouterLink :to="item.path" class="tag_name">
                        {{ item.name }}
                    </RouterLink>
                    <el-icon :size="15" class="show" @click="closetag(item,index)" > <Close /> </el-icon>
                </li>
            </ul>
        </div>

        <div class="header-right flex-box">

            <el-dropdown @command="handlecheck">

                <div class="el-dropdown-link flex-box new-hover">
                    <el-avatar
                        :src="userInfo.avatar"
                    />
                    <p class="user-name">{{ userInfo.name }}</p>
                </div>
                
                <template #dropdown>
                    <el-dropdown-menu>
                    <el-dropdown-item  command="cancel">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

        </div>
    </div> 
</template>

<script setup>
import { RouterLink,useRoute,useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store=useStore()
const route=useRoute()
const router=useRouter()
const selectionMenu=computed(()=>store.state.menu.selectionMenu)

//
const userInfo=JSON.parse(localStorage.getItem('pz_userInfo'))

//关闭tag
const closetag=(item,index)=>{
    store.commit('closeselection',index)
    if(route.path!==item.path){
        return
    }
    //
    const menu=selectionMenu.value
    if(index===menu.length){
        if(!menu.length){
            router.push('/')
        }else{
            router.push({
                path:menu[index-1].path
            })
        }
    }else{
        router.push({
            path:menu[index].path
        })
    }
}
//退出登录
const handlecheck=(command)=>{
    if(command === 'cancel'){
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('pz_v3pz')
        window.location.href=window.location.origin
    }
}
</script>



<style lang="less" scoped>
a{
    color: inherit;
    text-decoration: none;
}
a:hover{
    color: inherit;
    text-decoration: none;
}
.flex-box{
    display: flex;
    align-items: center;
}

.header-container{
    display: flex;
    justify-content: space-between;

    background-color: #fff;
    height: 40px;

    .header-left{
        height: 100%;
        .icon{
            height: 100%;
            width: 30px;
        }
        .icon:hover{
            background-color: #f5f5f5;
            cursor: pointer;
        }

        .selected{
            color: blueviolet;
            background-color: #f5f5f5;

        }

        .tag{
            height: 100%;

            .tag_item{
                margin-left: 6px;
                padding: 0 6px;
                height: 100%;

                .tag_name{
                    margin: 0 5px;
                    font-size: 15px;
                }

                .show{
                    visibility: hidden;
                }
                .show:hover{
                    cursor: pointer;
                    color: red;
                }

                }
                .tag_item:hover{
                    background-color: #f5f5f5;
                    .show{
                        visibility: visible;
                    }
            }

        }

    }

    .header-right{
        .user-name{
            margin-left: 15px;
            margin-right: 5px;
        }
        
        .new-hover{
            border: none;
            box-shadow: none;
        }

        .new-hover:hover{
            border: none;
            box-shadow: none;

            cursor: pointer;
        }
    }
}
</style>