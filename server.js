require("dotenv").config();
const app = require("./api/index");
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Corner Shelf Pro running on http://localhost:${port}`));
