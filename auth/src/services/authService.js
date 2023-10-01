const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/userRepository');

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async login (username, password) {
        const user = this.userRepository.findUserByUsername(username);
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return {
                success: false,
                message: 'Invalid username / password combination'
            };
        }
        return {
            success: true,
            token: 'jwt token',
            user
        };
    }

    async register (user) {
        user.password = await bcrypt.hash(user.password);
        return (await this.userRepository.create(user));
    }

    async findUserById (userId) {
        return (await this.userRepository.findById(userId));
    }

    async findUserByUsername (username) {
        return (await this.userRepository.findByUsername(username));
    }

}

module.exports = AuthService;