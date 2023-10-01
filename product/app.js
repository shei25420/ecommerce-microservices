const ProductRepository = require('./repositories/productRepository');

class ProductsService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async createProduct (product) {
        const createdProduct = await this.productRepository.create(product);
        return createdProduct;
    }

    async getProductById (productId) {
        const product = await this.productRepository.findById(productId);
        return product;
    }

    async getProducts () {
        const products = await this.productRepository.findAll();
        return products;
    }
}

module.exports = ProductsService;
