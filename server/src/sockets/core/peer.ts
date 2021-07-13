/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-12 16:06:10
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-12 16:07:33
 */
export class Peer {

  id:string;
  name:string;
  constructor(_socketId:string,_name:string){
    this.id = _socketId;
    this.name = _name;
  }

}
