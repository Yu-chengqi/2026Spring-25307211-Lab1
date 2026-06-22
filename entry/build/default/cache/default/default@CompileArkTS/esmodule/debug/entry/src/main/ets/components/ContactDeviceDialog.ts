if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ContactDeviceDialog_Params {
    controller?: CustomDialogController;
    deviceList?: Array<distributedDeviceManager.DeviceBasicInfo>;
    selectedDeviceIndex?: number;
    onSelectedIndexChange?: (index: number) => void;
}
import type distributedDeviceManager from "@ohos:distributedDeviceManager";
import CommonConstants from "@bundle:com.example.distributedcontacts/entry/ets/common/CommonConstants";
function __Text__ButtonTextStyle(): void {
    Text.fontColor('#0A59F7');
    Text.fontSize({ "id": 16777282, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
    Text.fontWeight(CommonConstants.FONT_WEIGHT_500);
}
export default class ContactDeviceDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.controller = undefined;
        this.__deviceList = new SynchedPropertyObjectTwoWayPU(params.deviceList, this, "deviceList");
        this.__selectedDeviceIndex = new SynchedPropertySimpleTwoWayPU(params.selectedDeviceIndex, this, "selectedDeviceIndex");
        this.onSelectedIndexChange = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ContactDeviceDialog_Params) {
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.onSelectedIndexChange !== undefined) {
            this.onSelectedIndexChange = params.onSelectedIndexChange;
        }
    }
    updateStateVars(params: ContactDeviceDialog_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__deviceList.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDeviceIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__deviceList.aboutToBeDeleted();
        this.__selectedDeviceIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private controller?: CustomDialogController;
    setController(ctr: CustomDialogController) {
        this.controller = ctr;
    }
    private __deviceList: SynchedPropertySimpleOneWayPU<Array<distributedDeviceManager.DeviceBasicInfo>>;
    get deviceList() {
        return this.__deviceList.get();
    }
    set deviceList(newValue: Array<distributedDeviceManager.DeviceBasicInfo>) {
        this.__deviceList.set(newValue);
    }
    private __selectedDeviceIndex: SynchedPropertySimpleTwoWayPU<number>;
    get selectedDeviceIndex() {
        return this.__selectedDeviceIndex.get();
    }
    set selectedDeviceIndex(newValue: number) {
        this.__selectedDeviceIndex.set(newValue);
    }
    private onSelectedIndexChange: (index: number) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                left: { "id": 16777343, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                right: { "id": 16777343, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                top: { "id": 16777344, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
            });
            Row.height({ "id": 16777342, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777257, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.fontSize({ "id": 16777341, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontColor(Color.Black);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
            List.scrollBar(BarState.On);
            List.height('80%');
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
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
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.height({ "id": 16777329, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                            Row.onClick(() => {
                                if (this.selectedDeviceIndex === index) {
                                    return;
                                }
                                else {
                                    this.selectedDeviceIndex = index;
                                }
                            });
                            Row.padding({
                                left: { "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                                right: { "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                            });
                            Row.width(CommonConstants.FULL_PERCENT);
                            Row.justifyContent(FlexAlign.SpaceBetween);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.justifyContent(FlexAlign.Start);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.width({ "id": 16777324, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                            Row.aspectRatio(CommonConstants.NUMBER_ONE);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Image.create(this.getDeviceTypeIcon());
                            Image.opacity({ "id": 16777323, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                        }, Image);
                        Row.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.deviceName);
                            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                            Text.width(CommonConstants.DEVICE_NAME_WIDTH);
                            Text.fontColor(Color.Black);
                            Text.margin({ left: { "id": 16777335, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" } });
                            Text.maxLines(CommonConstants.NUMBER_ONE);
                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                            Text.textAlign(TextAlign.Start);
                        }, Text);
                        Text.pop();
                        Row.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Radio.create({
                                value: item.deviceId, group: 'RadioGroup',
                                indicatorType: RadioIndicatorType.DOT
                            });
                            Radio.width(20);
                            Radio.height(20);
                            Radio.checked(index === this.selectedDeviceIndex);
                        }, Radio);
                        Row.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (index !== this.deviceList.length - 1) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.padding({
                                            left: { "id": 16777327, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" },
                                            right: { "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
                                        });
                                        Row.width(CommonConstants.FULL_PERCENT);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Divider.create();
                                        Divider.width(CommonConstants.FULL_PERCENT);
                                        Divider.height({ "id": 16777325, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                                        Divider.opacity({ "id": 16777326, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                                    }, Divider);
                                    Row.pop();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        Column.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.deviceList, forEachItemGenFunction, (item: distributedDeviceManager.DeviceBasicInfo) => JSON.stringify(item), true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.border({
                color: Color.White,
                radius: { "id": 16777288, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }
            });
            Row.padding({ "id": 16777287, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Row.margin({ top: { "id": 16777286, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" } });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(CommonConstants.NUMBER_ONE);
            Column.justifyContent(FlexAlign.Center);
            Column.height({ "id": 16777285, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Column.onClick(() => {
                if (this.controller !== undefined) {
                    this.controller.close();
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777258, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            __Text__ButtonTextStyle();
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.vertical(true);
            Divider.height({ "id": 16777283, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Divider.color({ "id": 16777262, "type": 10001, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Divider.width({ "id": 16777284, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(CommonConstants.NUMBER_ONE);
            Column.justifyContent(FlexAlign.Center);
            Column.height({ "id": 16777285, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            Column.onClick(() => {
                this.onSelectedIndexChange(this.selectedDeviceIndex);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            __Text__ButtonTextStyle();
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        Column.pop();
    }
    getDeviceTypeIcon(): Resource {
        return { "id": 16777412, "type": 20000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" };
    }
    rerender() {
        this.updateDirtyElements();
    }
}
