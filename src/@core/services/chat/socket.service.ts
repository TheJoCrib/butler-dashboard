import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs/operators";
import { TokenService } from "../authentication/token.service";

@Injectable()
export class SocketService {
  constructor(
    private socket: Socket,
    private toastService: ToastrService,
    private token: TokenService
  ) {}

  sendMessage(data: any, chatRoomId: string) {
    this.socket.emit("sendMessage", {
      token: this.token.getToken(),
      ...data,
      chatRoomId: chatRoomId,
    });
  }
  connectToChats() {
    this.socket.emit("connectToChats", { token: this.token.getToken() });
  }
  typing() {
    this.socket.emit("typing", { token: this.token.getToken() });
  }
  readChat(data) {
    this.socket.emit("readChat", { ...data, token: this.token.getToken() });
  }
  getUnReadMessages(data) {
    this.socket.emit("getUnReadMessages", {
      ...data,
      token: this.token.getToken(),
    });
  }
  disconnect() {
    this.socket.disconnect();
  }
  connect() {
    this.socket.connect();
  }
  updatedChatRoomStatus() {
    return this.socket.fromEvent("updatedChatRoomStatus").pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  updatedUserStatus(){
    return this.socket.fromEvent("updatedUserStatus").pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  exception() {
    return this.socket.fromEvent("exception").pipe(
      map((data: any) => {
        this.toastService.error(JSON.stringify(data));
        return data.messages;
      })
    );
  }
  messageData() {
    return this.socket
      .fromEvent("messageData")
      .pipe(map((data: any) => data));
  }
  unReadMessages() {
    return this.socket.fromEvent("unReadMessages").pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getMessage() {
    return this.socket.fromEvent("message").pipe(map((data) => data));
  }
}
