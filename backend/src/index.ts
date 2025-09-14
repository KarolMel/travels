import express from 'express';
import { initDB } from './db';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

let db: any;

   


app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, password]
    );
    return res.status(201).json({ message: 'Användaren har registrerats' });
  } catch (error) {
    return res.status(400).json({ error: 'Registreringen misslyckades' });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.get(
      `SELECT id, username, email FROM users WHERE username = ? AND password = ?`,
      [username, password]
    );

    if(!user) {
      return res.status(401).json({ error: 'Ogiltigt användarnamn eller lösenord' });
    }
    
   
  


} catch (error) {
    return res.status(500).json({ error: 'Internt serverfel' });
  }
});



app.post('/travels', async (req, res) => {
  const { userId, title, date, budget, saved } = req.body;
  if (!userId || !title) {
    return res.status(400).json({ error: 'Saknas userId eller titel' });
  }
  try {
    const result = await db.run(
      `INSERT INTO travels (user_id, title, date, budget, saved) VALUES (?, ?, ?, ?, ?)`,
      [userId, title, date || null, budget || 0, saved || 0]
    );
    return res.status(201).json({ id: result.lastID, title, date });
  } catch (error) {
    return res.status(500).json({ error: 'Misslyckades med att lägga till resa' });
  }
});




app.get('/travels/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const travels = await db.all(
      `SELECT * FROM travels WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return res.status(200).json(travels);
  } catch (error) {
    return res.status(500).json({ error: 'Misslyckades med att hämta resor' });
  }
});



app.put('/travels/:id', async (req, res) => {
  const { id } = req.params;
  const { date, budget, saved } = req.body;
  try {
    const updates = [];
    const values = [];
    if (date !== undefined) {
      updates.push(`date = ?`);
      values.push(date);
    }
    if (budget !== undefined) {
      updates.push(`budget = ?`);
      values.push(budget);
    }
    if (saved !== undefined) {
      updates.push(`saved = ?`);
      values.push(saved);
    }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Inga fält att uppdatera' });
    }
    values.push(id);
    const result = await db.run(
      `UPDATE travels SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Resa hittades inte' });
    } else {
      return res.status(200).json({ message: 'Resa uppdaterad' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Misslyckades med att uppdatera resa' });
  }
});





app.post('/travels/:travelId/todos', async (req, res) => {
  const { travelId } = req.params;
  const { text } = req.body;
  try {
    const result = await db.run(
      `INSERT INTO todos (travel_id, text) VALUES (?, ?)`,
      [travelId, text]
    );
    res.status(201).json({ id: result.lastID, text, done: 0 });
  } catch (error) {
    res.status(500).json({ error: 'Misslyckades med att lägga till todo' });
  }
});



app.get('/travels/:travelId/todos', async (req, res) => {
  const { travelId } = req.params;
  try {
    const todos = await db.all(
      `SELECT * FROM todos WHERE travel_id = ? ORDER BY created_at DESC`,
      [travelId]
    );
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Misslyckades med att hämta todo' });
  }
});




app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  try {
    await db.run(
      `UPDATE todos SET done = ? WHERE id = ?`,
      [done ? 1 : 0, id]
    );
    res.status(200).json({ message: 'Todo uppdaterad' });
  } catch (error) {
    res.status(500).json({ error: 'Misslyckades med att uppdatera todo' });
  }
});








const PORT = 5000;
initDB().then((database) => {
  db = database;
  app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
  });
});


