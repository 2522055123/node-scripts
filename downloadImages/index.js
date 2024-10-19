const axios = require("axios");
const fs = require("fs"); // 使用 fs 的 promises 版本
const path = require("path");
const { ensureDir } = require("fs-extra");

// 图片 URL 列表
const imageUrls = [
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/bigplay.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/smallplay.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/smallpause.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/fullscreen.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/smallscreen.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/volume.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/unmutevolume.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/volumehover.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/volumemute.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/volumemutehover.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/playanimation.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/pauseanimation.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/dragcursorhover.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/snapshot.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/cc.png",
  "https://g.alicdn.com/apsara-media-box/imp-web-player/2.20.3/skins/default/img/setting.png",
  // 添加更多图片 URL
];

// 目标文件夹路径
const targetFolder = path.join(__dirname, "img");

// 确保目标文件夹存在
async function createTargetFolder() {
  try {
    await ensureDir(targetFolder);
    console.log(`Folder ${targetFolder} created or already exists.`);
  } catch (error) {
    console.error(`Error creating folder: ${error.message}`);
    process.exit(1); // 如果无法创建文件夹，退出程序
  }
}

// 清空目标文件夹
async function clearTargetFolder() {
  try {
    const files = await fs.promises.readdir(targetFolder);
    for (const file of files) {
      const filePath = path.join(targetFolder, file);
      await fs.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
    console.log(`Cleared all files in ${targetFolder}`);
  } catch (error) {
    console.error(`Error clearing folder: ${error.message}`);
    process.exit(1); // 如果无法清空文件夹，退出程序
  }
}

// 下载单张图片
async function downloadImage(url, filePath) {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream", // 设置响应类型为流
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath); // 使用 fs.createWriteStream

      response.data.pipe(writer);

      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading the image from ${url}: ${error.message}`);
    return null;
  }
}

// 批量下载图片
async function batchDownloadImages(urls) {
  for (const [_, url] of urls.entries()) {
    const fileName = url.match(/[^/]+$/)[0];
    const filePath = path.join(targetFolder, fileName);

    console.log(`Downloading ${url} to ${filePath}`);
    await downloadImage(url, filePath);
  }
}

// 主函数
async function main() {
  await createTargetFolder();
  await clearTargetFolder(); // 清空目标文件夹
  await batchDownloadImages(imageUrls);
  console.log("All images have been downloaded.");
}

main().catch((error) => {
  console.error(`An error occurred: ${error.message}`);
});
