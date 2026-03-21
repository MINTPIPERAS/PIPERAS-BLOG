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
    flex-wrap: wrap;

}

.menu button {
    flex: 1;
    min-width: 120px;
}

/* 平板设备优化 */
@media (max-width: 900px) {
  .admin {
    padding: 30px;
    margin: 16px;
  }

  .menu {
    gap: 12px;
  }
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .admin {
    padding: 16px;
    margin: 12px;
    border-radius: 8px;
  }

  h1 {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .menu {
    flex-direction: column;
    gap: 8px;
  }

  .menu button {
    min-width: auto;
    padding: 10px;
    font-size: 13px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .admin {
    padding: 12px;
    margin: 8px;
  }

  h1 {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .menu button {
    padding: 8px;
    font-size: 12px;
  }
}
</style>