<template>
  <page-header>仪表盘</page-header>

  <el-row :gutter="16">
    <el-col :sm="24" :md="12" :lg="12" :xl="12">
      <panel class="total">
        <h3>今年总发布</h3>
        <p class="num">{{ totalYear.total }}</p>
        <p class="remarks">
          截止 {{ dayjs().format("YYYY-MM-DD") }}
          <component
            :is="totalYear.trend === 'up' ? ArrowCircleUp : ArrowCircleDown"
            theme="filled"
            :fill="totalYear.trend === 'up' ? '#007fff' : '#00a574'"
          />
          {{ totalYear.contrast }}%
        </p>
        <span class="ic-box"><SendOne /></span>
      </panel>
    </el-col>
    <el-col :sm="24" :md="12" :lg="12" :xl="12">
      <panel class="total">
        <h3>本月总发布</h3>
        <p class="num">{{ totalMonth.total }}</p>
        <p class="remarks">
          与上月
          <component
            :is="totalMonth.trend === 'up' ? ArrowCircleUp : ArrowCircleDown"
            theme="filled"
            :fill="totalMonth.trend === 'up' ? '#007fff' : '#00a574'"
          />
          {{ totalMonth.contrast }}%
        </p>
        <span class="ic-box"><SendOne /></span>
      </panel>
    </el-col>
  </el-row>

  <panel title="数据趋势">
    <el-radio-group
      style="position: relative; z-index: 101"
      v-model="trendType"
      size="small"
      @change="handleSwitchType"
    >
      <el-radio-button label="7day">最近7天</el-radio-button>
      <el-radio-button label="14day">最近14天</el-radio-button>
      <el-radio-button label="30day">最近30天</el-radio-button>
    </el-radio-group>
    <vue-echarts
      :option="lineOption"
      :theme="theme"
      ref="trendLineRef"
      style="height: 350px"
    />
  </panel>

  <el-row :gutter="16">
    <el-col :sm="24" :md="12" :lg="12" :xl="12">
      <panel title="季度发布趋势">
        <vue-echarts
          :option="quarterConfig"
          ref="trendQuarterRef"
          :theme="theme"
          style="height: 350px; margin: -24px 0"
        />
      </panel>
    </el-col>
    <el-col :sm="24" :md="12" :lg="12" :xl="12">
      <panel title="每月发布趋势">
        <vue-echarts
          :option="monthConfig"
          ref="trendMonthRef"
          :theme="theme"
          style="height: 350px; margin: -24px 0"
        />
      </panel>
    </el-col>
  </el-row>

  <el-row :gutter="16">
    <el-col :sm="24" :md="24" :lg="8" :xl="8">
      <panel title="分类占比">
        <vue-echarts
          :option="pipConfigCategory"
          :theme="theme"
          ref="pipCategoryRef"
          style="height: 350px; margin: -24px 0 0"
        />
      </panel>
    </el-col>
    <el-col :sm="24" :md="24" :lg="8" :xl="8">
      <panel title="机器人占比">
        <vue-echarts
          :option="pipConfigRobot"
          :theme="theme"
          ref="pipRobotRef"
          style="height: 350px; margin: -24px 0 0"
        />
      </panel>
    </el-col>
    <el-col :sm="24" :md="24" :lg="8" :xl="8">
      <panel title="标签占比">
        <vue-echarts
          :option="pipConfigTag"
          :theme="theme"
          ref="pipTagRef"
          style="height: 350px; margin: -24px 0 0"
        />
      </panel>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted, ref } from "vue";
import dayjs from "dayjs";
import { ArrowCircleUp, ArrowCircleDown, SendOne } from "@icon-park/vue-next";
import { VueEcharts } from "vue3-echarts";
import { useThemeStore } from "@/stores";
import { ThemeEnum } from "@/enum";
import { useBarLineChart, usePipChart } from "@/hooks";
import { dataTrend, percentPip, recentTotal, dataYearOverYear } from "@/api/share";
import type { DataTrendType } from "@/types";
import { transformTotal } from "@/utils";

const themeStore = useThemeStore();
const theme = computed(() => {
  // 跟随系统：当前系统的主题 code; 其他：直接取当前缓存中的主题
  const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
  const curSystemCode = themeMedia.matches ? ThemeEnum.LIGHT : ThemeEnum.DARK;
  // console.log(themeMedia, curSystemCode);
  return themeStore.theme === ThemeEnum.SYSTEM ? curSystemCode : themeStore.theme;
});

