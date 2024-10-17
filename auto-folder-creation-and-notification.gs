const parentFolder = DriveApp.getFolderById("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
const slackWebhookUrl = "https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

function getLatestFolderName() {
  const folders = parentFolder.getFolders();
  return folders.hasNext() ? folders.next().getName() : null;
}

function checkFileExists(folderName) {
  const folder = DriveApp.getFoldersByName(folderName);
  return folder.hasNext() ? folder.next().getFiles().hasNext() : false;
}

function notifyToSlack(folder) {
  const folderUrl = folder.getUrl();
  const message = `新しいフォルダができました！${folderUrl}`; // すきなメッセージを配置する
  
  const jsonData = {
    "username": "Bot", // すきなBot名をいれる
    "icon_emoji": ":robot_face:",
    "text": message
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(jsonData)
  };

  UrlFetchApp.fetch(slackWebhookUrl, options);
}

function createNewFolder() {
  const latestFolderName = getLatestFolderName();
  if (!latestFolderName || !checkFileExists(latestFolderName)) {
    Logger.log("フォルダを作成しません");
    return;
  }

  Logger.log("フォルダを作成します");
  const newFolderName = latestFolderName.replace(/\d+/, (n) => ++n);
  const newFolder = parentFolder.createFolder(newFolderName);
  notifyToSlack(newFolder);
}
