const fs = require('fs');

const html = fs.readFileSync('dist/conquista-oceanica/index.html', 'utf-8');
const schemaMatches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

for (const match of schemaMatches) {
    try {
        JSON.parse(match[1]);
        console.log("Valid");
    } catch (e) {
        console.log("Invalid!");
        console.log(match[1]);
        console.log(e.message);
    }
}
