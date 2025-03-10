const db = require("./db");
const { v4: uuidv4 } = require("uuid");

const taskResolver = {
  Query: {
    task: async (_, { id }) => {
      try {
        const task = await db.get(id);
        return task ? JSON.parse(task) : null;
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de la tâche :", error);
        return null;
      }
    },
    tasks: async () => {
      try {
        const tasks = [];
        for await (const [key, value] of db.iterator()) {
          if (value && typeof value === "object" && value.id) {
            tasks.push(value);
          } else {
            console.warn(`⚠️ Donnée invalide détectée dans la DB pour la clé: ${key}`);
          }
        }
        return tasks;
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des tâches :", error);
        return [];
      }
    },
  },
  Mutation: {
    addTask: async (_, { title, description, completed, duration }) => {
      const id = uuidv4();
      const task = { id, title, description, completed, duration };

      try {
        await db.put(id, task);
        console.log("✅ Nouvelle tâche ajoutée :", task);
        return task;
      } catch (error) {
        console.error("❌ Erreur lors de l'ajout de la tâche :", error);
        return null;
      }
    },
    completeTask: async (_, { id }) => {
      try {
        const task = await db.get(id);
        if (task) {
          task.completed = true;
          await db.put(id, task);
          console.log(`✅ Tâche ${id} complétée.`);
          return task;
        } else {
          console.warn(`⚠️ Tâche avec ID ${id} introuvable.`);
          return null;
        }
      } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de la tâche :", error);
        return null;
      }
    },
    changeDescription: async (_, { id, description }) => {
      try {
        const task = await db.get(id);
        if (task) {
          task.description = description;
          await db.put(id, task);
          console.log(`✅ Description de la tâche ${id} modifiée.`);
          return task;
        } else {
          console.warn(`⚠️ Tâche avec ID ${id} introuvable.`);
          return null;
        }
      } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de la description :", error);
        return null;
      }
    },
    deleteTask: async (_, { id }) => {
      try {
        await db.del(id);
        console.log(`✅ Tâche ${id} supprimée.`);
        return true;
      } catch (error) {
        console.error("❌ Erreur lors de la suppression de la tâche :", error);
        return false;
      }
    },
  },
};

module.exports = taskResolver;
