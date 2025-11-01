<p align="center">
	<a href="https://stremio.com/">
		<img src="https://github.com/REVENGE977/stremio-enhanced/raw/main/images/icon.ico" alt="Stremio Enhanced Icon">
	</a>
	<h1 align="center">Stremio Enhanced</h1>
	<h5 align="center">This is a community project and is <b>NOT</b> affiliated with Stremio in any way.</h5>
	<p align="center">
		<a href="https://github.com/REVENGE977/stremio-enhanced/releases/latest">
			<img alt="GitHub Downloads (all assets, all releases)" src="https://img.shields.io/github/downloads/REVENGE977/stremio-enhanced/total?style=for-the-badge&color=%237B5BF5">
		</a>
		<a href="https://github.com/REVENGE977/stremio-enhanced/stargazers">
			<img src="https://img.shields.io/github/stars/REVENGE977/stremio-enhanced.svg?style=for-the-badge&color=%237B5BF5" alt="stargazers">
		</a>
		<a href="https://github.com/REVENGE977/stremio-enhanced/releases/latest">
			<img src="https://img.shields.io/github/v/release/REVENGE977/stremio-enhanced?label=Latest%20Release&style=for-the-badge&color=%237B5BF5" alt="Latest Version">
		</a>
		<br>
		<a href="https://nodejs.org/">
			<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS">
		</a>
		<a href="https://www.typescriptlang.org/">
			<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
		</a>
		<a href="https://www.electronjs.org/">
			<img src="https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white" alt="Electron">
		</a>
		<a href="https://developer.mozilla.org/en-US/docs/Web/HTML">
			<img src="https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white" alt="HTML">
		</a>
		<a href="https://developer.mozilla.org/en-US/docs/Web/CSS">
			<img src="https://img.shields.io/badge/CSS-2965F1?&style=for-the-badge&logo=css3&logoColor=white" alt="CSS">
		</a>
	</p>
</p>

