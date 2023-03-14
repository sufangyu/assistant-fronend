<template>
  <page-header>分享列表</page-header>

  <panel>
    <div class="flex flex-align-top">
      <el-form ref="ruleFormRef" :model="query" label-width="40px" class="flex-1" status-icon>
        <el-row :gutter="16">
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item label="分类" prop="categoryId">
              <el-select
                v-model="query.categoryId"
                placeholder="选择分类"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="category in formOptions.categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id!"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item label="标签" prop="tagIds">
              <el-select
                v-model="query.tagIds"
                multiple
                :multiple-limit="5"
                collapse-tags
                clearable
                placeholder="选择标签"
                style="width: 100%"
              >
                <el-option
                  v-for="tag in formOptions.tags"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id!"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="8">
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
        <el-button type="primary" @click="getSharesWithQuery(1)">查询</el-button>
        <el-button @click="ruleFormRef?.resetFields()">重置</el-button>
        <el-button type="success"
          ><router-link :to="{ name: 'ShareCreate' }">新建</router-link></el-button
        >
      </div>
    </div>
  </panel>

  <panel>
    <el-empty v-if="list.length === 0" :image-size="120" />

    <template v-for="item in list" :key="item.id">
      <el-row align="top" class="share-item">
        <el-col :span="12">
          <div class="title">
            <a target="_blank" :href="item.url">{{ item.title }}</a>
          </div>
          <div class="description">{{ item.description }}</div>
        </el-col>
        <el-col :span="2">
          <div class="extra">
            <h3>分类</h3>
            <p>
              <el-tag type="" round size="small">{{ item.category?.name ?? '-' }}</el-tag>
            </p>
          </div>
        </el-col>

        <el-col :span="5">
          <div class="extra">
            <h3>标签</h3>
            <p class="tags">
              <el-tag v-for="tag in item.tags ?? []" type="info" round size="small" :key="tag.id">
                {{ tag.name }}
              </el-tag>
            </p>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="extra">
            <h3>创建时间</h3>
            <p class="created">{{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm') }}</p>
          </div>
        </el-col>

        <el-col :span="1">
          <div class="actions">
            <router-link :to="{ name: 'ShareEdit', params: {id: item.id!} }"
              ><el-button size="small" text type="primary">编辑</el-button></router-link
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
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import { getShares, removeShare } from '@/api/share'
import type { Category, Robot, Share, ShareQuery, Tag } from '@/types'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'

const formOptions = reactive<{ categories: Category[]; tags: Tag[]; robots: Robot[] }>({
  categories: [],
  tags: [],
  robots: []
})

// 获取全部分类
const getAllCategories = async () => {
  const { data } = await getCategories()
  formOptions.categories = data ?? []
}
// 获取全部标签
const getAllTags = async () => {
  const { data } = await getTags()
  formOptions.tags = data ?? []
}

const ruleFormRef = ref<FormInstance>()
const query = reactive<ShareQuery>({
  page: 1,
  size: 10,
  categoryId: '',
  tagIds: [],
  start: '',
  end: '',
  daterange: ''
})
const handleSizeChange = async (size: number) => {
  query.page = 1
  query.size = size
  await getSharesWithQuery()
}
const handleCurrentChange = async (page: number) => {
  query.page = page
  await getSharesWithQuery(page)
}

const list = ref<Share[]>([])
const total = ref(0)
// 获取列表数据
const getSharesWithQuery = async (page: number = 1) => {
  const [start, end] = query.daterange ?? ['', '']
  const params: ShareQuery = {
    ...query,
    start: start ? `${start} 0:0:0` : '',
    end: end ? `${end} 23:59:59` : '',
    page
  }

  delete params.daterange

  const { data } = await getShares(params)
  list.value = data?.list ?? []
  total.value = data?.total
}

// 删除
const handleConfirmRemove = async (id: number) => {
  await removeShare(id)

  // 提示 + 刷新页面（TODO: 考虑最后一页问题）
  ElMessage({ message: '删除成功', type: 'success' })
  await getSharesWithQuery()
}

onMounted(async () => {
  getAllCategories()
  getAllTags()
  await getSharesWithQuery()
})
</script>

<style lang="scss">
.share-item {
  .extra {
    font-size: 13px;
    color: #808080;

    h3 {
      font-size: 13px;
      margin-bottom: 4px;
    }
  }

  .tags {
    .el-tag {
      margin-left: 4px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .actions {
    text-align: center;
    margin-top: -8px;

    .el-button {
      margin: 4px 0;
    }
  }

  .title {
    margin-bottom: 4px;
    padding-right: 16px;

    a {
      color: inherit;
    }
  }

  .description {
    font-size: 12px;
    padding-right: 16px;
    text-align: justify;
    opacity: 0.6;
    line-height: 1.3;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
