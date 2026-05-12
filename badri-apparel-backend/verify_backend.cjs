const http = require('http');

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/products',
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', body);
        process.exit(res.statusCode === 200 ? 0 : 1);
    });
});

req.on('error', (e) => {
    console.error('ERROR:', e.message);
    process.exit(1);
});

req.end();
