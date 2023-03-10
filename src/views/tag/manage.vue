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
    <el-form ref="formRef" :model="form" :rules="rules" status-icon label-width="60px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">确定提交</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { Tag } from '@/types'
import { getTagDetailInfo, manageTag } from '@/api/tag'

const emit = defineEmits<{
  (ev: 'success'): void
}>()

const props = withDefaults(defineProps<{ title: string }>(), { title: '' })

const formRef = ref<FormInstance>()
const form = reactive<Tag>({
  id: undefined,
  name: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
})

const visible = ref(false)
const handleOpen = async (id?: number) => {
  if (id) {
    const { data } = await getTagDetailInfo(id)
    Object.assign(form, data)
  }

  visible.value = true
}
const handleClose = () => {
  visible.value = false
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
    await manageTag(form)

    handleClose()
    ElMessage({
      type: 'success',
      message: '操作成功',
      duration: 1500,
      onClose: () => {
        emit('success')
      }
    })
  })
}

defineExpose({
  handleOpen,
  handleClose
})
</script>
