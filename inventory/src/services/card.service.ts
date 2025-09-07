import { Card, ICard } from "../type/card";

export class CardService {
    private static instance: CardService;

    private constructor() {
    }

    public static getInstance(): CardService {
        if (!CardService.instance) {
            CardService.instance = new CardService();
        }
        return CardService.instance;
    }

    public async findCard(oracle_id: string){
        return await Card.findOne({ oracle_id: oracle_id });
    }

    public async addCard(card: ICard){
        const newCard = new Card(card);
        return await newCard.save();
    }
}