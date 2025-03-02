<template>
    <panel-head :route="route" />
    <div class="btns">
        <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
    </div>
    <el-table :data="tableData.list" style="width: 100%;">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissionName" label="菜单权限"  width="450px"/>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination
            v-model:current-page="paginationData.pageNum"
            :page-size="paginationData.pageSize"
            :background="false"
            size="small"
            layout="total, prev, pager, next"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
    <el-dialog
        v-model="dialogFormShow"
        :before-close="beforeClose"
        title="添加权限"
        width="500"
    >
        <el-form
            ref="formRef"
            label-width="100px"
            label-position="left"
            :model="form"
            :rules="rules"
        >
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree 
                    ref="treeRef"
                    style="max-width: 600px;"
                    :data="permissionData"
                    node-key="id"
                    show-checkbox
                    :default-checked-keys="defaultKeys"
                    :default-expanded-keys="[2]"
                />
            </el-form-item>
        </el-form>
        <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="comfirm(formRef)">确认</el-button>
                </div>
        </template>
    </el-dialog>
</template>

<script setup>
import  { ref,reactive,onMounted, nextTick } from 'vue'
import { userGetmenu,userSetmenu,menuList }  from '../../../api'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

//
const route=useRoute()

//form的数据
const form=reactive({
    name:'',
    permissions:'',
    id:''
})

//菜单权限列表
const paginationData=reactive({
    pageNum:1,
    pageSize:10
})
//多次会调用
const getListData=()=>{
    menuList(paginationData).then(({ data })=>{
        const { list,total }=data.data
        tableData.list=list
        tableData.total=total
    })
}

//列表数据
const tableData=reactive({
    list:[],
    total:0
})


//编辑菜单,打开弹窗
const open=(rowData={})=>{
    dialogFormShow.value=true
    //异步form生成*****************
    nextTick(()=>{
        if(rowData){
            Object.assign(form,{ id:rowData.id,name:rowData.name })
            treeRef.value.setCheckedKeys(rowData.permission)
        }
    })
}

//
const handleSizeChange=(val)=>{
    paginationData.pageSize=val
    getListData()
}
//
const handleCurrentChange=(val)=>{
    paginationData.pageNum=val
    getListData()
}

//菜单权限数据
const permissionData=ref([])

onMounted(()=>{
    userGetmenu().then(( { data } )=>{
        permissionData.value=data.data
    })
    getListData()
})

//弹窗的显示
const dialogFormShow=ref(false)
//弹窗关闭的回调
const beforeClose=()=>{
    dialogFormShow.value=false
    //重置表单
    formRef.value.resetFields()
    treeRef.value.setCheckedKeys(defaultKeys)
}

//默认选中数组
const defaultKeys=[4,5]
//树组件实例
const treeRef=ref()
//表单检验
const formRef=ref()
const rules=reactive( { name:[ {required: true, message: '请输入权限名称', trigger: 'blur' } ] })
//表单提交
const comfirm=async(formEl)=>{
    if (!formEl) return

    await formEl.validate((valid, fields) => {
        if (valid) {
            //获取选择权限
            const permissions=JSON.stringify(treeRef.value.getCheckedKeys())
            userSetmenu( { name:form.name,permissions,id:form.id } )
            beforeClose()
            getListData()
        }else{
            console.log('error submit!', fields)
        }
    })
}
</script>

<style lang="less" scoped>
.btns{
    padding: 6px;
    width: 100%;
    //background-color: #fff;
}
.pagination-info{
    padding-left: 10px;
    width: 100%;
    //background-color: #fff;
}
</style>