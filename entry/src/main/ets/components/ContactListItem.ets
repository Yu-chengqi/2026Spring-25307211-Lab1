/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import CommonConstants from '../common/CommonConstants';
import { ListItemData } from '../viewmodel/ContactViewModel';

@Component
export struct ContactListItem {
  public itemInfo: ListItemData = {
    id: 0,
    name: '',
    checked: false,
    groupName: '',
    birthday: ''
  };
  public isCanCheck = false;
  public onCheck: () => void = () => {};

  /**
   * 判断是否为生日当天
   * 生日格式为 MM-DD，只对比月日，忽略年份
   */
  isBirthdayToday(): boolean {
    if (!this.itemInfo.birthday || this.itemInfo.birthday === '') {
      return false;
    }
    try {
      const today = new Date();
      // 解析生日（格式：MM-DD）
      const birthdayParts = this.itemInfo.birthday.split('-');
      if (birthdayParts.length !== 2) {
        return false;
      }
      const birthMonth = parseInt(birthdayParts[0]) - 1; // 月份从0开始
      const birthDay = parseInt(birthdayParts[1]);
      // 只对比月日，忽略年份
      return today.getMonth() === birthMonth && today.getDate() === birthDay;
    } catch (err) {
      return false;
    }
  }

  build() {
    Column() {
      Column() {
        Row() {
          Row() {
            SymbolGlyph($r('sys.symbol.person_crop_circle_fill_1'))
              .fontSize(48)
              .fontColor(['#D1D1D6'])
              .fontWeight(400)
          }
          .margin({ right: 19 })

          Column() {
            Text(this.itemInfo.name.toString())
              .fontSize(16)
              .fontColor('rgba(0, 0, 0, 0.9)')
              .fontWeight(700)
              .maxLines(CommonConstants.TITLE_MAX_LINES)
              .textOverflow({
                overflow: TextOverflow.Ellipsis
              })
            // 显示分组标签
            if (this.itemInfo.groupName && this.itemInfo.groupName !== '') {
              Text(this.itemInfo.groupName)
                .fontSize(12)
                .fontColor('#0A59F7')
                .fontWeight(400)
                .margin({ top: 4 })
                .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                .backgroundColor('rgba(10, 89, 247, 0.1)')
                .borderRadius(4)
            }
            // 显示生日标签
            if (this.itemInfo.birthday && this.itemInfo.birthday !== '') {
              Row() {
                SymbolGlyph($r('sys.symbol.cake'))
                  .fontSize(12)
                  .fontColor([this.isBirthdayToday() ? '#FFFFFF' : '#FF6B6B'])
                Text(this.isBirthdayToday() ? '今天生日' : this.itemInfo.birthday)
                  .fontSize(12)
                  .fontColor(this.isBirthdayToday() ? '#FFFFFF' : '#FF6B6B')
                  .fontWeight(400)
                  .margin({ left: 4 })
              }
              .margin({ top: 4 })
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.isBirthdayToday() ? '#FF6B6B' : 'rgba(255, 107, 107, 0.1)')
              .borderRadius(4)
            }
          }
          .layoutWeight(CommonConstants.TITLE_LAYOUT_WEIGHT)
          .alignItems(HorizontalAlign.Start)

          if (this.isCanCheck) {
            Checkbox()
              .select(this.itemInfo.checked)
              .selectedColor('#0A59F7')
              .onChange(() => {
                this.onCheck();
              })
              .width($r('app.float.checkbox_size'))
              .height($r('app.float.checkbox_size'))
          }
        }
        .height(48)
      }
    }
    .margin({ top: 16 })
  }
}