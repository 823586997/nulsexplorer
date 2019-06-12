<template>
   <div class="alterMsg" v-loading="nodeInfoLoading">
        <el-row class="alterMsgWrap">
            <el-col :xs="19" :sm="20" :md="20" :lg="8" :xl="5" class="grid-content bg-purple">
                <form action="">
                    <div class='alterMsg-cen'>
                        <div class='avatar-box'>
                            <div class='adatar'>
                                <img :src="nodeInfo.avatar ? nodeInfo.avatar : require('../../static/images/avatar/default.jpg')" alt="" >
                                <input type="file" name="" accept="image/gif,image/jpeg,image/jpg,image/png" @change="fileChange">
                            </div>
                            <div class='nickName'>{{nodeInfo.agentAlias}}</div>
                        </div>
                        
                        <div class='input'>
                            <div class='hint'>手机号：</div>
                            <el-input v-model="nodeInfo.phone" ></el-input>
                        </div>
                        <div class='input'>
                            <div class='hint'>email：</div>
                            <el-input v-model='nodeInfo.email' ></el-input>
                        </div>
                        <div class='input'>
                            <div class='hint'>相关链接：</div>
                            <el-input v-model='nodeInfo.link'></el-input>
                        </div>
                        <div class='input' @click='desc()'>
                            <div class='hint' >描述：</div>
                            <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model='nodeInfo.description'>
                            </el-input>
                        </div>
                        <div class='btn'>
                            <button @click='Change()'>确认修改</button>
                        </div>
                    </div>
                </form>
            </el-col>
        </el-row>
        <!-- <div class='quill' v-if='flag'>
            <quill-editor 
            v-model="content" 
            ref="myQuillEditor" 
            :options="editorOption" 
            @blur="onEditorBlur($event)" 
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
            </quill-editor>
        </div> -->
   </div>
</template>

<script>

import axios from 'axios';
// import { quillEditor } from "vue-quill-editor"; //调用编辑器
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';

export default {
   name: '',
//    components:{ quillEditor },
   data() {
       return {
            nodeInfo:{
                phone: '',
                email:'',
                link:'',
                description:'',
                avatar:''
            },
            nodeInfoLoading: true,
            content: '',
            editorOption: {},
            flag: false,
       }
   },
   mounted(){
       this.getData();
   },
   methods: {
        getData(){
                let url = 'http://nuls.yqkkn.com/node/'+this.$route.query.id;
                axios.get(url)
                .then( (res) => {
                    let data = res.data;
                    this.nodeInfo = data.result;
                    this.nodeInfoLoading = false;
                })
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        fileChange(e) {
            var that = this;
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e){
                that.nodeInfo.avatar  = e.target.result;
            }
            reader.readAsDataURL(file);
        },
        submit() {
            var data = new FormData();
            data.appendTo('file',this.adatar);
            $ajax({
                type: 'POST',
                data: data,
                processData: false, //processData 默认为false，当设置为true的时候,jquery ajax 提交的时候不会序列化 data，而是直接使用data
                contentType: false,
                success:function(res){
                },
                error:function(err){
                }
            })
        },
        // onEditorReady(editor) { // 准备编辑器
 
        // },
        // onEditorBlur(e){
        //     this.flag = false;
        // }, // 失去焦点事件
        // onEditorFocus(){}, // 获得焦点事件
        // onEditorChange(e){
        //     console.log(e.html);
        // }, // 内容改变事件
        desc(){
            this.flag = true;
        },
        Change(){
            let that = this;
            event.preventDefault();
            let formData = new FormData();
            formData.append('nodeId',this.nodeInfo.id);
            formData.append('link',this.nodeInfo.link);
            formData.append('description',this.nodeInfo.description);
            formData.append('email',this.nodeInfo.email);
            formData.append('phone',this.nodeInfo.phone);
            formData.append('avatar',this.nodeInfo.avatar);

            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            axios.post('http://nuls.yqkkn.com/admin/updateNodeInfo', formData, config)
            .then(function (res) {
                let data = res.data;
                if( data.code == 0 ){
                    that.$message('申请成功，请耐心等待管理审批');
                    that.$router.go(-1);
                }else{
                    that.$message(data.msg);
                }
            })
        }
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    }
}
</script>

<style scoped lang='less'>
.alterMsg{
    width: 100%;
    position: relative;
    background: #F9FAFD;
    .alterMsg-cen{
        width: 100%;
        padding: 10px;  
        padding-bottom: 70px;
    }
    .avatar-box{
        width: 100%;
        height: 120px;
        .adatar {
            position: relative;
            width: 100px;
            height: 100px;
            margin: 0 auto;
            img {
                object-fit: cover;
                object-position: center;
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            input {
                position: absolute;
                top: 0;
                right: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                outline: none;
                opacity: 0;
                cursor: pointer;
                &:focus {
                    box-shadow: none;
                }
            }
        }
        .nickName{
            text-align: center;
        }
    }
    .input{
        display: flex;
        margin: 20px 0;
        .hint{
            width: 120px;
            line-height: 40px;
            text-align: right;
        }
    }
    .btn{
        width: 100%;
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
    .quill{
        width: 100%;
        position: absolute;
        bottom: 40px;
        background: white;
    }
}

.el-col {
    border-radius: 4px;
}
.alterMsgWrap{
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
