<template>
  <page-header>推送记录</page-header>

  <panel>
    <div class="flex flex-align-top">
      <el-form ref="ruleFormRef" :model="query" label-width="40px" class="flex-1" status-icon>
        <el-row :gutter="16">
          <el-col :sm="24" :md="12" :lg="12">
            <el-form-item label="状态" prop="result">
              <el-select
                v-model="query.result"
                clearable
                placeholder="选择推送状态"
                style="width: 100%"
              >
                <el-option v-for="(k, v) in PushResultMessage" :key="k" :label="k" :value="v" />
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
          <div class="title">{{ item.title ?? '-' }}</div>
        </el-col>

        <el-col :span="4">
          <div class="extra">
            模块:
            <el-tag type="success" size="small">
              {{ PushResultModuleMessage[item.module] }}
            </el-tag>
          </div>
        </el-col>

        <el-col :span="5">
          <div class="extra">时间: {{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm') }}</div>
        </el-col>

        <el-col :span="5">
          <div class="extra">
            {{ `成功（${item.resultTotal?.success}）, 失败（${item.resultTotal?.fail}）` }}
          </div>
        </el-col>

        <el-col :span="2">
          <el-button
            v-if="item.resultTotal?.fail! > 0 && hasAuth([RoleTypeEnum.ROOT])"
            size="small"
            type="primary"
            @click="handleRepush(item)"
          >
            重新推送
          </el-button>
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

  <!-- 推送结果 -->
  <RepushDrawer ref="repushDrawerRef" @close="handleQuery" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import type { PushRecordQuery, PushRecord, PushRecordResult } from '@/types'
import { PushResultMessage, PushResultEnum, PushResultModuleMessage, RoleTypeEnum } from '@/enum'
import { getPushRecordList } from '@/api/push-record'
import { hasAuth } from '@/core/utils'
import RepushDrawer from './repush-drawer.vue'

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
  const pushRecords = (data?.list ?? []).map((item) => {
    const total = {
      success: 0,
      fail: 0
    }

    ;(item.results ?? []).forEach((res: PushRecordResult) => {
      if (res.result === PushResultEnum.SUCCESS) {
        total.success += 1
      } else if (res.result === PushResultEnum.FAIL) {
        total.fail += 1
      }
    })

    item.resultTotal = total

    return item
  })

  list.value = pushRecords
  total.value = data?.total
}

const repushDrawerRef = ref<typeof RepushDrawer>()
const handleRepush = async (record: PushRecord) => {
  repushDrawerRef.value?.handleOpen(record)
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
