<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PasswordInput from "@/components/PasswordInput.vue";
import { useAuthStore } from "@/stores/auth";
import { ApiError } from "@/api/http";
import { emailError, passwordError, usernameError } from "@/utils/validate";

// 切换到登录 tab（由父组件 EntryView 处理）
const emit = defineEmits<{ switch: [] }>();

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const form = reactive({ username: "", email: "", password: "", confirm: "" });
const touched = reactive({
  username: false,
  email: false,
  password: false,
  confirm: false,
});
// 服务端返回的字段级错误（409 重名/重邮箱）
const serverErrors = reactive({ username: "", email: "" });
const errorMsg = ref("");
const loading = ref(false);

const usernameRef = ref<{ focus: () => void }>();
const emailRef = ref<{ focus: () => void }>();
const passwordRef = ref<{ focus: () => void }>();
const confirmRef = ref<{ focus: () => void }>();

const errors = computed(() => ({
  username: usernameError(form.username),
  email: emailError(form.email),
  password: passwordError(form.password),
  confirm: !form.confirm
    ? "请再次输入密码"
    : form.confirm === form.password
      ? ""
      : "两次输入的密码不一致",
}));

type Field = "username" | "email" | "password" | "confirm";

/** 字段当前应显示的错误（服务端错误优先，其次触碰过的本地校验） */
function showError(field: Field): string {
  if (serverErrors[field as "username" | "email"])
    return serverErrors[field as "username" | "email"];
  return touched[field] ? errors.value[field] : "";
}

/** 字段是否校验通过（用于绿色提示与边框） */
function isOk(field: Field): boolean {
  return !!form[field] && !errors.value[field] && !showError(field);
}

function onBlur(field: Field) {
  touched[field] = true;
}

function onFieldInput(field: Field) {
  if (field === "username" || field === "email") serverErrors[field] = "";
}

// 用户名输入即规范：大写 + 仅字母数字
function onUsernameInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const v = input.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 20);
  input.value = v;
  form.username = v;
  serverErrors.username = "";
}

const fieldRefs: Record<Field, typeof usernameRef> = {
  username: usernameRef,
  email: emailRef,
  password: passwordRef,
  confirm: confirmRef,
};

async function submit() {
  errorMsg.value = "";
  touched.username = touched.email = touched.password = touched.confirm = true;
  const firstBad = (["username", "email", "password", "confirm"] as Field[]).find(
    (f) => errors.value[f],
  );
  if (firstBad) {
    fieldRefs[firstBad].value?.focus();
    return;
  }
  loading.value = true;
  try {
    await auth.register(
      form.username,
      form.password,
      form.email.trim().toLowerCase(),
    );
    // 注册即登录，默认进入答题设置页；带 redirect 则回跳
    const redirect =
      typeof route.query.redirect === "string" ? route.query.redirect : "/setup";
    router.push(redirect);
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.code === "USERNAME_TAKEN") {
        serverErrors.username = e.message;
        usernameRef.value?.focus();
        return;
      }
      if (e.code === "EMAIL_TAKEN") {
        serverErrors.email = e.message;
        emailRef.value?.focus();
        return;
      }
      errorMsg.value = e.message;
    } else {
      errorMsg.value = "注册失败，请稍后再试";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>

    <div class="form-item">
      <label class="form-label" for="reg-username">用户名</label>
      <input
        id="reg-username"
        ref="usernameRef"
        class="text-input"
        :class="{
          'input-error': showError('username'),
          'input-ok': isOk('username'),
        }"
        type="text"
        :value="form.username"
        maxlength="20"
        autocomplete="username"
        placeholder="2~20 位大写字母或数字"
        @input="onUsernameInput"
        @blur="onBlur('username')"
      />
      <div class="field-msg" :class="{ ok: isOk('username') }">
        {{ showError("username") || (isOk("username") ? "✓" : "") }}
      </div>
    </div>

    <div class="form-item">
      <label class="form-label" for="reg-email">邮箱（用于找回密码）</label>
      <input
        id="reg-email"
        ref="emailRef"
        v-model="form.email"
        class="text-input"
        :class="{ 'input-error': showError('email'), 'input-ok': isOk('email') }"
        type="email"
        autocomplete="email"
        placeholder="example@qq.com"
        @input="onFieldInput('email')"
        @blur="onBlur('email')"
      />
      <div class="field-msg" :class="{ ok: isOk('email') }">
        {{ showError("email") || (isOk("email") ? "✓" : "") }}
      </div>
    </div>

    <div class="form-item">
      <label class="form-label" for="reg-password">密码</label>
      <PasswordInput
        id="reg-password"
        ref="passwordRef"
        v-model="form.password"
        autocomplete="new-password"
        placeholder="8 位以上，字母+数字组合"
        :state="showError('password') ? 'error' : isOk('password') ? 'ok' : ''"
        @blur="onBlur('password')"
      />
      <div class="field-msg" :class="{ ok: isOk('password') }">
        {{ showError("password") || (isOk("password") ? "✓" : "") }}
      </div>
    </div>

    <div class="form-item">
      <label class="form-label" for="reg-confirm">确认密码</label>
      <PasswordInput
        id="reg-confirm"
        ref="confirmRef"
        v-model="form.confirm"
        autocomplete="new-password"
        placeholder="再输入一次密码"
        :state="showError('confirm') ? 'error' : isOk('confirm') ? 'ok' : ''"
        @blur="onBlur('confirm')"
      />
      <div class="field-msg" :class="{ ok: isOk('confirm') }">
        {{ showError("confirm") || (isOk("confirm") ? "✓" : "") }}
      </div>
    </div>

    <button class="primary-btn" type="submit" :disabled="loading">
      {{ loading ? "注册中…" : "注册并登录" }}
    </button>
  </form>

  <p class="bottom-links">
    <button type="button" class="link-btn" @click="emit('switch')">
      已有账号？去登录
    </button>
  </p>
</template>

<style scoped lang="scss">
.bottom-links {
  text-align: center;
  margin-top: 0.16rem;
  font-size: 0.14rem;
}
</style>
