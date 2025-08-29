<template>
  <div>
    <h1>Example Vue. FYI</h1>

    <div class="context">
      <div class="header-line">
        <h2>h265Web.js Player Demo</h2>
      </div>
      
      <!-- 视频URL输入框 -->
      <div class="input-container">
        <label for="video-url">视频URL:</label>
        <input 
          id="video-url" 
          v-model="videoUrl" 
          type="text" 
          placeholder="请输入视频URL" 
          class="url-input"
        />
        <button @click="loadVideo" class="load-btn">加载视频</button>
        
        <!-- 本地视频格式选择 -->
        <div class="format-selector">
          <label for="format-select">本地测试视频:</label>
          <select id="format-select" v-model="selectedFormat" @change="onFormatChange" class="format-select">
            <option value="">请选择格式</option>
            <option value="webm">WebM (原始)</option>
            <option value="mp4">MP4 (H.264)</option>
            <option value="h265">MP4 (H.265)</option>
            <option value="avi">AVI</option>
            <option value="mkv">MKV</option>
            <option value="mov">MOV</option>
            <option value="flv">FLV</option>
            <option value="3gp">3GP</option>
            <option value="wmv">WMV</option>
            <option value="ts">TS (MPEG-TS)</option>
            <option value="ogv">OGV (Ogg Video)</option>
            <option value="m4v">M4V</option>
          </select>
        </div>
        
        <div class="format-info" v-if="currentFormat">
          当前格式: {{ currentFormat }} | 播放器: {{ currentPlayerType }}
        </div>
        
        <!-- 示例视频链接 -->
        <div class="example-links">
          <h4>示例视频链接:</h4>
          <div class="link-group">
            <span class="link-label">WebM格式:</span>
            <button @click="loadExampleVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm')" class="example-btn">BigBuckBunny.webm</button>
            <button @click="loadExampleVideo('https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-webm-file.webm')" class="example-btn">sample.webm</button>
          </div>
          <div class="link-group">
            <span class="link-label">MP4格式:</span>
            <button @click="loadExampleVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')" class="example-btn">BigBuckBunny.mp4</button>
            <button @click="loadExampleVideo('https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4')" class="example-btn">sample.mp4</button>
          </div>
        </div>
      </div>
      
      <!-- video player content -->
      <div class="players-comparison">
        <!-- H265Web.js播放器 -->
        <div class="player-section">
          <h3 class="player-title">H265Web.js 播放器</h3>
          <div class="player-container">
            <div id="glplayer" class="glplayer"></div>
            <div id="controller" class="controller">
              <div id="progress-container" class="progress-common progress-container" @click="onProgressClick">
                <div id="cachePts" class="progress-common cachePts"></div>
                <div id="progressPts" class="progress-common progressPts"></div>
              </div>
              
              <div class="operate-container">
                <div class="player__button" role="button" @click="togglePlay">{{ isPlaying ? 'PAUSE' : 'PLAY' }}</div>
                <span class="ptsLabel">{{ currentTime }}/{{ totalTime }}</span>
                <div class="voice-div">
                  <button class="mute-btn" @click="toggleMute">🔊</button>
                  <input type="range" class="volume-slider" min="0" max="100" :value="volume" @input="onVolumeChange" />
                </div>
                <button class="fullscreen-btn" @click="toggleFullscreen">⛶</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 原生HTML5播放器 -->
        <div class="player-section">
          <h3 class="player-title">原生 HTML5 播放器</h3>
          <div class="player-container">
            <video 
              ref="comparisonVideo" 
              class="native-player" 
              controls
              preload="metadata"
              crossorigin="anonymous"
              @loadedmetadata="onComparisonLoadedMetadata"
              @timeupdate="onComparisonTimeUpdate"
              @ended="onComparisonEnded"
              @play="onComparisonPlay"
              @pause="onComparisonPause"
            ></video>
          </div>
        </div>
      </div>
      <!-- comapny tips -->
      <footer>
        <ul>
          <li>
            <a
              aria-label="Github"
              href="https://github.com/numberwolf/h265web.js"
              target="_blank"
              >H265Web.js Github</a
            >
          </li>
          <li>
            <a aria-label="company" href="https://zzsin.com" target="_blank"
              >zzSin</a
            >
          </li>
          <li>
            <a href="mailto:porschegt23@foxmail.com" aria-label="email"
              >Eamil</a
            >
          </li>
        </ul>
      </footer>
    </div>
  </div>
</template>

