# google-meet-file-mover
特定の親フォルダ下に連番のフォルダ名で子フォルダを定期的に作成するGoogle Apps Script（ auto-folder-creation-and-notification.gs ）と、Google Meet録画ァイルおよびチャットテキストファイルを最新の子フォルダに移動する自動化を実現するGoogle Apps Script（ google-meet-file-mover.gs ）です。
定期的な会議体の開催回ごとに、フォルダを作成することや、そのフォルダに対して録画ファイル移動を行っている場合にご活用ください。

```mermaid
sequenceDiagram
    actor User
    participant GoogleAppsScript as Google Apps Script (フォルダ作成)
    participant Slack as Slack Webhook
    participant GoogleDriveMeet as Google Drive (Meet Recordings)
    participant GoogleDriveTarget as Google Drive (Target Folder)
    participant GoogleAppsScript2 as Google Apps Script (ファイル移動)
    participant GoogleMeet as Google Meet

    loop 定期実行設定 (タイマー設定)
        User ->> GoogleAppsScript: フォルダ作成プロセス開始
        GoogleAppsScript ->> GoogleDriveTarget: 特定の親フォルダを指定
        GoogleAppsScript ->> GoogleDriveTarget: 最新の子フォルダ名を取得
        GoogleAppsScript ->> GoogleDriveTarget: 新しいフォルダを作成
        GoogleAppsScript ->> Slack: Slack通知 (新しいフォルダの作成情報)
    end

    loop 毎回のMeet録画後
        GoogleMeet ->> GoogleDriveMeet: 録画ファイルとチャットテキストを保存
        User ->> GoogleAppsScript2: 手動実行または定期実行 (ファイル移動)
        GoogleAppsScript2 ->> GoogleDriveMeet: 録画フォルダから最新の録画ファイルとチャットファイルを取得
        GoogleAppsScript2 ->> GoogleDriveTarget: 親フォルダから最新の子フォルダを取得
        GoogleAppsScript2 ->> GoogleDriveTarget: 録画ファイルとチャットファイルを最新の子フォルダに移動
    end
 ```

## 使い方
フォルダID等の定数を編集した後にそれぞれの関数をGoogle Apps Scriptにデプロイし、時間起動のトリガーを会議終了後に設定してください。
たとえば会議が13:00-14:00だとすると、以下のように設定すると期待した動作になるように設計されています。
 - google-meet-file-mover.gs ... 15:00-16:00
 - auto-folder-creation-and-notification.gs ... 16:00-17:00
