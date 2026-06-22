if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ContactBottomBar_Params {
    isAll?: boolean;
    pageId?: string;
    leftClickEvent?: (isAll?: boolean) => void;
    rightClickEvent?: () => void;
}
import CommonConstants from "@bundle:com.example.distributedcontacts/entry/ets/common/CommonConstants";
function __Text__setTextStyle(): void {
    Text.width('100%');
    Text.textAlign(TextAlign.Center);
    Text.fontColor('rgba(0, 0, 0, 0.9)');
    Text.fontSize(12);
}
function __SymbolGlyph__setImageStyle(): void {
    SymbolGlyph.fontSize(20);
    SymbolGlyph.fontWeight(400);
    SymbolGlyph.fontColor(['rgba(0, 0, 0, 0.9)']);
}
export default class ContactBottomBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.isAll = false;
        this.pageId = '';
        this.leftClickEvent = () => {
        };
        this.rightClickEvent = () => {
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ContactBottomBar_Params) {
        if (params.isAll !== undefined) {
            this.isAll = params.isAll;
        }
        if (params.pageId !== undefined) {
            this.pageId = params.pageId;
        }
        if (params.leftClickEvent !== undefined) {
            this.leftClickEvent = params.leftClickEvent;
        }
        if (params.rightClickEvent !== undefined) {
            this.rightClickEvent = params.rightClickEvent;
        }
    }
    updateStateVars(params: ContactBottomBar_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private isAll: boolean;
    public pageId: string;
    public leftClickEvent: (isAll?: boolean) => void;
    public rightClickEvent: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(48);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('50%');
            Column.onClick(() => {
                if (this.pageId === CommonConstants.DELETE_PAGE_ID) {
                    this.isAll = !this.isAll;
                }
                this.leftClickEvent(this.isAll);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831588, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            __SymbolGlyph__setImageStyle();
        }, SymbolGlyph);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            __Text__setTextStyle();
            Text.margin({
                top: 4
            });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('50%');
            Column.onClick(() => this.rightClickEvent());
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831542, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            __SymbolGlyph__setImageStyle();
        }, SymbolGlyph);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777224, "type": 10003, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            __Text__setTextStyle();
            Text.margin({
                top: 4
            });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
