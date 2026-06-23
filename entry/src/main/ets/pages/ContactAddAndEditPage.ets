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

import { common } from '@kit.AbilityKit';
import { KeyboardAvoidMode } from '@kit.ArkUI';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';
import CommonConstants from '../common/CommonConstants';
import { ContactData } from '../viewmodel/ContactViewModel';
import { KvManager } from '../utils/KvManager';

@Entry
@Component
struct ContactAddAndEditPage {
  @State isSelectAll: boolean = false;
  @State name: string = '';
  @State address: string = '';
  @State telephony: string = '';
  @State email: string = '';
  @State remarks: string = '';
  // 分组选择相关状态变量
  @State selectedGroupIndex: number = 0; // 当前选中的分组索引
  private groupOptions: string[] = ['家人', '朋友', '同事']; // 分组选项（不包含"全部"）
  // Select 组件选项数据
  private selectOptions: Array<SelectOption> = [
    { value: '家人' },
    { value: '朋友' },
    { value: '同事' }
  ];
  private isEdit: boolean = false;
  private context = this.getUIContext().getHostContext() as common.UIAbilityContext;
  kvManager = AppStorage.get('kvManager') as KvManager;

  aboutToAppear() {
    this.getUIContext().setKeyboardAvoidMode(KeyboardAvoidMode.RESIZE);
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
    } catch (error) {
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

  build() {
    Column() {
      this.NavigationTitle();
      Scroll() {
        Column() {
          Image($r('app.media.ic_head_portrait'))
            .width(56)
            .height(56)
            .objectFit(ImageFit.Contain)
            .margin({ bottom: 16, top: 12 })
          if (!this.isEdit) {
            Text($r('app.string.edit_save_to_text'))
              .fontSize(16)
              .fontWeight(700)
              .margin({ bottom: 20 })
          }
          this.Item('edit_item_name', $r('sys.symbol.person'), this.name, true);
          this.Item('edit_item_address', $r('app.media.ic_address'), this.address);
          this.Item('edit_item_phone', $r('app.media.ic_phone'), this.telephony);
          this.Item('edit_item_email', $r('sys.symbol.envelope'), this.email, true);
          this.Item('edit_item_note', $r('app.media.ic_note'), this.remarks);
          // 添加分组选择器
          this.GroupSelector();
        }
        .margin({ top: 16, bottom: 64 })
        .layoutWeight(CommonConstants.WEIGHT)
      }
      .scrollBar(BarState.Off)
      .align(Alignment.Top)
      .width('100%')
      .height('100%')
    }
    .width('100%')
    .height('100%')
    .padding({ left: 16, right: 16 })
    .backgroundColor($r('app.color.detail_page_background'))
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  /**
   * 分组选择器组件
   */
  @Builder
  GroupSelector() {
    Row() {
      SymbolGlyph($r('sys.symbol.folder'))
        .fontSize(24)
        .fontColor([$r('app.color.font_color')])
        .margin({ right: $r('app.float.item_icon_margin') })
      Text('分组')
        .fontSize($r('app.float.item_font_size'))
        .fontColor($r('app.color.font_color'))
        .fontWeight(FontWeight.Regular)
      Column() {
        Select(this.selectOptions)
          .selected(this.selectedGroupIndex)
          .value(this.groupOptions[this.selectedGroupIndex])
          .font({ size: 14 })
          .fontColor('rgba(0, 0, 0, 0.9)')
          .selectedOptionFont({ size: 14 })
          .optionFont({ size: 14 })
          .onSelect((index: number) => {
            this.selectedGroupIndex = index;
          })
      }
      .width(CommonConstants.EDIT_INPUT_WIDTH)
      .margin({ right: $r('app.float.edit_input_margin') })
      .alignItems(HorizontalAlign.End)
    }
    .padding({
      top: 16,
      bottom: 16,
      left: 12,
      right: 12
    })
    .margin({ bottom: 12 })
    .justifyContent(FlexAlign.Start)
    .backgroundColor(Color.White)
    .borderRadius(24)
    .width('100%')
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
        if (!this.isEdit) {
          this.getUIContext().getRouter().back();
        } else {
          let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
          this.getUIContext().getRouter().back({
            url: CommonConstants.PAGE_DETAIL_URL,
            params: {
              key: params.key
            }
          });
        }
      })

      Text(this.isEdit ? $r('app.string.edit_title') : $r('app.string.add_contacts_text'))
        .fontSize(26)
        .fontWeight(700)
        .lineHeight(27)
        .fontColor('rgba(0, 0, 0, 0.9)')
        .flexGrow(1)
      Row() {
        SymbolGlyph($r('sys.symbol.checkmark'))
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
        if (this.name !== '') {
          // 获取选中的分组名称
          const groupName = this.groupOptions[this.selectedGroupIndex];
          const contactData: ContactData =
            new ContactData(this.name, this.address, this.telephony, this.email, this.remarks, groupName);
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
          } else {
            let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
            this.getUIContext().getRouter().back({
              url: CommonConstants.PAGE_DETAIL_URL,
              params: {
                key: params.key
              }
            });
          }
        } else {
          try {
            this.getUIContext().getPromptAction().showToast({
              message: $r('app.string.contact_name'),
              duration: CommonConstants.PROMPT_DURATION
            });
          } catch (err) {
            hilog.error(0x0000, 'ContactAddAndEditPage', `showToast failed, code is ${err.code}, message is ${err.message}`);
          }
        }
      })
    }
    .height(56)
    .backgroundColor($r('app.color.detail_page_background'))
    .expandSafeArea([SafeAreaType.KEYBOARD])
    .zIndex(3)
  }

  @Builder
  Item(key: string, icon: Resource, content: string, isSys: boolean = false) {
    Row() {
      if (isSys) {
        SymbolGlyph(icon)
          .fontSize(24)
          .fontColor([$r('app.color.font_color')])
          .margin({ right: $r('app.float.item_icon_margin') })
      } else {
        Image(icon)
          .objectFit(ImageFit.Contain)
          .height($r('app.float.item_icon_size'))
          .width($r('app.float.item_icon_size'))
          .margin({ right: $r('app.float.item_icon_margin') })
      }
      Text(this.getStringValue(key))
        .fontSize($r('app.float.item_font_size'))
        .fontColor($r('app.color.font_color'))
        .fontWeight(FontWeight.Regular)
      TextInput({ text: content })
        .type(this.getInputType(key))
        .maxLength(this.getMaxLength(key))
        .width(CommonConstants.EDIT_INPUT_WIDTH)
        .margin({ right: $r('app.float.edit_input_margin') })
        .backgroundColor(Color.White)
        .fontSize($r('app.float.item_font_size'))
        .fontWeight(FontWeight.Regular)
        .enabled(this.getStringValue(key) === this.getStringValue(CommonConstants.CONTACTS_DETAIL_NAME) && this.isEdit ?
          false : true)
        .onChange((value) => {
          this.contactInfoChange(key, value);
        })
    }
    .padding({
      top: 16,
      bottom: 16,
      left: 12,
      right: 12
    })
    .margin({ bottom: 12 })
    .justifyContent(FlexAlign.Start)
    .backgroundColor(Color.White)
    .borderRadius(24)
    .width('100%')
  }

  getStringValue(resName: string): string {
    try {
      return this.context.resourceManager.getStringByNameSync(resName);
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      hilog.error(0x0000, 'ContactAddAndEditPage', `have error .Code:${err.code},message: ${err.message}`);
      return err.code;
    }
  }
}
