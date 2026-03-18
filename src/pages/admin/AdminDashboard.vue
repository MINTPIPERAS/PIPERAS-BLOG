<script setup>
// 这里是管理员后台管理页
import { useRouter } from "vue-router"

const router = useRouter()

const logout = () => {

    localStorage.removeItem("token")

    router.push("/admin/login")

}
</script>

<template>

    <div class="admin">

        <h1 >后台管理</h1>

        <div class="menu">

            <button @click="$router.push('/blog/create')">
                写文章
            </button>

            <button @click="$router.push('/admin/posts')">
                文章管理
            </button>

             <button @click="$router.push('/admin/comments')">
                评论管理
            </button>

            <button @click="logout">
                退出登录
            </button>

        </div>

    </div>

</template>

<style>
.admin {

    max-width: 900px;
    margin: auto;

    padding: 40px;

    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);

    border-radius: 12px;

}

.menu {

    display: flex;
    gap: 20px;

}
</style>