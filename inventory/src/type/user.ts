import mongoose, {Schema} from 'mongoose';

export interface IUser {
    globalId: string;
    cards: string[];
}

export interface UserCard {
    cardId: string;
    quantity: number;
    price: number;
    language: string;
}

const userSchema = new mongoose.Schema({
    globalId: String,
    cards: [
        {
            cardId: { type: Schema.Types.ObjectId, ref: 'Card' },
            quantity: Number,
            price: Number,
            language: String
        },
    ],
});

export const User = mongoose.model('User', userSchema);
