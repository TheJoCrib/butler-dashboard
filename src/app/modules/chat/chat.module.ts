import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

import { CoreSidebarModule } from "@core/components";
import { CoreCommonModule } from "@core/common.module";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { ChatContentComponent } from "./chat-content/chat-content.component";
import { ChatSidebarComponent } from "./chat-sidebars/chat-sidebar/chat-sidebar.component";
import { ChatUserSidebarComponent } from "./chat-sidebars/chat-user-sidebar/chat-user-sidebar.component";
import { ChatActiveSidebarComponent } from "./chat-sidebars/chat-active-sidebar/chat-active-sidebar.component";
import { ChatComponent } from "./chat.component";
import { environment } from "environments/environment";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

const config: SocketIoConfig = { url: environment.chatUrl, options: {path:'/api/socket.io'} };

// routing
const routes: Routes = [
  {
    path: "",
    component: ChatComponent,
    data: { animation: "chat" },
  },
];

@NgModule({
  declarations: [
    ChatComponent,
    ChatContentComponent,
    ChatSidebarComponent,
    ChatUserSidebarComponent,
    ChatActiveSidebarComponent,
  ],
    imports: [
        CommonModule,
        CoreSidebarModule,
        RouterModule.forChild(routes),
        SocketIoModule.forRoot(config),
        CoreCommonModule,
        PerfectScrollbarModule,
        NgbModule,
        MatCardModule,
        MatButtonModule,
    ],
  providers: [],
})
export class ChatModule {}
