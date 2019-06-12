<template>
   <div class="login">

        <el-row class="loginWrap">
            <el-col :xs="19" :sm="20" :md="20" :lg="8" :xl="5" class="grid-content bg-purple">
                <div class='login-cen'>
                    <form>
                        <div class='input'>
                            <div class='hint'>账号：</div>
                            <el-input v-model="userName" placeholder="请输入您的账户"></el-input>
                        </div>
                        <div class='input'>
                            <div class='hint'>密码：</div>
                            <el-input v-model='passWord' show-password type='password' placeholder="请输入您的密码"></el-input>
                        </div>
                        <div class='btn'>
                            <button @click='Login($event)'>登录</button>
                        </div>
                    </form>
                </div>
            </el-col>
        </el-row>

   </div>
</template>

<script>

import axios from 'axios';
export default {
    name: '',
    data() {
        return {
            userName:'',
            passWord:''
        }
    },
    methods:{
        Login(e){
            let that = this;
            if( this.userName != '' && this.passWord != ''){
                event.preventDefault();
                let formData = new FormData();
                formData.append('username', this.userName);
                formData.append('password', this.passWord);

                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }

                axios.post('http://nuls.yqkkn.com/passport/login', formData, config)
                .then(function (res) {
                    let data = res.data;
                    if( data.code == 0 ){
                        that.$message('登录成功');
                        localStorage.id = data.result.id;
                        localStorage.node_id = data.result.nodeId;
                        localStorage.role = data.result.role;
                        location.reload();
                        that.$router.push('/');
                    }else{
                        that.$message(data.msg);
                    }
                })
            }else{
                that.$message('请输入您的账号密码');
            }
        }
    }
}
</script>

<style scoped lang='less'>
.login{
    width: 100%;
    height: calc(100% - 102px);
    position: relative;
    background: #F9FAFD;
    .login-cen{
        width: 100%;
        height: 250px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        background: #F9FAFD;
        padding: 10px;
        .input{
            display: flex;
            margin: 20px 0;
            .hint{
                width: 70px;
                line-height: 40px;
                text-align: right;
            }
        }
        .btn{
            width: 100%;
            position: absolute;
            bottom: 10px;
            >button{
                width: 200px;
                height: 40px;
                border: none;
                background: #00C0ED;
                color: white;  
                display: block;
                margin: 0 auto;
            }
        }
    }
}
.el-col {
        border-radius: 4px;
}
.loginWrap{
    height: 100%;
    position: relative;
}
.bg-purple-dark {
    height: 100%;
}
.bg-purple {
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
}
.bg-purple-light {
    height: 100%;
}
.grid-content {
    border-radius: 4px;
}
</style>
