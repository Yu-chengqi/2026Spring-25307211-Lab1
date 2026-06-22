/*
 *  Copyright (c) 2025 Huawei Device Co., Ltd.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { distributedKVStore } from '@kit.ArkData';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import CommonConstants from '../common/CommonConstants';
import ContactBottomBar from '../components/ContactBottomBar';
import { KvManager } from '../utils/KvManager';
import { ContactListItem } from '../components/ContactListItem';
import { ListItemData } from '../viewmodel/ContactViewModel';
import { ContactDeleteDialog } from '../components/ContactDeleteDialog';

const TAG: string = 'DeletePage';

@Entry
@Component
struct ContactDeletePage {
  @State isSelectAll: boolean = false;
  @State checkList: Array<ListItemData> = [];
  @State count: number = 0;
  kvManager = AppStorage.get('kvManager') as KvManager;
  dialogController: CustomDialogController = new CustomDialogController({
    builder: ContactDeleteDialog({
      cancel: () => {
        this.onCancel();
      },
      confirm: () => {
        this.onConfirm();
      },
      promptMessage: $r('app.string.batch_delete_text'),
    }),
    autoCancel: true,
    alignment: DialogAlignment.Center,
    customStyle: true
  });

  // Close the pop-up window.
  onCancel() {
    try {
      this.getUIContext().getPromptAction().showToast({
        message: $r('app.string.delete_cancel_text'),
        duration: CommonConstants.PROMPT_DURATION
      });
    } catch (error) {
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
    this.kvManager.getEntries(
      CommonConstants.CONTACTS_DATABASE_KEY,
      (err: BusinessError, entries: distributedKVStore.Entry[]) => {
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
          message: $r('app.string.prompt_message_deleted'),
          duration: CommonConstants.PROMPT_DURATION
        });
      } catch (err) {
        hilog.error(0x0000, 'ContactDeletePage', `showToast failed, code is ${err.code}, message is ${err.message}`);
      }
      this.getUIContext().getRouter().pushUrl({
        url: CommonConstants.LIST_PAGE_URL
      }).catch((err: BusinessError) => {
        hilog.error(0x0000, 'ContactDeletePage', `pushUrl failed, code is ${err.code}, message is ${err.message}`);
      });
    });
  }

  build() {
    Column() {
      Flex({ direction: FlexDirection.Column }) {
        this.NavigationTitle();

        Column() {
          List() {
            ForEach(this.checkList, (item: ListItemData) => {
              ListItem() {
                ContactListItem({
                  itemInfo: item,
                  isCanCheck: true,
                  onCheck: () => {
                    item.checked = !item.checked;
                    item.checked ? this.count++ : this.count--;
                  }
                })
              }
            }, (item: ListItemData) => JSON.stringify(item))
          }
          .scrollBar(BarState.Off)
          .width('100%')
          .height(CommonConstants.PERCENTAGE_MAX)
        }
        .flexGrow(1)

        ContactBottomBar({
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
                  message: $r('app.string.prompt_delete'),
                  duration: CommonConstants.PROMPT_DURATION,
                });
              } catch (err) {
                hilog.error(0x0000, 'ContactDeletePage', `showToast failed, code is ${err.code}, message is ${err.message}`);
              }
            } else {
              this.dialogController.open();
            }
          },
          pageId: CommonConstants.DELETE_PAGE_ID,
        })
      }
    }
    .width('100%')
    .height('100%')
    .padding({ left: 16, right: 16 })
    .backgroundColor(Color.White)
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  @Builder
  NavigationTitle() {
    Flex({ alignItems: ItemAlign.Center }) {
      Row() {
        SymbolGlyph($r('sys.symbol.xmark'))
          .fontSize(24)
          .fontWeight(400)
      }
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .width(40)
      .height(40)
      .backgroundColor('rgba(0, 0, 0, 0.05)')
      .borderRadius(40)
      .margin({ right: 8 })
      .onClick(() => {
        this.getUIContext().getRouter().back();
      })

      Row() {
        Text($r('app.string.edit_text'))
          .fontSize(26)
          .fontWeight(700)
          .lineHeight(27)
          .fontColor('rgba(0, 0, 0, 0.9)')
      }
      .flexGrow(1)

      Row() {
        SymbolGlyph($r('sys.symbol.checkmark'))
          .fontColor(['rgba(0,0,0,0.9)'])
          .fontSize(24)
      }
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .width(40)
      .height(40)
      .backgroundColor('rgba(0, 0, 0, 0.05)')
      .borderRadius(40)
      .onClick(() => {
        this.getUIContext().getRouter().back();
      })
    }
    .height(56)
  }
}