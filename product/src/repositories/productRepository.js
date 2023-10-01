const productModel = require('../models/product');

class ProductRepository {
    async create(product) {
        const createdProduct = await productModel.create(product);
        return createdProduct.toObject();
    }

    async findById(productId) {
        return (await productModel.findById(productId).lean());
    }

    async findAll () {
        return (await productModel.find().lean());
    }

};

module.exports = ProductRepository;