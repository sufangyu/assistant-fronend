<template>
  <el-drawer
    v-model="visible"
    :title="`${pushRecord?.title} — 推送失败结果`"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :size="640"
    @close="handleClose()"
  >
    <el-table
      :data="results"
      @selection-change="(val: PushRecordResult[]) => { selectResults = val;}"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="机器人" width="200">
        <template #default="{ row }">{{ row.robot?.name }}</template>
      </el-table-column>
      <el-table-column label="结果" width="140">
        <template #default="{ row }">
          <el-tag :type="row.result === PushResultEnum.FAIL ? 'danger' : ''" disable-transitions>
            {{ PushResultMessage[row.result as 0 | 1] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推送时间" width="200">
        <template #default="{ row }">{{
          dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')
        }}</template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 16px" v-if="results.length > 0">
      <el-button size="small" type="primary" @click="handleRepushAll()"> 重新推送 </el-button>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage, type ElTable } from 'element-plus'
import type { PushRecord, PushRecordResult } from '@/types'
import { PushResultEnum, PushResultMessage } from '@/enum'
import { repushRecord, repushRecordDetail } from '@/api/push-record'

const emit = defineEmits<{
  (ev: 'close'): void
}>()

const visible = ref(false)
const pushRecord = ref<PushRecord>()
const results = ref<PushRecordResult[]>([])
// 选择要推送的机器人
const selectResults = ref<PushRecordResult[]>([])

const handleRepushAll = async () => {
  if (selectResults.value.length === 0) {
    ElMessage({
      message: '请选择要重新推送的机器人',
      type: 'warning',
      duration: 1500
    })

    return
  }

  const params: PushRecord = {
    id: pushRecord.value?.id,
    module: pushRecord.value?.module!,
    title: pushRecord.value?.title || '',
    variable: pushRecord.value?.variable || '',
    results: [...selectResults.value]
  }
  console.log('重复推送：', params)
  await repushRecord(params)

  // 提示 + 获取刷新推送记录的结果 => 更新
  ElMessage({
    message: '推送成功',
    type: 'success',
    duration: 1500,
    onClose: async () => await getPushRecordDetail()
  })
}

// 获取详情 => 更新
const getPushRecordDetail = async () => {
  const { data } = await repushRecordDetail(pushRecord.value?.id)
  pushRecord.value = data
  results.value = data.results.filter((it) => it.result === PushResultEnum.FAIL)
}

const handleOpen = (record: PushRecord) => {
  visible.value = true
  pushRecord.value = record
  results.value = record.results.filter((it) => it.result === PushResultEnum.FAIL)
}

const handleClose = () => {
  emit('close')
}

defineExpose({
  handleOpen
})
</script>
