<template>
  <div>
    <b-button v-if="!address" @click="login">登录</b-button>
    <div>
      <b-input v-model="address"></b-input>
      <span>Address: {{ address }}</span>
      <br />
      <span>ZO Token: {{ zo && zo.address }}</span>
      <br />
      <span>ZO Balance: {{ zoBalance | uints }}</span>

      <br />
      <span>ZOL Token: {{ zol && zol.address }}</span>
      <br />
      <span>ZOL Balance: {{ zol && zolBalance | uints}}</span>
      <br />
      <span>ZOL Details:</span>
      <div v-for="detail in zolDetails" :key="detail.timestamp">
        <span>amount: {{ detail.amount | uints }}</span
        ><br />
        <span>timestamp: {{ detail.timestamp | timestamp }}</span
        ><br />
      </div>
      <br/>
      <b-button v-if="transferEn" @click="transfer">转账</b-button>
    </div>
  </div>
</template>

<script>
import {contracts} from "../lib/contract";
import { ethers } from "ethers";
export default {
  name: "HelloWorld",
  data(){return {
    address:null,
    zo:null,
    zol:null,
    zoBalance:null,
    zolBalance:null,
    zolDetails:[],
    isTransfer: false
  };},
  props: {
    msg: String,
  },
  methods:{
    async login(){
      const address = await window.ethereum.enable();
      this.address = address[0];
      console.log('click')
    },
    async transfer(){
      const from = '0xf3Bed9D5F0C965f852a3792A9Af255B25C9640B0';
      const to = '0x9A69Db579EEfcAEDabb4450358D2cb2E8Ea8cC5c';
      const inputs = [from, to, this.zolDetails.map(detail=>detail.timestamp), this.zolDetails.map(detail=>detail.amount.div(2)), '0x'];
      console.log(inputs);
      if(this.address.toLowerCase() != from.toLowerCase()) {
        alert(`请使用地址 0xf3Bed9D5F0C965f852a3792A9Af255B25C9640B0`);
        throw "wrong: 0xf3Bed9D5F0C965f852a3792A9Af255B25C9640B0";
      }
      const balance = ethers.BigNumber.from("6125000000000000000000000");
      if(!this.zolBalance.eq(balance)) {
        alert("wrong balance");
        throw "wrong balance";
      }
      if(this.isTransfer) return;
      const tx = await this.zol.safeBatchTransferFrom(...inputs);
      console.log(tx);
      this.isTransfer = true;
    },
    async update(){
      const c = contracts(window.ethereum);
      this.zo = c.ZO;
      this.zol = c.ZOL;
      window.x = this.zol;
      this.zoBalance = await this.zo.balanceOf(this.address);
      this.zolBalance = await this.zol["balanceOf(address)"](this.address);
      window.zb = this.zolBalance;
      const zolDetails = await this.zol.lockDetails(this.address);
      console.log(zolDetails);
      this.zolDetails = zolDetails.map(detail=>({amount:detail[1], timestamp:detail[0].toNumber()}));
    }
  },
  computed:{
    transferEn(){
      const from = '0xf3Bed9D5F0C965f852a3792A9Af255B25C9640B0';
      return this.address && this.address.toLowerCase() == from.toLowerCase();
    }
  },
  watch: {
    address(){
      if(this.address && this.address.length >= 40) this.update();
    }
  },
  filters:{
    timestamp(t) {
      const d = new Date();
      d.setTime(t*1000);
      return d.toLocaleString();
    },
    uints(v) {
      return v && ethers.utils.formatUnits(v)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
