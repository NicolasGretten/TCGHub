import express, { Request, Response } from 'express';
import cors from 'cors';
import amqp from 'amqplib';
import mongoose from 'mongoose';

const app = express();
const port = 3001;

// Middleware pour parser le JSON du body
app.use(express.json());
app.use(cors())

app.use((req, res, next) => {
    console.log(req.headers);
    console.log(req.body);
    next();
});

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gateway')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Route GET pour lancer le script
app.get('/health', async (req: Request, res: Response) => {
    res.status(200).json({ message: 'OK' });
});

// Route POST pour lancer le script
app.post('/api/cards/add', async (req: Request, res: Response) => {
    try {
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue', error: error });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
