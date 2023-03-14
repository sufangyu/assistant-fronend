<template>
  <page-header>分享归档</page-header>

  <panel>
    <div class="flex flex-align-top">
      <el-form ref="ruleFormRef" :model="query" label-width="80px" class="flex-1" status-icon>
        <el-row :gutter="16">
          <el-col :sm="24" :md="12" :lg="12">
            <el-form-item label="归档年份" prop="year">
              <el-date-picker
                style="width: 100%"
                v-model="query.year"
                type="year"
                value-format="YYYY"
                :clearable="false"
                placeholder="选择归档年份"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="12">
            <el-form-item label="归档类型" prop="tagIds">
              <el-select v-model="query.type" placeholder="选择归档类型" style="width: 100%">
                <el-option label="季度" value="quarter" />
                <el-option label="月度" value="month" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-left: 16px">
        <el-button type="primary" @click="getShareByFiled()">查询</el-button>
        <el-button @click="ruleFormRef?.resetFields()">重置</el-button>
      </div>
    </div>
  </panel>

  <panel>
    <el-empty v-if="list.length === 0" :image-size="120" />

    <el-timeline>
      <el-timeline-item
        v-for="item in list"
        :key="item.label"
        type="primary"
        :timestamp="item.label"
        placement="top"
      >
        <el-card
          style="margin-bottom: 16px"
          shadow="hover"
          v-for="listItem in item.list"
          :key="listItem.id"
          class="share-item"
        >
          <h4>
            <a :href="listItem.url" target="_blank">{{ listItem.title || '-' }}</a>
          </h4>
          <p class="description">{{ listItem.description || '-' }}</p>
          <p class="created-at">发布于 {{ listItem.createdAt }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </panel>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import { findShareByFiled } from '@/api/share'
import type { Share, ShareFiledQuery } from '@/types'
import { QuarterTypeMessage, MonthTypeMessage } from '@/enum'

const ruleFormRef = ref<FormInstance>()
const query = reactive<ShareFiledQuery>({
  year: dayjs().format('YYYY'),
  type: 'quarter'
})

const list = ref<{ type: string; label: string; list: Share[] }[]>([])
// 获取列表数据
const getShareByFiled = async () => {
  const { data } = await findShareByFiled(query.year!, query.type!)
  list.value = (data ?? []).map((it) => {
    it.label =
      it.type === 'quarter'
        ? (QuarterTypeMessage as any)[it.label]
        : (MonthTypeMessage as any)[it.label]

    return it
  })
}

onMounted(async () => {
  await getShareByFiled()
})
</script>

<style lang="scss" scoped>
.share-item {
  h4 {
    font-size: 16px;

    a {
      color: initial;
    }
  }
  .description {
    opacity: 0.8;
    margin-top: 8px;
    margin-bottom: 8px;
    font-size: 13px;
  }

  .created-at {
    font-size: 12px;
    opacity: 0.5;
  }
}
</style>
