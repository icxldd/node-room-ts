/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-13 17:07:56
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-13 19:53:12
 */
import React, { useEffect, useState } from "react";
import DPlayer from "dplayer";
import { DPlayerEvents } from 'dplayer';
import { WebsocketSignal } from "../utils/websocket-signal";
import Event from "../utils/event";
import Bus from '../utils/event-bus'
import { room_status } from "../utils/room-status";
export interface RoomVideoPorps {
  socketSignal: WebsocketSignal | undefined;
}

export const RoomVideo = ({ socketSignal }: RoomVideoPorps) => {
  let url = 'https://n1.szjal.cn/20210708/aBI7IbCm/index.m3u8';
  useEffect(() => {

    const dp = new DPlayer({
      container: document.getElementById('video'),
      video: {
        url: url,
        type: 'hls',
      },
      pluginOptions: {
        hls: {
          // hls config
        },
      },
    });

    dp.on('canplay' as DPlayerEvents.canplay, () => {
      //1.同步进度
      //2.等待响应
      //3.发送播放  dp.play();

      if (!socketSignal?.isSelfCreate) {
        socketSignal?.request(Event.EventRequestConst.StartPlayerReqeust, {}).then(x => { });
        return;
      }

      console.log('canplay ');
    });

    //接收端更新时间
    socketSignal?.socket.on(Event.EventResponeseConst.SynchronousProgressResponese, ({ time }) => {
      dp.video.currentTime = time;
    });

    socketSignal?.socket.on(Event.EventResponeseConst.StartPlayerResponese, () => {
      dp.play();
    });

    Bus.addListener('changeRoomStatus', (val: room_status) => {
      if (val == '好友已进入房间') {
        socketSignal?.request(Event.EventRequestConst.SynchronousProgressReqeust, ({ time: dp.video.currentTime })).then(x => { });
      }
    });


    // dp.on('waiting' as DPlayerEvents.waiting, () => {
    //   console.log('waiting ');
    // });

    // dp.on('pause' as DPlayerEvents.pause, () => {
    //   console.log('pause ');
    //   //刷新进度
    // });
    // dp.on('play' as DPlayerEvents.play, () => {
    //   console.log('play ');
    // });

    
  }, []);

  return (<div id="video"></div>);
}