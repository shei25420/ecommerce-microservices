const UserModel = require('../models/user');

class UserRepository {
    async create (user) {
        return await UserModel.create(user);
    }
    async findByUsername (username) {
        const user = await UserModel.where('username', username).findOne().lean();
        return user;
    }

    async findById (id) {
        return (await UserModel.findById(id).lean());
    }
}

module.exports = UserRepository;