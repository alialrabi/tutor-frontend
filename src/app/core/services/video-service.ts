import { Injectable } from '@angular/core';
import DailyIframe from '@daily-co/daily-js';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    callObject: any;

    createCall() {
        this.callObject = DailyIframe.createCallObject();
    }

    async joinRoom(roomUrl: string, userName: string) {
        await this.callObject.join({
            url: roomUrl,
            userName: userName
        });
    }

    leaveRoom() {
        if (this.callObject) {
            this.callObject.leave();
        }
    }
}