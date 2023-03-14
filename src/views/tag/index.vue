<template>
  <page-header>标签管理</page-header>

  <panel>
    <div class="flex flex-align-top">
      <el-form ref="ruleFormRef" :model="query" label-width="40px" class="flex-1" status-icon>
        <el-row :gutter="16">
          <el-col :sm="24" :md="12" :lg="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="query.name" clearable placeholder="名称关键词" />
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

  <panel title="标签列表">
    <template #extra><el-button type="success" @click="handleManage()">新建</el-button></template>
    <el-divider style="margin-top: 0" />

    <el-empty v-if="list.length === 0" :image-size="120" />

    <template v-for="item in list" :key="item.id">
      <el-row align="top" class="item">
        <el-col :span="14">
          <div class="title">{{ item.name }}</div>
        </el-col>

        <el-col :span="6">
          <div class="extra">创建时间: {{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm') }}</div>
        </el-col>

        <el-col :span="4">
          <div class="actions">
            <el-button size="small" text type="primary" @click="handleManage(item.id)"
              >编辑</el-button
            >
            <el-popconfirm
              width="200"
              title="你确认删除该项吗?"
              @confirm="handleConfirmRemove(item.id!)"
            >
              <template #reference>
                <el-button size="small" text type="danger">删除</el-button>
              </template>
            </el-popconfirm>
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

  <!-- 新建/编辑 -->
  <Manage ref="manegeDrawerRef" :title="manegeDrawerTitle" @success="handleQuery()" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import type { TagQuery, Tag } from '@/types'
import { getTagList, removeTag } from '@/api/tag'
import Manage from './manage.vue'

const manegeDrawerRef = ref<typeof Manage>()
const manegeDrawerTitle = ref('新建标签')
const ruleFormRef = ref<FormInstance>()
const query = reactive<TagQuery>({
  page: 1,
  size: 10,
  name: '',
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

const list = ref<Tag[]>([])
const total = ref(0)
const handleQuery = async (page: number = 1) => {
  const [start, end] = query.daterange ?? ['', '']
  const params: TagQuery = {
    ...query,
    start: start ? `${start} 0:0:0` : '',
    end: end ? `${end} 23:59:59` : '',
    page
  }

  delete params.daterange

  const { data } = await getTagList(params)
  list.value = data?.list ?? []
  total.value = data?.total
}

const handleConfirmRemove = async (id: number) => {
  await removeTag(id)

  // 提示 + 刷新页面（TODO: 考虑最后一页问题）
  ElMessage({ message: '删除成功', type: 'success' })
  await handleQuery()
}

const handleManage = (id?: number) => {
  manegeDrawerRef.value?.handleOpen(id)
  manegeDrawerTitle.value = id ? '编辑标签' : '新建标签'
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
