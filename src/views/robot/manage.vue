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
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model.number="form.type">
          <el-radio v-for="(k, v) in RobotTypeMessage" :key="k" :label="Number(v)">{{
            k
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Webhook" prop="webhook">
        <el-input v-model="form.webhook" />
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
import type { Robot } from '@/types'
import { RobotTypeMessage } from '@/enum'
import { getRobotDetailInfo, manageRobot } from '@/api/robot'

const emit = defineEmits<{
  (ev: 'success'): void
}>()

const props = withDefaults(defineProps<{ title: string }>(), { title: '' })

const formRef = ref<FormInstance>()
const form = reactive<Robot>({
  id: undefined,
  name: '',
  type: undefined,
  webhook: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
  webhook: [{ required: true, message: 'webhook不能为空', trigger: 'blur' }]
})

const visible = ref(false)
const handleOpen = async (id?: number) => {
  if (id) {
    const { data } = await getRobotDetailInfo(id)
    Object.assign(form, data)
  }

  visible.value = true
}
const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
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
    await manageRobot(form)

    handleClose()
    ElMessage({
      type: 'success',
      message: '操作成功',
      duration: 1000,
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
