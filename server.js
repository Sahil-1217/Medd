// server.js - Starts your backend app reliably from root
const path = require('path');
const { spawn } = require('child_process');

// Resolve the full path to your app.js
const appPath = path.join(__dirname, 'backend', 'src', 'app.js');
console.log('Attempting to start server from:', appPath);

// Spawn the app.js process
const child = spawn('node', [appPath], { stdio: 'inherit' });

// Handle exit
child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
  process.exit(code);
});