<script>
import { Player } from "./executor";
export default {
  data() {
    return {
      videoUrl: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.webm",
        url: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.webm",
      instance: null,
      isPlaying: false,
      currentTime: "00:00:00",
      totalTime: "00:00:00",
      volume: 50,
      isMuted: false,
      mediaInfo: null,
      progressContainerWidth: 0,
      useNativePlayer: false,
      currentFormat: "",
      currentPlayerType: "",
      selectedFormat: "",
      comparisonIsPlaying: false,
      comparisonCurrentTime: "00:00:00",
      comparisonTotalTime: "00:00:00",
      videoFormats: {
        webm: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.webm",
        mp4: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.mp4",
        h265: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB_h265.mp4",
        avi: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.avi",
        mkv: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.mkv",
        mov: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.mov",
        flv: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.flv",
        "3gp": "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.3gp",
        wmv: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.wmv",
        ts: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.ts",
        ogv: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.ogv",
        m4v: "/H265webjs-test/Big_Buck_Bunny_1080_10s_1MB.m4v"
      },
    };
  },
  mounted() {
    // 获取进度条容器宽度
    this.$nextTick(() => {
      const progressContainer = document.querySelector('#progress-container');
      if (progressContainer) {
        this.progressContainerWidth = progressContainer.offsetWidth;
      }
    });
    
    // 自动加载默认的H.265视频
    this.selectedFormat = 'h265';
    this.videoUrl = this.videoFormats.h265;
    this.loadVideo();
  },
  methods: {
    setupPlayerEvents() {
      if (!this.instance) return;
      
      // 播放时间更新
      this.instance.onPlayTime = (videoPTS) => {
        if (this.mediaInfo && this.mediaInfo.videoType === "vod") {
          const progressContainer = document.querySelector('#progress-container');
          const progressPts = document.querySelector('#progressPts');
          
          if (progressContainer && progressPts) {
            const percent = videoPTS / progressContainer.max;
            const progWidth = percent * this.progressContainerWidth;
            progressPts.style.width = progWidth + 'px';
          }
          
          this.currentTime = this.durationText(videoPTS);
        }
      };
      
      // 缓存进度更新
      this.instance.onCacheProcess = (cPts) => {
        const progressContainer = document.querySelector('#progress-container');
        const cachePts = document.querySelector('#cachePts');
        
        if (progressContainer && cachePts) {
          const percent = cPts / progressContainer.max;
          const cacheWidth = percent * this.progressContainerWidth;
          cachePts.style.width = cacheWidth + 'px';
        }
      };
      
      // 加载完成
      this.instance.onLoadFinish = () => {
        this.mediaInfo = this.instance.mediaInfo();
        console.log('Media info:', this.mediaInfo);
        
        if (this.mediaInfo.videoType === "vod") {
          const progressContainer = document.querySelector('#progress-container');
          if (progressContainer) {
            progressContainer.max = this.mediaInfo.meta.durationMs / 1000;
            this.totalTime = this.durationText(progressContainer.max);
          }
        }
        
        this.instance.setVoice(this.volume / 100);
      };
      
      // 播放完成
      this.instance.onPlayFinish = () => {
        this.isPlaying = false;
      };
    },
    
    togglePlay() {
      if (this.useNativePlayer) {
        const video = this.$refs.nativeVideo;
        if (video) {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
      } else {
        if (!this.instance) return;
        
        if (this.instance.isPlaying()) {
          this.instance.pause();
          this.isPlaying = false;
        } else {
          this.instance.play();
          this.isPlaying = true;
        }
      }
    },
    
    onProgressClick(event) {
      const progressContainer = event.currentTarget;
      const rect = progressContainer.getBoundingClientRect();
      const x = event.pageX - rect.left;
      
      if (this.useNativePlayer) {
        const video = this.$refs.nativeVideo;
        if (video && video.duration) {
          const clickedValue = (x / progressContainer.offsetWidth) * video.duration;
          video.currentTime = clickedValue;
        }
      } else {
        if (!this.instance || !this.mediaInfo) return;
        const clickedValue = (x * progressContainer.max) / progressContainer.offsetWidth;
        this.instance.seek(clickedValue);
      }
    },
    
    onVolumeChange(event) {
      this.volume = event.target.value;
      
      if (this.useNativePlayer) {
        const video = this.$refs.nativeVideo;
        if (video) {
          video.volume = this.volume / 100;
        }
      } else {
        if (this.instance) {
          this.instance.setVoice(this.volume / 100);
        }
      }
    },
    
    toggleMute() {
      this.isMuted = !this.isMuted;
      
      if (this.useNativePlayer) {
        const video = this.$refs.nativeVideo;
        if (video) {
          video.muted = this.isMuted;
        }
      } else {
        if (!this.instance) return;
        
        if (this.isMuted) {
          this.instance.setVoice(0);
        } else {
          this.instance.setVoice(this.volume / 100);
        }
      }
    },
    
    toggleFullscreen() {
      if (this.useNativePlayer) {
        const video = this.$refs.nativeVideo;
        if (video) {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
          } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
          }
        }
      } else {
        if (this.instance) {
          this.instance.fullScreen();
        }
      }
    },
    
    durationText(duration) {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = Math.floor(duration % 60);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // 检测视频格式
    detectVideoFormat(url) {
      const urlLower = url.toLowerCase();
      if (urlLower.includes('_h265.mp4')) {
        return 'MP4 (H.265)';
      } else if (urlLower.includes('.webm') || urlLower.includes('webm')) {
        return 'WebM';
      } else if (urlLower.includes('.mp4') || urlLower.includes('mp4')) {
        return 'MP4 (H.264)';
      } else if (urlLower.includes('.avi') || urlLower.includes('avi')) {
        return 'AVI';
      } else if (urlLower.includes('.mkv') || urlLower.includes('mkv')) {
        return 'MKV';
      } else if (urlLower.includes('.mov') || urlLower.includes('mov')) {
        return 'MOV';
      } else if (urlLower.includes('.flv') || urlLower.includes('flv')) {
        return 'FLV';
      } else if (urlLower.includes('.3gp') || urlLower.includes('3gp')) {
        return '3GP';
      } else if (urlLower.includes('.wmv') || urlLower.includes('wmv')) {
        return 'WMV';
      } else if (urlLower.includes('.ts') || urlLower.includes('ts')) {
        return 'TS (MPEG-TS)';
      } else if (urlLower.includes('.ogv') || urlLower.includes('ogv')) {
        return 'OGV (Ogg Video)';
      } else if (urlLower.includes('.m4v') || urlLower.includes('m4v')) {
        return 'M4V';
      } else if (urlLower.includes('.m3u8') || urlLower.includes('m3u8')) {
        return 'HLS/M3U8';
      } else {
        return '未知格式';
      }
    },
    
    // 判断是否应该使用原生播放器
    shouldUseNativePlayer(url) {
      const format = this.detectVideoFormat(url);
      // H265播放器主要支持H.265编码的MP4，其他格式可能需要原生播放器
      // 但为了测试，我们让H265播放器尝试处理所有格式
      if (url.includes('_h265.mp4')) {
        // H.265编码的MP4，优先使用H265播放器
        return false;
      }
      // 其他格式也让H265播放器尝试，如果失败会有错误提示
      return false;
    },
    
    // 加载视频
    loadVideo() {
      if (!this.videoUrl.trim()) {
        alert('请输入视频URL或选择本地测试视频格式');
        return;
      }
      
      this.url = this.videoUrl.trim();
      this.currentFormat = this.detectVideoFormat(this.url);
      
      console.log('Loading video:', this.url, 'Format:', this.currentFormat);
      
      // 同时加载两个播放器
      this.loadH265Player();
      this.loadComparisonPlayer();
    },
    
    // 加载示例视频
    loadExampleVideo(url) {
      this.videoUrl = url;
      this.loadVideo();
    },
    
    // 格式选择变化处理
    onFormatChange() {
      if (this.selectedFormat && this.videoFormats[this.selectedFormat]) {
        this.videoUrl = this.videoFormats[this.selectedFormat];
        this.loadVideo();
      }
    },
    
    // 加载原生播放器
    loadNativePlayer() {
      this.currentPlayerType = '浏览器原生播放器';
      this.isPlaying = false;
      this.currentTime = "00:00:00";
      this.totalTime = "00:00:00";
      
      // 清理h265播放器实例
      if (this.instance) {
        try {
          this.instance.release();
        } catch (e) {
          console.warn('Error destroying h265 player:', e);
        }
        this.instance = null;
      }
      
      this.$nextTick(() => {
        const video = this.$refs.nativeVideo;
        if (video) {
          video.src = this.url;
          video.volume = this.volume / 100;
          
          // 添加错误处理
          video.onerror = (e) => {
            console.error('视频加载失败:', e);
            alert('视频加载失败，可能是网络问题或视频格式不支持。请尝试其他视频URL。');
          };
          
          // 尝试加载视频
          video.load();
        }
      });
    },
    
    // 加载H265播放器
    loadH265Player() {
      this.currentPlayerType = 'H265Web.js播放器';
      this.isPlaying = false;
      this.currentTime = "00:00:00";
      this.totalTime = "00:00:00";
      
      // 清理原生播放器
      const video = this.$refs.nativeVideo;
      if (video) {
        video.pause();
        video.src = '';
      }
      
      try {
        // 清理旧的播放器实例
        if (this.instance) {
          this.instance.release();
        }
        
        const player = new Player();
        player.init(this.url);
        if (player.instance) {
          this.instance = player.instance;
          this.setupPlayerEvents();
          this.instance.do();
        } else {
          console.error('Failed to initialize player instance');
          alert('播放器初始化失败，请检查视频URL或格式');
        }
      } catch (error) {
        console.error('Error initializing player:', error);
        alert('播放器加载失败: ' + error.message);
      }
    },
    
    // 加载对比播放器
    loadComparisonPlayer() {
      this.$nextTick(() => {
        const video = this.$refs.comparisonVideo;
        if (video) {
          video.src = this.url;
          video.volume = this.volume / 100;
          
          // 添加错误处理
          video.onerror = (e) => {
            console.error('对比视频加载失败:', e);
          };
          
          // 尝试加载视频
          video.load();
        }
      });
    },
    
    // 原生播放器事件处理
    onNativeLoadedMetadata() {
      const video = this.$refs.nativeVideo;
      if (video) {
        this.totalTime = this.durationText(video.duration);
      }
    },
    
    onNativeTimeUpdate() {
      const video = this.$refs.nativeVideo;
      if (video) {
        this.currentTime = this.durationText(video.currentTime);
        
        // 更新进度条
        const progressContainer = document.querySelector('#progress-container');
        const progressPts = document.querySelector('#progressPts');
        
        if (progressContainer && progressPts && video.duration) {
          const percent = video.currentTime / video.duration;
          const progWidth = percent * this.progressContainerWidth;
          progressPts.style.width = progWidth + 'px';
        }
      }
    },
    
    onNativeEnded() {
      this.isPlaying = false;
    },
    
    onNativePlay() {
      this.isPlaying = true;
    },
    
    onNativePause() {
      this.isPlaying = false;
    },
    
    // 对比播放器事件处理
    onComparisonLoadedMetadata() {
      const video = this.$refs.comparisonVideo;
      if (video) {
        this.comparisonTotalTime = this.durationText(video.duration);
      }
    },
    
    onComparisonTimeUpdate() {
      const video = this.$refs.comparisonVideo;
      if (video) {
        this.comparisonCurrentTime = this.durationText(video.currentTime);
      }
    },
    
    onComparisonEnded() {
      this.comparisonIsPlaying = false;
    },
    
    onComparisonPlay() {
      this.comparisonIsPlaying = true;
    },
    
    onComparisonPause() {
      this.comparisonIsPlaying = false;
    },
  },
};
</script>

