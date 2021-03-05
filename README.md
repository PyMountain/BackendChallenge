# BackendChallenge!!

API de demonstração destinada ao desafio técnico de backend da Delivery Much (e ao mercadinho do seu zé).



## Pré-requisitos de instalação

- [Git](https://git-scm.com/downloads) instalado e configurado na máquina.
- Docker ([Docker Desktop](https://www.docker.com/products/docker-desktop) ou [Docker Compose](https://docs.docker.com/compose/install/))
- [NodeJs](https://nodejs.org/en/download/)



## Instalação
Abra um prompt de comando, navegue até uma pasta desejada, e execute o seguinte comando:
```shell
$ git clone https://github.com/PyMountain/BackendChallenge.git
```

Para instalar os pacotes necessários, navegue para a pasta do projeto usando
```shell
$ cd BackendChallenge
```
e execute
```shell
$ npm install
```

## Executando o projeto
Para o serviço funcionar corretamente é necessário três coisas: uma instância do `mongodb`, um serviço de envio de mensagens do `RabbitMQ` e, é claro, a `API` do mercadinho do seu zé.



### Executando os serviços externos
Na raiz do projeto, nos diretórios `docker/mongo` e `docker/rabbitmq` existem arquivos de configuração (`docker-compose.yml`) 
das imagens do `mongodb` e do `RabbitMQ`, respectivamente.

Navegue até estes diretórios usando o prompt de comando e execute, em cada um deles:
```shell
$ docker-compose up
```
ou, use a UI do Docker Desktop. Os serviços em questão devem estar listados na aba `Containers/Apps`.

  > Caso escolha executar pelo prompt de comando, é recomendado executar cada um dos serviços em um prompt separado, para poder ter um melhor controle das saídas dos mesmos.
  
O serviço do RabbitMQ estará disponível na porta `5672` e a UI do RabbitMQ Management estará na porta `15672` (acessível pela url `http://localhost:15672/`) 
com user: `guest` e password: `guest`. Ele irá enviar as mensagens para o nosso serviço para aumentar ou diminuir o estoque de algum produto.

O serviço do mongo db estará disponível na url `http://localhost:27020/`. Nesta base ficará toda a persistência da aplicação, ela iniciará vazia.

  > Vale lembrar que as portas em questão devem estar livres pros serviços subirem corretamente, caso ocorra algum problema, verifique se não há algum serviço rodando nas
  portas `5672`,  `15672` e `27020` da sua máquina.



### Executando a aplicação

Usando um prompt de comando livre, navegue até a raiz do projeto e execute
```shell
$ npm run start
```

Isso deverá subir a aplicação no endereço `http://localhost:3000` e efetuar a conexão com os serviços externos.

  > Você deve ver algumas mensagens de erro indicando falha na busca de certos produtos, não se preocupe, isso está ocorrendo pois a aplicação está consumindo as
  mensagens enviadas pelo RabbitMQ e tentando executar as ações em uma base vazia. Para resolver isso, vamos iniciar a base da aplicação.



### Iniciando a base da aplicação

A aplicação possui um serviço para iniciar a base de dados usando o arquivo `.csv` disponível em `/src/resources/products.csv`, basta fazer uma requisição para
```
[POST] localhost:3000/import/products
```
E a aplicação cuidará do resto.



## Endpoints da API

#### Endpoint que retorna um produto pelo nome
```
[GET] /products/:name
```

Exemplo de Request:
```shell
[GET] http://localhost:3000/products/Saffron
```

Exemplo de Response:
```json
{
    "name": "Saffron",
    "price": 3,
    "quantity": 6
}
```

#### Endpoint para criação de um pedido
```
[POST] /orders
```

Exemplo de Request:
```shell
[POST] http://localhost:3000/orders
```
```json
{
    "products": [
        {
            "name": "Saffron",
            "quantity": 1
        },
        {
            "name": "Lettuce",
            "quantity": 1
        }
    ]
}
```

Exemplo de Response:
```json
{
    "id": 1,
    "products": [
        {
            "name": "Lettuce",
            "quantity": 1,
            "price": 5.37
        },
        {
            "name": "Saffron",
            "quantity": 1,
            "price": 3
        }
    ],
    "total": 8.37
}
```

#### Endpoint para retornar todos os pedidos persistidos na base
```
[GET] /orders
```

Exemplo de Request:
```
http://localhost:3000/orders
```

Exemplo de Response:
```json
[
    {
        "id": 1,
        "products": [
            {
                "_id": "60421fb9c00bb4546064b6fb",
                "name": "Arabica coffee",
                "price": 6.48,
                "quantity": 2
            },
            {
                "_id": "60421fb9c00bb4546064b71f",
                "name": "Lettuce",
                "price": 5.37,
                "quantity": 1
            }
        ],
        "total": 11.850
    },
    {
        "id": 2,
        "products": [
            {
                "_id": "60421fb9c00bb4546064b6fb",
                "name": "Arabica coffee",
                "price": 6.48,
                "quantity": 1
            }
        ],
        "total": 6.48
    },...
]
```

#### Endpoint para retornar um pedido específico, dado um id
```
[GET] /orders/:id
```

Exemplo de Request:
```
[GET] http://localhost:3000/orders/1
```

Exemplo de Response:
```json
{
    "id": 1,
    "products": [
        {
            "name": "Lettuce",
            "quantity": 1,
            "price": 5.37
        },
        {
            "name": "Saffron",
            "quantity": 1,
            "price": 3
        }
    ],
    "total": 8.37
}
```

Caso esteja utilizando o postman, uma `collection` das requisições está disponível [aqui](https://www.getpostman.com/collections/45bb0a1c38d504719afb)


## Rodando os testes

Os testes da aplicação não necessitam da base de dados levantada, visto que usam dados mockados.

Para o rodar os testes, basta executar, na raiz do projeto:
```shell
$ npm run test
```

Os testes devem rodar corretamente, caso algum erro ocorra, certifique-se de que o [jest](https://www.npmjs.com/package/jest) está instalado globalmente na sua máquina
```shell
$ npm isntall -g jest
```
caso erros continuem ocorrendo, tente buildar o projeto com
```shell
$ npm run build
```
