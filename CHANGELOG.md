# RoboBananaFrontend Changelog
## 2024.05.04
### Additions and Fixes
- Added more realistic physics to emote popups (old implementation still exists but is not used)
- Deactivated old emote zones (left, right, top, bottom)
- Added new emote popup zone (special) where special emote popup animations are displayed.
- Special animation is triggered when a streamdeck event happens (works in tandem with new point redemtions in [RoboNana](https://github.com/crscillitoe/RoboBanana/pull/155))
- Special animation is triggered when the same emote is sent to chat often enough in 30 seconds (will be removed or adjusted depending on how it turns out in stream)
- General changes to the emote popup coding
- by [Tiranthine](https://github.com/Tiranthine)
- [PR #46](https://github.com/crscillitoe/RoboBananaFrontend/pull/46)

## 2024.04.28
### Additions and Fixes
- Added a multi move option for pokemon playMove, allowing to move multiple spaces with a single command - by [ValpsZ](https://github.com/ValpsZ) - [PR #39](https://github.com/crscillitoe/RoboBananaFrontend/pull/39) & [PR #42](https://github.com/crscillitoe/RoboBananaFrontend/pull/42)
- Fixed a chat issue where a twitch chat message with a very long username pushed the twitch icon too far to the right - by [Tiranthine](https://github.com/Tiranthine) - [PR #44](https://github.com/crscillitoe/RoboBananaFrontend/pull/44)
- Also removed the ':' between message name and twitch icon for twitch messages

## 2024.04.23-26
### Additions and Fixes:
- Improve features of chat TTS mode, including a delay between TTS messages and restricting it to people with certain roles ([502673a...4eb5ddf](https://github.com/crscillitoe/RoboBananaFrontend/compare/df08d7f...4eb5ddf))
- Add functionality to have Overlay pass "Twitch plays Pokemon" commands to local game instance ([62615f2...1f482a4](https://github.com/crscillitoe/RoboBananaFrontend/compare/4eb5ddf...1f482a4))
- Improve custom theme loading to fill missing values from currently loaded theme instead of always using the default theme ([4b324e8](https://github.com/crscillitoe/RoboBananaFrontend/commit/4b324e88fead4f82ee3e3c412a74482e346374d5))

## 2024.04.22
### Additions and Fixes:
- Add full TTS mode, which can use any message that starts with "hooj" for TTS ([05cfefb...27e5b9e](https://github.com/crscillitoe/RoboBananaFrontend/compare/7f65afe...27e5b9e))
  
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
