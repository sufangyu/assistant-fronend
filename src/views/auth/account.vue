<template>
  <page-header>个人中心</page-header>

  <panel>
    <!-- <el-row>
      <el-col :span="6">
        authStore
      </el-col>
    </el-row> -->
    <el-descriptions title="个人信息" direction="vertical" :column="4">
      <el-descriptions-item label="用户名">
        {{ authStore.account?.username }}
      </el-descriptions-item>
      <el-descriptions-item label="手机号">
        {{ authStore.account?.mobile }}
      </el-descriptions-item>
      <el-descriptions-item label="昵称" :span="1">
        {{ authStore.account?.nickname }}
      </el-descriptions-item>
      <el-descriptions-item label="角色">
        <el-tag size="small">{{ RoleTypeMessage[authStore.account?.role!] }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag size="small">{{ StatusMessage[authStore.account?.status!] }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ dayjs(authStore.account?.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
    </el-descriptions>
  </panel>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useAuthStore } from '@/stores'
import { StatusMessage, RoleTypeMessage } from '@/enum'

const authStore = useAuthStore()
</script>
