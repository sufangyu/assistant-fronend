/** 机器人枚举类型 */
export enum RobotTypeEnum {
  /** 飞书 */
  FEI_SHU = 1,
  /** 钉钉 */
  DING_DING = 2,
  /** 企微 */
  QI_WEI = 3
}

/** 机器人 */
export const RobotTypeMessage = {
  1: '飞书',
  2: '钉钉',
  3: '企微'
}

/** 机器人类型 */
export type RobotType = keyof typeof RobotTypeMessage;
