<template>
  <div class="c_list" v-loading="nodeListLoading">
    <!-- <div class="c_list_search">
      <div class="type_select fl">
        <SelectBar v-model="nodeTypeRegion" :typeOptions="nodeTypeOptions" typeName="nodeType"
                   @change="changeNodeType"></SelectBar>
      </div>
      <div class="status_select fl">
        <SelectBar v-model="nodeStatusRegion" :typeOptions="nodeStatusOptions" typeName="nodeStatus"
                   @change="changeNodeStatus"></SelectBar>
      </div>
      <div class="search_input">
        <el-input v-model="searchValue" class="search" :placeholder="$t('consensus.search')"
                  suffix-icon="el-icon-search"></el-input>
        <i class="iconfont fr click" :class="viewList ? 'icon-list_icon':'icon-chart_icon'"
           @click="viewList = !viewList"></i>
      </div>
    </div> -->
    <div v-show="!viewList" class="c_tabs">
      <el-table :data="searchData" stripe border style="width: 100%">
        <el-table-column label="" width="30">
        </el-table-column>
        <el-table-column label="ID" min-width="150" align="left">
          <template slot-scope="scope"><span class="cursor-p click uppercase"
                                             @click="toUrl('consensusInfo',scope.row.txHash)">{{ scope.row.agentId }}</span>
          </template>
          <!--<template slot-scope="scope"><span class="uppercase">{{ scope.row.agentId }}</span></template>-->
        </el-table-column>
        <el-table-column :label="$t('public.alias')" width="250" align="left">
          <template slot-scope="scope"><span>{{ scope.row.agentAlias ? scope.row.agentAlias : '-' }}</span></template>
        </el-table-column>
        <el-table-column prop="creditValue" :label="$t('public.creditValue')" width="150"
                         align="left"></el-table-column>
        <el-table-column :label="$t('public.proportion')" width="100" align="left">
          <template slot-scope="scope">{{ scope.row.commissionRate }}%</template>
        </el-table-column>
        <el-table-column :label="$t('public.bond')+'(NULS)'" width="150" align="left">
          <template slot-scope="scope">{{ scope.row.deposit }}</template>
        </el-table-column>
        <el-table-column :label="$t('public.entrust')+'(NULS)'" width="150" align="left">
          <template slot-scope="scope"><span class="cursor-p click uppercase"
                                             @click="toUrl('consensusInfo',scope.row.txHash,'three')">{{ scope.row.totalDeposit}}</span>
          </template>
          <!-- <template slot-scope="scope">{{ scope.row.totalDeposit/100000000 }}</template>-->
        </el-table-column>
        <el-table-column prop="depositCount" :label="$t('public.participants')" width="150"
                         align="left"></el-table-column>
      </el-table>
    </div>

    <div v-show="viewList" class="card-info">
      <div class="card fl click" v-for="item in nodeList"
           :key="item.agentId">
        <h3 class="tabs_title tabs_infos" :class="item.agentAlias ? '' : 'uppercase'">
          <div class='avatar'>
              <div>
                <img :src="item.avatar" alt="">
              </div>
          </div>
          <!-- {{ item.agentAlias ? item.agentAlias : item.agentId }} -->
          <i v-if="item.checkstatus == '0' && id == item.id " class="iconfont fr font18 buldGreen"></i>
          <i v-if="item.checkstatus == '2' && id == item.id " class="iconfont fr font18 buldRed"></i>
          <i v-if="item.checkstatus == '1' && id == item.id " class="iconfont fr font18 icon-await"></i>
          <i class="iconfont fr font18"
              @click="toUrl('consensusInfo',item.id)"
             :class="item.status !=='0'? 'icon-consensus_icon': 'icon-wait_red_icon'"></i>
          <i @click='AlterMsg(item.id)' class="iconfont fr font18 el-icon-edit" v-if=" role == 'admin' || id == item.id"></i>
        </h3>
        <ul>
          <li class="font12 fl">{{$t('public.alias')}}<span
                  class="fr">{{ item.agentAlias ? item.agentAlias : '-' }}</span></li>
          <li class="font12 fl">{{$t('public.proportion')}}<span class="fr">{{ item.commissionRate }}%</span></li>
          <li class="font12 fl">{{$t('public.bond')}}<span class="fr">{{ item.deposit }}<label
                  class="fCN"> NULS</label></span></li>
          <li class="font12 fl">{{$t('public.participants')}}<span class="fr">{{ item.depositCount }}</span></li>
          <li class="font12 fl">{{$t('public.entrust')}}<span class="fr">{{item.totalDeposit }}<label
                  class="fCN"> NULS</label></span></li>
          <li class="font12 fl">{{$t('public.creditValue')}}<span class="fr">{{item.creditValue}}</span></li>
          <li class="font12 fl newly">相关链接
            <span class="fr">{{item.link}}</span>
          </li>
          <li class="font12 fl newly">联系方式
            <span class="fr">{{item.phone}} / {{item.email}}</span>
          </li>
          <li class="font12 fl newly">描述
            <span class="fr">{{item.description | filterFun}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectBar from '@/components/SelectBar';
  import {timesDecimals} from '@/api/util.js';
  import axios from 'axios';

  export default {
    data() {
      return {
        //是否显示列表
        viewList: true,
        //排序下拉框选择列表
        nodeTypeOptions: [
          {value: 0, label: '0'},
          {value: 1, label: '1'},
          {value: 2, label: '2'},
          {value: 3, label: '3'},
          {value: 4, label: '4'},
        ],
        //排序选中值
        nodeTypeRegion: 0,
        //节点类型排序
        nodeStatusOptions: [
          {value: 0, label: '0'},
          {value: 1, label: '1'},
          {value: 2, label: '2'},
          {value: 3, label: '3'},
        ],
        nodeStatusRegion: 0,
        //节点列表
        nodeList: [],
        nodeListLoading: true,
        //搜索框内容
        searchValue: '',
        //分页数据
        pager: {
          total: 0,
          page: 1,
          rows: 200,
        },
        id: localStorage.node_id,
        role: localStorage.role
      }
    },
    components: {
      SelectBar
    },
    created() {
      // this.getConsensusNodes(this.pager.page, this.pager.rows, this.nodeStatusRegion)
      this.getNodeMsg();
    },
    computed: {
      //数据筛选
      searchData: function () {
        // let search = this.searchValue;
        // //console.log(this.nodeList);
        // if (search) {
        //   return this.nodeList.filter(function (product) {
        //     return Object.keys(product).some(function (key) {
        //       return String(product[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
        //     })
        //   })
        // }
        // return this.nodeList;
      },

    },
    methods: {
      /**
       * 获取共识列表
       */
      // async getConsensusNodes(page, rows, type) {
        // this.$post('/api.nuls.io/', 'getConsensusNodes', [page, rows, type])
        //   .then((response) => {
        //     console.log(response);
        //     if (response.hasOwnProperty("result")) {
        //       for (let item of response.result.list) {
        //         item.deposit = timesDecimals(item.deposit, 8);
        //         item.bozhengjin = item.deposit;
        //         item.totalDeposit = Number(timesDecimals(item.totalDeposit, 8)).toFixed(2);
        //       }
        //       this.nodeList = response.result.list;
        //       this.nodeListLoading = false;
        //     }
        //   }).catch((error) => {
        //   console.log(error)
        // })
      // },
      getNodeMsg(){
        let url = 'http://nuls.yqkkn.com/nodes/0';
        axios.get(url)
        .then( (res) => {
          let data = res.data;
          this.nodeList = data.result;
          this.nodeListLoading = false;
          console.log(this.nodeList)
        })
      },
      /**
       * 路径跳转
       * @param name
       * @param hash
       * @param tabName
       */
      toUrl(name,id) {
        this.$router.push({
          name: name,
          query: { id : id }
        })
      },

      /**
       *  根据数据类型排序
       **/
      changeNodeType(type) {
        this.nodeTypeRegion = parseInt(type);
        switch (type) {
          case 1:
            this.nodeTypeSort(this.nodeList, 'creditValue');
            break;
          case 2:
            this.nodeTypeSort(this.nodeList, 'commissionRate');
            break;
          case 3:
            this.nodeTypeSort(this.nodeList, 'totalDeposit');
            break;
          case 4:
            this.nodeTypeSort(this.nodeList, 'bozhengjin');
            break;
          default:
            this.getConsensusNodes(this.pager.page, this.pager.rows, 0, '')
        }
      },

      /**
       *  根据节点状态排序
       **/
      changeNodeStatus(type) {
        this.nodeStatusRegion = type;
        this.getConsensusNodes(this.pager.page, this.pager.rows, this.nodeStatusRegion)
      },
      AlterMsg(id){
        this.$router.push({path:'/alterMsg',query:{ id:id }});
      },
      /**
       * 数组排序
       */
      nodeTypeSort(arr, name) {
        //console.log(name);
        let compare = function (prop) {
          return function (obj1, obj2) {
            let val1 = obj1[prop];
            let val2 = obj2[prop];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
              val1 = Number(val1);
              val2 = Number(val2);
            }
            if (val1 > val2) {
              return -1;
            } else if (val1 < val2) {
              return 1;
            } else {
              return 0;
            }
          }
        };
        return arr.sort(compare(name));
      },
    },
    filters:{
        filterFun(value) {
          if(value&& value.length > 20) {
          value= value.substring(0,20)+ '…';
          }
          return value;
        }
    },
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .c_list {
    .c_list_search {
      .type_select {
        width: 174px;
        margin-left: 5px;
        @media screen and (max-width: 1000px) {
          width: 45%;
          margin-left: 0;
        }
      }
      .status_select {
        width: 174px;
        margin-left: 10px;
        @media screen and (max-width: 1000px) {
          width: 45%;
          margin-left: 0;
          float: right;
          margin-right: 0;
        }
      }

      .search_input {
        .search {
          width: 360px;
          margin-left: 20px;
          @media screen and (max-width: 1000px) {
            width: 80%;
            margin: 0.5rem 0 0 0;
          }
          .el-input__inner {
            height: 30px;
            line-height: 30px;
            &:focus {
              border-color: @Ncolour;
            }
          }
          .el-input__icon {
            line-height: 30px !important;
          }
        }
        .iconfont {
          @media screen and (max-width: 1000px) {
            font-size: 1rem;
            margin: 1rem 0 0 0 ;
          }
        }
      }
    }
    .c_tabs {
      margin: 20px auto 100px;
    }
    .card-info {
      min-height: 600px;
      .card {
        width: 588px;
        margin: 20px 0 0 0;
        border: @BD1;
        &:first-child {
          margin: 16px 0 0 0;
        }
        &:nth-child(2) {
          margin: 16px 0 0 0;
        }
        &:nth-child(2n) {
          margin-left: 20px;
        }
        &:last-child {
          margin-bottom: 100px;
        }
        .tabs_infos {
          padding: 0 0 0 20px;
          display: flex;
          .avatar{
            flex: 1;
            position: relative;
            >div{
              width: 30px;
              height: 30px;
              border-radius: 50%;
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto 0;
              >img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .icon-wait_red_icon, .icon-consensus_icon,.el-icon-edit {
            margin: 15px 30px 0 0;
            color: @Ncolour;
          }
          .icon-wait_red_icon {
            color: red;
          }
        }
        ul {
          background-color: @Bcolour1;
          height: 180px;
          padding: 0 30px;
          li {
            width: 50%;
            line-height: 30px;
            color: @Acolor3;
            span {
              width: 150px;
              text-align: left;
              color: @Mcolour;
            }
          }
          .newly{
            width: 100%;
            span {
              width: 79%;
              text-align: left;
              color: @Mcolour;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
      @media screen and (max-width: 1000px) {
        .card {
          width: 100%;
          margin: 1rem 0 0;
          &:first-child {
            margin: 1rem 0 0;
          }
          &:nth-child(2) {
            margin: 1rem 0 0;
          }
          &:nth-child(2n) {
            margin: 1rem 0 0;
          }
          &:last-child {
            margin: 1rem 0 0;
          }

          ul {
            padding: 0 1rem;
            li {
              span {
                width: 55%;
                text-align: center;
                .fCN {
                  display: none;
                }
              }
            }
          }
        }
      }
    }

  }
.buldGreen{
  width: 18px;
  height: 18px;
  margin: 15px 30px 0 0;
  background: url('../../static/images/icon/buldGreen.png') no-repeat center;
  background-size: 18px;
}
.buldRen{
  width: 18px;
  height: 18px;
  margin: 15px 30px 0 0;
  background: url('../../static/images/icon/buldRed.png') no-repeat;
  background-size: 18px;
}
.icon-await{
  width: 18px;
  height: 18px;
  margin: 15px 30px 0 0;
  background: url('../../static/images/icon/await.png') no-repeat;
  background-size: 18px;
}

</style>
