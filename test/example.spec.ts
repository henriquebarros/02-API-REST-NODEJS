import { expect, test } from 'vitest'

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
test('o usuário consegue criar uma nova transação', () => {
  const responseStatusCode = 201

  expect(responseStatusCode).toEqual(201)
})
