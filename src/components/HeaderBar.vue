<template>
  <div class="header">
    <div class="w1200">
      <div class="header_logo fl">
        <img class="logo click" :src=logoSvg @click="toHome">
      </div>
      <div class="menu fl">
        <MenuBar></MenuBar>
      </div>

      <div class="header_language fl">
        <div class="top-search fl" v-if="navActive !== 'home' && navActive !== '/'">
          <div class="top_height fl" v-if="!topLong">
            <i class="iconfont icon-block fCN font20"></i>
            <!-- <span>{{height}}</span>-->
            <label class="number-grow-warp">
              <span>{{count.height}}</span>
            </label>
            <!--<numberGrow :value="count.height"></numberGrow>-->
          </div>
          <el-input v-model="searchValue" class="fr" :placeholder="$t('public.searchTip')"
                    @keyup.enter.native="clickSearch"
                    @focus="focusSearch"
                    @blur="blurSearch">
            <i class="el-icon-search el-input__icon click" slot="suffix" @click="clickSearch"></i>
          </el-input>
        </div>
        <div class="language font14 fr" @click="selectLanguage(lang,true)">{{lang === 'en' ? '简体中文':'English' }}</div>
        <div class="language font14 fr" @click='Login()'>{{ id ? '退出' : '登录'}}</div>
      </div>
      <div class="mobile_ico fr">
        <i class="el-icon-menu" @click="showMobile = !showMobile"></i>
      </div>
    </div>

    <el-collapse-transition>
      <div class="mobile_header fr" @click="hideMobileMenu" v-show="showMobile">
        <div class="mobile_menu">
          <MenuBar></MenuBar>
          <div class="cb"></div>
          <div class="language1 font14 fr" @click="selectLanguage(lang,true)">{{lang === 'en' ? '简体中文':'English' }}</div>
          <div class="language2 font14 fr" @click='Login()'>{{ id ? '退出' : '登录'}}</div>
        </div>
      </div>
    </el-collapse-transition>

    <div class="cb"></div>
  </div>


</template>

<script>
  import * as config from '../config.js'
  import logo from './../assets/img/logo.svg'
  import testnetLogo from './../assets/img/logo-test-black.svg'
  import MenuBar from '@/components/MenuBar';
  import axios from 'axios';

  export default {
    data() {
      return {
        logoSvg: config.RUN_DEV ? logo : testnetLogo,
        //默认选择菜单
        navActive: sessionStorage.hasOwnProperty('navActive') ? sessionStorage.getItem('navActive') : 'home',
        //统计信息
        count: {
          height: this.$store.state.height,//当前高度
        },
        //搜索框内容
        searchValue: '',
        //顶部搜索框加长
        topLong: false,
        //语言
        lang: 'en',
        //移动端显示
        showMobile: false,
        id: localStorage.node_id
      };
    },
    components: {
      MenuBar,
    },
    created() {
      let lang = navigator.language || navigator.userLanguage;//常规浏览器语言和IE浏览器
      if (sessionStorage.hasOwnProperty('lang')) {
        this.lang = sessionStorage.getItem('lang')
      } else {
        if (lang.substr(0, 2) === 'zh') {
          this.lang = 'cn'
        } else {
          this.lang = 'en'
        }
      }
    },
    mounted() {
      this.selectLanguage(this.lang, false);
      //秒循环一次数据
      setInterval(() => {
        this.count.height = this.$store.state.height;
        this.navActive = this.$route.path;
      }, 100);
    },
    methods: {
      /**
       * 顶部搜索框获取焦点事件
       **/
      focusSearch() {
        this.topLong = true;
      },

      /**
       * 顶部搜索框失却焦点事件
       **/
      blurSearch() {
        this.topLong = false;
      },
      /*登录退出 */
      Login(){
        if(this.id){
          let url = 'http://nuls.yqkkn.com/passport/logout';
          axios.get(url)
          .then( (res) => {
            this.$message('您已成功退出登录');
            localStorage.clear();
            location.reload();
          })
        }else{
          this.$router.push('/login');
        }
      },
      /**
       *  顶部搜索框
       **/
      clickSearch() {
        this.$post('https://api.nuls.io/', 'search', [this.searchValue])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              if (response.result.type === 'block') {
                this.$router.push({
                  name: 'blockInfo',
                  query: {height: response.result.data.blockHeader.height}
                })
              } else if (response.result.type === 'tx') {
                this.$router.push({
                  name: 'transactionInfo',
                  query: {hash: response.result.data.hash}
                })
              } else if (response.result.type === 'account') {
                this.$router.push({
                  name: 'addressInfo',
                  query: {address: response.result.data.address}
                })
              } else if (response.result.type === 'contract') {
                this.$router.push({
                  name: 'contractsInfo',
                  query: {contractAddress: response.result.data.contractAddress, tabName: 'first'}
                })
              } else {
                this.$message({message: this.$t('codeInfo.codeInfo12'), type: 'error', duration: 1000});
              }
            } else {
              this.$message({message: this.$t('codeInfo.codeInfo12'), type: 'error', duration: 1000});
            }
            this.searchValue = '';
          }).catch((error) => {
          console.log(error)
        })
      },

      hideMobileMenu(){
        this.showMobile=false;
      },

      /**
       * 语言切换
       * @param e
       * @param Boolean
       */
      selectLanguage(e, Boolean) {
        if (Boolean) {
          this.lang = this.lang === 'en' ? 'cn' : 'en';
        }
        sessionStorage.setItem('lang', this.lang);
        //console.log(this.lang);
        this.$i18n.locale = this.lang;
      },

      /**
       * logo 跳转首页
       */
      toHome() {
        this.navActive = 'home';
        sessionStorage.setItem('navActive', 'home');
        this.$router.push({
          name: 'home',
        })
      }
    },
    watch: {
      /* navActive: function (val, oldVal) {
         console.log('new: %s, old: %s', val, oldVal);
       }*/
    }
  }
