<template>
  <div>
    <NavHeader>
      <!--哈哈哈 我改了一下
      哈哈哈 第二次改
      第三次改
      -->
    </NavHeader>
    <!--或者 因为原来要小写的-->
    <!--<nav-header></nav-header>-->
    <NavBread>
      <span slot="slot-test-1">Goods</span>
      <span slot="slot-test-2">测试一下插槽</span>
    </NavBread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <!--排序-->
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" v-on:click="sortGoods">Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <!--响应式 价格过滤-->
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked == 'all'}"
                     v-on:click="priceChecked = 'all'">All</a></dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" v-on:click="setPriceFilter(index)"
                   v-bind:class="{'cur':priceChecked == index}">
                  {{price.startPrice}} - {{price.endPrice}}
                </a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list 商品列表-->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">

              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-bind:src="'/static/' + item.productImage" alt=""></a>
                    <!--<a href="#"><img v-lazy="'/static/' + item.productImage" alt=""></a>-->
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>

              <!--滚动加载更多插件-->
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading"/>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <!--遮罩-->
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <NavFooter></NavFooter>
  </div>
</template>

<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import './../assets/css/checkout.css'
  import './../assets/css/login.css'
  import NavHeader from './../components/NavHeader'
  import NavFooter from './../components/NavFooter'
  import NavBread from './../components/NavBread'
  import axios from 'axios'


  export default {
    name: "GoodsList",
    data() {
      return {
        msg: 'goods list',
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: true,//true的时候禁止加载更多,
        loading: false,//加载更多的动画
        priceFilter: [
          {
            startPrice: '0.00',
            endPrice: '100.00'
          },
          {
            startPrice: '100.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '5000.00'
          }
        ],
        priceChecked: 'all',
        filterBy: false,
        overLayFlag: false
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted: function () {
      this.getGoodsList();
    },
    methods: {
      getGoodsList(flag) {//获取列表
        //axios.get('/goods/list').then((result) => {//访问mock
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked
        }
        this.loading = true;//显示加载动画
        axios.get('/goods', {
          params: param
        }).then((response) => {//访问数据库
          this.loading = false;//关闭加载动画
          let res = response.data;
          if (res.status == '0') {
            if (flag) {//表示加载更多,累加列表数据
              this.goodsList = this.goodsList.concat(res.result.list);
              if (res.result.count == 0) {//没有更多数据
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
            }
          } else {
            this.goodsList = [];
          }
        }).catch((error) => {
          this.loading = false;//关闭加载动画
          console.log(error);
        });
      },
      sortGoods() {//排序
        this.sortFlag = !this.sortFlag
        this.page = 1;
        this.getGoodsList();
      },
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      },
      showFilterPop() {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      setPriceFilter(index) {
        this.priceChecked = index;
        this.page = 1;
        this.getGoodsList();


        this.closePop();
      },
      closePop() {
        this.filterBy = false;
        this.overLayFlag = false;
      }
    }
  }
</script>

