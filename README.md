# <p align = "center"> Valex </p>

<p align="center">
   <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu03_1UQe4VVpkdgjZt54GEsmy_cBbd6K6Xg&usqp=CAU"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-SergioTrajano-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/SergioTrajano/Valex?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Descrição

Está é uma API de cartões de benefícios. A API é responsável pela criação, recarga, ativação e o processamento das compras.

***

## :computer:	 Tecnologias e Conceitos

- REST APIs
- Node.js
- TypeScript
- PostgreSQL
- Express
- Bcrypt e Cryptr

***

# Rotas de criação e gerenciamento de cartões:

## Rota <span style="color:yellow"> **POST** </span>/cards

Essa é uma rota autenticada com um header http do tipo "x-api-key". Sua função é criar novos cartões para os funcionários.

O Body da requisição deve ser feito no seguinte formato:

```json
{
	"employeeId": "id_do_funcionario", //number
	"cardType": "tipo_do_cartão" //'groceries', 'restaurants', 'transport', 'education', 'health'
}
```

## Rota <span style="color:yellow"> **POST** </span>/virtualCards

Essa é uma rota não autenticada. Sua função é criar cartões virtuais vinculados aos cartões materiais para os funcionários.

O Body da requisição deve ser feito no seguinte formato:

```json
{
	"id": "id_do_cartão", //number
	"password": "senha_do_cartão" //string
}
```

## Rota <span style="color:orange"> **PATCH** </span>/cards/activation

Essa é uma rota não autenticada. Sua função é ativar os cartões criados. Cartões virtuais não podem ser ativados.

O Body da requisição deve ser feito no seguinte formato:

```json
{
  "id": "id_do_cartão", //number
  "securityCode": "cvc_do_cartao", //string
  "password": "senha_escolhida" //string
}
```

## Rota <span style="color:green"> **GET** </span>/cards/:cardId

Essa é uma rota não autenticada. Sua função é verificar o extrato dos cartões.

O "cardId" passado na rota é o id do cartão criado.

A resposta da requisição virá no seguinte formato:

```json
"balance": 35000,
  "transactions": [
		{ "id": 1, "cardId": 1, "businessId": 1, "businessName": "DrivenEats", "timestamp": "22/01/2022", "amount": 5000 }
	]
  "recharges": [
		{ "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 }
	]
```

## Rotas <span style="color:orange"> **PATCH** </span>/cards/block e /cards/unblock

Rotas não autenticadas, mesmo funcionamento, com o intuito de permitir ao usuário respectivamente bloquear e desbloquear um cartão.

O Body da requisição deve ser feito no seguinte formato:

```json
{
  "id": "id_do_cartão", //number
  "password": "senha_do_cartão" //string
}
```

## Rota <span style="color:yellow"> **DELETE** </span>/virtualCards

Essa é uma rota não autenticada. Sua função é deletar cartões virtuais.

O Body da requisição deve ser feito no seguinte formato:

```json
{
	"id": "id_do_cartão_virtual", //number
	"password": "senha_do_cartão" //string
}
```

# Rota de recarga:

## Rota <span style="color:yellow"> **POST** </span>/recharges

Essa é uma rota autenticada com um header http do tipo "x-api-key" com o identificador da empresa. Sua função é recarregar os cartões para os funcionários. Cartões virtuais não podem ser recarregados.

O Body da requisição deve ser feito no seguinte formato:

```json
{
  "id": "id_do_cartão", //number
  "amount": "valor_escolhido" //number
}
```
# Rotas de compra e compra online:

## Rota <span style="color:yellow"> **POST** </span>/purchases

Essa é uma rota não autenticada. Sua função é permitir aos funcionários fazerem compras POS (maquininha) em estabelecimentos **do mesmo tipo** de seus cartões. Cartões virtuais não podem fazer compras POS.

```json
{
  "cardId": "id_do_cartão", //number
  "password": "senha_do_cartão", //string
  "businessId": "id_do_estabelecimento", //number
  "amount": "valor_da_compra" //number
}
```

## Rota <span style="color:yellow"> **POST** </span>/purchases/online

Essa é uma rota não autenticada. Sua função é permitir aos funcionários fazerem compras onlines em estabelecimentos **do mesmo tipo** de seus cartões.

```json
{
  "number": "número do cartão", //string
  "name": "nome do dono do cartão", //string
  "securityCode": "cvc_do_cartao", //string
  "businessId": "id_do_estabelecimento", //number
  "amount": "valor_da_compra" //number
}
```

***

## 🏁 Rodando a aplicação

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/SergioTrajano/Valex
```

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Finalizado o processo, é só inicializar o servidor
```
npm start
```
