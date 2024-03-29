import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
// execSync método que possibilita executar comandos no terminal no ambiente node
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Transctions routes', () => {
  // método exedutado uma única vez antes de todos os testes do bloco de teste
  beforeAll(async () => {
    await app.ready()
  })
  // método executado depois de todos os testes no bloco de teste
  afterAll(async () => {
    await app.close()
  })

  // método é executado antes de cada teste no bloco de teste
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

  it('should be able to get a specific transaction', async () => {
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

    const transctionId = listTransactionResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transctionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
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
