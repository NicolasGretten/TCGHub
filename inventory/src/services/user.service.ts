import {IUser, User, UserCard} from "../type/user";

export class UserService {
    private static instance: UserService;

    private constructor() {}

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async getUserInventory(globalId: string) {
        const user = await User.aggregate([
            {
                $match: {globalId: globalId}
            },
            {
                $unwind: "$cards"
            },
            {
                $lookup: {
                    from: "cards",
                    localField: "cards.cardId",
                    foreignField: "_id",
                    as: "cardDetails"
                }
            },
            {
                $unwind: "$cardDetails"
            },
            {
                $group: {
                    _id: "$_id",
                    globalId: {$first: "$globalId"},
                    cards: {
                        $push: {
                            cardId: "$cards.cardId",
                            _id: "$cards._id",
                            details: "$cardDetails"
                        }
                    }
                }
            }
        ]);

        return user[0]?.cards || [];
    }

    public async createUserInventory(globalId: string) {
        const user = new User({
            globalId,
            cards: []
        });

        await user.save();

        return user;
    }

    public async addCard(user: string, card: UserCard): Promise<IUser | null> {
        const updatedUser = await User.findOneAndUpdate({globalId: user}, {$addToSet: {cards: card ? [card] : []}}, {upsert: true});
        if (!updatedUser) {
            return null;
        }
        const userObj = updatedUser.toObject();
        return {
            globalId: userObj.globalId,
            cards: userObj.cards.map(c => c.cardId?.toString() || '')
        } as IUser;
    }
}