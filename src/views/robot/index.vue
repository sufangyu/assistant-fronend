<template>
  <page-header>机器人管理</page-header>

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
          <el-col :sm="24" :md="12" :lg="6">
            <el-form-item label="名称" prop="name">
              <el-input v-model="query.name" clearable placeholder="名称关键词" />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="6">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="query.status"
                clearable
                placeholder="选择状态"
                style="width: 100%"
              >
                <el-option
                  v-for="(k, v) in StatusMessage"
                  :key="k"
                  :label="k"
                  :value="v"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="6">
            <el-form-item label="类型" prop="type">
              <el-select
                v-model="query.type"
                clearable
                placeholder="选择机器人类型"
                style="width: 100%"
              >
                <el-option
                  v-for="(k, v) in RobotTypeMessage"
                  :key="k"
                  :label="k"
                  :value="v"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="6">
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
    <template #extra
      ><el-button type="success" @click="handleManage()">新建</el-button></template
    >
    <el-divider style="margin-top: 0" />

    <el-empty v-if="list.length === 0" :image-size="120" />

    <template v-for="item in list" :key="item.id">
      <el-row align="middle" class="item">
        <el-col :span="8">
          <div class="title">{{ item.name }}</div>
        </el-col>

        <el-col :span="6">
          <div class="extra">
            创建: {{ dayjs(item.createdAt).format("YYYY-MM-DD HH:mm") }}
          </div>
        </el-col>

        <el-col :span="5">
          <div class="extra">
            <el-tag
              size="small"
              :type="item.status === StatusEnum.FORBIDDEN ? 'danger' : undefined"
              >{{ StatusMessage[item.status!] }}</el-tag
            >
            <span style="display: inline-block; width: 10px"></span>
            <el-tag size="small" type="info">{{ RobotTypeMessage[item.type!] }}</el-tag>
          </div>
        </el-col>

        <el-col :span="5">
          <div class="actions">
            <el-button size="small" text type="primary" @click="handleManage(item.id)"
              >编辑</el-button
            >
            <el-button size="small" text type="success" @click="handleToggle(item)">{{
              StatusNextMessage[item.status!]
            }}</el-button>
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
import type { RobotQuery, Robot } from '@/types'
import { StatusEnum, StatusMessage, StatusNextMessage, RobotTypeMessage } from '@/enum'
import { getRobotList, removeRobot, toggleRobotStatus } from '@/api/robot'
import Manage from './manage.vue'

const manegeDrawerRef = ref<typeof Manage>()
const manegeDrawerTitle = ref('新建标签')
const ruleFormRef = ref<FormInstance>()
const query = reactive<RobotQuery>({
  page: 1,
  size: 10,
  name: '',
  status: undefined,
  type: undefined,
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

const list = ref<Robot[]>([])
const total = ref(0)
const handleQuery = async (page: number = 1) => {
  const [start, end] = query.daterange ?? ['', '']
  const params: RobotQuery = {
    ...query,
    start: start ? `${start} 0:0:0` : '',
    end: end ? `${end} 23:59:59` : '',
    page
  }

  delete params.daterange

  const { data } = await getRobotList(params)
  list.value = data?.list ?? []
  total.value = data?.total
}

const handleConfirmRemove = async (id: number) => {
  await removeRobot(id)

  // 提示 + 刷新页面（TODO: 考虑最后一页问题）
  ElMessage({ message: '删除成功', type: 'success' })
  await handleQuery()
}

const handleToggle = async (robot: Robot) => {
  // console.log(robot);
  const status = robot.status === StatusEnum.NORMAL ? StatusEnum.FORBIDDEN : StatusEnum.NORMAL;
  console.log(status);

  await toggleRobotStatus(robot.id!, status);
  ElMessage({
    type: 'success',
    message: '操作成功',
    duration: 1000,
  });
  handleQuery();
}


const handleManage = (id?: number) => {
  manegeDrawerRef.value?.handleOpen(id)
  manegeDrawerTitle.value = id ? '编辑机器人' : '新建机器人'
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