</script>

<style lang="less">
  @import "./../assets/css/style";

  .header {
    position: relative;
    border-bottom: @BD1;
    .w1200 {
      .header_logo {
        width: 104px;
        margin-right: 20px;
        .logo {
          width: 104px;
          margin: 20px 0 0 0;
        }
      }
      .menu {
        width: 670px;
      }
      .header_language {
        width: 406px;
        .top-search {
          width: 250px;
          height: 30px;
          margin: 25px 10px 0 0;
          text-align: right;
          @media screen and (max-width: 1000px) {
            //margin: 1rem 0.5rem 0 0;
          }
          .top_height {
            line-height: 30px;
            margin-left: -248px;
            position: absolute;
            .number-grow-warp {
              margin: 0 0 0 5px;
            }
          }
          .el-input {
            width: 80%;
            input {
              width: 150px;
              transition: width 400ms ease, background 400ms ease, border-radius 400ms ease;
              height: 30px;
              line-height: 30px;
              &:focus {
                width: 250px;
                border-color: @Ncolour;
              }
            }
            .el-input__icon {
              line-height: 30px;
              color: @Acolor3;
            }
          }
        }
        .language {
          width: 60px;
          color: @Acolor;
          line-height: 80px;
          cursor: pointer;
          text-align: right;
        }
      }
      .mobile_ico {
        display: none;
      }
    }
    .mobile_header {

    }

    @media screen and (max-width: 1000px) {
      .w1200 {
        .header_logo {
          width: 5.2rem;
          margin: 0 0.5rem;
          .logo {
            width: 5.2rem;
            margin: 1rem 0 0 0;
          }
        }
        .menu {
          display: none;
        }
        .header_language {
          width: 61.5%;
          .top-search {
            width: 100%;
            .top_height {
              line-height: 0.25rem;
              margin-left: -64%;
              i {
                display: none;
              }
            }
            .el-input {
              width: 100%;
              margin-top: -0.8rem;
              input {
                width: 5rem;
                &:focus {
                  width: 100%;
                }
              }
            }
          }
          .language {
            display: none;
          }
        }
        .mobile_ico {
          display: block;
          i {
            margin: 1rem 1rem 0 0;
            font-size: 1.4rem;
          }
        }
      }

      .mobile_header {
        width: 100%;
        min-height: 35rem;
        position: absolute;
        right: 0;
        top: 3.4rem;
        z-index: 9999;
        .language1 {
          display: initial;
          float: none;
          position: absolute;
          right: 0;
          top: 15rem;
          height: 2rem;
          line-height: 2rem;
          width: 10rem;
          background-color: #FFFFFF;
          text-align: center;
        }
        .language2 {
          display: initial;
          float: none;
          position: absolute;
          right: 0;
          top: 17rem;
          height: 2rem;
          line-height: 2rem;
          width: 10rem;
          background-color: #FFFFFF;
          text-align: center;
        }
      }
    }

    @media screen and (max-width: 320px) {
      .w1200 {
        .header_language {
          width: 55%;
          .top-search {
            width: 100%;
            .top_height {
              line-height: 0.25rem;
              margin-left: -61%;
            }
          }
        }
      }
    }

  }
</style>
