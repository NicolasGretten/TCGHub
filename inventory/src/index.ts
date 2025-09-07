import express, { Request, Response } from 'express';
import cors from 'cors';
import amqp from 'amqplib';
import mongoose from 'mongoose';
import {startWorker} from "./worker";
import {Card, ICard} from "./type/card";
import { CardService } from './services/card.service';
import { UserService } from './services/user.service';

const app = express();
const port = 3001;

// Middleware pour parser le JSON du body
app.use(express.json());
app.use(cors())

app.use((req, res, next) => {
    // console.log(req.headers);
    // console.log(req.body);
    next();
});

const cardService = CardService.getInstance();
const userService = UserService.getInstance();

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/inventory')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// Route GET pour lancer le script
app.get('/health', async (req: Request, res: Response) => {
    res.status(200).json({ message: 'OK' });
});

// Route POST pour lancer le script
app.post('/api/cards/add', async (req: Request, res: Response) => {
    try {
        const card = req.body;
        const existingCard = await cardService.findCard(card.oracle_id);
        if (!existingCard) {
            const newCard = await cardService.addCard(card as ICard);

            await userService.addCard('1', {
                cardId: newCard._id.toString(),
                language: card.language,
                price: card.price,
                quantity: card.quantity
            })

        } else {
            await userService.addCard('1', {
                cardId: existingCard._id.toString(),
                language: card.language,
                price: card.price,
                quantity: card.quantity
            })
        }
        res.status(200).json({ card });
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue', error: error });
    }
});

// Route POST pour lancer le script
app.put('/api/cards/:id', async (req: Request, res: Response) => {
    try {
        const card = Card.findByIdAndUpdate(req.params.id, {...req.body});
        res.status(200).json({ card});
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue', error: error });
    }
});

app.get('/api/cards', async (req: Request, res: Response) => {
    try {
        res.status(200).json({ cards: await Card.find()});
    } catch (error) {
        console.error('Erreur lors de la mise en vente :', error);
        res.status(500).json({ message: 'Une erreur est survenue', error: error });
    }
});

app.post('/api/inventory', async (req: Request, res: Response) => {
    try {
        res.status(200).json({ userInventory: await userService.createUserInventory('1')});
    } catch (error) {
        console.error('Erreur lors de la mise en vente :', error);
        res.status(500).json({ message: 'Une erreur est survenue', error: error });
    }
});

app.get('/api/inventory', async (req: Request, res: Response) => {
    try {
        console.log(await userService.getUserInventory('1'))
        res.status(200).json({ cards: await userService.getUserInventory('1')});
    } catch (error) {
        console.error('Erreur lors de la mise en vente :', error);
        res.status(500).json({ message: 'Une erreur est survenue', error: error });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
//
// // Démarre le worker
// startWorker().catch((err) => {
//     console.error('❌ Worker failed:', err);
// });
