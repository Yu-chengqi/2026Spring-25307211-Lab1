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
    checked: false
  };
  public isCanCheck = false;
  public onCheck: () => void = () => {};

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