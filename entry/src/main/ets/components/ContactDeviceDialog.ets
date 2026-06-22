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

import { distributedDeviceManager } from '@kit.DistributedServiceKit';
import CommonConstants from '../common/CommonConstants';

@Extend(Text)
function ButtonTextStyle() {
  .fontColor('#0A59F7')
  .fontSize($r('app.float.button_font_size'))
  .fontWeight(CommonConstants.FONT_WEIGHT_500);
}

@CustomDialog
export default struct ContactDeviceDialog {
  controller?: CustomDialogController;
  @Link deviceList: Array<distributedDeviceManager.DeviceBasicInfo>;
  @Link selectedDeviceIndex: number;
  onSelectedIndexChange: (index: number) => void = () => {};

  build() {
    Column() {
      Row() {
        Text($r('app.string.select_device'))
          .fontSize($r('app.float.dialog_title_font_size'))
          .textAlign(TextAlign.Start)
          .fontColor(Color.Black)
          .fontWeight(FontWeight.Bold)
      }
      .padding({
        left: $r('app.float.dialog_title_padding_left'),
        right: $r('app.float.dialog_title_padding_left'),
        top: $r('app.float.dialog_title_padding_top')
      })
      .height($r('app.float.dialog_title_height'))
      .justifyContent(FlexAlign.Center)

      List() {
        ForEach(this.deviceList, (item: distributedDeviceManager.DeviceBasicInfo, index: number) => {
          ListItem() {
            Column() {
              Row() {
                Row() {
                  Row() {
                    Image(this.getDeviceTypeIcon())
                      .opacity($r('app.float.device_icon_opacity'))
                  }
                  .width($r('app.float.device_icon_width'))
                  .aspectRatio(CommonConstants.NUMBER_ONE)

                  Text(item.deviceName)
                    .fontSize($r('app.float.device_name_font_size'))
                    .width(CommonConstants.DEVICE_NAME_WIDTH)
                    .fontColor(Color.Black)
                    .margin({ left: $r('app.float.device_name_margin_left') })
                    .maxLines(CommonConstants.NUMBER_ONE)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
                    .textAlign(TextAlign.Start)
                }
                .justifyContent(FlexAlign.Start)

                Radio({
                  value: item.deviceId, group: 'RadioGroup',
                  indicatorType: RadioIndicatorType.DOT
                })
                  .width(20)
                  .height(20)
                  .checked(index === this.selectedDeviceIndex)
              }
              .height($r('app.float.device_info_height'))
              .onClick(() => {
                if (this.selectedDeviceIndex === index) {
                  return;
                } else {
                  this.selectedDeviceIndex = index;
                }
              })
              .padding({
                left: $r('app.float.device_info_padding'),
                right: $r('app.float.device_info_padding')
              })
              .width(CommonConstants.FULL_PERCENT)
              .justifyContent(FlexAlign.SpaceBetween)

              if (index !== this.deviceList.length - 1) {
                Row() {
                  Divider()
                    .width(CommonConstants.FULL_PERCENT)
                    .height($r('app.float.device_info_divider_height'))
                    .opacity($r('app.float.device_info_divider_opacity'))
                }
                .padding({
                  left: $r('app.float.device_info_divider_padding_left'),
                  right: $r('app.float.device_info_divider_padding_right')
                })
                .width(CommonConstants.FULL_PERCENT)
              }
            }
          }
        }, (item: distributedDeviceManager.DeviceBasicInfo) => JSON.stringify(item))
      }
      .scrollBar(BarState.On)
      .height('80%')

      Blank()
      Row() {
        Column() {
          Text($r('app.string.select_device_cancel'))
            .ButtonTextStyle()
        }
        .layoutWeight(CommonConstants.NUMBER_ONE)
        .justifyContent(FlexAlign.Center)
        .height($r('app.float.button_line_height'))
        .onClick(() => {
          if (this.controller !== undefined) {
            this.controller.close();
          }
        })

        Divider()
          .vertical(true)
          .height($r('app.float.button_line_divider_height'))
          .color($r('app.color.button_line_divider_color'))
          .width($r('app.float.button_line_divider_width'))

        Column() {
          Text($r('app.string.confirm'))
            .ButtonTextStyle()
        }
        .layoutWeight(CommonConstants.NUMBER_ONE)
        .justifyContent(FlexAlign.Center)
        .height($r('app.float.button_line_height'))
        .onClick(() => {
          this.onSelectedIndexChange(this.selectedDeviceIndex);
        })
      }
      .border({
        color: Color.White,
        radius: $r('app.float.button_line_radius')
      })
      .padding($r('app.float.button_line_padding'))
      .margin({ top: $r('app.float.button_line_margin_top') })
    }
    .height('100%')
  }

  getDeviceTypeIcon(): Resource {
    return $r('app.media.ic_public_devices_phone');
  }
}