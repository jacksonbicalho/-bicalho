# `@bicalho/utilities` - É um pacote com algumas funções úteis para ser usadas em qualquer sistema

`utilities` nasce para centralizar métodos úteis para ser usados por todo o sistema.

## Instalação

```bash
npm install @bicalho/utilities
```
Ou

```bash
yarn add  @bicalho/utilities
```

## Métodos

| **Método**              | **Descrição**            |
| :---------------------- | :----------------------- |
| [getJson](#getjson)     | Lê um arquivo JSON       |

### getJson

```bash
$ touch index.js
```

#### Adicione
```javascript
const {utilities} = require('@bicalho/utilities');

const pkg = utilities.getJson('package.json');
console.log(pkg);

```

#### Execute
```bash
$ node index.js

{
  name: 'testando',
  version: '1.0.0',
  main: 'index.js',
  license: 'MIT',
  dependencies: { '@bicalho/utilities': '^0.0.5-dev.1' }
}
```

