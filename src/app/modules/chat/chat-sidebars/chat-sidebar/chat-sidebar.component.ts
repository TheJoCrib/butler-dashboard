import {Component, Input, OnInit} from "@angular/core";
import {CoreSidebarService} from "@core/components/core-sidebar/core-sidebar.service";
import {ChatService} from "@core/services/chat/chat.service";
import {SocketService} from "@core/services/chat/socket.service";
import {FREELANCER} from "@core/utilities/constants";
import {Subject} from "rxjs";
import {DialogService} from "../../../../../@core/components/dialog.service";
import {AdminService} from "../../../../../@core/services/admin/admin.service";

@Component({
    selector: "app-chat-sidebar",
    templateUrl: "./chat-sidebar.component.html",
    providers: [SocketService],
})
export class ChatSidebarComponent implements OnInit {
    // Public
    public sidebarChats;
    public searchText;
    public chats;
    public selectedIndex = null;
    public selectedTabIndex = 0;
    public userProfile;
    @Input() isResetRequired: Subject<boolean>;
    @Input() selectedChat$: Subject<boolean>;
    @Input() selectedChatRoom: Subject<string>;
    @Input() selectedTopMenu: Subject<string>;
    @Input() reloadChats: Subject<boolean>;
    admins: any;
    selectedTab: any;
    totalActiveUsers: any;
    totalChats: any;
    support = false;
    lastSelectedChat = null;
    tabList = [
        {
            value: "client",
            label: "Clients",
            menu: [
                {
                    value: "client",
                    label: "Jobs"
                },
                {
                    value: "support",
                    label: "Support"
                },
                {
                    value: "openchat",
                    label: "Open Chat"
                }
            ]
        },
        {
            value: "freelancer",
            label: "Designers",
            menu: [
                {
                    value: "freelancer",
                    label: "Jobs"
                },
                {
                    value: "freelancer_support",
                    label: "Support"
                }
            ]
        },
        {
            value: "staff",
            label: "Staff",
            menu: [
                {
                    value: "support",
                    label: "Support"
                }
            ]
        },
    ];
    /**
     * On init
     */
    public subs = [];

    // Public Methods
    // -----------------------------------------------------------------------------------------------------
    tabsList = [];
    tabsSupportList = [];
    selectedTopTab = 'client';
    selectedBottomTab = 'client';

    /**
     * Constructor
     *
     * @param {ChatService} chatService
     * @param {CoreSidebarService} _coreSidebarService
     */
    constructor(
        private chatService: ChatService,
        private socktService: SocketService,
        private dialogService: DialogService,
        private adminService: AdminService,
        private _coreSidebarService: CoreSidebarService
    ) {
    }

    /**
     * Open Chat
     *
     * @param id
     * @param newChat
     */

