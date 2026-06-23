if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ContactAddAndEditPage_Params {
    isSelectAll?: boolean;
    name?: string;
    address?: string;
    telephony?: string;
    email?: string;
    remarks?: string;
    selectedGroupIndex?: number;
    groupOptions?: string[];
    selectOptions?: Array<SelectOption>;
    isEdit?: boolean;
    context?;
    kvManager?;
}
import type common from "@ohos:app.ability.common";
import type { KeyboardAvoidMode } from "@ohos:arkui.UIContext";
import hilog from "@ohos:hilog";
import type { BusinessError } from "@ohos:base";
import CommonConstants from "@bundle:com.example.distributedcontacts/entry/ets/common/CommonConstants";
import { ContactData } from "@bundle:com.example.distributedcontacts/entry/ets/viewmodel/ContactViewModel";
import type { KvManager } from '../utils/KvManager';
class ContactAddAndEditPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isSelectAll = new ObservedPropertySimplePU(false, this, "isSelectAll");
        this.__name = new ObservedPropertySimplePU('', this, "name");
        this.__address = new ObservedPropertySimplePU('', this, "address");
        this.__telephony = new ObservedPropertySimplePU('', this, "telephony");
        this.__email = new ObservedPropertySimplePU('', this, "email");
        this.__remarks = new ObservedPropertySimplePU('', this, "remarks");
        this.__selectedGroupIndex = new ObservedPropertySimplePU(0, this, "selectedGroupIndex");
        this.groupOptions = ['家人', '朋友', '同事'];
        this.selectOptions = [
            { value: '家人' },
            { value: '朋友' },
            { value: '同事' }
        ];
        this.isEdit = false;
        this.context = this.getUIContext().getHostContext() as common.UIAbilityContext;
        this.kvManager = AppStorage.get('kvManager') as KvManager;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ContactAddAndEditPage_Params) {
        if (params.isSelectAll !== undefined) {
            this.isSelectAll = params.isSelectAll;
        }
        if (params.name !== undefined) {
            this.name = params.name;
        }
        if (params.address !== undefined) {
            this.address = params.address;
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
        if (params.selectedGroupIndex !== undefined) {
            this.selectedGroupIndex = params.selectedGroupIndex;
        }
        if (params.groupOptions !== undefined) {
            this.groupOptions = params.groupOptions;
        }
        if (params.selectOptions !== undefined) {
            this.selectOptions = params.selectOptions;
        }
        if (params.isEdit !== undefined) {
            this.isEdit = params.isEdit;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.kvManager !== undefined) {
            this.kvManager = params.kvManager;
        }
    }
    updateStateVars(params: ContactAddAndEditPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isSelectAll.purgeDependencyOnElmtId(rmElmtId);
        this.__name.purgeDependencyOnElmtId(rmElmtId);
        this.__address.purgeDependencyOnElmtId(rmElmtId);
        this.__telephony.purgeDependencyOnElmtId(rmElmtId);
        this.__email.purgeDependencyOnElmtId(rmElmtId);
        this.__remarks.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedGroupIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isSelectAll.aboutToBeDeleted();
        this.__name.aboutToBeDeleted();
        this.__address.aboutToBeDeleted();
        this.__telephony.aboutToBeDeleted();
        this.__email.aboutToBeDeleted();
        this.__remarks.aboutToBeDeleted();
        this.__selectedGroupIndex.aboutToBeDeleted();
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
    private __name: ObservedPropertySimplePU<string>;
    get name() {
        return this.__name.get();
    }
    set name(newValue: string) {
        this.__name.set(newValue);
    }
    private __address: ObservedPropertySimplePU<string>;
    get address() {
        return this.__address.get();
    }
    set address(newValue: string) {
        this.__address.set(newValue);
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
    // 分组选择相关状态变量
    private __selectedGroupIndex: ObservedPropertySimplePU<number>; // 当前选中的分组索引
    get selectedGroupIndex() {
        return this.__selectedGroupIndex.get();
    }
    set selectedGroupIndex(newValue: number) {
        this.__selectedGroupIndex.set(newValue);
    }
    private groupOptions: string[]; // 分组选项（不包含"全部"）
    // Select 组件选项数据
    private selectOptions: Array<SelectOption>;
    private isEdit: boolean;
    private context;
    private kvManager;
    aboutToAppear() {
        this.getUIContext().setKeyboardAvoidMode(1);
        let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
        this.isEdit = params.isEdit as boolean;
        this.initializeData();
    }
    /**
     * Contact information change.
     * @param key Key of the text information.
     * @param value Changed Data.
     */
    contactInfoChange(key: string, value: string) {
        try {
            let context = this.getUIContext().getHostContext() as common.UIAbilityContext;
            let contactKey = context.resourceManager.getStringByNameSync(key);
            switch (contactKey) {
                case this.getStringValue(CommonConstants.CONTACTS_DETAIL_NAME):
                    this.name = value;
                    break;
                case this.getStringValue(CommonConstants.CONTACTS_DETAIL_ADDRESS):
                    this.address = value;
                    break;
                case this.getStringValue(CommonConstants.CONTACTS_DETAIL_TEL):
                    this.telephony = value;
                    break;
                case this.getStringValue(CommonConstants.CONTACTS_DETAIL_EMAIL):
                    this.email = value;
                    break;
                case this.getStringValue(CommonConstants.CONTACTS_DETAIL_REMARKS):
                    this.remarks = value;
                    break;
                default:
                    break;
            }
        }
        catch (error) {
            hilog.error(0x0000, 'ContactAddAndEditPage', `Failed to copy.Code:${error.code},message: ${error.message}`);
        }
    }
    /**
     * Initialize edit page data.
     */
    initializeData(): void {
        // Check whether the page is an editing page.
        if (this.getUIContext().getRouter().getParams() && this.isEdit) {
            let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
            this.name = params.name as string;
            this.address = params.address as string;
            this.telephony = params.telephony as string;
            this.email = params.email as string;
            this.remarks = params.remarks as string;
            // 初始化分组信息
            const groupName = params.groupName as string;
            if (groupName) {
                const groupIndex = this.groupOptions.indexOf(groupName);
                if (groupIndex !== -1) {
                    this.selectedGroupIndex = groupIndex;
                }
            }
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
            Scroll.align(Alignment.Top);
            Scroll.width('100%');
            Scroll.height('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ top: 16, bottom: 64 });
            Column.layoutWeight(CommonConstants.WEIGHT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777403, "type": 20000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Image.width(56);
            Image.height(56);
            Image.objectFit(ImageFit.Contain);
            Image.margin({ bottom: 16, top: 12 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isEdit) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777242, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                        Text.fontSize(16);
                        Text.fontWeight(700);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.Item.bind(this)('edit_item_name', { "id": 125832135, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }, this.name, true);
        this.Item.bind(this)('edit_item_address', { "id": 16777395, "type": 20000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }, this.address);
        this.Item.bind(this)('edit_item_phone', { "id": 16777410, "type": 20000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }, this.telephony);
        this.Item.bind(this)('edit_item_email', { "id": 125831746, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }, this.email, true);
        this.Item.bind(this)('edit_item_note', { "id": 16777409, "type": 20000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }, this.remarks);
        // 添加分组选择器
        this.GroupSelector.bind(this)();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    /**
     * 分组选择器组件
     */
    GroupSelector(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                top: 16,
                bottom: 16,
                left: 12,
                right: 12
            });
            Row.margin({ bottom: 12 });
            Row.justifyContent(FlexAlign.Start);
            Row.backgroundColor(Color.White);
            Row.borderRadius(24);
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831897, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(24);
            SymbolGlyph.fontColor([{ "id": 16777271, "type": 10001, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }]);
            SymbolGlyph.margin({ right: { "id": 16777368, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" } });
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('分组');
            Text.fontSize({ "id": 16777367, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontColor({ "id": 16777271, "type": 10001, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Regular);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.EDIT_INPUT_WIDTH);
            Column.margin({ right: { "id": 16777347, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" } });
            Column.alignItems(HorizontalAlign.End);
        }, Column);
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
            });
        }, Select);
        Select.pop();
        Column.pop();
        Row.pop();
    }
    NavigationTitle(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ alignItems: ItemAlign.Center });
            Flex.height(56);
            Flex.backgroundColor({ "id": 16777267, "type": 10001, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Flex.expandSafeArea([SafeAreaType.KEYBOARD]);
            Flex.zIndex(3);
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
                if (!this.isEdit) {
                    this.getUIContext().getRouter().back();
                }
                else {
                    let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
                    this.getUIContext().getRouter().back({
                        url: CommonConstants.PAGE_DETAIL_URL,
                        params: {
                            key: params.key
                        }
                    });
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(24);
            SymbolGlyph.fontWeight(400);
        }, SymbolGlyph);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isEdit ? { "id": 16777244, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" } : { "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontSize(26);
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
                if (this.name !== '') {
                    // 获取选中的分组名称
                    const groupName = this.groupOptions[this.selectedGroupIndex];
                    const contactData: ContactData = new ContactData(this.name, this.address, this.telephony, this.email, this.remarks, groupName);
                    let contactsKey = CommonConstants.CONTACTS_DATABASE_KEY + contactData.name;
                    // Save the contact information.
                    this.kvManager.addAndSave(contactsKey, JSON.stringify(contactData));
                    if (!this.isEdit) {
                        this.getUIContext().getRouter().replaceUrl({
                            url: CommonConstants.PAGE_DETAIL_URL,
                            params: { key: contactsKey }
                        }).catch((err: BusinessError) => {
                            hilog.error(0x0000, 'ContactAddAndEditPage', `replaceUrl failed, code is ${err.code}, message is ${err.message}`);
                        });
                    }
                    else {
                        let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
                        this.getUIContext().getRouter().back({
                            url: CommonConstants.PAGE_DETAIL_URL,
                            params: {
                                key: params.key
                            }
                        });
                    }
                }
                else {
                    try {
                        this.getUIContext().getPromptAction().showToast({
                            message: { "id": 16777227, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                            duration: CommonConstants.PROMPT_DURATION
                        });
                    }
                    catch (err) {
                        hilog.error(0x0000, 'ContactAddAndEditPage', `showToast failed, code is ${err.code}, message is ${err.message}`);
                    }
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831490, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(24);
            SymbolGlyph.fontWeight(400);
        }, SymbolGlyph);
        Row.pop();
        Flex.pop();
    }
    Item(key: string, icon: Resource, content: string, isSys: boolean = false, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                top: 16,
                bottom: 16,
                left: 12,
                right: 12
            });
            Row.margin({ bottom: 12 });
            Row.justifyContent(FlexAlign.Start);
            Row.backgroundColor(Color.White);
            Row.borderRadius(24);
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (isSys) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create(icon);
                        SymbolGlyph.fontSize(24);
                        SymbolGlyph.fontColor([{ "id": 16777271, "type": 10001, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }]);
                        SymbolGlyph.margin({ right: { "id": 16777368, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" } });
                    }, SymbolGlyph);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(icon);
                        Image.objectFit(ImageFit.Contain);
                        Image.height({ "id": 16777369, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                        Image.width({ "id": 16777369, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                        Image.margin({ right: { "id": 16777368, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" } });
                    }, Image);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getStringValue(key));
            Text.fontSize({ "id": 16777367, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontColor({ "id": 16777271, "type": 10001, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Regular);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: content });
            TextInput.type(this.getInputType(key));
            TextInput.maxLength(this.getMaxLength(key));
            TextInput.width(CommonConstants.EDIT_INPUT_WIDTH);
            TextInput.margin({ right: { "id": 16777347, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" } });
            TextInput.backgroundColor(Color.White);
            TextInput.fontSize({ "id": 16777367, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            TextInput.fontWeight(FontWeight.Regular);
            TextInput.enabled(this.getStringValue(key) === this.getStringValue(CommonConstants.CONTACTS_DETAIL_NAME) && this.isEdit ?
                false : true);
            TextInput.onChange((value) => {
                this.contactInfoChange(key, value);
            });
        }, TextInput);
        Row.pop();
    }
    getStringValue(resName: string): string {
        try {
            return this.context.resourceManager.getStringByNameSync(resName);
        }
        catch (err) {
            hilog.error(0x0000, 'ContactAddAndEditPage', `have error .Code:${err.code},message: ${err.message}`);
            return err.msg;
        }
    }
    getInputType(key: string): InputType {
        try {
            switch (this.getStringValue(key)) {
                case this.getStringValue(CommonConstants.CONTACTS_DETAIL_TEL):
                    return InputType.PhoneNumber;
                case this.getStringValue(CommonConstants.CONTACTS_DETAIL_EMAIL):
                    return InputType.Email;
                default:
                    return InputType.Normal;
            }
        }
        catch (err) {
            hilog.error(0x0000, 'ContactAddAndEditPage', `have error .Code:${err.code},message: ${err.message}`);
            return err.code;
        }
    }
    getMaxLength(key: string): number {
        try {
            switch (this.getStringValue(key)) {
                case this.getStringValue(CommonConstants.CONTACTS_DETAIL_NAME):
                    return CommonConstants.CONTACTS_NAME_MAX_LENGTH;
                case this.getStringValue(CommonConstants.CONTACTS_DETAIL_TEL):
                    return CommonConstants.CONTACTS_TEL_MAX_LENGTH;
                default:
                    return CommonConstants.CONTACTS_DETAIL_MAX;
            }
        }
        catch (err) {
            hilog.error(0x0000, 'ContactAddAndEditPage', `have error .Code:${err.code},message: ${err.message}`);
            return err.code;
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ContactAddAndEditPage";
    }
}
registerNamedRoute(() => new ContactAddAndEditPage(undefined, {}), "", { bundleName: "com.example.distributedcontacts", moduleName: "entry", pagePath: "pages/ContactAddAndEditPage", pageFullPath: "entry/src/main/ets/pages/ContactAddAndEditPage", integratedHsp: "false", moduleType: "followWithHap" });
