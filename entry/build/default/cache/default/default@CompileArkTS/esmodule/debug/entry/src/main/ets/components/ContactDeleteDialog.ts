if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ContactDeleteDialog_Params {
    controller?: CustomDialogController;
    cancel?: () => void;
    confirm?: () => void;
    promptMessage?: Resource;
}
export class ContactDeleteDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.controller = undefined;
        this.cancel = () => {
        };
        this.confirm = () => {
        };
        this.promptMessage = { "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ContactDeleteDialog_Params) {
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.cancel !== undefined) {
            this.cancel = params.cancel;
        }
        if (params.confirm !== undefined) {
            this.confirm = params.confirm;
        }
        if (params.promptMessage !== undefined) {
            this.promptMessage = params.promptMessage;
        }
    }
    updateStateVars(params: ContactDeleteDialog_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private controller: CustomDialogController;
    setController(ctr: CustomDialogController) {
        this.controller = ctr;
    }
    private cancel: () => void;
    private confirm: () => void;
    private promptMessage: Resource;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(328);
            Column.padding(24);
            Column.borderRadius(32);
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.promptMessage);
            Text.textAlign(TextAlign.Center);
            Text.fontSize('16vp');
            Text.fontColor('rgba(0, 0, 0, 0.9)');
            Text.lineHeight('21vp');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ direction: FlexDirection.Row, alignItems: ItemAlign.Center, justifyContent: FlexAlign.SpaceBetween });
            Flex.height('40vp');
            Flex.margin({ top: '8vp' });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777258, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }, { buttonStyle: ButtonStyleMode.EMPHASIZED, role: ButtonRole.NORMAL });
            Button.flexGrow(1);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor('#0A59F7');
            Button.fontSize('16vp');
            Button.fontWeight(500);
            Button.onClick(() => {
                this.cancel();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.vertical(true);
            Divider.strokeWidth('0.5vp');
            Divider.height(24);
            Divider.color('rgba(0, 0, 0, 0.05)');
            Divider.margin({ left: 4, right: 4 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" }, { buttonStyle: ButtonStyleMode.EMPHASIZED, role: ButtonRole.NORMAL });
            Button.flexGrow(1);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor('#0A59F7');
            Button.fontSize('16vp');
            Button.fontWeight(500);
            Button.onClick(() => {
                this.confirm();
            });
        }, Button);
        Button.pop();
        Flex.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
