<template>
  <side class="sidebar">
    <h1 class="logo">
      <img class="logo" src="@/assets/logo.svg" />
      <span>Work Tools</span>
    </h1>

    <nav>
      <div
        class="nav-item"
        :class="{ active: curActivePath === item.active }"
        v-for="item in SHARE_MENUS"
        :key="item.routerName"
      >
        <router-link :to="{ name: item.routerName }">
          <component :is="item.icon" />
          {{ item.label }}
        </router-link>
      </div>
    </nav>

    <div class="footer">
      <el-dropdown>
        <span style="font-size: 16px">
          <component :is="curThemeIcon" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="theme in THEMES"
              :key="theme.code"
              @click="handleSwitchTheme(theme.code)"
              :icon="themeIcon[theme.code]"
            >
              {{ theme.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <a target="_blank" href="https://www.github.com"><GithubOne /></a>
    </div>
  </side>

  <main class="main">
    <RouterView />
  </main>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import {
  Dashboard,
  Add,
  ListView,
  CategoryManagement,
  Tag,
  RobotOne,
  GithubOne,
  SettingThree,
  DarkMode,
  Brightness,
  Find,
  SendOne,
} from "@icon-park/vue-next";
import { ThemeEnum, type ThemeType } from "@/enum";
import { useThemeStore } from '@/stores';

const route = useRoute();
const SHARE_MENUS = [
  {
    routerName: "ShareCreate",
    active: "/share/create",
    icon: Add,
    label: "创建分享",
  },
  {
    routerName: "ShareDashboard",
    active: "/share/dashboard",
    icon: Dashboard,
    label: "仪表盘",
  },
  {
    routerName: "ShareList",
    active: "/share/list",
    icon: ListView,
    label: "分享列表",
  },
  {
    routerName: "ShareFiled",
    active: "/share/filed",
    icon: Find,
    label: "分享归档",
  },
  {
    routerName: "PushRecord",
    active: "/push-record",
    icon: SendOne,
    label: "推送记录",
  },
  {
    routerName: "Category",
    active: "/category",
    icon: CategoryManagement,
    label: "分类管理",
  },
  {
    routerName: "Tag",
    active: "/tag",
    icon: Tag,
    label: "标签管理",
  },
  {
    routerName: "Robot",
    active: "/robot",
    icon: RobotOne,
    label: "机器人管理",
  },
];
const curActivePath = ref(route.path);

watch(
  () => route.path,
  () => {
    // console.log(route.path, route.meta);
    curActivePath.value = (route?.meta?.active as string) ?? route.path;
  }
);

const THEMES: { name: string; code: ThemeType; }[] = [
  { name: "日间模式", code: "light" },
  { name: "夜间模式", code: "dark" },
  { name: "跟随系统", code: "system" },
];
const themeIcon = {
  [ThemeEnum.LIGHT]: SettingThree,
  [ThemeEnum.DARK]: DarkMode,
  [ThemeEnum.SYSTEM]: Brightness,
}
const themeStore = useThemeStore();
const curThemeIcon = computed(() => themeIcon[themeStore.theme])
const handleSwitchTheme = (theme: ThemeType) => {
  themeStore.setTheme(theme);
};
</script>

<style lang="scss" scoped>
.sidebar nav {
  .nav-item {
    margin: 4px 24px;
    border-radius: var(--border-radius-small);
    overflow: hidden;
    font-size: 15px;
    color: #808080;

    .i-icon {
      font-size: inherit;
      margin-right: 8px;
      height: 15px;
      line-height: 15px;
      display: inline-block;
    }

    a {
      display: block;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      color: inherit;
      display: flex;
      align-items: center;

      &:hover {
        background-color: rgba(24, 44, 225, 0.08);
      }
    }

    &.active {
      background-color: var(--el-color-primary);
      color: #fff;
    }
  }
}

.sidebar .footer {
  padding: 16px;
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: var(--border-radius-middle);
  background-color: var(--sidebar-footer-bg);
  font-size: 16px;

  .i-icon {
    color: initial;
    font-size: inherit;
    position: relative;
    top: 2px;
    cursor: pointer;
    outline: none;
  }
}
.ic {
  > span {
    margin-right: 8px;
  }
  .i-icon {
    position: relative;
    top: 2px;
  }
}
</style>
