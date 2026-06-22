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

@Component
export default struct ContactDetailItem {
  @Prop topContent: string;
  @Prop bottomContent: Resource;

  build() {
    Column() {
      Text(this.topContent)
        .height(22)
        .fontSize(16)
        .fontWeight(500)
        .lineHeight(21)
        .fontColor('rgba(0, 0, 0, 0.9)')
        .margin({ bottom: 2 })
      Text(this.bottomContent)
        .fontSize(14)
        .fontWeight(400)
        .lineHeight(19)
        .fontColor('rgba(0, 0, 0, 0.6)')
    }
    .alignItems(HorizontalAlign.Start)
    .justifyContent(FlexAlign.Center)
    .width('100%')
    .height(64)
    .margin({ bottom: 16 })
    .padding({ left: 12, right: 12 })
    .borderRadius(12)
    .backgroundColor(Color.White)
  }
}