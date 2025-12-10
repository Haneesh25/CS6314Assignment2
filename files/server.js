const express = require("express");
const cors = require("cors"); 
const fs = require("fs");
const path = require("path");
const app = express();

app.use(cors()); 
app.use(express.static("public"));
app.use(express.json());

// Handle POST request from contact.js
app.post("/save-contact", (req, res) => {
    const dataFile = path.join(__dirname, "contacts.json");
    const newEntry = req.body;

    fs.readFile(dataFile, "utf8", (err, content) => {
        let contacts = [];
        if (!err && content) {
            contacts = JSON.parse(content);
        }
        contacts.push(newEntry);

        fs.writeFile(dataFile, JSON.stringify(contacts, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.json({ success: false });
            }
            res.json({ success: true });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
