<template>
  <page-header>推送记录</page-header>

  <panel>
    <div class="flex flex-align-top">
      <el-form
        ref="ruleFormRef"
        :model="query"
        label-width="40px"
        class="flex-1"
        status-icon
      >
        <el-row :gutter="16">
          <el-col :sm="24" :md="12" :lg="12">
            <el-form-item label="状态" prop="result">
              <el-select
                v-model="query.result"
                clearable
                placeholder="选择推送状态"
                style="width: 100%"
              >
                <el-option
                  v-for="(k, v) in PushResultMessage"
                  :key="k"
                  :label="k"
                  :value="v"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="12">
            <el-form-item label="时间" prop="daterange">
              <el-date-picker
                v-model="query.daterange"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-left: 16px">
        <el-button type="primary" @click="handleQuery(1)">查询</el-button>
        <el-button @click="ruleFormRef?.resetFields()">重置</el-button>
      </div>
    </div>
  </panel>

  <panel title="推送结果列表">
    <el-divider style="margin-top: 0" />

    <el-empty v-if="list.length === 0" :image-size="120" />

    <template v-for="item in list" :key="item.id">
      <el-row align="middle" class="item">
        <el-col :span="8">
          <div class="extra">
            功能:
            <el-tag type="success">
              {{ PushResultModuleMessage[item.module] }}
            </el-tag>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="extra">
            推送时间: {{ dayjs(item.createdAt).format("YYYY-MM-DD HH:mm") }}
          </div>
        </el-col>

        <el-col :span="5">
          <div class="extra">
            <el-tag
              size="small"
              :type="item.result === PushResultEnum.FAIL ? 'danger' : undefined"
            >
              {{ PushResultMessage[item.result!] }}
            </el-tag>
          </div>
        </el-col>

        <el-col :span="5">
          <div class="actions">
            <el-button
              v-if="item.result === PushResultEnum.FAIL"
              size="small"
              type="success"
              @click="handleRepush(item)"
            >
              重新推送
            </el-button>
            <span v-else>-</span>
          </div>
        </el-col>
      </el-row>
      <el-divider />
    </template>

    <div class="list-pagination" v-if="list.length > 0">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.size"
        small
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </panel>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import type { PushRecordQuery, PushRecord } from '@/types'
import {  PushResultMessage, PushResultEnum, PushResultModuleMessage } from '@/enum'
import { getPushRecordList, repushRecord } from '@/api/push-record'

const ruleFormRef = ref<FormInstance>()
const query = reactive<PushRecordQuery>({
  page: 1,
  size: 10,
  result: undefined,
  start: '',
  end: '',
  daterange: ''
})
const handleSizeChange = async (size: number) => {
  query.page = 1
  query.size = size
  await handleQuery()
}
const handleCurrentChange = async (page: number) => {
  query.page = page
  await handleQuery(page)
}

const list = ref<PushRecord[]>([])
const total = ref(0)
const handleQuery = async (page: number = 1) => {
  const [start, end] = query.daterange ?? ['', '']
  const params: PushRecordQuery = {
    ...query,
    start: start ? `${start} 0:0:0` : '',
    end: end ? `${end} 23:59:59` : '',
    page
  }

  delete params.daterange

  const { data } = await getPushRecordList(params)
  list.value = data?.list ?? []
  total.value = data?.total
}

const handleRepush = async (record: PushRecord) => {
  console.log('record: ', record);

  await repushRecord(record)
  // 提示 + 刷新页面（TODO: 考虑最后一页问题）
  ElMessage({
    message: '推送成功',
    type: 'success',
    duration: 1500,
    onClose: async () => {
      await handleQuery();
    }
  })

}

onMounted(async () => {
  await handleQuery()
})
</script>

<style lang="scss">
.item {
  .extra {
    font-size: 13px;
    color: #808080;
  }

  .actions {
    text-align: center;
    margin-top: -8px;

    .el-button {
      margin: 4px 0;
    }
  }
}
</style>
