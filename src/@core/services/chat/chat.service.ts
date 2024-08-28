import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {API_ENDPOINTS} from "../http/api-end-points";
import {HttpService} from "../http/http.service";
import {TokenService} from "../authentication/token.service";

@Injectable({
    providedIn: "root",
})
export class ChatService {
    public currentChatRoom = '';
    public onChatRoomChange: Subject<any>;

    constructor(
        private httpService: HttpService,
        private token: TokenService
    ) // private socket: Socket
    {
        this.onChatRoomChange = new Subject();
    }

    getChats(queryParams?: Object) {
        return this.httpService.get(API_ENDPOINTS.CHAT, {
            ...queryParams,
        });
    }

    getAdminChats(queryParams?: Object) {
        return this.httpService.get(API_ENDPOINTS.CHAT + '/getAdminToAdminChats', {
            ...queryParams,
        });
    }

    createAdminChat(queryParams?: any) {
        console.log('hi', queryParams)
        return this.httpService.post(API_ENDPOINTS.CHAT + '/adminToAdmin?participant=' + queryParams.participant, {
            ...queryParams,
        });
    }

    getChatMessages(queryParams?: Object) {
        return this.httpService.get(API_ENDPOINTS.CHAT + '/messages', {
            ...queryParams,
        });
    }

    endChat(chatId: any,queryParams?: Object) {
        return this.httpService.post(API_ENDPOINTS.CHAT + '/endChat?chatId=' + chatId, {
            ...queryParams,
        });
    }

    getChatById(id: String) {
        return this.httpService.get(API_ENDPOINTS.CHAT + "/" + id);
    }

    setCurrentChat(chatRoom) {
        this.currentChatRoom = chatRoom;
        this.onChatRoomChange.next(chatRoom);
    }

    getCurrentChat() {
        return this.currentChatRoom;
    }
}
