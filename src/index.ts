import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import fastifyFormbody from '@fastify/formbody';
import * as hosts from './collector.js';

const fastify = Fastify({
  logger: true
});

fastify.register(fastifyFormbody);

fastify.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
});

fastify.get('/', async function handler(request: FastifyRequest, reply: FastifyReply) {
  return reply.view('./src/public/home.ejs', {
    title: 'Homepage'
  });
});

fastify.get('/about', async function handler(request: FastifyRequest, reply: FastifyReply) {
  return reply.view('./src/public/about.ejs', {
    title: 'About',
    description: hosts.name1,
    testing: hosts.value1
  });
});

fastify.post('/about', (request: FastifyRequest, reply: FastifyReply) => {
  reply.redirect('/about');
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
