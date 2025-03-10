// checkEmulators.js
const { spawn } = require('child_process');

(async () => {
  const { default: isPortReachable } = await import('is-port-reachable');
  
  const firestoreRunning = await isPortReachable(8080, { host: 'localhost' });
  const authRunning = await isPortReachable(9099, { host: 'localhost' });
  
  const emulatorActive = firestoreRunning || authRunning;
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR = emulatorActive ? 'true' : 'false';
  
  console.log(`Emuladores ${emulatorActive ? 'detectados' : 'não detectados'}.`);
  
  spawn('next', ['dev'], { env: process.env, stdio: 'inherit' });
})();
