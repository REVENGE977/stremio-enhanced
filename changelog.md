## Update v0.3
- Now relies on [Stremio Service](https://github.com/Stremio/stremio-service) to run (if stremio service isn't installed it will guide the user to install it). This is means you will get a similar streaming experience to the official app.
- Checks if the installed version is the latest version or not. Startup checking can be disabled from the settings (not tested yet).
- Made a new plugin called "BetterEpisodesList." The idea is to add a new season option in shows that says "all." When the option is chosen, the plugin will take all of the episodes available in a show (except specials) and put them in one list for you, numbered as they are in one list. This is very useful for shows like One Piece, Where in other platforms the episodes are listed as they are in one season. This plugin brings that to Stremio. The plugin also adds a search bar for the user to search episodes, which is a feature apparent in [Stremio Web](https://web.stremio.com/).
- Now shows the list of plugins/themes in more details. It will show the details provided in the meta data (the first few comment lines). You can check examples/BetterEpisodesList.plugin.js.
- The source is a bit more organized now.
- Fixed the flag for --devtools. Now if the user launches stremio-enhanced with the flag --devtools it will open the F12 devtools on launch properly.
- Added the hotkey Ctrl+Shift+I to open the devtools.
- Added the flag --no-stremio-service for users who don't want to use stremio service and override the streaming server URL from the settings.
- Now sets the background to black on startup, so you don't get flashbanged on launch.

*Note: I've only tested the update on Windows.*

## Update v0.4
- Implemented a plugin/theme update checker.
- Added hotkeys for zooming in/out Ctrl+= and Ctrl+-.

*Note: I've only tested the update on Windows.*

## Update v0.5
- Added [Discord Rich Presence](https://github.com/discordjs/RPC) (disabled by default and can be toggled from the settings).
- Now uses [winston](https://www.npmjs.com/package/winston) for logging.
- Now kills [Stremio Service](https://github.com/Stremio/stremio-service) when the app is closed.

*Note: I've only tested the update on Windows.*

## Update v0.6
- I Made it so it doesn't rely on a webserver just to load themes anymore (I don't know why I had it working that way before tbh).
- Now, instead of having to copy the default theme css and modify it, you can just make a new file and put all of your CSS changes, making it easier to make and modify themes now.

*Note: I've only tested the update on Windows.*


## Update v0.7
- Fixed an issue where options in the settings menu that are part of the regular stremio were not working.
- Codebase improvements
#### knowns issues that have not been solved here:
- Not sure if this works on macOS or not. [Although the stremio service path detection issue shouldn't be there anymore](https://github.com/REVENGE977/stremio-enhanced-community/pull/16).
- Changing audio tracks isn't supported.
  
*Note: I've only tested the update on Windows. I do not have access to a mac at the moment*

## Update v0.7.1
This should've been part of v0.7 tbh, but I rushed the previous release for no reason.
- Better DiscordRPC implementation.
  - Now supports movies as well, not just shows like before.
  - Better rich presence looks. Now if available, it will show the poster of what you're watching instead of the stremio icon.
  - Supports other navbar tabs like browse and settings etc.
- Codebase improvements. Now StremioService-related things are in their own separate class under ./utils/StremioService.ts

**I am soon planning move on from https://app.strem.io/shell-v4.4/ and use https://web.stremio.com/ instead. It will take some work but it will fix the [multiple audio tracks issue](https://github.com/REVENGE977/stremio-enhanced-community/issues/3) and make this project more in-line with the newest features added to Stremio.**

*Note: I've only tested the update on Windows. I do not have access to a mac at the moment*

## Update v0.8
#### This is so far the closest experience to the official app while still having the functionality and customizability of plugins and themes!
- **Now uses [Stremio Web v5](https://web.stremio.com/) instead of [Stremio shell-v4.4](https://app.strem.io/shell-v4.4/). This means:**
  - Support for multiple audio tracks, allowing you to switch audio tracks as you would in the official app.
  - Subtitles menu is working more often than not now.
  - Access to the latest features, like the episode search bar.
- **Way faster launch time:** The [StremioService.isProcessRunning()](https://github.com/REVENGE977/stremio-enhanced-community/blob/main/src/utils/StremioService.ts#L81) method was previously taking too long to execute, which has now been resolved.
- **More consistent Discord Rich Presence.**
- **Stremio Service can now be placed in the same directory as the app:** You can now download the [.zip archive of Stremio Service](https://github.com/Stremio/stremio-service/releases/tag/v0.1.13), extract it in the same directory as Stremio Enhanced, and it should be recognized. Previously, Stremio Service had to be installed on your system using the setup file.
- **Better codebase:** Instead of embedding HTML/JS as strings in the source code, most HTML/JS components are now separate files inside ./src/components. This makes debugging and making changes much easier.
- **Improved logging:** Class names are now displayed in log messages.


**Notes:**
- This update has only been tested on Windows. I do not currently have access to a Mac but may create a macOS Virtual Machine for testing in the near future.
- Since this project now uses [Stremio Web v5](https://web.stremio.com/), this means most, if not all, previous themes and plugins are no longer compatible and will require an update. This is because in [Stremio Web v5](https://web.stremio.com/), the UI has different structure, classes and ids are different, etc. So far I've only updated [Amoled theme](https://github.com/REVENGE977/StremioAmoledTheme) and [SlashToSearch](https://github.com/REVENGE977/SlashToSearch) to work on this version. I'll work on updating [BetterEpisodeList](https://github.com/REVENGE977/BetterEpisodeList) soon.

## Update v0.9
- **Improved Discord Rich Presence:**
  - Now works even if you launch Stremio Enhanced first then you launch Discord.
  - Now shows the watching status type instead of playing if you're watching something.
- **Custom update modal:** Now displays a custom new update dialog that shows release notes on new updates.

## Update v0.9.1
This is just a small update to fix compatibility issues in Linux/macOS. 

- Changed file paths to use path.join for cross-platform compatibility.
- Improved the StremioService class to check for Flatpak installation.
- Fixed an issue where, on Linux, Stremio Enhanced attempted to use `process.env.APPDATA` to locate AppData, which doesn't exist on Linux and returned undefined instead. Now it will use the .config folder on Linux instead.
- Now correctly opens the file explorer on the operating system the user is using. Previously, clicking "OPEN THEMES FOLDER" or "OPEN PLUGINS FOLDER" in the settings menu had no effect on non-Windows systems.

Just like the latest release, I'm providing stremio-service bundled builds but this time also for macOS (x64) and Linux.

This is what I tested:
- On Linux, I Installed Stremio Service using [Flatpak](https://flathub.org/apps/com.stremio.Service). & also tested the service bundled build.
- On macOS (x86, Intel), I installed Stremio Service using StremioService.dmg [from here](https://dl.strem.io/stremio-service/v0.1.13/StremioService.dmg).
- On Windows, I tested both the service-bundled build and the regular build.

Soon, I'll transition from using Electron Packager to Electron Builder, which will fix some cross-platform compatibility issues.

**Note:** The macOS arm build may not work (you can run directly from source until the issue is fixed). The x86 is tested and should work.

[Also, the stremio-aniskip plugin is out. Give it a try!](https://github.com/REVENGE977/stremio-aniskip)

## Update v0.9.1+repack
This is just a small update to fix compatibility issues in Linux/macOS. 

- Changed file paths to use path.join for cross-platform compatibility.
- Improved the StremioService class to check for Flatpak installation.
- Fixed an issue where, on Linux, Stremio Enhanced attempted to use `process.env.APPDATA` to locate AppData, which doesn't exist on Linux and returned undefined instead. Now it will use the .config folder on Linux instead.
- Now correctly opens the file explorer on the operating system the user is using. Previously, clicking "OPEN THEMES FOLDER" or "OPEN PLUGINS FOLDER" in the settings menu had no effect on non-Windows systems.
- Transitioned to using electron-builder instead of electron-packager.
- Implemented GitHub Actions workflow for automated project building.

This is what I tested:
- On Linux, I Installed Stremio Service using [Flatpak](https://flathub.org/apps/com.stremio.Service). & also tested the service bundled build.
- On macOS (x86, Intel), I installed Stremio Service using StremioService.dmg [from here](https://dl.strem.io/stremio-service/v0.1.13/StremioService.dmg).
- On Windows, I tested both the service-bundled build and the regular build.

[Also, the stremio-aniskip plugin is out. Give it a try!](https://github.com/REVENGE977/stremio-aniskip)

**The app isn't signed so if you're on macOS you'll have to bypass Gatekeeper.**

You should right-click the app and choose “Open” for first time you open the app (instead of double clicking) or run on terminal this command:

```sh
xattr -cr /path/to/Stremio.Enhanced.app
```

or if that doesn't work try this:
```sh
xattr -d com.apple.quarantine /path/to/Stremio.Enhanced.app
```

## Update v0.9.2
- Updated classes names to make Enhanced compatible with the latest [Stremio Web](https://web.stremio.com/) version.
- Updated Electron to 36.2.0 from 28.1.4. 
  - This fixes an issue where the right click menu in devtools doesn't show on top of the window.
  - This also sets the possibility to add support for transparent themes for future updates.

## Update v1.0
- **Stremio Service no longer needed**: 
  - Now Enhanced run a Stremio streaming server in the background without needing Stremio Service. 
  - It uses a more recent version of the streaming server which should fix some playback issues. The latest available release of Stremio Service used version 4.20.8 whereas Enhanced now use 4.20.11 built-in.
  - This should also fix issues related to needing Stremio Service, such as [Playback stops working every few episodes](https://github.com/REVENGE977/stremio-enhanced/issues/33) (at least from my testing it did, if you still encounter this issue, feel free to inform me).
  - Enhanced stores Stremio’s streaming server logs in a stremio-server.log file located in its application data directory (`~/.config/stremio-enhanced` on Linux, `~/Library/Application Support/stremio-enhanced` on macOS, and `%appdata%/stremio-enhanced` on Windows).
- **Improved Discord Rich Presence**: 
  - Now if you resume playback from the home page directly, it will also update status on Discord and show what you're watching.
- **Explore and try community-made plugins & themes from the app**: 
  - You can now go to the settings menu and click on the "Community Plugins & Themes" button to easily explore and download available themes and plugins for Stremio Enhanced (not many available right now). 
  - The themes and plugins are fetched from [Stremio Enhanced Registry](https://github.com/REVENGE977/stremio-enhanced-registry/). If you're a developer you can submit your work there.
- **Added support for transparent themes**: 
  - There is a new toggle option in the settings menu. When enabled it will use the transparent flag in Electron to allow transparent themes. 
  - Enabling this option might affect performance and a restart is required after enabling it.
- **No longer uses OpenGL on macOS**: 
  - In the previous version, Enhanced used OpenGL for all platforms (this is done to fix an issue where the audio tracks menu in the video player is unavailable). 
  - Enhanced now uses OpenGL on Windows/Linux but not macOS, since OpenGL is not well optimized on macOS and caused performance issues.
  
  *Note: I don't have a mac so I'm not sure if this will introduce more issues. Feel free to report any issues you encounter.*
- **Updated Electron to 37**:
  - [Electron 36 on Linux experienced conflicts between GTK 2/3 and GTK 4 libraries](https://github.com/REVENGE977/stremio-enhanced/issues/37). This should fix that issue.

**As always the app isn't signed so if you're on macOS you'll have to bypass Gatekeeper. Signing would cost me 99 USD per year..**

To bypass, you should right-click the app and choose “Open” for first time you open the app (instead of double clicking) or run this command in terminal:

```sh
xattr -cr /path/to/Stremio.Enhanced.app
```

or if that doesn't work try this:
```sh
xattr -d com.apple.quarantine /path/to/Stremio.Enhanced.app
```

*I've only tested this version on Windows and Linux. I don't have a mac and macOS VMs suck.*