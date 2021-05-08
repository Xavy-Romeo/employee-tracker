// require statements
const db = require('./db/connection');
const startup = require('./utils/startup');
const startPrompts = require('./utils/start_menu');

// Start DB connection then start app
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Database connected.');
    
    // load app logo
    startup();
    // wait 500 ms after logo to start app
    setTimeout(startPrompts, 500);
});
