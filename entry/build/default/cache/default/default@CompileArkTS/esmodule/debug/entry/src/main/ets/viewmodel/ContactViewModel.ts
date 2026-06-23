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
/**
 * Contact data entity.
 */
export class ContactData {
    /**
     * Contact name.
     */
    name: string;
    /**
     * Contact address.
     */
    address?: string;
    /**
     * Contact phone number.
     */
    telephony?: string;
    /**
     * Contact email.
     */
    email?: string;
    /**
     * Contact remarks.
     */
    remarks?: string;
    /**
     * Contact group name (分组名称：家人、朋友、同事).
     */
    groupName?: string;
    /**
     * Contact birthday (联系人生日，格式：MM-DD，只存储月日，不存储年份).
     */
    birthday?: string;
    constructor(name: string, address?: string, telephony?: string, email?: string, remarks?: string, groupName?: string, birthday?: string) {
        this.name = name;
        this.address = address;
        this.telephony = telephony;
        this.email = email;
        this.remarks = remarks;
        this.groupName = groupName;
        this.birthday = birthday;
    }
}
export class ListItemData {
    /**
     * Contact id.
     */
    id: number = 0;
    /**
     * Contact name.
     */
    name: string = '';
    /**
     * Contact selection box.
     */
    checked: boolean = false;
    /**
     * Contact group name (分组名称).
     */
    groupName: string = '';
    /**
     * Contact birthday (联系人生日，格式：MM-DD，只存储月日，不存储年份).
     */
    birthday: string = '';
}
