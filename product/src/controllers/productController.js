const Product = require('../models/product');
const messageBroker = require('../utils/messageBroker');
const uuid = require('uuid');

class ProductController {
    constructor() {
        this.createOrder = this.createOrder.bind(this);
        this.ordersMap = new Map();
    }

    async createOrder (req, res, next) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const { ids } = req.body;
            const products = Product.find({ _id: { $in: ids } });

            const orderId = uuid.v5();
            this.ordersMap.set(orderId, {
                status: 'pending',
                products,
                userEmail: req.user.email
            });

            await messageBroker.publicMessage("orders", {
                products,
                userEmail: req.user.id,
                orderId
            });

            messageBroker.consumeMessage("products", (data) => {
                const orderData = JSON.parse(JSON.stringify(data));
                const { orderId } = orderData;
                const order = this.ordersMap.get(orderId);
                if (order) {
                    this.ordersMap.set(orderId, { ...order, ...orderData, status: 'completed' });
                    console.log('Updated Order:', order);
                }
            });

            //Long polling until order is complete
            let order = this.ordersMap.get(orderId);
            while (order.status !== 'completed') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                order = this.ordersMap.get(orderId);
            }

            return res.status(201).json(order);
        } catch (e) {
            res.status(500).json({ message: 'Server error' });
        }
    }
}