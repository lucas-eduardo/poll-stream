# NLW Expert (Node.js)

Bem-vindo ao Real-Time Polling System, um sistema de votação em tempo real onde os usuários podem criar enquetes e outros usuários podem votar. Este sistema foi construído com Node.js e utiliza WebSockets para atualizações em tempo real, PostgreSQL para armazenamento de dados e Redis para gerenciamento de estado de votação em tempo real.

## Tecnologias Utilizadas
- TypeScript
- PostgreSQL
- Redis
- WebSockets
- Drizzle ORM

## Requisitos

- Docker;
- Node.js;

## Configuração do Ambiente

- Clone o repositório;
- Instale as dependências com (`pnpm install`);
- nicialize os serviços do PostgreSQL e Redis com Docker usando (`docker compose up -d`);
- Copie o arquivo `.env.example` para `.env` e preencha com as suas variáveis de ambiente.
- Execute a migrate com (`pnpm migrate`)
- Execute a aplicação com (`pnpm run dev`);
- Teste a aplicação. Recomendamos o uso do [Hoppscotch](https://hoppscotch.io/) para testes de APIs.

## HTTP

### POST `/polls`

Criar uma nova enquete.

#### Request body

```json
{
  "title": "Qual a melhor linguagem de programação?",
  "options": [
    "JavaScript",
    "Java",
    "PHP",
    "C#"
  ]
}
```

#### Response body

```json
{
  "pollId": "194cef63-2ccf-46a3-aad1-aa94b2bc89b0"
}
```

### GET `/polls/:pollId`

Obter dados de uma enquete.

#### Response body

```json
{
	"poll": {
		"id": "e4365599-0205-4429-9808-ea1f94062a5f",
		"title": "Qual a melhor linguagem de programação?",
		"options": [
			{
				"id": "4af3fca1-91dc-4c2d-b6aa-897ad5042c84",
				"title": "JavaScript",
				"score": 1
			},
			{
				"id": "780b8e25-a40e-4301-ab32-77ebf8c79da8",
				"title": "Java",
				"score": 0
			},
			{
				"id": "539fa272-152b-478f-9f53-8472cddb7491",
				"title": "PHP",
				"score": 0
			},
			{
				"id": "ca1d4af3-347a-4d77-b08b-528b181fe80e",
				"title": "C#",
				"score": 0
			}
		]
	}
}
```

### POST `/polls/:pollId/votes`

Adicionar um voto a uma opção específica de enquete.

#### Request body

```json
{
  "pollOptionId": "31cca9dc-15da-44d4-ad7f-12b86610fe98"
}
```

## WebSockets

### ws `/polls/:pollId/results`

#### Message

```json
{
  "pollOptionId": "da9601cc-0b58-4395-8865-113cbdc42089",
  "votes": 2
}
```

## Créditos
- Desenvolvido durante o NLW Experts da Rocketseat.