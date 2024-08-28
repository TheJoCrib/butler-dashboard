import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'chat-application'}
})
export class ChatComponent {
    public isResetRequired$: Subject<boolean> = new Subject<boolean>();
    public selectedChat$: Subject<any> = new Subject<any>();
    public selectedChatRoom$: Subject<any> = new Subject<any>();
    public selectedTopMenu$: Subject<any> = new Subject<any>();
    public reloadChats$: Subject<any> = new Subject<any>();

}
