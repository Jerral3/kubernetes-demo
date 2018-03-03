import json
import pika
import time

with open('config.json', 'r') as f:
    cfg = json.load(f)

def word_in_file(path, word):
    with open(path, 'r') as file:
        content = file.read()

        if word in content:
            return True

        return False

def test_file(ch, method, properties, body):
    message = json.loads(body)

    word = message['word']
    path = message['filepath']

    result = word_in_file(path, word)

    res = json.dumps({'result': result})

    time.sleep(1)

    ch.basic_publish( exchange = '', routing_key = properties.reply_to, properties = pika.BasicProperties(correlation_id = properties.correlation_id), body = (res))


credentials = pika.PlainCredentials(cfg['user'], cfg['password'])
parameters  = pika.ConnectionParameters(cfg['host'], cfg['port'], '/', credentials, pika.channel.MAX_CHANNELS, pika.spec.FRAME_MAX_SIZE, 0)

connection = pika.BlockingConnection(parameters)
channel = connection.channel()
channel.queue_declare(queue = cfg['queue'], durable=True)

channel.basic_qos(prefetch_count = 0)
channel.basic_consume(test_file, queue = cfg['queue'])
channel.start_consuming()
