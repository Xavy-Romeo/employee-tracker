const db = require('./db/connection');
const startup = require('./utils/startup');
const startPrompts = require('./utils/start_menu');

// Start DB connection then run inquirer
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Database connected.');
    
    startup();
    setTimeout(startPrompts, 500);
});
