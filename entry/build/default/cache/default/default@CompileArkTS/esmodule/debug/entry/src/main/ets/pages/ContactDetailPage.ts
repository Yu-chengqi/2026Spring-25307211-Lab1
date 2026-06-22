if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ContractDetailPage_Params {
    uiContext?: UIContext | undefined;
    name?: string;
    telephony?: string;
    email?: string;
    remarks?: string;
    address?: string;
    kvManager?;
    dialogController?: CustomDialogController;
}
import hilog from "@ohos:hilog";
import type { BusinessError } from "@ohos:base";
import ContactDetailItem from "@bundle:com.example.distributedcontacts/entry/ets/components/ContactDetailItem";
import type { ContactData } from '../viewmodel/ContactViewModel';
import type { KvManager } from '../utils/KvManager';
import { ContactDeleteDialog } from "@bundle:com.example.distributedcontacts/entry/ets/components/ContactDeleteDialog";
import CommonConstants from "@bundle:com.example.distributedcontacts/entry/ets/common/CommonConstants";
class ContractDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__uiContext = new ObservedPropertyObjectPU(AppStorage.get('uiContext'), this, "uiContext");
        this.__name = new ObservedPropertySimplePU('', this, "name");
        this.__telephony = new ObservedPropertySimplePU('', this, "telephony");
        this.__email = new ObservedPropertySimplePU('', this, "email");
        this.__remarks = new ObservedPropertySimplePU('', this, "remarks");
        this.__address = new ObservedPropertySimplePU('', this, "address");
        this.kvManager = AppStorage.get('kvManager') as KvManager;
        this.dialogController = new CustomDialogController({
            builder: () => {
                let jsDialog = new ContactDeleteDialog(this, {
                    cancel: () => {
                        this.onCancel();
                    },
                    confirm: () => {
                        this.onConfirm();
                    },
                    promptMessage: { "id": 16777260, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                }, undefined, -1, () => { }, { page: "entry/src/main/ets/pages/ContactDetailPage.ets", line: 35, col: 14 });
                jsDialog.setController(this.dialogController);
                ViewPU.create(jsDialog);
                let paramsLambda = () => {
                    return {
                        cancel: () => {
                            this.onCancel();
                        },
                        confirm: () => {
                            this.onConfirm();
                        },
                        promptMessage: { "id": 16777260, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                    };
                };
                jsDialog.paramsGenerator_ = paramsLambda;
            },
            autoCancel: true,
            alignment: DialogAlignment.Center,
            customStyle: true
        }, this);
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ContractDetailPage_Params) {
        if (params.uiContext !== undefined) {
            this.uiContext = params.uiContext;
        }
        if (params.name !== undefined) {
            this.name = params.name;
        }
        if (params.telephony !== undefined) {
            this.telephony = params.telephony;
        }
        if (params.email !== undefined) {
            this.email = params.email;
        }
        if (params.remarks !== undefined) {
            this.remarks = params.remarks;
        }
        if (params.address !== undefined) {
            this.address = params.address;
        }
        if (params.kvManager !== undefined) {
            this.kvManager = params.kvManager;
        }
        if (params.dialogController !== undefined) {
            this.dialogController = params.dialogController;
        }
    }
    updateStateVars(params: ContractDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__uiContext.purgeDependencyOnElmtId(rmElmtId);
        this.__name.purgeDependencyOnElmtId(rmElmtId);
        this.__telephony.purgeDependencyOnElmtId(rmElmtId);
        this.__email.purgeDependencyOnElmtId(rmElmtId);
        this.__remarks.purgeDependencyOnElmtId(rmElmtId);
        this.__address.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__uiContext.aboutToBeDeleted();
        this.__name.aboutToBeDeleted();
        this.__telephony.aboutToBeDeleted();
        this.__email.aboutToBeDeleted();
        this.__remarks.aboutToBeDeleted();
        this.__address.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __uiContext: ObservedPropertyObjectPU<UIContext | undefined>;
    get uiContext() {
        return this.__uiContext.get();
    }
    set uiContext(newValue: UIContext | undefined) {
        this.__uiContext.set(newValue);
    }
    private __name: ObservedPropertySimplePU<string>;
    get name() {
        return this.__name.get();
    }
    set name(newValue: string) {
        this.__name.set(newValue);
    }
    private __telephony: ObservedPropertySimplePU<string>;
    get telephony() {
        return this.__telephony.get();
    }
    set telephony(newValue: string) {
        this.__telephony.set(newValue);
    }
    private __email: ObservedPropertySimplePU<string>;
    get email() {
        return this.__email.get();
    }
    set email(newValue: string) {
        this.__email.set(newValue);
    }
    private __remarks: ObservedPropertySimplePU<string>;
    get remarks() {
        return this.__remarks.get();
    }
    set remarks(newValue: string) {
        this.__remarks.set(newValue);
    }
    private __address: ObservedPropertySimplePU<string>;
    get address() {
        return this.__address.get();
    }
    set address(newValue: string) {
        this.__address.set(newValue);
    }
    private kvManager;
    private dialogController: CustomDialogController;
    // Close the pop-up window.
    onCancel() {
        try {
            this.getUIContext().getPromptAction().showToast({
                message: { "id": 16777232, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                duration: CommonConstants.PROMPT_DURATION
            });
            this.dialogController.close();
        }
        catch (error) {
            hilog.error(0x0000, 'ContactDetailPage', `delete_cancel_text err: ${error.code}  msg:${error.message}`);
        }
    }
    // Confirm the cancellation of transcoding.
    onConfirm() {
        let contactsKey = CommonConstants.CONTACTS_DATABASE_KEY + this.name;
        this.kvManager.deleteOnce(contactsKey, () => {
            try {
                this.getUIContext().getPromptAction().showToast({
                    message: { "id": 16777255, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                    duration: CommonConstants.PROMPT_DURATION
                });
            }
            catch (error) {
                hilog.error(0x0000, 'ContactDetailPage', `prompt_message_deleted err: ${error.code}  msg:${error.message}`);
            }
            this.getUIContext().getRouter().pushUrl({
                url: CommonConstants.LIST_PAGE_URL
            }).catch((err: BusinessError) => {
                hilog.error(0x0000, 'ContactDetailPage', `LIST_PAGE_URL err: ${err.code}  msg:${err.message}`);
            });
        });
        this.dialogController.close();
    }
    onPageShow(): void {
        let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
        if (params && params.key) {
            this.initializeData(params.key as string);
        }
    }
    /**
     * Initialize detail page data.
     */
    initializeData(key: string): void {
        // Get contact details.
        this.kvManager.getDetails(key, (err: BusinessError, data) => {
            if (err) {
                hilog.error(0x0000, 'ContactDetailPage', `DetailPage.ets Fail to get: ${err.code}  msg:${err.message}`);
                return;
            }
            let contactsData: ContactData = JSON.parse(data as string);
            this.name = contactsData.name as string;
            this.address = contactsData.address as string;
            this.telephony = contactsData.telephony as string;
            this.email = contactsData.email as string;
            this.remarks = contactsData.remarks as string;
        });
    }
    onBackPress() {
        this.uiContext?.getRouter().clear();
        try {
            this.uiContext?.getRouter().replaceUrl({ url: "pages/ContactHomePage" }).catch((error: BusinessError) => {
                hilog.error(0x0000, 'ContactDetailPage', `have error .Code:${error.code},message: ${error.message}`);
            });
            return true;
        }
        catch (error) {
            hilog.error(0x0000, 'ContactDetailPage', `have error .Code:${error.code},message: ${error.message}`);
            return true;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 16, right: 16 });
            Column.backgroundColor({ "id": 16777267, "type": 10001, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Column.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
        }, Column);
        this.NavigationTitle.bind(this)();
        this.RankList.bind(this)();
        Column.pop();
    }
    NavigationTitle(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ alignItems: ItemAlign.Center });
            Flex.height(56);
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
            Row.width(40);
            Row.height(40);
            Row.backgroundColor('rgba(0, 0, 0, 0.05)');
            Row.borderRadius(40);
            Row.margin({ right: 8 });
            Row.onClick(() => {
                this.getUIContext().getRouter().back();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125833534, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(24);
            SymbolGlyph.fontWeight(400);
        }, SymbolGlyph);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.flexGrow(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
            Row.width(40);
            Row.height(40);
            Row.backgroundColor('rgba(0, 0, 0, 0.05)');
            Row.borderRadius(40);
            Row.margin({ right: 8 });
            Row.onClick(() => {
                let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
                this.getUIContext().getRouter().pushUrl({
                    url: 'pages/ContactAddAndEditPage',
                    params: {
                        key: params.key as string,
                        isEdit: true,
                        name: this.name,
                        address: this.address,
                        telephony: this.telephony,
                        email: this.email,
                        remarks: this.remarks
                    }
                }).catch((error: BusinessError) => {
                    hilog.error(0x0000, 'ContactDetailPage', `have error .Code:${error.code},message: ${error.message}`);
                });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831624, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(24);
            SymbolGlyph.fontWeight(400);
        }, SymbolGlyph);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
            Row.width(40);
            Row.height(40);
            Row.backgroundColor('rgba(0, 0, 0, 0.05)');
            Row.borderRadius(40);
            Row.margin({ right: 8 });
            Row.onClick(() => {
                this.dialogController.open();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831542, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(24);
            SymbolGlyph.fontWeight(400);
        }, SymbolGlyph);
        Row.pop();
        Flex.pop();
    }
    RankList(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ top: 32 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831250, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(122);
            SymbolGlyph.fontColor(['#D1D1D6']);
        }, SymbolGlyph);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.name);
            Text.fontColor('rgba(0, 0, 0, 0.6)');
            Text.fontSize(38);
            Text.fontWeight(700);
            Text.margin({ top: 32 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 28 });
            Row.padding({ left: 84, right: 84 });
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
            Row.width(56);
            Row.height(56);
            Row.backgroundColor('#C4C4C4');
            Row.borderRadius('50%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831789, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(26);
            SymbolGlyph.fontColor([Color.White]);
        }, SymbolGlyph);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
            Row.width(56);
            Row.height(56);
            Row.backgroundColor('#C4C4C4');
            Row.borderRadius('50%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831767, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(26);
            SymbolGlyph.fontColor([Color.White]);
        }, SymbolGlyph);
        Row.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ top: 28 });
            Column.width('100%');
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new ContactDetailItem(this, {
                        topContent: this.telephony,
                        bottomContent: { "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ContactDetailPage.ets", line: 253, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            topContent: this.telephony,
                            bottomContent: { "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        topContent: this.telephony,
                        bottomContent: { "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                    });
                }
            }, { name: "ContactDetailItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new ContactDetailItem(this, {
                        topContent: this.email,
                        bottomContent: { "id": 16777238, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ContactDetailPage.ets", line: 257, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            topContent: this.email,
                            bottomContent: { "id": 16777238, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        topContent: this.email,
                        bottomContent: { "id": 16777238, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                    });
                }
            }, { name: "ContactDetailItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new ContactDetailItem(this, {
                        topContent: this.remarks,
                        bottomContent: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ContactDetailPage.ets", line: 261, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            topContent: this.remarks,
                            bottomContent: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        topContent: this.remarks,
                        bottomContent: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                    });
                }
            }, { name: "ContactDetailItem" });
        }
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ContractDetailPage";
    }
}
registerNamedRoute(() => new ContractDetailPage(undefined, {}), "", { bundleName: "com.example.distributedcontacts", moduleName: "entry", pagePath: "pages/ContactDetailPage", pageFullPath: "entry/src/main/ets/pages/ContactDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