<style scoped>
.header-line {
  height: 30px;
}

/* 输入框容器样式 */
.input-container {
  margin: 20px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.input-container label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.url-input {
  width: 70%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 10px;
}

.url-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.load-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.load-btn:hover {
  background: #0056b3;
}

.format-info {
  margin-top: 10px;
  padding: 8px 12px;
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 4px;
  font-size: 13px;
  color: #0066cc;
}

.example-links {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
}

.example-links h4 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 16px;
}

.link-group {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.link-label {
  font-weight: 500;
  color: #6c757d;
  min-width: 80px;
}

.example-btn {
  padding: 4px 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.example-btn:hover {
  background-color: #0056b3;
}

ul {
  margin: 0;
  padding: 0;
}
ul li {
  list-style-type: none;
  padding: 5px 0;
}
ul li a {
  text-decoration: none;
}

.players-comparison {
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.player-section {
  flex: 1;
  min-width: 0;
}

.player-title {
  text-align: center;
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

.player-container {
  width: 100%;
  height: 540px;
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.glplayer {
  width: 100%;
  height: 100%;
}

.native-player {
  width: 100%;
  height: 100%;
  background: #000;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .players-comparison {
    flex-direction: column;
    max-width: 800px;
  }
  
  .player-container {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .player-container {
    height: 300px;
  }
  
  .player-title {
    font-size: 14px;
  }
}

.controller {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.player-container:hover .controller {
  opacity: 1;
}

/* 进度条样式 */
.progress-common {
  height: 6px;
  border-radius: 3px;
  border: none;
}

.progress-container {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
}

.cachePts {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 1;
}

.progressPts {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  background-color: #ff4444;
  z-index: 2;
}

/* 控制器样式 */
.operate-container {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
}

.player__button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.player__button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.ptsLabel {
  font-size: 14px;
  min-width: 120px;
}

.voice-div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mute-btn {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  outline: none;
  border-radius: 2px;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #ff4444;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #ff4444;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.fullscreen-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

/* 格式选择器样式 */
.format-selector {
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.format-selector label {
  font-weight: bold;
  color: #333;
  min-width: 100px;
}

.format-select {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 200px;
}

.format-select:hover {
  border-color: #007bff;
}

.format-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}
</style>
