import { getClient } from '@tauri-apps/api/http';
import { getVersion } from '@tauri-apps/api/app';
import { type } from '@tauri-apps/api/os';

interface Assets {
    browser_download_url: string,
    name: string
}

interface ReleasesData {
    assets: Assets[],
    draft: boolean,
    prerelease: boolean,
};

const platformSuffix = {
    Darwin: '.AppImage',
    Linux: '.deb',
    Windows_NT: '.msi',
};

const url = 'https://api.github.com/repos/beenyan/tauri-updater-exercise/releases';
export async function dd() {
    const client = await getClient();
    const response = await client.get<ReleasesData[]>(url);
    const data = response.data;
    if (response.status != 200) {
        console.warn(`Url 連接失敗`, response);
        return;
    }

    const suffix = platformSuffix[await type()];

    const releaseLatest = data.find(e => !e.draft && !e.prerelease);
    if (releaseLatest === undefined) {
        console.warn(`無發行版本`, data);
        return;
    }

    console.log(releaseLatest);
    const binaryAsset = releaseLatest.assets.find(e =>
        e.name.endsWith(suffix)
    );
    if (binaryAsset === undefined) {
        console.warn(`無可用更新`, releaseLatest.assets);
        return;
    }

    console.log(releaseLatest.assets, await getVersion());

}