    openChat(id) {
        if (id) {
            const selectedChat = this.sidebarChats.find(value => value._id === id);
            this.selectedChat$.next(selectedChat);

            this.chatService.getChatById(id).subscribe((res) => {
                this.chats = res;
            });
            this.chatService.setCurrentChat(id);
            this.lastSelectedChat = id;
        }
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle Sidebar
     *
     * @param name
     */
    toggleSidebar(name) {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    /**
     * Set Index
     *
     * @param index
     */
    setIndex(index: number) {
        this.selectedIndex = index;
    }

    topTabHandler(value) {
        this.selectedTabIndex = 0;
        this.selectedTopTab = value;
        this.selectedBottomTab = this.tabList.find(value1 => value1.value === value).menu[0].value;
        this.fetchChatList(this.selectedBottomTab);
        this.isResetRequired.next(true);
        this.selectedTopMenu.next(value);
    }

    createAdminChat() {
        const admins = this.filterAdmins();
        this.dialogService.swalConfirmationWithInputAndDropdown('Create Admin Chat', 'Create', admins)
            .then((selectedAdmin: any) => {
                const req = {participant: selectedAdmin.id};
                this.chatService.createAdminChat(req).subscribe((res) => {
                    this.fetchChatList();
                });
                ;
                // Handle the selected admin here
            })
            .catch((error) => {
                console.log('Dialog dismissed or rejected:', error);
                // Handle the dismissal or rejection here
            });

    }

    filterAdmins() {
        const alreadyHaveChatRoom = this.sidebarChats.flatMap(item => item.admins.map(admin => admin.participant._id));
        return this.admins.filter(item => {
            return !alreadyHaveChatRoom.includes(item.id);
        });
    }

    getAdmins() {
        const adminSub = this.adminService.getAdmins().subscribe((value: any) => {
            this.admins =
                value.data.map((c) => {
                    return {
                        id: c._id,
                        name: c.fullName,
                        displayName: `${c.fullName}(${c.email})`,
                        email: c.email,
                    };
                });
        });
        this.subs.push(adminSub);
    }

    setTabIndex(index: number, value: string) {
        this.lastSelectedChat = null;
        this.selectedBottomTab = value;
        this.selectedTabIndex = index;
    }

    ngOnInit(): void {
        this.tabsList = [
            {value: "client", label: "Clients"},
            {value: "freelancer", label: "Designers"},
            {value: "openchat", label: "Open Chats"},
        ];
        this.tabsSupportList = [
            {value: "support", label: "Support"},
            {value: "operations", label: "Operations"}
        ];
        //this.fetchChatList();
        const expSub = this.socktService.exception().subscribe((res) => {
        });
        this.getAdmins();
        this.socktService.connect();
        this.socktService.connectToChats();
        const onlineStatusSub = this.socktService
            .updatedUserStatus()
            .subscribe((res) => {
                this.totalActiveUsers = res.users;
                this.fetchChatList(this.tabsList[this.selectedTabIndex].value);
            });
        const trgSub = this.socktService.messageData().subscribe((res) => {
            if (res.chatRoom?._id && this.sidebarChats.length) {
                let cIndex = this.sidebarChats.findIndex(
                    (c) => c._id === res.chatRoom?._id
                );
                if (cIndex > -1) {
                    this.sidebarChats[cIndex]["lastMessage"] = res.messages[0];
                }
            }
        });
        const selectedTabSub = this.selectedChatRoom.subscribe(value => {
            if (value) {
                this.selectedTab = value;
            }
        });
        const reloadChatsSub = this.reloadChats.subscribe(value => {
            if (value) {
                this.fetchChatList(this.selectedTab);
            }
        })
        this.subs.push(reloadChatsSub);
        this.subs.push(selectedTabSub);
        this.subs.push(trgSub);
        this.subs.push(expSub);
        this.subs.push(onlineStatusSub);

    }

    // destroy cpmponent//
    ngOnDestroy() {
        this.subs.forEach((sub) => {
            sub.unsubscribe();
            sub.remove();
        });

        this.socktService.disconnect();
    }


    isOnline(userId: string, onlineUsers: []) {
        return (
            onlineUsers?.length && onlineUsers.findIndex((id) => id == userId) > -1
        );
    }


    fetchChatList(typ?: string) {
        typ = typ || "client";
        this.sidebarChats = [];
        this.isResetRequired.next(true);
        this.selectedChatRoom.next(typ);
        this.lastSelectedChat = null;
        if (this.selectedTopTab !== 'staff') {
            console.log('typ', typ)
            const getChats = this.chatService
                .getChats({roomType: typ})
                .subscribe((res) => {
                    this.chatHandler(typ, res);
                });
            this.subs.push(getChats);
        } else {
            const getChats = this.chatService
                .getAdminChats({})
                .subscribe((res) => {
                    this.chatHandler(typ, res);
                });
            this.subs.push(getChats);
        }
    }


    chatHandler(typ, res) {
        this.reloadChats.next(false);
        this.sidebarChats = res[0].data;
        if (this.totalActiveUsers) {
            let activeUsers =
                typ === FREELANCER
                    ? this.totalActiveUsers.activeFreelancers
                    : [
                        ...this.totalActiveUsers.activeFreelancers,
                        this.totalActiveUsers.activeClients,
                    ];

            this.sidebarChats = this.sidebarChats.map((sbc) => {
                return {
                    ...sbc,
                    online: this.isOnline(sbc.user.participant._id, activeUsers),
                };
            });
        }
        this.totalChats = res[0].totalCount;
        const chatId = res[0]?.data[0]?._id;
        if (this.sidebarChats.length > 0) {
            if (this.lastSelectedChat) {
                const index = this.sidebarChats.findIndex(value => value._id === this.lastSelectedChat);
                this.openChat(this.lastSelectedChat)
                this.selectedIndex = index;
            } else {
                this.openChat(chatId);
                this.selectedIndex = 0;
            }
        }
    }

    isLastRead(chat) {
        let tempAdmin = JSON.parse(localStorage.getItem("admin"));
        return chat.admins.filter((a) => a.participant?._id == tempAdmin.id)[0]
            ?.isRead;
    }

    reloadChatsHandler() {
        this.fetchChatList(this.selectedTab);
    }
}
