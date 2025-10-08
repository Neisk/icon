const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

const videoFolder = path.join(__dirname, 'mp4');
const thumbFolder = path.join(videoFolder, 'thumbnails');

// 确保文件夹存在
if (!fs.existsSync(videoFolder)) {
  fs.mkdirSync(videoFolder, { recursive: true });
  console.log(`📁 已创建 mp4 文件夹，请放入视频后重新运行`);
  process.exit(0);
}

if (!fs.existsSync(thumbFolder)) fs.mkdirSync(thumbFolder, { recursive: true });

const videos = fs.readdirSync(videoFolder).filter(f => /\.(mp4|mov)$/i.test(f));

if (videos.length === 0) {
  console.log('⚠️ mp4 文件夹没有视频文件，请添加 .mp4 文件后再运行');
  process.exit(0);
}

videos.forEach(video => {
  const videoPath = path.join(videoFolder, video);
  const outputThumb = path.join(thumbFolder, video + '.jpg');

  ffmpeg(videoPath)
    .screenshots({
      timestamps: ['5'],
      filename: path.basename(outputThumb),
      folder: thumbFolder,
      size: '320x180'
    })
    .on('end', () => console.log(`✅ 缩略图生成完成: ${video}`))
    .on('error', (err) => console.error(`❌ 生成失败: ${video}`, err.message));
});
