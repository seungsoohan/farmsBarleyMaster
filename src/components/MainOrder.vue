<template >
  <div class="">
    <md-tabs class="md-primary" md-alignment="fixed" md-sync-route md-active-tab="tab-pizza">
      <md-tab class="fb-menu-tab" id="tab-pizza" md-label="주문 리스트" to="/mainTab/schdule" exact>
        <div class="md-layout md-alignment-left-center ">
          <!-- <md-toolbar class="md-primary">
            <h3 class="md-layout-item md-size-100 md-title">순차적 주문 리스트</h3>
          </md-toolbar>
          <div class="md-layout-item md-size-25" v-for="menu in ORDER_MENU" >
            <md-card class="fb-list-card-box" style="margin: 4px 4px; " >
              <md-card-content class="fb-list-card" style="">
              <p>{{menu.index}}번</p>
              <p>{{menu.name}}</p>
              <p>{{menu.price}}원</p>

              <md-button class=" md-raised md-default md-accent" @click="takeComplete(menu)">
                수령완료
              </md-button>

              </md-card-content>
            </md-card>
          </div> -->

        </div>
      </md-tab>

      <md-tab class="fb-menu-tab" id="tab-a" md-label="조리 완료" to="/mainTab/menu" exact>
        <div class="md-layout md-alignment-center-center fb-menuHistory-container">
          <!-- <button type="button" name="button" @click="ringPlay()">aa</button> -->
          <div class="md-layout-item md-size-90 fb-menuHistory-box"  v-for="menu in MENU" >
            <md-card v-if="menu.state < 2">
              <md-card-content class="md-layout md-alignment-center-center">
              <span class="md-layout-item md-size-10">{{menu.orderIndex}}번</span>
              <span class="md-layout-item md-size-40" style="font-weight: 900;">{{menu.full}}</span>
              <!-- <span class="md-layout-item md-size-10" style="font-weight: 900; font-size:18px;">{{menu.makingTime.total}}분</span> -->
              <span class="md-layout-item md-size-10" style="font-weight: 900; font-size:18px;">{{menu.quantity}}판</span>
              <!-- <span class="md-layout-item md-size-20">시작</span> -->
              <div class="md-layout-item md-size-20">
                <md-button class=" md-raised md-default" :disabled="menu.state>0" :class="{'md-accent': menu.state==0}" @click="makeStart(menu.orderCode, menu.orderIndex); menu.state=1">
                  시작
                </md-button>
              </div>
              <div class="md-layout-item md-size-20">
                <!-- <md-button class=" md-raised md-default" @click="makeComplete(menu.orderCode, menu.orderIndex)"> -->
                <md-button class=" md-raised md-default " :disabled="menu.state==0" :class="{'md-primary': menu.state==1}" @click="checkComplete(menu.orderCode, menu.orderIndex)">
                  완료
                </md-button>
              </div>


              </md-card-content>
            </md-card>
          </div>

          <md-toolbar class="md-primary">
            <h3 class="md-layout-item md-size-100 md-title">순차적 주문 리스트</h3>
          </md-toolbar>
          <div class="md-layout-item md-size-25" v-for="menu in ORDER_MENU" >
            <md-card class="fb-list-card-box" style="margin: 4px 4px; " >
              <md-card-content class="fb-list-card" style="">
              <p>{{menu.index}}번</p>
              <p>{{menu.name}}</p>
              <p>{{menu.price}}원</p>
              <p>{{menu.phoneNum}}</p>

              <md-button class=" md-raised md-default md-accent" @click="takeComplete(menu)">
                수령완료
              </md-button>

              </md-card-content>
            </md-card>
          </div>

        </div>





        <md-dialog-confirm
          :md-active.sync="modalActive"
          md-title="조리완료"
          md-content=""
          md-confirm-text="확인"
          md-cancel-text="취소"
          @md-cancel="onCancel"
          @md-confirm="onConfirm" />



        <!-- <md-button class="md-primary md-raised" @click="modalActive = true">Confirm</md-button>
        <span v-if="value">Value: {{ value }}</span> -->

      </md-tab>
    </md-tabs>
  </div>

</template>

<script>
import axios from 'axios'
import moment from 'vue-moment'

