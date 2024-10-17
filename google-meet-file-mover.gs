const RECORDINGS_FOLDER_ID = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // 録画ファイルがデフォルトで保存されるフォルダ「Meet Recordings」のIDを指定
const PARENT_FOLDER_ID = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // 録画ファイルを移動する先のフォルダを束ねる親フォルダのID
const FILE_NAME_KEYWORD = "xxx-xxxx-xxx"; // 録画ファイルに付与されるミーティングID

function getLatestRecordingAndChatFiles() {
  // 録画フォルダから最新の録画ファイルとチャット記録ファイルを取得する
  const recordingsFolder = DriveApp.getFolderById(RECORDINGS_FOLDER_ID);
  const filesIterator = recordingsFolder.getFiles();
  let latestRecordingFile = null;
  let latestChatFile = null;

  while (filesIterator.hasNext()) {
    let file = filesIterator.next();
    const fileName = file.getName();

    // ファイル名に FILE_NAME_KEYWORD を含む、最新の録画ファイルとチャットファイルをそれぞれ1件ずつ取得する
    if (fileName.includes(FILE_NAME_KEYWORD)) {
      if (fileName.includes("チャットの記録")) {
        if (!latestChatFile || file.getLastUpdated() > latestChatFile.getLastUpdated()) {
          latestChatFile = file;
        }
      } else {
        if (!latestRecordingFile || file.getLastUpdated() > latestRecordingFile.getLastUpdated()) {
          latestRecordingFile = file;
        }
      }
    }
  }

  return [latestRecordingFile, latestChatFile];
}

function moveLatestFilesToFolder() {
  // フォルダへのファイル移動処理
  const ParentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
  const childFolders = ParentFolder.getFolders();
  const latestFolder = childFolders.next(); // 最新のフォルダを取得

  const [latestRecordingFile, latestChatFile] = getLatestRecordingAndChatFiles();

  if (latestRecordingFile) {
    latestRecordingFile.moveTo(latestFolder);
  }
  if (latestChatFile) {
    latestChatFile.moveTo(latestFolder);
  }
}

// 実行関数
function executeFileMove() {
  moveLatestFilesToFolder();
} 
