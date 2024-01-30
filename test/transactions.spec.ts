import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
// execSync método que possibilita executar comandos no terminal no ambiente node
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Transctions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  // deve ser possível criar uma nova transação
  it('shuold be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transction',
        amount: 5000,
      }),
    ])
  })
})
/**
 * funções do método it
 * skip: não possará pelo teste
 * todo: como pendência ser alertado ao executar
 * only: roda somente o teste específico
 */

/**
 Um teste é composto por três partes essenciais: 
    a enunciação da proposição do teste, 
    a operação a ser realizada 
    e o processo de validação. 
A enunciação da proposição define claramente o que está sendo testado, estabelecendo as condições e expectativas. 
A operação refere-se à execução prática do teste, detalhando as ações a serem tomadas para avaliar o sistema. 
Por fim, o processo de validação verifica se os resultados obtidos estão em conformidade com as expectativas 
previamente estabelecidas, garantindo a eficácia e integridade do teste. 

Essa abordagem tripla proporciona uma estrutura robusta para a execução e avaliação eficaz dos testes em sistemas.

npx vitest
 */
