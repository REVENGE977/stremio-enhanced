const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function chmodRecursive(dir) {
	for (const file of fs.readdirSync(dir)) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			chmodRecursive(fullPath);
		} else {
			fs.chmodSync(fullPath, 0o755); 
		}
	}
}

module.exports = async function (context) {
	const appOutDir = context.appOutDir;
	
	// Linux permissions fix
	const serverDir = path.join(appOutDir, 'stremingserver');
	if (fs.existsSync(serverDir)) {
		chmodRecursive(serverDir);
		console.log('Marked all binaries in streamingserver as executable.');
	}
	
	// macOS permissions fix
	if (context.packager.platform === 'darwin') {
		console.log('Applying macOS permissions fix...');
		const frameworksDir = path.join(appOutDir, 'Contents', 'Frameworks');
		if (fs.existsSync(frameworksDir)) {
			execSync(`find "${frameworksDir}" -type f -exec chmod +x {} \\;`);
			console.log('Marked all Frameworks binaries as executable.');
		}
		
		const macOSDir = path.join(appOutDir, 'Contents', 'MacOS');
		const mainExec = path.join(macOSDir, path.basename(appOutDir));
		if (fs.existsSync(mainExec)) {
			fs.chmodSync(mainExec, 0o755);
			console.log('Marked main executable as executable.');
		}
	}
};