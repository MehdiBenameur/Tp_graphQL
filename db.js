const { Level } = require("level");

// Initialisation de la base de données LevelDB avec encodage JSON
const db = new Level("tasksDB", { valueEncoding: "json" });

module.exports = db;
