/** 主题枚举类型 */
export enum ThemeEnum {
  /** 日间模式 */
  LIGHT = 'light',
  /** 黑暗模式 */
  DARK = 'dark',
  /** 跟随系统 */
  SYSTEM = 'system'
}

/** 主体描素 */
export const ThemeMessage = {
  light: '日间模式',
  dark: '黑暗模式',
  system: '跟随系统'
}

/** 主体类型 */
export type ThemeType = keyof typeof ThemeMessage