export default {
  name: 'order-history',
  data() {
    return {
        stdId: 2130,
        MENU: [],
        MENUALL: [],
        ORDER_MENU: [],
        menuList: [],
        // orderTime: []
        orderTime: 123,
        isH: true,
        timer: '',
        lastIndex: 0,
        modalActive: false,
        value: null,
        postCode: null,
        postIdx: null
    }
  },
  methods: {
    getOrdered: function() {

      axios
      .get('https://ow696its6d.execute-api.ap-northeast-2.amazonaws.com/v1')
      .then((response) =>  {
        console.log(response);
        this.num = response.data.Count;
        if(this.num != 0) {
          this.orderTime = response.data.Items[0].startTime;

          response.data.Items.sort(function(a,b) {
          //   return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
              return a.orderIndex < b.orderIndex ? -1 : a.orderIndex > b.orderIndex ? 1 : 0;
              // return a.orderIndex > b.orderIndex ? -1 : a.orderIndex < b.orderIndex ? 1 : 0;
          });

          // for(var i=0 ; i< response.data.Count ; i++) {
          //   if(response.data.Items[i].menuId.slice(0,2) == "pc") {
          //     console.log("cica");
          //     console.log(response.data.Items);
          //     var temp = response.data.Items[i];
          //     response.data.Items.unshift(temp);
          //     response.data.Items.splice(i+1,1);
          //     console.log(response.data.Items);
          //   }
          // }

          if(this.lastIndex != response.data.Items[response.data.Count-1].orderIndex) {
            this.updateUI(response.data.Items);
          }
          else {
            console.log("same!", this.lastIndex, response.data.Items[response.data.Count-1].orderIndex);
          }

          this.lastIndex = response.data.Items[response.data.Count-1].orderIndex;
        }

        //


      })
    },
    ringPlay: function() {
      var audio = new Audio(require("../assets/ring.wav"));
        audio.play();
    },
    updateUI: function(data) {
      this.ORDER_MENU = new Array();
      this.MENU = new Array();
      var showCnt = 0;
      var prevNum = 0;

      var tempSauceName = null; // for test 위험

      var itemParams = new Object();
      itemParams.name = "";
      itemParams.index = 0;
      itemParams.price = 0;
      itemParams.orderCode = new Array();

      for(var i=0 ; i<this.num ; i++) {
        this.MENUALL.push(data[i]);
        if(i==0) {
          prevNum = data[0].orderIndex;
        }
        if(showCnt < 999) {
          // if(data[i].makedFood == 0 || data[i].menuId.slice(0,1) == 'c' || data[i].menuId.slice(0,2) == 'pj' || data[i].menuId.slice(0,2) == 'ss') {
          if((data[i].makedFood == 0 || data[i].menuId.slice(0,1) == 'c' || data[i].menuId.slice(0,2) == 'pj') && data[i].menuId.slice(0,2) != 'c2') {
            this.MENU.push(data[i]);
            showCnt++;
          }

          if(data[i].menuId.slice(0,2) == 'c2') {
            if(tempSauceName != null) {
              console.log(this.MENU[i], i, tempSauceName);
              data[i].full = data[i].full + tempSauceName;
              tempSauceName = null;

              this.MENU.push(data[i]);
            }
            else {
              this.MENU.push(data[i]);
            }
          }
          console.log(i, data[i].menuId);
        }



        if(data[i].menuId.slice(0,2) == 'ss') {
          var found = false;
          for(var j=0 ; j<this.MENU.length ; j++) {
            if(data[i].orderIndex == this.MENU[j].orderIndex) {
              this.MENU[j].full = this.MENU[j].full + data[i].full;
              found = true;
              tempSauceName = null;
            }
          }
          if(!found) {
            tempSauceName = data[i].full;
          }
        }




        // this.ORDER_MENU.push()

        if(prevNum == data[i].orderIndex) {
          itemParams.name = itemParams.name  + data[i].full +  " #  ";
          itemParams.index = data[i].orderIndex;
          itemParams.phoneNum = data[i].phoneNum;
          itemParams.orderCode.push(data[i].orderCode);
          itemParams.price += data[i].price;
        }
        else{
            this.ORDER_MENU.push(itemParams);
            itemParams = new Object();
            itemParams.name = data[i].full +  " #  ";
            itemParams.index = data[i].orderIndex;
            itemParams.phoneNum = data[i].phoneNum;
            itemParams.orderCode = [data[i].orderCode];
            itemParams.price = data[i].price;
        }

        prevNum = data[i].orderIndex;
      }

      if(this.num > 0) {
        this.ORDER_MENU.push(itemParams);
      }

      console.log(this.ORDER_MENU);
      console.log(data);

      this.ringPlay();
    },
    makeStart: function(code, idx) {
      console.log(code, idx);


      axios
      .post('https://ow696its6d.execute-api.ap-northeast-2.amazonaws.com/v1',
          {
            "orderCode": code,
            "orderIndex": idx,
            "state": 1
          }
      )
      .then((resp) => {
        console.log(resp);


      })
    },
    makeComplete: function(code, idx) {
      axios
      .post('https://ow696its6d.execute-api.ap-northeast-2.amazonaws.com/v1',
          {
            "orderCode": code,
            "orderIndex": idx,
            "state": 2
          }
      )
      .then((resp) => {
        console.log(resp);


      })
    },
    checkComplete: function(code, idx) {
      this.modalActive = true;
      this.postCode = code;
      this.postIdx = idx;
    },
    onConfirm () {
      console.log("complete", this.postCode, this.postIdx);
      this.makeComplete(this.postCode, this.postIdx);
      console.log(this.MENU);
      var idx = this.MENU.findIndex(x=> x.orderIndex === this.postIdx);
      this.MENU.splice(idx,1);

      // var idx2 = this.ORDER_MENU.findIndex(x=> x.index === this.postIdx);
      // this.ORDER_MENU[idx2].complete = true;
      // console.log(test);
      // this.MENU = [];
    },
    onCancel () {
      this.value = 'Disagreed'
    },

    test: function() {
      console.log("z");
    },
    takeComplete: function(data) {
      console.log(data);
      // console.log(data.orderCode.slice(0,data.orderCode.length-3));

      for(var i=0 ; i<data.orderCode.length ; i++) {
        axios
        .post('https://ow696its6d.execute-api.ap-northeast-2.amazonaws.com/v1',
            {
              "orderCode": data.orderCode[i],
              "orderIndex": data.index,
              "state": 3
            }
        )
        .then((resp) => {
          console.log(resp);


        })
      }

      var idx = this.ORDER_MENU.findIndex(x=> x.index === data.index);
      this.ORDER_MENU.splice(idx,1);

      // console.log(this.ORDER_MENU);
      // console.log(idx);

    }

  },
  created: function() {
    this.getOrdered();
    this.timer = setInterval(this.getOrdered, 20000);
    // this.timer = setInterval(this.test, 60000);
  }


}
</script>

<style lang="css" scoped>

.fb-menuHistory-box {
  margin: 10px 0px;
}

.fb-menuHistory-container {
  margin-bottom: 20px;
}

.fb-list-card {
  padding-bottom: 8px !important;
  min-height: 80px;

}

.fb-list-card-box {
  height: 100%;
}
</style>
