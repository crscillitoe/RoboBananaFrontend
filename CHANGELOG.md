# RoboBananaFrontend Changelog
## 2024.04.06
### Additions and Fixes:
- Functionality to enable emote popup zones on startup (bottomEdgeMultiple for now) (https://github.com/crscillitoe/RoboBananaFrontend/pull/37) (By [Tiranthine](https://github.com/Tiranthine))
- Fixed bug where multiple emotes from different sources in the same message were displayed incorrrectly (https://github.com/crscillitoe/RoboBananaFrontend/pull/37) (By [Tiranthine](https://github.com/Tiranthine))

## 2024.04.04
### Additions and Fixes:
- Animation endpoint now supports images AND videos (https://github.com/crscillitoe/RoboBananaFrontend/pull/36) (By [Tiranthine](https://github.com/Tiranthine))
  - Objects only start playing after they are done loading
  - Duration parameter is now in MS
  - Content is no longer cached so animations restart
 
- New "bottomEdgeMultiple" zone for jumping emoji that multiplies emoji amount based on usage in last 10 seconds (https://github.com/crscillitoe/RoboBananaFrontend/pull/36) (By [Tiranthine](https://github.com/Tiranthine))

## 2024.04.03
### Additions and Fixes:
- Added progress bar to polls to display time left (https://github.com/crscillitoe/RoboBananaFrontend/pull/29)
- Added animation to spotify progress, making the progress bar smoother (https://github.com/crscillitoe/RoboBananaFrontend/pull/30)
- Added streamdeck endpoint to replay last/current T3 TTS message (https://github.com/crscillitoe/RoboBananaFrontend/pull/31)
- (Temporarily) rewrites sticker URLs of GIF stickers to media.discordapp.com instead of their CDN, as gif stickers are not available on the CDN at the moment for some reason (https://github.com/crscillitoe/RoboBananaFrontend/pull/35)
