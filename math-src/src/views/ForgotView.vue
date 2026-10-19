<script setup lang="ts">
// 找回密码 = 联系管理员（家长）人工重置：无邮件服务依赖
</script>

<template>
  <h1>找回密码</h1>
  <div class="card">
    <p class="icon">🔑</p>
    <p class="desc">
      忘记密码了？请把你的<b>用户名</b>告诉管理员（家长），由管理员重置后告诉你新密码。
    </p>
    <p class="desc sub">小提示：用户名由 2~20 位文字或数字组成，不含空格或特殊符号。</p>
    <button class="primary-btn" @click="$router.push('/')">返回登录</button>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.icon {
  text-align: center;
  font-size: 0.4rem;
  margin-bottom: 0.1rem;
}

.desc {
  font-size: 0.15rem;
  color: $text-main;
  line-height: 1.7;
  text-align: center;
  margin-bottom: 0.1rem;

  &.sub {
    font-size: 0.13rem;
    color: $text-muted;
    margin-bottom: 0.2rem;
  }
}
</style>
