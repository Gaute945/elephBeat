import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import fastifyFormbody from '@fastify/formbody';
import { metrics } from './collector.js';

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

fastify.get('/proxmox', async function handler(request: FastifyRequest, reply: FastifyReply) {
  return reply.view('./src/public/proxmox.ejs', {
    title: 'Proxmox',
    metrics: Object.fromEntries(metrics)
  });
});

fastify.post('/proxmox', (request: FastifyRequest, reply: FastifyReply) => {
  reply.redirect('/proxmox');
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
