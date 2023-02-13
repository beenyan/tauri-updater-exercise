---
marp: false
---

# Tauri Updater with github 練習

## 1. 安裝全域 tauri
```
pnpm i -g @tauri-apps/cli
```

## 2. 生成簽名 
```
# tauri signer generate -w ~/.tauri/{app_name}.key

tauri signer generate -w ~/.tauri/tauri_updater.key
```

## 3. 在 tauri.conf.json 填上公鑰
![](mdimage/publickey.png)

## 4. 在 github action 新增 secret
![](mdimage/privatekey.png)

## 4. 新增好 private_key & password
![](mdimage/secretkey.png)

## 4. 在 yml 加上剛剛新增好的 secret
![](mdimage/ymlkey.png)