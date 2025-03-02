const localData=localStorage.getItem('pz_v3pz')

const state= localData? localData.menu: {
    iscollapse:false,
    selectionMenu:[],
    routerList:[],
    menuActive:'1-1'
}

const mutations={
    collapseMenu(state){
        state.iscollapse=!state.iscollapse
    },
    addselection(state,item){
        //去重
        if(state.selectionMenu.findIndex((now)=>now.name===item.name)===-1){
            state.selectionMenu.push(item)
        }
        //console.log(item)
    },
    closeselection(state,index){ //删除数据
        state.selectionMenu.splice(index,1)
    },
    dynamicMenu(state,payload){
        //通过glob导入文件
        const modules=import.meta.glob('../views/**/**/*.vue')
        //console.log(modules)
        //拼接
        function routerSet(router) {
            router.forEach(route=>{
                //判断没有字菜单，拼接路由
                if(!route.children){
                    const url=`../views${route.meta.path}/index.vue`
                    //拿到vue组件
                    route.component = modules[url]
                }else{
                    routerSet(route.children)
                }
            })
        }
        routerSet(payload)
        //拿到完整的路由数据
        state.routerList=payload
    },
    updataMenuActive(state,payload){
        state.menuActive=payload
    }
}

export default {
    state,
    mutations
}