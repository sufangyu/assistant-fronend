import type { RobotType, StatusEnum, StatusType } from '@/enum'
import type { BaseQuery } from './base'

/** 机器人 */
export interface Robot {
  id?: number;
  name?: string;
  /** 类型（1: 飞书; 2: 钉钉; 3: 企微） */
  type?: RobotType;
  webhook?: string;
  status?: StatusType;
  createdAt?: string;
}

export interface RobotQuery extends BaseQuery {
  name?: string;
  status?: StatusEnum;
  type?: RobotType;
}
