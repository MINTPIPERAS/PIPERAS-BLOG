<template>

    <div class="navbar">
    
      <div class="logo">
        PIPERAS' CAVE
      </div>
    
      <div class="nav-links">
    
        <router-link to="/">首页</router-link>
    
        <router-link to="/blog">博客</router-link>
        
        <router-link to="/projects">项目</router-link>

        <router-link to="/contact">联系我</router-link>
    
      </div>
    
    </div>
    
    </template>
    
    <style>
    
    .navbar{
    
      display:flex;
      justify-content:space-between;
      align-items:center;
    
      padding:16px 30px;
    
      backdrop-filter:blur(10px);
    
      background:rgba(255,255,255,0.7);
    
      border-bottom:1px solid rgba(0,0,0,0.05);
    
    }
    
    .logo{
    
      font-weight:bold;
      font-size:20px;
    
    }
    
    .nav-links a{
    
      margin-left:20px;
      text-decoration:none;
      color:#333;
    
    }
    
    .nav-links a:hover{
    
      color:#42b983;
    
    }
    
    </style>