import { reactive } from "vue";

const colors = ["#007fff"];
type Series = {
  type: "bar" | "line";
  data: any[];
  barWidth?: string;
  name?: string;
  smooth?: boolean;
  label?: {
    show?: boolean;
    position?: string;
  };
  areaStyle?: boolean | object;
  color?: string[];
}


/** 折线、柱状图 */
export const useBarLineChart = () => {
  const chartConfig = reactive({
    backgroundColor: "transparent",
    xAxis: {
      type: "category" as "category",
      data: [],
    },
    yAxis: {
      type: "value" as "value",
    },
    series: [],
    tooltip: { show: true },
    toolbox: {
      feature: {
        saveAsImage: { show: true },
      },
    },
    color: [...colors],
  });


  const setLineBarChart = <C = string>(ref: any, columns: C[], data: Series[], tooltip?: any) => {
    const series = (data ?? []).map((d) => {
      return {
        data: d.data,
        type: d.type,
        barWidth: d.barWidth ?? "auto",
        smooth: d.smooth,
        label: d.label ?? {
          show: true,
          position: "top" as "top",
        },
        areaStyle: d.areaStyle,
        color: d.color,
      };
    });

    if (tooltip) {
      // console.log('tooltip: ', tooltip);
      chartConfig.tooltip = tooltip
    }
    
    if ((data ?? []).length > 1) {
      chartConfig.tooltip = { trigger: "axis" } as any;
    }

    chartConfig.xAxis.data = [...columns] as any;
    chartConfig.series = [...series] as any;
    // console.log('chartConfig:', JSON.stringify(chartConfig));

    // 触发更新视图
    ref?.setOption(chartConfig);
  };
  
  return {
    chartConfig,
    setLineBarChart,
  }
}


/** 饼图 */
export const usePipChart = () => {
  const pipConfig = reactive({
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item" as "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      bottom: "0",
      type: "scroll" as "scroll",
    },
    series: [
      {
        name: "",
        type: "pie" as "pie",
        radius: ["50%", "60%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: 'transparent',
        },
        label: {
          // FIXME: 偶尔被裁剪（根据字符长度处理是否换行）
          formatter(param: { name: string; value: number; percent: number; }) {
            return `${param.name}: ${param.value}`;
            // return param.name + " (" + param.percent! * 1 + "%)";
          },
          show: true,
        },
        data: [],
      },
    ],
    color: [...colors],
  });

  /**
   * 设置配置 & 更新视图
   *
   * @param {*} ref 组件示例
   * @param {string} name 名称
   * @param {({ value: number | string, name: string}[])} data 数据
   */
  const setPipChart = (ref: any, name: string, data: { value: number | string, name: string}[]) => {
    pipConfig.series[0].name = name;
    pipConfig.series[0].data = [...data] as any;
  
    // 触发更新视图
    ref?.setOption(pipConfig);
  }
  
  return {
    pipConfig,
    setPipChart,
  }
}