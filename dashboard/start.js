require('dotenv').config({ path: '../.env' });

const { exec } = require('child_process');

console.log("Loaded ENV Variable:", process.env.REACT_APP_BACKEND_URL); // Debugging

exec('react-scripts start', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(stdout);
});
