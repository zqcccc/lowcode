const { spawn } = require('child_process')

const d = spawn('docker buildx build --platform=linux/amd64,linux/arm64 -f ./Dockerfile -t 172232502/lowcode:0.0.1 -t 172232502/lowcode --push .', {
  shell: true,
  stdio: 'inherit'
})

// d.stdout.pipe(process.stdout)
// d.stderr.pipe(process.stderr)
// console.log(123)
