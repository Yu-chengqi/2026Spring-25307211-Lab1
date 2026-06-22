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

import CommonConstants from '../common/CommonConstants';

@Extend(Text)
function setTextStyle() {
  .width('100%')
  .textAlign(TextAlign.Center)
  .fontColor('rgba(0, 0, 0, 0.9)')
  .fontSize(12);
}

@Extend(SymbolGlyph)
function setImageStyle() {
  .fontSize(20)
  .fontWeight(400)
  .fontColor(['rgba(0, 0, 0, 0.9)']);
}

@Component
export default struct ContactBottomBar {
  private isAll: boolean = false;
  public pageId: string = '';
  public leftClickEvent: (isAll?: boolean) => void = () => {
  };
  public rightClickEvent: () => void = () => {
  };

  build() {
    Row() {
      Column() {
        Row() {
          SymbolGlyph($r('sys.symbol.checkmark_square_on_square'))
            .setImageStyle()
        }

        Text($r('app.string.bottom_text_all_selected'))
          .setTextStyle()
          .margin({
            top: 4
          })
      }
      .width('50%')
      .onClick(() => {
        if (this.pageId === CommonConstants.DELETE_PAGE_ID) {
          this.isAll = !this.isAll;
        }
        this.leftClickEvent(this.isAll);
      })

      Column() {
        Row() {
          SymbolGlyph($r('sys.symbol.trash'))
            .setImageStyle()
        }

        Text($r('app.string.bottom_text_deletion'))
          .setTextStyle()
          .margin({
            top: 4
          })
      }
      .width('50%')
      .onClick(() => this.rightClickEvent())
    }
    .width('100%')
    .height(48)
  }
}