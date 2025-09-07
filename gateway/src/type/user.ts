import mongoose, {Schema} from 'mongoose';

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    password: String,
});

export const User = mongoose.model('user', userSchema);
