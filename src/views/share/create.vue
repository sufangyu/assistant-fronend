<template>
  <page-header>{{ IS_EDIT ? "编辑分享" : "创建分享" }}</page-header>

  <panel>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      status-icon
    >
      <el-form-item label="链接地址" prop="url">
        <div class="flex">
          <div class="flex-1">
            <el-input
              v-model="ruleForm.url"
              :disabled="IS_EDIT"
              placeholder="请输入链接地址"
            />
          </div>
          <el-button style="margin-left: 8px" type="primary" @click="handleGetWebInfo"
            >获取站点信息</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="站点标题" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>

      <el-form-item label="站点描述" prop="description">
        <el-input v-model="ruleForm.description" type="textarea" :rows="3" />
      </el-form-item>

      <el-form-item label="所属分类" prop="categoryId">
        <el-select
          v-model="ruleForm.categoryId"
          placeholder="请选择分类"
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

      <el-form-item label="添加标签" prop="tags">
        <el-select
          v-model="ruleForm.tagIds"
          placeholder="请选择标签"
          multiple
          :multiple-limit="5"
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

      <el-form-item label="机器人" prop="robotIds">
        <el-checkbox-group v-model="ruleForm.robotIds" :disabled="IS_EDIT">
          <el-checkbox
            v-for="robot in formOptions.robots"
            :key="robot.id"
            :label="robot.id"
          >
            {{ robot.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定提交 </el-button>
      </el-form-item>
    </el-form>
  </panel>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { Category, Robot, Share, Tag } from '@/types'
import { createShare, getShareDetailInfo, getWebsiteInfo } from '@/api/share'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'
import { getRobots } from '@/api/robot'

const route = useRoute()
const router = useRouter()
const IS_EDIT = route.name === 'ShareEdit'

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
// 获取全部机器人
const getAllRobots = async () => {
  const { data } = await getRobots()
  formOptions.robots = data ?? []
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<Share>({
  id: undefined,
  url: '',
  title: '',
  description: '',
  categoryId: undefined,
  tagIds: [],
  robotIds: []
})
const rules = reactive<FormRules>({
  url: [
    { required: true, message: '链接地址不能为空', trigger: 'blur' }
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  categoryId: [
    {
      required: true,
      message: '所属分类不能为空',
      trigger: 'change'
    }
  ],
  tagIds: [
    {
      required: true,
      message: '标签不能为空',
      trigger: 'change'
    }
  ],
  robotIds: [
    {
      required: true,
      message: '发布机器人不能为空',
      trigger: 'change'
    }
  ]
})

// 获取站点信息
const handleGetWebInfo = async () => {
  const {
    data: { title, description }
  } = await getWebsiteInfo(encodeURIComponent(ruleForm.url!))
  ruleForm.title = title
  ruleForm.description = description
}

const getShareDetail = async (id: number) => {
  return getShareDetailInfo(id)
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      return
    }
    console.log('submit!', fields, ruleForm)
    await createShare(ruleForm)

    ElMessage({
      type: 'success',
      message: '操作成功',
      onClose: () => {
        router.replace({
          name: 'ShareList'
        })
      }
    })
  })
}

onMounted(async () => {
  getAllCategories()
  getAllTags()
  getAllRobots()

  if (IS_EDIT) {
    const { data } = await getShareDetail(+route.params.id)
    // ruleForm = { ...data };
    ruleForm.id = data.id
    ruleForm.url = data.url
    ruleForm.title = data.title
    ruleForm.description = data.description
    ruleForm.categoryId = data.category?.id
    ruleForm.tagIds = (data.tags ?? []).map((it) => it.id!)
    ruleForm.robotIds = (data.robots ?? []).map((it) => it.id!)
  }
})
</script>
