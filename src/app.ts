import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)
// método register para registrar um plugin que contém todas as rotas com o mesmo path
app.register(transactionsRoutes, {
  prefix: 'transactions',
})
