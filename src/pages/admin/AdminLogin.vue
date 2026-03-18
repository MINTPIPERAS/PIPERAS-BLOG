<script setup>

// 管理员登录页面

import { ref } from "vue"

import { useRouter } from "vue-router"

import api from "../../api"



const router = useRouter()



const username = ref("")

const password = ref("")

const loading = ref(false)



const login = async () => {



  loading.value = true



  try {



    const res = await api.post("/login", {

      username: username.value,

      password: password.value

    })



    localStorage.setItem("token", res.data.token)



    router.push("/admin")



  } catch (err) {



    alert("登录失败，请检查用户名和密码")



  }



  loading.value = false

}

</script>



<template>



  <div class="login-card">



    <h2>管理员登录</h2>



    <input v-model="username" placeholder="用户名">



    <input type="password" v-model="password" placeholder="密码">



    <button @click="login">

      登录

    </button>



  </div>



</template>



<style>
.login-card {



  width: 360px;

  margin: 120px auto;



  padding: 30px;



  border-radius: 12px;



  background: rgba(255, 255, 255, 0.6);



  backdrop-filter: blur(10px);



  display: flex;

  flex-direction: column;

  gap: 15px;



}



input {



  padding: 10px;

  border-radius: 6px;

  border: 1px solid #ddd;



}



button {



  padding: 10px;

  background: #42b983;

  color: black;

  border: none;

  border-radius: 6px;



}
</style>