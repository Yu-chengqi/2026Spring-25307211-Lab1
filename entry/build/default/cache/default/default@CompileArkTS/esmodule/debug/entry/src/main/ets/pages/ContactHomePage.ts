if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ContactHomePage_Params {
    uiContext?: UIContext | undefined;
    contactList?: Array<ListItemData>;
    initContactList?: Array<ListItemData>;
    isShowPopup?: boolean;
    deviceList?: Array<distributedDeviceManager.DeviceBasicInfo>;
    selectedDeviceIndex?: number;
    searchValue?: string;
    selectedGroupIndex?: number;
    groupOptions?: string[];
    selectOptions?: Array<SelectOption>;
    context?: common.UIAbilityContext;
    contactDeviceManager?: ContactDeviceManager;
    kvManager?;
    dialogController?: CustomDialogController;
}
import type common from "@ohos:app.ability.common";
import type distributedDeviceManager from "@ohos:distributedDeviceManager";
import type { BusinessError } from "@ohos:base";
import hilog from "@ohos:hilog";
import type distributedKVStore from "@ohos:data.distributedKVStore";
import CommonConstants from "@bundle:com.example.distributedcontacts/entry/ets/common/CommonConstants";
import { ListItemData } from "@bundle:com.example.distributedcontacts/entry/ets/viewmodel/ContactViewModel";
import { ContactListItem } from "@bundle:com.example.distributedcontacts/entry/ets/components/ContactListItem";
import { ContactDeviceManager } from "@bundle:com.example.distributedcontacts/entry/ets/utils/ContactDeviceManager";
import ContactDeviceDialog from "@bundle:com.example.distributedcontacts/entry/ets/components/ContactDeviceDialog";
import type { KvManager } from '../utils/KvManager';
class ContactHomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__uiContext = new ObservedPropertyObjectPU(AppStorage.get('uiContext'), this, "uiContext");
        this.__contactList = new ObservedPropertyObjectPU([], this, "contactList");
        this.__initContactList = new ObservedPropertyObjectPU([], this, "initContactList");
        this.__isShowPopup = new ObservedPropertySimplePU(false, this, "isShowPopup");
        this.__deviceList = new ObservedPropertyObjectPU([], this, "deviceList");
        this.__selectedDeviceIndex = new ObservedPropertySimplePU(0, this, "selectedDeviceIndex");
        this.__searchValue = new ObservedPropertySimplePU('', this, "searchValue");
        this.__selectedGroupIndex = new ObservedPropertySimplePU(0, this, "selectedGroupIndex");
        this.groupOptions = ['全部', '家人', '朋友', '同事'];
        this.selectOptions = [
            { value: '全部' },
            { value: '家人' },
            { value: '朋友' },
            { value: '同事' }
        ];
        this.context = this.getUIContext().getHostContext() as common.UIAbilityContext;
        this.contactDeviceManager = new ContactDeviceManager(this.context);
        this.kvManager = AppStorage.get('kvManager') as KvManager;
        this.dialogController = new CustomDialogController({
            builder: () => {
                let jsDialog = new ContactDeviceDialog(this, {
                    deviceList: this.__deviceList,
                    selectedDeviceIndex: this.__selectedDeviceIndex,
                    onSelectedIndexChange: (index: number): Promise<void> => this.onSelectedIndexChange(index)
                }, undefined, -1, () => { }, { page: "entry/src/main/ets/pages/ContactHomePage.ets", line: 52, col: 14 });
                jsDialog.setController(this.dialogController);
                ViewPU.create(jsDialog);
                let paramsLambda = () => {
                    return {
                        deviceList: this.__deviceList,
                        selectedDeviceIndex: this.__selectedDeviceIndex,
                        onSelectedIndexChange: (index: number): Promise<void> => this.onSelectedIndexChange(index)
                    };
                };
                jsDialog.paramsGenerator_ = paramsLambda;
            },
            cancel: () => {
                this.onClose();
            },
            autoCancel: true
        }, this);
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ContactHomePage_Params) {
        if (params.uiContext !== undefined) {
            this.uiContext = params.uiContext;
        }
        if (params.contactList !== undefined) {
            this.contactList = params.contactList;
        }
        if (params.initContactList !== undefined) {
            this.initContactList = params.initContactList;
        }
        if (params.isShowPopup !== undefined) {
            this.isShowPopup = params.isShowPopup;
        }
        if (params.deviceList !== undefined) {
            this.deviceList = params.deviceList;
        }
        if (params.selectedDeviceIndex !== undefined) {
            this.selectedDeviceIndex = params.selectedDeviceIndex;
        }
        if (params.searchValue !== undefined) {
            this.searchValue = params.searchValue;
        }
        if (params.selectedGroupIndex !== undefined) {
            this.selectedGroupIndex = params.selectedGroupIndex;
        }
        if (params.groupOptions !== undefined) {
            this.groupOptions = params.groupOptions;
        }
        if (params.selectOptions !== undefined) {
            this.selectOptions = params.selectOptions;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.contactDeviceManager !== undefined) {
            this.contactDeviceManager = params.contactDeviceManager;
        }
        if (params.kvManager !== undefined) {
            this.kvManager = params.kvManager;
        }
        if (params.dialogController !== undefined) {
            this.dialogController = params.dialogController;
        }
    }
    updateStateVars(params: ContactHomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__uiContext.purgeDependencyOnElmtId(rmElmtId);
        this.__contactList.purgeDependencyOnElmtId(rmElmtId);
        this.__initContactList.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowPopup.purgeDependencyOnElmtId(rmElmtId);
        this.__deviceList.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDeviceIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__searchValue.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedGroupIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__uiContext.aboutToBeDeleted();
        this.__contactList.aboutToBeDeleted();
        this.__initContactList.aboutToBeDeleted();
        this.__isShowPopup.aboutToBeDeleted();
        this.__deviceList.aboutToBeDeleted();
        this.__selectedDeviceIndex.aboutToBeDeleted();
        this.__searchValue.aboutToBeDeleted();
        this.__selectedGroupIndex.aboutToBeDeleted();
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
    private __contactList: ObservedPropertyObjectPU<Array<ListItemData>>;
    get contactList() {
        return this.__contactList.get();
    }
    set contactList(newValue: Array<ListItemData>) {
        this.__contactList.set(newValue);
    }
    private __initContactList: ObservedPropertyObjectPU<Array<ListItemData>>;
    get initContactList() {
        return this.__initContactList.get();
    }
    set initContactList(newValue: Array<ListItemData>) {
        this.__initContactList.set(newValue);
    }
    private __isShowPopup: ObservedPropertySimplePU<boolean>;
    get isShowPopup() {
        return this.__isShowPopup.get();
    }
    set isShowPopup(newValue: boolean) {
        this.__isShowPopup.set(newValue);
    }
    private __deviceList: ObservedPropertyObjectPU<Array<distributedDeviceManager.DeviceBasicInfo>>;
    get deviceList() {
        return this.__deviceList.get();
    }
    set deviceList(newValue: Array<distributedDeviceManager.DeviceBasicInfo>) {
        this.__deviceList.set(newValue);
    }
    private __selectedDeviceIndex: ObservedPropertySimplePU<number>;
    get selectedDeviceIndex() {
        return this.__selectedDeviceIndex.get();
    }
    set selectedDeviceIndex(newValue: number) {
        this.__selectedDeviceIndex.set(newValue);
    }
    private __searchValue: ObservedPropertySimplePU<string>;
    get searchValue() {
        return this.__searchValue.get();
    }
    set searchValue(newValue: string) {
        this.__searchValue.set(newValue);
    }
    // 分组筛选相关状态变量
    private __selectedGroupIndex: ObservedPropertySimplePU<number>; // 当前选中的分组索引，0表示全部
    get selectedGroupIndex() {
        return this.__selectedGroupIndex.get();
    }
    set selectedGroupIndex(newValue: number) {
        this.__selectedGroupIndex.set(newValue);
    }
    private groupOptions: string[]; // 分组选项
    // Select 组件选项数据
    private selectOptions: Array<SelectOption>;
    private context: common.UIAbilityContext;
    private contactDeviceManager: ContactDeviceManager;
    private kvManager;
    private dialogController: CustomDialogController;
    aboutToAppear(): void {
        this.kvManager.subscriptionKvStore(() => {
            this.getAllData();
        });
    }
    onPageShow(): void {
        this.getAllData();
    }
    onBackPress() {
        this.context.terminateSelf().catch((err: BusinessError) => {
            hilog.error(0x0000, 'ContactHomePage', `onBackPress err: ${err.code}  msg:${err.message}`);
        });
        return true;
    }
    getAllData() {
        this.kvManager.getEntries(CommonConstants.CONTACTS_DATABASE_KEY, (err: BusinessError, entries: distributedKVStore.Entry[]) => {
            hilog.info(0x0000, 'ContactHomePage', `getAllData entries: ${JSON.stringify(entries)}`);
            if (err) {
                hilog.error(0x0000, 'ContactHomePage', `Fail to get Entries: ${err.code}  msg:${err.message}`);
                return;
            }
            let listItems: Array<ListItemData> = [];
            entries.forEach((item, index) => {
                let itemInfo: ListItemData = new ListItemData();
                let contactData = JSON.parse(item.value.value as string) as Record<string, string>;
                itemInfo.name = contactData.name;
                // 解析分组名称字段，兼容旧数据（无groupName字段时默认为空）
                itemInfo.groupName = contactData.groupName || '';
                itemInfo.id = index;
                listItems.push(itemInfo);
            });
            this.initContactList = listItems;
            // 根据当前选中的分组进行过滤
            this.filterContactsByGroup();
        });
    }
    /**
     * 根据选中的分组过滤联系人列表
     */
    filterContactsByGroup(): void {
        if (this.selectedGroupIndex === 0) {
            // 选择"全部"时，显示所有联系人
            this.contactList = this.initContactList;
        }
        else {
            // 根据分组名称过滤
            const selectedGroup = this.groupOptions[this.selectedGroupIndex];
            this.contactList = this.initContactList.filter((item) => item.groupName === selectedGroup);
        }
    }
    async onSelectedIndexChange(index: number) {
        this.selectedDeviceIndex = index;
        if (index === 0) {
            this.onClose();
        }
        else {
            this.selectDevice();
        }
    }
    onClose(): void {
        this.deviceList = [];
        this.dialogController.close();
        this.contactDeviceManager.unregisterDeviceListCallback();
    }
    selectDevice(): void {
        if (this.contactDeviceManager.discoverList.length <= 0) {
            this.contactDeviceManager.startAbility(this.deviceList[this.selectedDeviceIndex].networkId);
        }
        else {
            this.contactDeviceManager.authenticateDevice(this.deviceList[this.selectedDeviceIndex], () => {
                for (let i = 0; i < this.contactDeviceManager.deviceList!.length; i++) {
                    const result = this.contactDeviceManager.deviceList![i].deviceName ===
                        this.deviceList[this.selectedDeviceIndex].deviceName;
                    if (result) {
                        this.contactDeviceManager.startAbility(this.contactDeviceManager.deviceList![i].networkId);
                    }
                }
            });
        }
        this.onClose();
    }
    showDeviceDialog(): void {
        // Register a listening callback.
        // A dialog box is displayed when a device is discovered or an authenticated device is found.
        this.contactDeviceManager.registerDeviceListCallback(() => {
            this.deviceList = [];
            this.deviceList.push({
                deviceId: '0',
                deviceName: CommonConstants.LOCALHOST_NAME,
                deviceType: '0',
                networkId: ''
            });
            let deviceTempList = this.contactDeviceManager.discoverList.length > 0 ?
                this.contactDeviceManager.discoverList : this.contactDeviceManager.deviceList;
            if (deviceTempList.length) {
                deviceTempList.forEach((item) => {
                    this.deviceList.push({
                        deviceId: item.deviceId,
                        deviceName: item.deviceName,
                        deviceType: item.deviceType,
                        networkId: item.networkId
                    });
                });
            }
        });
        this.dialogController.open();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ direction: FlexDirection.Column });
            Flex.width('100%');
            Flex.height('100%');
            Flex.padding({ left: 16, right: 16 });
            Flex.backgroundColor(Color.White);
            Flex.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
        }, Flex);
        this.NavigationTitle.bind(this)();
        // 添加分组筛选 Picker 下拉选择器
        this.GroupPicker.bind(this)();
        this.ContactList.bind(this)();
        Flex.pop();
    }
    /**
     * 分组筛选下拉选择器
     */
    GroupPicker(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 8, bottom: 8 });
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('分组筛选：');
            Text.fontSize(14);
            Text.fontColor('rgba(0, 0, 0, 0.6)');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create(this.selectOptions);
            Select.selected(this.selectedGroupIndex);
            Select.value(this.groupOptions[this.selectedGroupIndex]);
            Select.font({ size: 14 });
            Select.fontColor('rgba(0, 0, 0, 0.9)');
            Select.selectedOptionFont({ size: 14 });
            Select.optionFont({ size: 14 });
            Select.onSelect((index: number) => {
                this.selectedGroupIndex = index;
                // 切换分组时重新过滤联系人列表
                this.filterContactsByGroup();
            });
            Select.width(120);
            Select.height(40);
            Select.backgroundColor('rgba(0, 0, 0, 0.05)');
            Select.borderRadius(8);
        }, Select);
        Select.pop();
        Row.pop();
    }
    NavigationTitle(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ alignItems: ItemAlign.Center });
            Flex.height(56);
            Flex.flexShrink(0);
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777252, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontSize(20);
            Text.fontWeight(700);
            Text.lineHeight(27);
            Text.fontColor('rgba(0, 0, 0, 0.9)');
            Text.flexGrow(1);
        }, Text);
        Text.pop();
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
                this.getUIContext().getRouter().pushUrl({
                    url: 'pages/ContactAddAndEditPage',
                    params: {
                        isEdit: false
                    }
                }).catch((err: BusinessError) => {
                    hilog.error(0x0000, 'ContactHomePage', `ContactAddAndEditPage err: ${err.code}  msg:${err.message}`);
                });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831481, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
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
            Row.bindPopup(this.isShowPopup, {
                builder: { builder: this.popupBuilder.bind(this) },
                placement: Placement.BottomRight,
                popupColor: Color.White,
                enableArrow: false
            });
            Row.onClick(() => {
                this.isShowPopup = !this.isShowPopup;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831714, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(24);
            SymbolGlyph.fontWeight(400);
        }, SymbolGlyph);
        Row.pop();
        Flex.pop();
    }
    ContactList(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.contactList.length) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.emptyView.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.dataView.bind(this)();
                });
            }
        }, If);
        If.pop();
    }
    emptyView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.flexGrow(1);
            Column.width('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777402, "type": 20000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Image.width({ "id": 16777291, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Image.height({ "id": 16777291, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777228, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontSize({ "id": 16777293, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontColor({ "id": 16777270, "type": 10001, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
    }
    dataView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ direction: FlexDirection.Column });
            Flex.width('100%');
            Flex.flexGrow(1);
            Flex.margin({ top: 8 });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Search.create({ value: { value: this.searchValue, changeEvent: newValue => { this.searchValue = newValue; } }, placeholder: Object({ "id": 16777256, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }) });
            Search.width('100%');
            Search.height(40);
            Search.flexShrink(0);
            Search.borderRadius(24);
            Search.placeholderColor('rgba(0, 0, 0, 0.6)');
            Search.placeholderFont({
                size: 16,
                weight: 400,
            });
            Search.textFont({ size: 16 });
            Search.padding({
                top: 9,
                right: 12,
                bottom: 9,
                left: 12
            });
            Search.onChange((searchValue: string) => {
                if (searchValue === '') {
                    this.contactList = this.initContactList;
                }
            });
            Search.onSubmit((searchValue: string) => {
                const filterArr = this.contactList.filter((item) => item.name === searchValue);
                if (filterArr.length > 0) {
                    this.contactList = filterArr;
                }
                else {
                    try {
                        this.uiContext!.getPromptAction().showToast({
                            message: { "id": 16777251, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                            duration: CommonConstants.PROMPT_DURATION,
                        });
                    }
                    catch (error) {
                        hilog.error(0x0000, 'ContactHomePage', `have error .Code:${error.code},message: ${error.message}`);
                    }
                }
            });
        }, Search);
        Search.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.flexGrow(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
            List.scrollBar(BarState.Off);
            List.width('100%');
            List.height('100%');
            List.margin({ bottom: { "id": 16777370, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" } });
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
                        ListItem.onClick(() => {
                            const contactsKey = CommonConstants.CONTACTS_DATABASE_KEY + item.name;
                            this.getUIContext().getRouter().pushUrl({
                                url: 'pages/ContactDetailPage',
                                params: {
                                    key: contactsKey,
                                },
                            }).catch((err: BusinessError) => {
                                hilog.error(0x0000, 'ContactHomePage', `ContactAddAndEditPage err: ${err.code}  msg:${err.message}`);
                            });
                        });
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new ContactListItem(this, { itemInfo: item }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ContactHomePage.ets", line: 351, col: 15 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            itemInfo: item
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
            this.forEachUpdateFunction(elmtId, this.contactList, forEachItemGenFunction, (item: ListItemData) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        Column.pop();
        Flex.pop();
    }
    popupBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777385, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Column.height({ "id": 16777383, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777231, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontSize({ "id": 16777382, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.padding({
                top: { "id": 16777304, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                bottom: { "id": 16777304, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                left: { "id": 16777303, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
            });
            Text.width('100%');
            Text.onClick(() => {
                this.getUIContext().getRouter().pushUrl({
                    url: 'pages/ContactDeletePage'
                }).catch((err: BusinessError) => {
                    hilog.error(0x0000, 'ContactHomePage', `ContactAddAndEditPage err: ${err.code}  msg:${err.message}`);
                });
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.height({ "id": 16777345, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Divider.backgroundColor({ "id": 16777272, "type": 10001, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Divider.margin({
                left: { "id": 16777303, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                right: { "id": 16777303, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
            });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.width('100%');
            Text.fontSize({ "id": 16777382, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.padding({
                top: { "id": 16777304, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                bottom: { "id": 16777304, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                left: { "id": 16777303, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
            });
            Text.onClick(() => {
                this.isShowPopup = !this.isShowPopup;
                this.showDeviceDialog();
            });
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ContactHomePage";
    }
}
registerNamedRoute(() => new ContactHomePage(undefined, {}), "", { bundleName: "com.example.distributedcontacts", moduleName: "entry", pagePath: "pages/ContactHomePage", pageFullPath: "entry/src/main/ets/pages/ContactHomePage", integratedHsp: "false", moduleType: "followWithHap" });
