<template>
    <el-row class="login-container" justify="center" :align="'middle'">
        <el-card style="max-width: 480px;">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="">
                </div>
            </template>

            <div class="jump-link" @click="handlechangle">
                <el-link type="primary">{{ formType?'返回登录':'注册账号' }}</el-link>
            </div>

            <el-form 
                ref="loginFormRef"
                :model="loginform" 
                style="max-width:600px"
                class="demo-ruleForm"   
                :rules="rules" 
            >
                <el-form-item prop="userName">
                    <el-input v-model="loginform.userName" placeholder="手机号" :prefix-icon="UserFilled"></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginform.passWord" type="password" placeholder="密码" :prefix-icon="Lock"></el-input>
                </el-form-item>                
                <el-form-item prop="validCode" v-if="formType">
                    <el-input v-model="loginform.validCode" placeholder="验证码" :prefix-icon="Lock">
                        <template #append >
                            <span  @click="handlesend" class="send">{{vaildtext.text }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :style="{ width:'100%' }" @click="submitForm(loginFormRef)">
                        {{ formType?'注册账号':'立即登录' }}
                    </el-button>
                </el-form-item>
            </el-form>

        </el-card>
    </el-row>
</template>

<script setup>
import { ref,reactive,computed,toRaw } from 'vue';
import { getCode,userAuthentication,login,menuPermissions } from '../../api';
import { ElMessage } from 'element-plus'
import {UserFilled,Lock} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href

//0登录  1注册
const formType=ref(0)
//0 1切换
const handlechangle=()=>{
    formType.value=formType.value?0:1
    //表单的数据要清吗？
    loginform.userName=''
    loginform.passWord=''
}
//表单数据
const loginform=reactive({
    userName:'',
    passWord:'',
    validCode:''
})

//账号的校验
const validateUser=(rule,value,callback)=>{
    if(value===''){
        callback(new Error('请输入手机号'))
    }else{
        const phonereg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        phonereg.test(value)?callback():callback(new Error('请输入正确格式'))
    }
}
//密码的校验
const validatepass=(rule,value,callback)=>{
    if(value===''){
        callback(new Error('请输入密码'))
    }else{
        const passreg=/^[a-zA-Z0-9_-]{4,16}$/
        passreg.test(value)?callback():callback(new Error('请输入正确格式'))
    }
}
//表单的校验
const rules=reactive({
    userName:[{ validator:validateUser,trigger:'blur'}],
    passWord:[{ validator:validatepass,trigger:'blur'}],
})

//发送短信
const vaildtext=reactive({
    text:"获取验证码",
    time:60
})
let flag=false //没有定时器
const handlesend=()=>{
    //
    if(flag) return 
    //手机号验证
    const phonereg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if(!loginform.userName||!phonereg.test(loginform.userName)) {
        return   ElMessage({
            message: '请检查手机号',
            type: 'warning',
        })
    }
    //
 const time=setInterval(()=>{
        if(vaildtext.time<=0){
            vaildtext.text='获取验证码'
            vaildtext.time=60
            flag=false
            clearInterval(time)
            return
        }else{
            vaildtext.time-=1
            vaildtext.text=`剩余${vaildtext.time}s`
        }
    },1000)
    flag=true
    getCode({ tel:loginform.userName }).then( ({ data })=>{
        //console.log(data)
        if(data.code===10000){
            ElMessage.success('发送成功') //有问题
        }
    })
}

const router=useRouter()
const loginFormRef=ref()
const store =useStore()

const routerList=computed(()=>store.state.menu.routerList)
//表单的提交
const submitForm= async(formEl)=>{
    if (!formEl) return

    await formEl.validate((valid, fields) => {
    if (valid) {
        if(formType.value){
            //注册页面
            userAuthentication(loginform).then(({data})=>{
                if(data.code===10000){
                    ElMessage.success("注册成功，请登录")
                    formType.value=0
                    //console.log(loginform,'submit!')
                }
            })
        }else{
            login(loginform).then(({ data })=>{
                if(data.code===10000){
                    ElMessage.success("登录成功")
                    //console.log(data)
                    localStorage.setItem('pz_token',data.data.token)
                    localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
                    //后续：
                    menuPermissions().then(({data})=>{
                        store.commit('dynamicMenu',data.data)
                        //console.log(routerList)
                        toRaw(routerList.value).forEach(item=>{
                            router.addRoute('main',item)
                        })
                        //console.log('push')
                        router.push('/')
                    })
                }
            })
        }

    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>

<style lang="less" scoped>
//复制资料
:deep(.el-card__header) {
    padding: 0
  }
  .login-container {
    height: 100%;
    .card-header{
      background-color: #899fe1;
      img {
        width: 430px;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
  }

.send:hover{
    cursor: pointer;
}
</style>