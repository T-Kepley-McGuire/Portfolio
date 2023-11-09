const { PORT = 5001 } = process.env;

const app = require("./app");

app.listen(PORT, listener);

function listener() { 
    console.log(`Listening on Port ${PORT}!`);
}