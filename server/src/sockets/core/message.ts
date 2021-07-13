/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-12 17:03:17
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-12 17:16:43
 */
export class Message {
  public static BuilderErrorMsg(msg: string) {
    return { msg: msg, status: -1 };
  }

  public static BuilderSucceedMsg(msg: string, data: any = {}) {
    return { msg: msg, status: 0, data: data };
  }
}
