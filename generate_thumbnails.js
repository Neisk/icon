const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

const videoFolder = path.join(__dirname, 'mp4');
const thumbFolder = path.join(videoFolder, 'thumbnails');

if (!fs.existsSync(thumbFolder)) fs.mkdirSync(thumbFolder);

const videos = fs.readdirSync(videoFolder).filter(f => /\.(mp4|mov)$/i.test(f));

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
