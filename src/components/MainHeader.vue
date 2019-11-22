<template>
  <div class="page-container">
      <md-app>
        <md-app-toolbar class="md-primary fb_header" >

          <p class="md-title">
            <div class="">
              Farms Barley
              Pizza
            </div>
            <md-button class="md-raised md-accent" @click="resetOrderIndex()">주문번호초기화</md-button>
            <md-button class="md-raised md-accent" @click="shopStateChange(true)">영업시작</md-button>
            <md-button class="md-raised md-accent" @click="shopStateChange(false)">영업마감</md-button>
          </p>
        </md-app-toolbar>
      </md-app>

      <md-dialog-confirm
        :md-active.sync="modalActive1"
        md-title="주문번호초기화"
        md-content=""
        md-confirm-text="확인"
        md-cancel-text="취소"
        @md-confirm="onConfirm1" />
      <md-dialog-confirm
        :md-active.sync="modalActive2"
        md-title="영업시작"
        md-content=""
        md-confirm-text="확인"
        md-cancel-text="취소"
        @md-confirm="onConfirm2" />
      <md-dialog-confirm
        :md-active.sync="modalActive3"
        md-title="영업마감"
        md-content=""
        md-confirm-text="확인"
        md-cancel-text="취소"
        @md-confirm="onConfirm3" />

  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'main-header',
  data() {
    return {
        modalActive1: false, modalActive2:false, modalActive3: false,
        isResetModal: false
    }
  },
  methods: {
    shopStateChange: function(state) {
      if(state) {
        this.modalActive2 = true;
      }
      else{
        this.modalActive3 = true;
      }

    },
    resetOrderIndex: function() {
      this.modalActive1 = true;
    },
    onConfirm1: function() {
      axios
      .put('https://ow696its6d.execute-api.ap-northeast-2.amazonaws.com/v1/master',
          {
          }
      )
      .then((resp) => {
        console.log(resp);
      })
    },
    onConfirm2: function() {
      axios
      .post('https://ow696its6d.execute-api.ap-northeast-2.amazonaws.com/v1/master',
          {
            "state": true
          }
      )
      .then((resp) => {
        console.log(resp);
      })
    },
    onConfirm3: function() {
      axios
      .post('https://ow696its6d.execute-api.ap-northeast-2.amazonaws.com/v1/master',
          {
            "state": false
          }
      )
      .then((resp) => {
        console.log(resp);
      })
    },
  }
}
</script>

<style scoped>
  .md-app {
    max-height: 400px;
    border: 1px solid rgba(#000, .12);
    text-align: center;
  }

  .fb_header {
    background-color: #eecb77;
    justify-content: flex-end;
  }

  /* .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  } */
</style>
