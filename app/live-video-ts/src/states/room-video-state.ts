/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-14 10:24:15
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-14 10:48:50
 */
import { run } from 'concent';
import { VideoState } from '../types/type'
const roomState = {
  state: {
    videoState: VideoState.InBuffer,
    roomCreated: false,
    websocket: {},
    player:{}
  }
};

run({
  roomState
});
