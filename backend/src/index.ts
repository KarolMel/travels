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

    /*{ New Code tokens }*/
    const tokens: { [token: string]: { id: number; username: string} } = {};
    /*{ New Code tokens }*/


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
    
    /*{ New Code tokens }*/

    const token = uuidv4();
    const currentUser = { id: user.id, username: user.username};
    tokens[token] = currentUser;


    /*{ New Code tokens }*/
      return res.status(200).json({ message: 'Inloggning lyckades', token, user: currentUser });
  


} catch (error) {
    return res.status(500).json({ error: 'Internt serverfel' });
  }
});


/* {new code} */
/* Middleware för att autentisera användare baserat på token */

function authenticate(req: any, res: any, next: any) {
  const token = req.query.token;
  if(!token || !tokens[token]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = tokens[token];
  next();
}

app.get('/message', authenticate, (req: any, res) => {
  res.send(`Vällkomen ${req.user.username}`);
});

/* Middleware för att autentisera användare baserat på token */
/* {new code} */


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




/* New code START */

import { v4 as uuidv4 } from 'uuid';

interface City {
  id: string;
  name: string;
  population: number;
}


let cities = [
  { id: "5347da70-fef3-4e8f-ba49-e8010edba878", name: "Stockholm", population: 1372565 },
  { id: "4787e794-b3ac-4a63-bba0-03203f78e553", name: "Göteborg", population: 549839 },
  { id: "4bc43d96-3e84-4695-b777-365dbed33f89", name: "Malmö", population: 280415 },
  { id: "ec6b9039-9afb-4632-81aa-ff95338a011a", name: "Uppsala", population: 140454 },
  { id: "6f9eee1f-b582-4c84-95df-393e443a2cae", name: "Västerås", population: 110877 },
  { id: "27acb7a0-2b3d-441f-a556-bec0e430992a", name: "Örebro", population: 107038 },
  { id: "6745e3f4-636a-4ab7-8626-2311120c92c9", name: "Linköping", population: 104232 },
  { id: "a8a70019-9382-4215-a5b3-6278eb9232c3", name: "Helsingborg", population: 97122 },
  { id: "6fc1a491-3710-42f2-936d-e9bf9be4f915", name: "Jönköping", population: 89396 },
];


app.post('/cities', (req, res) => {
  const { name, population } = req.body;

  if (name === undefined || population === undefined) {
    return res.status(400).json({ error: 'Saknas namn eller population' });
  }

  if(name === '') {
    return res.status(400).json({ error: 'Stadsnamn kan inte vara tomt' });
  }

  const chechIfCityExists = cities.find(city => city.name.toLowerCase() === name.toLowerCase());

  if(chechIfCityExists) {
    return res.status(409).json({ error: 'Staden finns redan' });
  }

  if(typeof population !== 'number' || population < 0 || !Number.isInteger(population)) {
    return res.status(400).json({ error: 'Population måste vara ett icke-negativt heltal' });
  }

    if(typeof name !== 'string') {
    return res.status(400).json({ error: 'Namn måste vara en sträng' });
  }

    const nameRegex = /^[A-Za-zÅÄÖåäö\s]+$/;
      if (!nameRegex.test(name)) {
        return res.status(400).json({ error: 'Stadsnamn får bara innehålla bokstäver' });
      }

  const newCity: City = {
    id: uuidv4(),
    name,
    population
  };

  cities.push(newCity);
  res.status(201).json(newCity);
});


app.get('/cities', (req, res) => {
  res.json(cities);
})


app.put('/cities/:id', (req, res) => {
  const { id } = req.params;
  const { id: bodyId, name, population } = req.body;

  if(bodyId !== id) {
    return res.status(400).json({ error: 'ID i body och URL måste matcha' });
  }

  const cityIndex = cities.findIndex(city => city.id === id);
  if (cityIndex === -1) {
    return res.status(404).json({ error: 'Staden hittades inte' });
  }

  if(typeof name !== 'string') {
    return res.status(400).json({ error: 'Namn måste vara en sträng' });
  }

  if(typeof population !== 'number' || population < 0 || !Number.isInteger(population)) {
    return res.status(400).json({ error: 'Population måste vara ett icke-negativt heltal' });
  }

    if (name === undefined || population === undefined) {
    return res.status(400).json({ error: 'Saknas namn eller population' });
  }

  if(name.trim() === '') {
    return res.status(400).json({ error: 'Stadsnamn kan inte vara tomt' });
  }



  const nameRegex = /^[A-Za-zÅÄÖåäö\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ error: 'Stadsnamn får bara innehålla bokstäver' });
  }

  const chechIfCityExists = cities.find(city => city.name.toLowerCase() === name.toLowerCase() && city.id !== id);

  if(chechIfCityExists) {
    return res.status(409).json({ error: 'Staden finns redan' });
  }

  cities[cityIndex] = { id, name, population };
  res.json(cities[cityIndex]);
})


/* New code END */





const PORT = 5000;
initDB().then((database) => {
  db = database;
  app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
  });
});


