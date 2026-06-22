import UIAbility from "@ohos:app.ability.UIAbility";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type { BusinessError } from "@ohos:base";
import { KvManager } from "@bundle:com.example.distributedcontacts/entry/ets/utils/KvManager";
const TAG: string = 'EntryAbility';
export default class EntryAbility extends UIAbility {
    onCreate(): void {
        this.permissions();
        AppStorage.setOrCreate('kvManager', new KvManager(this.context));
    }
    onNewWant(): void {
        this.permissions();
        AppStorage.setOrCreate('kvManager', new KvManager(this.context));
        hilog.info(0x0000, 'EntryAbility', `Ability onNewWant`);
    }
    onDestroy(): void | Promise<void> {
        hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onDestroy');
        let kvManager = AppStorage.get('kvManager') as KvManager;
        kvManager.removeDataChangeListener();
        kvManager.closeKVStore();
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        // Main window is created, set main page for this ability.
        hilog.isLoggable(0x0000, TAG, hilog.LogLevel.INFO);
        windowStage.loadContent('pages/ContactHomePage', (err: BusinessError) => {
            if (err.code) {
                hilog.error(0x0000, 'EntryAbility', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err));
                return;
            }
            hilog.info(0x0000, 'EntryAbility', 'Succeeded in loading the content.');
            try {
                AppStorage.setOrCreate('uiContext', windowStage.getMainWindowSync().getUIContext());
            }
            catch (err) {
                hilog.error(0x0000, 'EntryAbility', `getMainWindowSync failed, code is ${err.code}, message is ${err.message}`);
            }
        });
    }
    /**
     * Apply for the permission to exchange data between different devices.
     */
    permissions(): void {
        let atManager = abilityAccessCtrl.createAtManager();
        atManager.requestPermissionsFromUser(this.context, ['ohos.permission.DISTRIBUTED_DATASYNC']).then((data) => {
            hilog.info(0x0000, 'EntryAbility', `Data permissions:${data.permissions}`);
        }).catch((err: BusinessError) => {
            hilog.error(0x0000, 'EntryAbility', `request permissions failed, code is ${err.code}, message is ${err.message}`);
        });
    }
}
