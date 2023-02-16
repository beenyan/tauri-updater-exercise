import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import Swal from 'sweetalert2/dist/sweetalert2.js';

export async function updateCheck() {

    const { shouldUpdate, manifest } = await checkUpdate()
    if (!shouldUpdate) return;
    try {
        const result = await Swal.fire({
            position: 'bottom-end',
            icon: 'info',
            title: `Update v${manifest?.version} available`,
            text: `${manifest?.body}`,
            showConfirmButton: true,
            confirmButtonText: "Install update and relaunch",
            showCancelButton: true,
            backdrop: false,
        });

        if (result.isConfirmed === false) return;

        // display dialog
        await installUpdate()
        // install complete, restart the app
        await relaunch()
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: `更新失敗`,
            text: `${error}`,
        });
    }
}