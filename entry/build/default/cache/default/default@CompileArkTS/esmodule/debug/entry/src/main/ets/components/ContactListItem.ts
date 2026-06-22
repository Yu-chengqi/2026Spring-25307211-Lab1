if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ContactListItem_Params {
    itemInfo?: ListItemData;
    isCanCheck?;
    onCheck?: () => void;
}
import CommonConstants from "@bundle:com.example.distributedcontacts/entry/ets/common/CommonConstants";
import type { ListItemData } from '../viewmodel/ContactViewModel';
export class ContactListItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.itemInfo = {
            id: 0,
            name: '',
            checked: false
        };
        this.isCanCheck = false;
        this.onCheck = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ContactListItem_Params) {
        if (params.itemInfo !== undefined) {
            this.itemInfo = params.itemInfo;
        }
        if (params.isCanCheck !== undefined) {
            this.isCanCheck = params.isCanCheck;
        }
        if (params.onCheck !== undefined) {
            this.onCheck = params.onCheck;
        }
    }
    updateStateVars(params: ContactListItem_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    public itemInfo: ListItemData;
    public isCanCheck;
    public onCheck: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height(48);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ right: 19 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831250, "type": 40000, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
            SymbolGlyph.fontSize(48);
            SymbolGlyph.fontColor(['#D1D1D6']);
            SymbolGlyph.fontWeight(400);
        }, SymbolGlyph);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(CommonConstants.TITLE_LAYOUT_WEIGHT);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itemInfo.name.toString());
            Text.fontSize(16);
            Text.fontColor('rgba(0, 0, 0, 0.9)');
            Text.fontWeight(700);
            Text.maxLines(CommonConstants.TITLE_MAX_LINES);
            Text.textOverflow({
                overflow: TextOverflow.Ellipsis
            });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isCanCheck) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Checkbox.create();
                        Checkbox.select(this.itemInfo.checked);
                        Checkbox.selectedColor('#0A59F7');
                        Checkbox.onChange(() => {
                            this.onCheck();
                        });
                        Checkbox.width({ "id": 16777289, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                        Checkbox.height({ "id": 16777289, "type": 10002, params: [], "bundleName": "com.example.distributedcontacts", "moduleName": "entry" });
                    }, Checkbox);
                    Checkbox.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
