if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ContactDeletePage_Params {
    isSelectAll?: boolean;
    checkList?: Array<ListItemData>;
    count?: number;
    kvManager?;
    dialogController?: CustomDialogController;
}
import type distributedKVStore from "@ohos:data.distributedKVStore";
import type { BusinessError } from "@ohos:base";
import hilog from "@ohos:hilog";
import CommonConstants from "@bundle:com.example.distributedcontacts/entry/ets/common/CommonConstants";
import ContactBottomBar from "@bundle:com.example.distributedcontacts/entry/ets/components/ContactBottomBar";
import type { KvManager } from '../utils/KvManager';
import { ContactListItem } from "@bundle:com.example.distributedcontacts/entry/ets/components/ContactListItem";
import { ListItemData } from "@bundle:com.example.distributedcontacts/entry/ets/viewmodel/ContactViewModel";
import { ContactDeleteDialog } from "@bundle:com.example.distributedcontacts/entry/ets/components/ContactDeleteDialog";
const TAG: string = 'DeletePage';
class ContactDeletePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isSelectAll = new ObservedPropertySimplePU(false, this, "isSelectAll");
        this.__checkList = new ObservedPropertyObjectPU([], this, "checkList");
        this.__count = new ObservedPropertySimplePU(0, this, "count");
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
                    promptMessage: { "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                }, undefined, -1, () => { }, { page: "entry/src/main/ets/pages/ContactDeletePage.ets", line: 36, col: 14 });
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
                        promptMessage: { "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
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
    setInitiallyProvidedValue(params: ContactDeletePage_Params) {
        if (params.isSelectAll !== undefined) {
            this.isSelectAll = params.isSelectAll;
        }
        if (params.checkList !== undefined) {
            this.checkList = params.checkList;
        }
        if (params.count !== undefined) {
            this.count = params.count;
        }
        if (params.kvManager !== undefined) {
            this.kvManager = params.kvManager;
        }
        if (params.dialogController !== undefined) {
            this.dialogController = params.dialogController;
        }
    }
    updateStateVars(params: ContactDeletePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isSelectAll.purgeDependencyOnElmtId(rmElmtId);
        this.__checkList.purgeDependencyOnElmtId(rmElmtId);
        this.__count.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isSelectAll.aboutToBeDeleted();
        this.__checkList.aboutToBeDeleted();
        this.__count.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isSelectAll: ObservedPropertySimplePU<boolean>;
    get isSelectAll() {
        return this.__isSelectAll.get();
    }
    set isSelectAll(newValue: boolean) {
        this.__isSelectAll.set(newValue);
    }
    private __checkList: ObservedPropertyObjectPU<Array<ListItemData>>;
    get checkList() {
        return this.__checkList.get();
    }
    set checkList(newValue: Array<ListItemData>) {
        this.__checkList.set(newValue);
    }
    private __count: ObservedPropertySimplePU<number>;
    get count() {
        return this.__count.get();
    }
    set count(newValue: number) {
        this.__count.set(newValue);
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
        }
        catch (error) {
            hilog.error(0x0000, 'ContactDeletePage', `delete_cancel_text error: ${error.code}  msg:${error.message}`);
        }
        this.dialogController.close();
    }
    // Confirm the cancellation of transcoding.
    onConfirm() {
        this.batchDeleteButton();
        this.dialogController.close();
    }
    aboutToAppear() {
        this.initializeData();
    }
    /**
     * Initialize edit page data.
     */
    initializeData(): void {
        this.kvManager.getEntries(CommonConstants.CONTACTS_DATABASE_KEY, (err: BusinessError, entries: distributedKVStore.Entry[]) => {
            hilog.info(0x0000, 'ContactDeletePage', TAG, `initializeData entries: ${JSON.stringify(entries)}`);
            if (err) {
                hilog.error(0x0000, 'ContactDeletePage', `Fail to get Entries, code is ${err.code}, message is ${err.message}`);
                return;
            }
            let listItems: Array<ListItemData> = [];
            entries.forEach((item, index) => {
                let itemInfo: ListItemData = new ListItemData();
                itemInfo.name = JSON.parse(item.value.value as string).name;
                itemInfo.id = index;
                listItems.push(itemInfo);
            });
            this.checkList = listItems;
        });
    }
    /**
     * Deleting selected contacts in batches.
     */
    batchDeleteButton(): void {
        let keys: string[] = [];
        this.checkList.forEach((item: ListItemData) => {
            if (item.checked) {
                let contactsKey: string = CommonConstants.CONTACTS_DATABASE_KEY + item.name;
                keys.push(contactsKey);
            }
        });
        hilog.info(0x0000, 'ContactDeletePage', TAG, `batchDeleteButton keys: ${JSON.stringify(keys)}`);
        // Batch delete.
        this.kvManager.deleteBatch(keys, (err: BusinessError) => {
            if (err) {
                hilog.error(0x0000, 'ContactDeletePage', `Fail to delete Batch, code is ${err.code}, message is ${err.message}`);
                return;
            }
            try {
                this.getUIContext().getPromptAction().showToast({
                    message: { "id": 16777255, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                    duration: CommonConstants.PROMPT_DURATION
                });
            }
            catch (err) {
                hilog.error(0x0000, 'ContactDeletePage', `showToast failed, code is ${err.code}, message is ${err.message}`);
            }
            this.getUIContext().getRouter().pushUrl({
                url: CommonConstants.LIST_PAGE_URL
            }).catch((err: BusinessError) => {
                hilog.error(0x0000, 'ContactDeletePage', `pushUrl failed, code is ${err.code}, message is ${err.message}`);
            });
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 16, right: 16 });
            Column.backgroundColor(Color.White);
            Column.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ direction: FlexDirection.Column });
        }, Flex);
        this.NavigationTitle.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.flexGrow(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
            List.scrollBar(BarState.Off);
            List.width('100%');
            List.height(CommonConstants.PERCENTAGE_MAX);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new ContactListItem(this, {
                                        itemInfo: item,
                                        isCanCheck: true,
                                        onCheck: () => {
                                            item.checked = !item.checked;
                                            item.checked ? this.count++ : this.count--;
                                        }
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ContactDeletePage.ets", line: 139, col: 17 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            itemInfo: item,
                                            isCanCheck: true,
                                            onCheck: () => {
                                                item.checked = !item.checked;
                                                item.checked ? this.count++ : this.count--;
                                            }
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                                }
                            }, { name: "ContactListItem" });
                        }
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.checkList, forEachItemGenFunction, (item: ListItemData) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        Column.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new ContactBottomBar(this, {
                        leftClickEvent: (isAll) => {
                            this.checkList = this.checkList.map((item: ListItemData) => {
                                item.checked = isAll ? true : false;
                                return item;
                            });
                            let result = this.checkList.filter((item) => item.checked);
                            this.count = this.checkList.length === 0 ? 0 : result.length;
                        },
                        rightClickEvent: () => {
                            if (this.count === 0) {
                                try {
                                    this.getUIContext().getPromptAction().showToast({
                                        message: { "id": 16777254, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                                        duration: CommonConstants.PROMPT_DURATION,
                                    });
                                }
                                catch (err) {
                                    hilog.error(0x0000, 'ContactDeletePage', `showToast failed, code is ${err.code}, message is ${err.message}`);
                                }
                            }
                            else {
                                this.dialogController.open();
                            }
                        },
                        pageId: CommonConstants.DELETE_PAGE_ID,
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ContactDeletePage.ets", line: 156, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            leftClickEvent: (isAll) => {
                                this.checkList = this.checkList.map((item: ListItemData) => {
                                    item.checked = isAll ? true : false;
                                    return item;
                                });
                                let result = this.checkList.filter((item) => item.checked);
                                this.count = this.checkList.length === 0 ? 0 : result.length;
                            },
                            rightClickEvent: () => {
                                if (this.count === 0) {
                                    try {
                                        this.getUIContext().getPromptAction().showToast({
                                            message: { "id": 16777254, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                                            duration: CommonConstants.PROMPT_DURATION,
                                        });
                                    }
                                    catch (err) {
                                        hilog.error(0x0000, 'ContactDeletePage', `showToast failed, code is ${err.code}, message is ${err.message}`);
                                    }
                                }
                                else {
                                    this.dialogController.open();
                                }
                            },
                            pageId: CommonConstants.DELETE_PAGE_ID
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "ContactBottomBar" });
        }
        Flex.pop();
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
            SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(24);
            SymbolGlyph.fontWeight(400);
        }, SymbolGlyph);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.flexGrow(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777243, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontSize(26);
            Text.fontWeight(700);
            Text.lineHeight(27);
            Text.fontColor('rgba(0, 0, 0, 0.9)');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
            Row.width(40);
            Row.height(40);
            Row.backgroundColor('rgba(0, 0, 0, 0.05)');
            Row.borderRadius(40);
            Row.onClick(() => {
                this.getUIContext().getRouter().back();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831490, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontColor(['rgba(0,0,0,0.9)']);
            SymbolGlyph.fontSize(24);
        }, SymbolGlyph);
        Row.pop();
        Flex.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ContactDeletePage";
    }
}
registerNamedRoute(() => new ContactDeletePage(undefined, {}), "", { bundleName: "com.example.distributedcontacts", moduleName: "entry", pagePath: "pages/ContactDeletePage", pageFullPath: "entry/src/main/ets/pages/ContactDeletePage", integratedHsp: "false", moduleType: "followWithHap" });
