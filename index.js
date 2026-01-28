const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to read JSON body
app.use(express.json());

const dataFile = path.join(__dirname, "data.json");

/**
 * GET /kgl/procurement
 * Read data from data.json and return it
 */
app.get("/kgl/procurement", (req, res) => {
  try {
    // If file does not exist, return empty array
    if (!fs.existsSync(dataFile)) {
      return res.status(200).json([]);
    }

    const fileData = fs.readFileSync(dataFile, "utf8");
    const records = fileData ? JSON.parse(fileData) : [];

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error reading data" });
  }
});

/**
 * POST /kgl/procurement
 * Add new procurement record
 */
app.post("/kgl/procurement", (req, res) => {
  try {
    const { produceName, tonnage, cost } = req.body;

    if (!produceName || !tonnage || !cost) {
      return res.status(400).json({ message: "Invalid data" });
    }

    let records = [];

    if (fs.existsSync(dataFile)) {
      const fileData = fs.readFileSync(dataFile, "utf8");
      records = fileData ? JSON.parse(fileData) : [];
    }

    const newRecord = {
      produceName,
      tonnage,
      cost,
    };

    records.push(newRecord);

    fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));

    res.status(201).json({ message: "Procurement added successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid JSON or server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
