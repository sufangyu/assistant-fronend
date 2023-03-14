<template>
  <el-drawer
    v-model="visible"
    :title="props.title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :size="640"
    @open="handleOpen"
    @closed="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" status-icon label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" :disabled="!!form.id" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="类型" prop="role">
        <el-radio-group v-model.number="form.role">
          <el-radio v-for="(k, v) in RoleTypeMessage" :key="k" :label="Number(v)">{{ k }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">确定提交</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { User } from '@/types'
import { RoleTypeMessage } from '@/enum'
import { getUserDetailInfo, manageUser } from '@/api/user'

const emit = defineEmits<{
  (ev: 'success', user?: User | null): void
}>()
const props = withDefaults(defineProps<{ title: string }>(), { title: '' })

const formRef = ref<FormInstance>()
const form = reactive<User>({
  id: undefined,
  username: '',
  nickname: '',
  mobile: '',
  role: undefined
})
const rules = reactive<FormRules>({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  role: [{ required: true, message: '用户角色不能为空', trigger: 'blur' }]
})

const visible = ref(false)
const handleOpen = async (id?: number) => {
  if (id) {
    const { data } = await getUserDetailInfo(id)
    Object.assign(form, data)
  }

  visible.value = true
}
const handleClose = () => {
  // console.log("关闭");
  visible.value = false
  formRef.value?.resetFields()
  form.id = undefined
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      return
    }
    console.log('submit!', fields, form)
    const { data } = await manageUser(form)
    // if (!form.id) {
    //   // 新增用户
    //   console.log(data);
    //   emit("success", data);
    // } else {
    //   // 编辑
    //   ElMessage({
    //     type: "success",
    //     message: "操作成功",
    //     duration: 1000,
    //     onClose: () => {
    //       emit("success");
    //     },
    //   });
    // }
    handleClose()
    emit('success', data.id ? data : null)
  })
}

defineExpose({
  handleOpen,
  handleClose
})
</script>
