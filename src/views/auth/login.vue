<template>
  <section class="account-form">
    <h2>用户登录</h2>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="0"
      class="demo-ruleForm"
    >
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="ruleForm.password"
          placeholder="请输入登录密码"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="submitForm(ruleFormRef)">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  username: 'root',
  password: '1234'
})

const rules = reactive<FormRules>({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) {
      return false
    }

    const { data } = await login(ruleForm)
    authStore.login(data.token)
    ElMessage.closeAll()
    ElMessage({
      type: 'success',
      message: '登录成功'
    })

    // 重定向
    const redirect = route.query.redirect as string
    const redirectUrl = redirect ? decodeURIComponent(redirect) : '/'
    router.replace(redirectUrl)
  })
}
</script>

<style lang="scss" scoped>
.account-form {
  width: 640px;
  height: 360px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-320px, -240px);
  border-radius: var(--border-radius-middle);
  background-color: var(--sidebar-bg);
  padding: 36px 48px 0;

  h2 {
    text-align: center;
    margin-bottom: 24px;
  }
}
</style>
