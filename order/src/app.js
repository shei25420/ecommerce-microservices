const amqp = require('amqplib');
const Order = require('./models/order');
class OrdersService {
    async setupOrderConsumer () {
        console.log(`Connecting to RabbitMQ...`);

        setTimeout(async () => {
            try {
                const amqpServer = "amqp://rabbitmq:5672";
                const connection = await amqp.connect(amqpServer);
                console.log('Connecting to rabbitmq...');

                const channel = await connection.createChannel();
                await channel.assertQueue("orders");

                channel.consume("orders", async (data) => {
                   console.log("Consuming order service");
                   const { products, username, orderId } = JSON.parse(data.content);
                   const newOrder = new Order();

                });
            } catch (e) {
                console.error(`Failed to connect to rabbitmq: ${e.message}`);
            }
        }, 10000); //Add delay to wait for rabbitmq to start
    }
}