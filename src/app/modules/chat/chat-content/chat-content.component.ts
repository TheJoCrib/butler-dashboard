import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild,} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {CoreSidebarService} from "@core/components/core-sidebar/core-sidebar.service";
import {ChatService} from "@core/services/chat/chat.service";
import {SocketService} from "@core/services/chat/socket.service";
import {CoreMediaService} from "@core/services/media.service";
import {ALLOWED_EX, IMAGE_EX, VIDEO_EX} from "@core/utilities/constants";
import {environment} from "environments/environment";
import {ToastrService} from "ngx-toastr";
import {InvoiceService} from "../../../../@core/services/invoice/invoices.service";
import {Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {DialogService} from "../../../../@core/components/dialog.service";

@Component({
    selector: "app-chat-content",
    templateUrl: "./chat-content.component.html",
    providers: [SocketService],
})
export class ChatContentComponent implements OnInit, OnDestroy {
    // Decorator
    @ViewChild("scrollMe") scrollMe: ElementRef;
    @Input() isResetRequired$: Subject<boolean>;
    @Input() selectedChat$: Subject<boolean>;
    @Input() reloadChats$: Subject<boolean>;
    @Input() selectedChatRoom$: Subject<string>;
    @Input() selectedTopMenu$: Subject<string>;
    scrolltop: number = null;
    @ViewChild("fileInput", {static: false}) fileInput: any;
    // Public
    public activeChat: Boolean;
    public activeChatId: string;
    public chatUser;
    public admin;
    public SERVER_URL = environment.apiUrl;
    subscription: Subscription = new Subscription();

    pointerDate: any;
    file: any;
    msgType: string;
    totalCount = 0;
    imgURL: any;
    public chatMessage = "";
    chatMessages = [];
    isRecording = false;
    recordedSecs = 0;
    skip = 0;
    query = {pageNo: 1, limit: 10};
    subs = [];
    roomType: string;
    isAudioRecording = false;
    audioBlobUrl: any;
    audioName: string;
    audioBlob: Blob;
    audioRecordedTime: string;
    selectedChat: any;
    selectedChatRoom: any;
    selectedTopMenu: any;
    showContent: boolean = false;

    /**
     * Constructor
     *
     * @param ref
     * @param {ChatService} chatService
     * @param {CoreSidebarService} _coreSidebarService
     * @param socktService
     * @param toastr
     * @param sanitizer
     * @param invoiceService
     * @param router
     * @param mediaService
     */
    constructor(
        private ref: ChangeDetectorRef,
        private chatService: ChatService,
        private _coreSidebarService: CoreSidebarService,
        private socktService: SocketService,
        private toastr: ToastrService,
        private sanitizer: DomSanitizer,
        private invoiceService: InvoiceService,
        private router: Router,
        private mediaService: CoreMediaService,
        private dialog: DialogService,
    ) {
        this.mediaService.recordingFailed().subscribe(() => {
            this.isAudioRecording = false;
            this.ref.detectChanges();
        });
        this.mediaService.getRecordedTime().subscribe((time) => {
            this.audioRecordedTime = time;
            this.ref.detectChanges();
        });

        this.mediaService.getRecordedBlob().subscribe((data) => {
            this.audioBlob = data.blob;
            this.audioName = data.title;
            this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(
                URL.createObjectURL(data.blob)
            );
            this.ref.detectChanges();
        });
    }


    // Public Methods
    // -----------------------------------------------------------------------------------------------------
    getThumbnail(ex: any) {
        switch (ex?.toLowerCase()) {
            case "pdf":
                return "/assets/pdf-thumbnail.png";
            case "jpeg":
                return "/assets/picture.jpg";
            case "png":
                return "/assets/picture.jpg";
            case "docx":
                return "/assets/docx-thumbnail.png";
            case "mp4":
                return "/assets/video-thumbnail.png";
            case "webm":
                return "/assets/video-thumbnail.png";
            case "wmv":
                return "/assets/video-thumbnail.png";
            case "mov":
                return "/assets/video-thumbnail.png";
            default:
                return "/assets/simple.png";
        }
    }

    getEx(fileURl: string) {
        return fileURl?.split(".").pop();
    }

    toggleRecording() {
        this.isRecording = !this.isRecording;
    }

    startAudioRecording() {
        if (!this.isAudioRecording) {
            this.isAudioRecording = true;
            this.mediaService.startRecording();
        }
    }

    sendInvoice() {
        // Required job Id here
        this.invoiceService.sendInvoice(this.activeChatId).subscribe((res) => {
            this.toastr.success(`Invoice sent successfully!`);
            this.retrieveChats();
        });
    }

    abortAudioRecording() {
        if (this.isAudioRecording) {
            this.isAudioRecording = false;
            this.mediaService.abortRecording();
        }
    }

    stopAudioRecording() {
        if (this.isAudioRecording) {
            this.mediaService.stopRecording();
            this.isAudioRecording = false;
        }
    }

    clearAudioRecordedData() {
        this.audioBlobUrl = null;
        this.audioBlob = null;
    }

    extractFileName(fileName: string) {
        return fileName
            ?.split("messages_static_data/")[1]
            ?.split(".")
            .splice(1)
            .join(".");
    }

    handleFileChange(event: any) {
        this.file = event.target.files[0];
        let extension = this.file.name.split(".").pop();
        if (ALLOWED_EX.findIndex((ex) => extension === ex) < 0) {
            this.toastr.warning(`.${extension} files are not allowed`);
            this.fileInput.nativeElement.value = null;
            return;
        }
        if (IMAGE_EX.findIndex((ex) => extension === ex) > -1) {
            this.msgType = "image";
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (_event) => {
                this.imgURL = reader.result;
            };
        } else if (VIDEO_EX.findIndex((ex) => extension === ex) > -1) {
            this.msgType = "video";
            this.imgURL = this.getThumbnail(extension);
        } else {
            this.msgType = "file";
            this.imgURL = this.getThumbnail(extension);
        }
    }

    deleteFile() {
        this.file = undefined;
        this.imgURL = undefined;
    }

    /**
     * Update Chat
     */
    updateChat() {
        if (!this.chatMessage.trim() && !this.file && !this.audioBlob) {
            return;
        }
        let data = {};
        data["message"] = this.chatMessage;
        if (this.file) {
            data["file"] = this.file;
            data["msgType"] = this.msgType;
            data["fileName"] = this.file.name;
        }
        if (this.audioBlob) {
            data["file"] = this.audioBlob;
            data["msgType"] = "audio";
        }
        this.socktService.sendMessage(data, this.activeChatId);
        this.chatMessage = "";
        this.file = undefined;
        this.audioBlob = null;
        this.audioBlobUrl = null;
        this.audioName = null;
        this.audioRecordedTime = null;
        this.imgURL = undefined;
    }

    handleScroll(event: Event) {
        if (
            (this.scrollMe as ElementRef).nativeElement.scrollTop < 1 && this.activeChatId &&
            this.query.pageNo < Math.ceil(this.totalCount / this.query.limit)
        ) {
            this.query.pageNo++;
            this.chatService
                .getChatMessages({
                    chatRoomId: this.activeChatId,
                    ...this.query,
                })
                .subscribe((res: any) => {
                    this.chatMessages.splice(0, 0, ...res.messages);
                    this.totalCount = res.totalCount[0]?.count;
                });
        }
    }

    typing() {
        const el: HTMLDivElement = this.scrollMe.nativeElement;
        el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
    }

    /**
     * Toggle Sidebar
     *
     * @param name
     */
    toggleSidebar(name) {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    isDivider(date) {
        if (this.pointerDate !== new Date(date).toDateString()) {
            this.pointerDate = new Date(date).toDateString();
            return this.pointerDate;
        } else {
            return null;
        }
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    // destroy cpmponent//
    ngOnDestroy() {
        this.subs.forEach((sub) => {
            sub.unsubscribe();
            sub.remove();
        });
        this.subscription.unsubscribe();

        this.socktService.disconnect();
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to Chat Change
        this.subscription.add(this.isResetRequired$.subscribe(value => {
            this.chatMessages.splice(0, this.chatMessages.length);
            this.roomType = '';
            this.activeChatId = '';
            this.activeChat = false;
        }));
        this.subscription.add(this.selectedChat$.subscribe(value => {
            this.selectedChat = value;
        }));
        this.subscription.add(this.selectedChatRoom$.subscribe(value => {
            this.selectedChatRoom = value;
        }));
        this.subscription.add(this.selectedTopMenu$.subscribe(value => {
            this.selectedTopMenu = value;
        }));
        const instanMsgSubs = this.socktService.messageData().subscribe((res) => {
            if (res.chatRoom && this.activeChatId === res.chatRoom._id) {
                this.chatMessages = [...this.chatMessages, res.messages[0]];
                setTimeout(() => {
                    this.scrollToBottom()
                });
            }
        });
        const chatRoomSub = this.chatService.onChatRoomChange.subscribe((res) => {
            this.activeChat = true;
            this.activeChatId = res;
            this.chatMessages.splice(0, 0);
            this.query.pageNo = 1;
            const chatByIdSub = this.chatService
                .getChatById(res)
                .subscribe((d: any) => {
                    this.chatUser = d.user?.participant;
                    this.roomType = d.roomType;
                    let tempAdmin = JSON.parse(localStorage.getItem("admin"));
                    this.admin = d.admins?.filter(
                        (a) => a.participant?._id == tempAdmin.id
                    )[0];
                    setTimeout(() => {
                        this.showContent = true;
                    }, 1000); // Delay of 2 seconds (2000 milliseconds)
                });
            this.subs.push(chatByIdSub);
            this.retrieveChats();
        });
        this.subs.push(instanMsgSubs, chatRoomSub);
    }

    scrollToBottom(): void {
        try {
            if (this.scrollMe) {
                this.scrollMe.nativeElement.scrollTop =
                    this.scrollMe.nativeElement.scrollHeight;
            }
        } catch (err) {
            console.log(err);
        }
    }


    routeToInvoice(id) {
        let path = 'admin/invoices/details-view/' + id;
        this.router.navigateByUrl(path);
    }

    retrieveChats() {
        const chatMessagesSub = this.chatService
            .getChatMessages({
                chatRoomId: this.activeChatId,
                ...this.query,
            })
            .subscribe((res: any) => {
                this.chatMessages.splice(0, this.chatMessages.length);
                this.chatMessages = res.messages;
                this.totalCount = res.totalCount[0]?.count;
                setTimeout(() => {
                    this.scrollToBottom();
                }, 1000);
            });
        this.subs.push(chatMessagesSub);
    }

    initialHandler(fullName) {
        let initials: string = '';
        if (fullName) {
            const names = fullName.split(' ').filter(name => name !== '');
            ;
            if (names.length > 0) {
                const firstName = names[0];
                initials += firstName ? firstName.charAt(0) : '';
            }

            if (names.length > 1) {
                const lastName = names[names.length - 1];
                initials += lastName ? lastName.charAt(0) : '';
            }
        }

        return initials;
    }

    endChat() {
        if (this.selectedChatRoom === 'openchat' || this.selectedChatRoom === 'support') {
            const msg = 'Are you sure you want to end the chat?';
            this.dialog.swalConfirmation(msg, 'warning', "Yes").then(value => {
                if (value) {
                    this.endChatHandler();
                }
            })
        } else if (this.selectedChatRoom === 'client') {
            if (this.selectedChat && this.selectedChat.job && this.selectedChat.job.status === 'PENDING') {
                const msg = 'There is an ongoing job in progress. Please enter the reason for ending the chat below.';
                this.dialog.swalConfirmationWithInput(msg, 'warning', "Yes").then(value => {
                    if (value && value.value) {
                        this.endChatHandler(value.value);
                    }
                })
            } else {
                const msg = 'Are you sure you want to end the chat?';
                this.dialog.swalConfirmation(msg, 'warning', "Yes").then(value => {
                    if (value) {
                        this.endChatHandler();
                    }
                })
            }
            if (this.selectedChat && this.selectedChat.job && this.selectedChat.job.status === 'COMPLETED') {
                const msg = 'Are you sure you want to end the chat?';
                this.dialog.swalConfirmation(msg, 'warning', "Yes").then(value => {
                    if (value) {
                        this.endChatHandler();
                    }
                })
            }
        }
    }

    endChatHandler(reason?: any) {
        let req = {};
        if (reason) {
            req = {reason: reason};
        }
        this.chatService.endChat(this.selectedChat._id,req).subscribe(value1 => {
            this.reloadChats$.next(true);
        })
    }
}