/** -------- 季度发布趋势 -------- */
const trendQuarterRef = ref();
const {
  chartConfig: quarterConfig,
  setLineBarChart: setLineBarChartQuarter,
} = useBarLineChart();
const getDataYearOverYearQuarter = async () => {
  const { data } = await dataYearOverYear("quarter");
  setLineBarChartQuarter(
    trendQuarterRef.value,
    ["第一季度", "第二季度", "第三季度", "第四季度"],
    [
      {
        type: "bar",
        smooth: true,
        // label: { show: true },
        data: (data.current ?? []).map((d: any) => d.total),
      },
      {
        type: "bar",
        smooth: true,
        data: (data.prev ?? []).map((d: any) => d.total),
      },
    ]
  );
};

/** -------- 月度发布趋势 -------- */
const trendMonthRef = ref();
const {
  chartConfig: monthConfig,
  setLineBarChart: setLineBarChartMonth,
} = useBarLineChart();
const getDataYearOverYearMonth = async () => {
  const { data } = await dataYearOverYear("month");
  setLineBarChartMonth(
    trendMonthRef.value,
    [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
    [
      {
        type: "bar",
        smooth: true,
        // label: { show: false },
        data: (data.current ?? []).map((d: any) => d.total),
      },
      {
        type: "bar",
        smooth: true,
        data: (data.prev ?? []).map((d: any) => d.total),
      },
    ]
  );
};

/** -------- 总数汇总情况 -------- */
const totalYear = reactive({
  total: 0,
  trend: "up",
  contrast: 0,
});
const getRecentTotalYear = async () => {
  const { data } = await recentTotal("year");
  const { total, trend, contrast } = transformTotal(data.current, data.prev);
  totalYear.total = total;
  totalYear.trend = trend;
  totalYear.contrast = contrast;
};
const totalMonth = reactive({
  total: 0,
  trend: "up",
  contrast: 0,
});
const getRecentTotalMonth = async () => {
  const { data } = await recentTotal("month");
  const { total, trend, contrast } = transformTotal(data.current, data.prev);
  totalMonth.total = total;
  totalMonth.trend = trend;
  totalMonth.contrast = contrast;
};

/** -------- 数据趋势 -------- */
const trendType = ref<DataTrendType>("7day");
const handleSwitchType = async (val: any) => {
  trendType.value = val as DataTrendType;
  await getDataTrend();
};
const trendLineRef = ref();
const { chartConfig: lineOption, setLineBarChart: setLineChart } = useBarLineChart();
const getDataTrend = async () => {
  const { data } = await dataTrend(trendType.value);
  setLineChart(
    trendLineRef.value,
    (data ?? []).map((it: any) => it.date),
    [
      {
        name: "数据趋势",
        type: "line",
        smooth: true,
        label: { show: false },
        areaStyle: {},
        data: (data ?? []).map((it: any) => it.total),
      },
    ],
    { trigger: "axis" }
  );
};

/** -------- 饼图 -------- */
const pipCategoryRef = ref();
const { pipConfig: pipConfigCategory, setPipChart: setPipChartCategory } = usePipChart();
const pipRobotRef = ref();
const { pipConfig: pipConfigRobot, setPipChart: setPipChartRobot } = usePipChart();
const pipTagRef = ref();
const { pipConfig: pipConfigTag, setPipChart: setPipChartTag } = usePipChart();

onMounted(async () => {
  getRecentTotalYear();
  getRecentTotalMonth();
  getDataTrend();
  getDataYearOverYearQuarter();
  getDataYearOverYearMonth();

  const { data: dataCategory } = await percentPip("category");
  setPipChartCategory(
    pipCategoryRef.value,
    "分类占比",
    (dataCategory ?? []).map((it) => ({
      name: it.name,
      value: Number(it.value),
    }))
  );

  const { data: dataRobot } = await percentPip("robot");
  setPipChartRobot(
    pipRobotRef.value,
    "机器人占比",
    (dataRobot ?? []).map((it) => ({
      name: it.name,
      value: Number(it.value),
    }))
  );

  const { data: dataTag } = await percentPip("tag");
  setPipChartTag(
    pipTagRef.value,
    "标签占比",
    (dataTag ?? []).map((it) => ({
      name: it.name,
      value: Number(it.value),
    }))
  );
});
</script>

<style lang="scss" scoped>
.total {
  position: relative;

  .num {
    font-size: 36px;
    padding: 8px 0;
  }

  .remarks {
    color: #999;
    // opacity: 0.6;
    font-size: 14px;
    display: flex;
    align-items: center;

    .i-icon {
      position: relative;
      top: 2px;
      padding: 0 4px 0 8px;
    }
  }

  .ic-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    font-size: 24px;
    background-color: var(--base-bg);
    color: var(--el-color-primary);
    position: absolute;
    top: 50%;
    right: 32px;
    margin-top: -28px;
    // opacity: 0.8;

    .i-icon {
      position: relative;
      top: 2px;
    }
  }
}
</style>