## 📌 Table of Contents
- [📌 Table of Contents](#-table-of-contents)
- [❓ What is Stremio Enhanced?](#-what-is-stremio-enhanced)
	- [🛠 How It Works](#-how-it-works)
	- [✨ Features](#-features)
- [📥 Downloads](#-downloads)
- [⚙️ Build From Source](#️-build-from-source)
- [🎨 Themes and Plugins](#-themes-and-plugins)
	- [🖌️ Installing Themes](#️-installing-themes)
	- [🛠️ Installing Plugins](#️-installing-plugins)
	- [🌐 Community Plugins \& Themes](#-community-plugins--themes)
- [❓ What Is the Difference Between Plugins and Addons?](#-what-is-the-difference-between-plugins-and-addons)
- [📜 Creating Your Own Plugin](#-creating-your-own-plugin)
- [🎨 Creating Your Own Theme](#-creating-your-own-theme)
- [🐛 Known Issues](#-known-issues)
- [📃 Todo List](#-todo-list)
- [🔗 Discord Server](#-discord-server)
- [⭐ Support the Project](#-support-the-project)
- [📊 Repository Stats](#-repository-stats)
- [🚨 Important Notice](#-important-notice)

## ❓ What is Stremio Enhanced?

Stremio Enhanced is an Electron-based [Stremio](https://www.stremio.com/) client with support for plugins and themes. It enhances the default Stremio experience by adding more customization options and integrations.  

### 🛠 How It Works  
- It runs the Stremio streaming server automatically in the background.
- It loads [the web version of Stremio](https://web.stremio.com) within an Electron environment.

### ✨ Features  
- **Themes** – Customize the look and feel of Stremio with different themes to match your style.  
  - Example: **AMOLED Theme** – A pitch black theme.  
    ![blacktheme](https://github.com/REVENGE977/stremio-enhanced/raw/main/images/amoled_screenshot.png)  
    *(This theme can be found in [StremioAmoledTheme](https://github.com/REVENGE977/StremioAmoledTheme).)*  

- **Plugins** – Extend Stremio’s functionality with JavaScript plugins for more features.
  - Example: **AniSkip Integration** – A plugin to integrate [AniSkip](https://github.com/aniskip) to autoskip anime openings and endings.
   ![aniskip](./images/aniskipplugin.png)
   *(This plugin is still under testing but can be found in [stremio-aniskip](https://github.com/REVENGE977/stremio-aniskip).)*

- **Built-in Toggleable Discord Rich Presence** – Show what you're watching on Discord with an easy-to-toggle Rich Presence feature.  
  ![discordpresence](./images/discordrichpresence.png)   


## 📥 Downloads
You can download the latest version from [the releases tab](https://github.com/REVENGE977/stremio-enhanced/releases). If you're on Windows, you can download the stremio service bundled build so you don't have to download and install Stremio Service separately.

## ⚙️ Build From Source
1. Clone the repository: `git clone https://github.com/REVENGE977/stremio-enhanced.git`
2. Navigate to the project directory: `cd stremio-enhanced`
3. Install dependencies: `npm install`
4. Compile TypeScript: `npm run dist`
5. Build the project with electron-builder: 
    - For Windows: `npm run build:win`
    - For Linux (x64): `npm run build:linux:x64`
    - For Linux (arm64): `npm run build:linux:arm64`
    - For macOS (x86): `npm run build:mac:x64`
    - For macOS (arm64): `npm run build:mac:arm64`

## 🎨 Themes and Plugins

### 🖌️ Installing Themes
1. Go to the settings and scroll down.
2. Click on the "OPEN THEMES FOLDER" button.
3. Move your theme into the opened folder.
4. Restart Stremio Enhanced.
5. You should see your theme in the settings with an option to apply it.

### 🛠️ Installing Plugins
1. Go to the settings and scroll down.
2. Click on the "OPEN PLUGINS FOLDER" button.
3. Move your plugin into the opened folder.
4. Restart Stremio Enhanced or reload using <kbd>Ctrl</kbd> + <kbd>R</kbd>
5. You should see your plugin in the settings with an option to enable it.

![settings_screenshot](https://github.com/REVENGE977/stremio-enhanced/raw/main/images/settings_screenshot.png)

### 🌐 Community Plugins & Themes
You can also use the new community tab.

1. Go to the settings and scroll down.
2. Click on "Community Plugins & Themes"
3. Here you can see and download the available submitted community-made themes and plugins.

![community_tab](./images/communitytab.png)

These plugins and themes are fetched from the [Stremio Enhanced Registry](https://github.com/REVENGE977/stremio-enhanced-registry) repository. If you're a developer you can submit your work there.

## ❓ What Is the Difference Between Plugins and Addons?
- **Addons** are available on the normal version of Stremio. They add catalogs and streams for Stremio.
- **Plugins** add more functionality to Stremio, like new features.

## 📜 Creating Your Own Plugin
Plugins are simply JavaScript files running on the client side. Create a JavaScript file with a `.plugin.js` extension and write your code as you would normally for the client side.

You are required to provide metadata for the plugin. Here is an example:

```js
/**
 * @name YourPluginNameHere
 * @description What does your plugin do?
 * @updateUrl your plugin's raw file URL for update checking. (Set this to 'none' if you don't want to provide one)
 * @version VersionHere (e.g., 1.0.0)
 * @author AuthorName
 */
```

## 🎨 Creating Your Own Theme
Create a file with a name ending in `.theme.css` and write your CSS modifications there. You can use the devtools (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>) to find an element's class name, etc.

*You are also required to provide metadata in your theme, in the same way as plugins.*

## 🐛 Known Issues
- Subtitles are not available for **some** streams that have embedded subs. This seems to be an issue with either [Stremio Web](https://web.stremio.com/) or Stremio Service, as it also occurs in the browser. Subtitles do work fine for **most** streams though.
- On macOS, you'll need to bypass Gatekeeper to run the app. This is because the app is not signed.

## 📃 Todo List
You can find the current list of tasks and planned features in the [todo.md](./todo.md) file.
You can suggest ideas and give feature requests by either creating a feature request issue or by contacting me in my Discord server below.

## 🔗 Discord Server
You can contact me on my Discord server to discuss anything related to my projects, whether it'd be features you'd like to see in this project or to share ideas for themes/plugins you'd like to see made.

[![Discord Server](https://dcbadge.limes.pink/api/server/https://discord.gg/jDsgcehrp7?theme=default-inverted&style=for-the-badge)](https://discord.gg/jDsgcehrp7)


## ⭐ Support the Project
Consider giving the project a ⭐ star on GitHub! Your support helps more people discover it and keeps me motivated to improve it.

If you'd like to go the extra mile, you can also support me by sponsoring the project. Every contribution, big or small, is truly appreciated!

[![Sponsor Me](https://img.shields.io/badge/Sponsor%20Me-%E2%9D%A4-red?style=for-the-badge)](https://github.com/sponsors/REVENGE977)

## 📊 Repository Stats

![Repo Stats](https://repobeats.axiom.co/api/embed/ffcb702620c8a5356a655a21e58442be5648de67.svg "Repobeats analytics image")

## 🚨 Important Notice
**This project is not affiliated in any way with Stremio.**

- **This project** is licensed under the MIT License.

<p align="center">💻 Developed with ❤️ by <a href="https://github.com/REVENGE977">REVENGE977</a> | 📜 Licensed under MIT</p>
