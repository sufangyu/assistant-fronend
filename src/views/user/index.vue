<template>
  <page-header>用户管理</page-header>

  <panel>
    <div class="flex flex-align-top">
      <el-form
        ref="ruleFormRef"
        :model="query"
        label-width="60px"
        class="flex-1"
        status-icon
      >
        <el-row :gutter="16">
          <el-col :sm="24" :md="12" :lg="6">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="query.username" clearable placeholder="用户名关键词" />
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
            <el-form-item label="角色" prop="role">
              <el-select
                v-model="query.role"
                clearable
                placeholder="选择用户角色"
                style="width: 100%"
              >
                <el-option
                  v-for="(k, v) in RoleTypeMessage"
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

  <panel title="用户列表">
    <template #extra>
      <el-button type="success" @click="handleManage()">新建</el-button>
    </template>
    <el-divider style="margin-top: 0" />

    <el-empty v-if="list.length === 0" :image-size="120" />

    <template v-for="item in list" :key="item.id">
      <el-row align="top" class="item">
        <el-col :span="4">
          <div class="title">{{ item.username }}</div>
        </el-col>

        <el-col :span="6">
          <div class="extra">手机号：{{ item.mobile ?? "-" }}</div>
        </el-col>

        <el-col :span="6">
          <div class="extra">
            创建: {{ dayjs(item.createdAt).format("YYYY-MM-DD HH:mm") }}
          </div>
        </el-col>

        <el-col :span="2">
          <div class="extra">
            <el-tag
              size="small"
              :type="item.status === StatusEnum.FORBIDDEN ? 'danger' : undefined"
              >{{ StatusMessage[item.status!] }}</el-tag
            >
            <span style="display: inline-block; width: 10px"></span>
            <el-tag size="small" type="info">{{ RoleTypeMessage[item.role!] }}</el-tag>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="actions">
            <el-button size="small" text type="primary" @click="handleManage(item.id)"
              >编辑</el-button
            >
            <el-button size="small" text type="success" @click="handleToggle(item)">
              {{ StatusNextMessage[item.status!] }}
            </el-button>
            <el-popconfirm
              width="200"
              title="你确认重置密码吗?"
              @confirm="handleConfirmResetPassword(item.id!, item.username!)"
            >
              <template #reference>
                <el-button size="small" text type="warning">重置密码</el-button>
              </template>
            </el-popconfirm>

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

  <!-- 新建/编辑 侧边抽屉 -->
  <Manage
    ref="manegeDrawerRef"
    :title="manegeDrawerTitle"
    @success="(user) => handleManegeSuccess(user as User | null)"
  />

  <!-- 新建/重置密码 结果弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="540px"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <p style="margin-bottom: 8px">{{ dialogResultText }}</p>
    <p>
      初始密码是：{{ initPassword }}
      <el-button size="small" type="success" @click="copyText(initPassword)">
        复制
      </el-button>
    </p>
    <template #footer>
      <el-button type="primary" @click="handleCloseDialog">刷新列表</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import type { UserQuery, User } from '@/types'
import { StatusEnum, StatusMessage, StatusNextMessage, RoleTypeMessage } from '@/enum'
import { getUserList, removeUser, resetPassword, toggleUserStatus } from '@/api/user'
import { copyText } from '@/hooks'
import Manage from './manage.vue'

const manegeDrawerRef = ref<typeof Manage>()
const manegeDrawerTitle = ref('新建用户')
const ruleFormRef = ref<FormInstance>()
const query = reactive<UserQuery>({
  page: 1,
  size: 10,
  username: '',
  status: undefined,
  role: undefined,
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

const list = ref<User[]>([])
const total = ref(0)
const handleQuery = async (page: number = 1) => {
  const [start, end] = query.daterange ?? ['', '']
  const params: UserQuery = {
    ...query,
    start: start ? `${start} 0:0:0` : '',
    end: end ? `${end} 23:59:59` : '',
    page
  }

  delete params.daterange

  const { data } = await getUserList(params)
  list.value = data?.list ?? []
  total.value = data?.total
}

const handleConfirmRemove = async (id: number) => {
  await removeUser(id)

  // 提示 + 刷新页面（TODO: 考虑最后一页问题）
  ElMessage({ message: '删除成功', type: 'success' })
  await handleQuery()
}

const handleToggle = async (user: User) => {
  const status = user.status === StatusEnum.NORMAL ? StatusEnum.FORBIDDEN : StatusEnum.NORMAL
  console.log(status)

  await toggleUserStatus(user.id!, status)
  ElMessage({
    type: 'success',
    message: '操作成功',
    duration: 1000
  })
  handleQuery()
}
const handleConfirmResetPassword = async (id: number, username: string) => {
  const { data } = await resetPassword(id)
  // 重置密码
  setDialogInfo('RESET', username, data.password!)
}

const handleManage = (id?: number) => {
  manegeDrawerRef.value?.handleOpen(id)
  manegeDrawerTitle.value = id ? '编辑用户' : '新建用户'
}
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogResultText = ref('')
const initPassword = ref('')
const handleCloseDialog = () => {
  dialogVisible.value = false
  handleQuery()
}

const handleManegeSuccess = (user: User | null) => {
  console.log('handleManegeSuccess user', user)

  if (user) {
    // 新建
    setDialogInfo('CREATE', user.username!, user.password!)
  } else {
    // 编辑
    ElMessage({
      type: 'success',
      message: '操作成功',
      duration: 1000,
      onClose: () => {
        handleQuery()
      }
    })
  }
}

// 设置重置密码、新建用户弹窗
const setDialogInfo = (type: 'RESET' | 'CREATE', username: string, password: string) => {
  dialogVisible.value = true
  initPassword.value = password
  dialogTitle.value = type === 'CREATE' ? '新建结果' : '重置结果'
  dialogResultText.value =
    type === 'CREATE' ? `新建用户${username}成功！` : `用户${username}重置密码成功！`
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
