const amqp = require('amqplib');

class MessageBroker {
    constructor() {
        this.channel = null;
    }

    async connect (){
        console.log(`Connecting to rabbit mq....`);

        setTimeout(async () => {
            try {
                const connection = await amqp.connect("amqp://rabbitmq:5672");
                this.channel = await connection.createChannel();
                await this.channel.assertQueue('products');
                console.log(`RabbitMQ Connected`);
            } catch (e) {
                console.error(`Failed to connect to rabbitmq: ${e.message}`);
            }
        }, 20000);
    }

    async publicMessage (queue, message) {
        if (!this.channel) {
            console.error('No rabbitmq channel available');
            return;
        }

        try {
            await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        } catch (e) {
            console.error(e);
        }
    }

    async consumeMessage (queue, callback) {
        if (!this.channel) {
            console.error('No rabbitmq channel available');
            return;
        }
        
        try {
            await this.channel.consume(queue, (message) => {
               const content = message.content.toString();
               const parsedContent = JSON.parse(content);
               callback(parsedContent);
               this.channel.ack(message);
            });
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = new MessageBroker();