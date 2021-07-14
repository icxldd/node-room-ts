/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-13 10:42:36
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-14 10:30:24
 */
export interface _Response {
  data: any;
  isError: boolean;
}

export enum VideoState {
  canPlayer = '可播放',
  InBuffer = '缓冲中'
}



// export type VideoState = '可播放' | '缓冲中';