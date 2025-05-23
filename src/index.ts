import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import fastifyFormbody from '@fastify/formbody';
import machines from './proxmoxCollector.js';

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
    title: 'Proxmox',
    machines: machines
  });
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
