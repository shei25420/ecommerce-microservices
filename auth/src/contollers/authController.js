const AuthService = require('../services/authService');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async login (req, res) {
        const { username, password } = req.body;
        const result = await this.authService.login(username, password);
        if (result.success) {
            res.json({ token: result.token });
        } else {
            res.status(400).json({
                message: result.message
            });
        }
    }

    async register (req, res) {
        const user = req.body;

        try {
            const existingUser = await this.authService.findUserByUsername(user.username);
            if (!existingUser) {
                throw new Error("Username already taken");
            }
            const result = await this.authService.register(user);
            res.json(result);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async getProfile (req, res) {
        const userId = req.params.id;
        try {
            const user = await this.authService.findUserById(userId);
            res.json(user);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

module.exports = AuthController;