const localtunnel = require('localtunnel');

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ port: 3000 });
    console.log('');
    console.log('Your website is now available at:');
    console.log(tunnel.url);
    console.log('');
    console.log('Share this URL with others to access your website');
    console.log('Keep this window open to maintain the connection');
    console.log('');

    tunnel.on('close', () => {
      console.log('Tunnel was closed');
    });
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

startTunnel(); 