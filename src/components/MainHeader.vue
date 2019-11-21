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
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'main-header',
  methods: {
    shopStateChange: function(state) {
      axios
      .post('https://ow696its6d.execute-api.ap-northeast-2.amazonaws.com/v1/master',
          {
            "state": state
          }
      )
      .then((resp) => {
        console.log(resp);


      })
    },
    resetOrderIndex: function() {
      axios
      .put('https://ow696its6d.execute-api.ap-northeast-2.amazonaws.com/v1/master',
          {
            
          }
      )
      .then((resp) => {
        console.log(resp);


      })
    }
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
