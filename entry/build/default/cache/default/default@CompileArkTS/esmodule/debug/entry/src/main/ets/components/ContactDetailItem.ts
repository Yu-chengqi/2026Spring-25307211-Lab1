if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ContactDetailItem_Params {
    topContent?: string;
    bottomContent?: Resource;
}
export default class ContactDetailItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__topContent = new SynchedPropertySimpleOneWayPU(params.topContent, this, "topContent");
        this.__bottomContent = new SynchedPropertyObjectOneWayPU(params.bottomContent, this, "bottomContent");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ContactDetailItem_Params) {
    }
    updateStateVars(params: ContactDetailItem_Params) {
        this.__topContent.reset(params.topContent);
        this.__bottomContent.reset(params.bottomContent);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__topContent.purgeDependencyOnElmtId(rmElmtId);
        this.__bottomContent.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__topContent.aboutToBeDeleted();
        this.__bottomContent.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __topContent: SynchedPropertySimpleOneWayPU<string>;
    get topContent() {
        return this.__topContent.get();
    }
    set topContent(newValue: string) {
        this.__topContent.set(newValue);
    }
    private __bottomContent: SynchedPropertySimpleOneWayPU<Resource>;
    get bottomContent() {
        return this.__bottomContent.get();
    }
    set bottomContent(newValue: Resource) {
        this.__bottomContent.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.justifyContent(FlexAlign.Center);
            Column.width('100%');
            Column.height(64);
            Column.margin({ bottom: 16 });
            Column.padding({ left: 12, right: 12 });
            Column.borderRadius(12);
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.topContent);
            Text.height(22);
            Text.fontSize(16);
            Text.fontWeight(500);
            Text.lineHeight(21);
            Text.fontColor('rgba(0, 0, 0, 0.9)');
            Text.margin({ bottom: 2 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.bottomContent);
            Text.fontSize(14);
            Text.fontWeight(400);
            Text.lineHeight(19);
            Text.fontColor('rgba(0, 0, 0, 0.6)');
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
