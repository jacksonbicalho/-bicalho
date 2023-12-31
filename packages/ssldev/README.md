# `@bicalho/ssldev` - Servidor https para ser usado durante desenvolvimento

`ssldev` é uma ferramenta simples de ser usada que resolve principalmente as dificuldades de lidar com desenvolvimento de PWAs.

## Instalação

```bash
npm install --save-dev @bicalho/ssldev
```

Ou

```bash
yarn add --dev @bicalho/ssldev
```



## Crie uma chave ssl
```bash
  mkdir -p ssl-keys \
    && mkcert -key-file ssl-keys/localhost.key.pem \
    -cert-file ssl-keys/localhost.cert.pem localhost
  mkcert -install
```


## Exemplo de uso
```javascript
  const {sslldev} = require("@bicalho/ssldev");
  const path = require("path");
  const dirRoot = path.resolve(__dirname);

  sslldev.configure({
    publicDomain: "localhost",
    contenPublic: 'public',
    webPort: 8081,
    rootApp: dirRoot,
    keysPath: "ssl-keys",
    cleanUrls: ["/**"],
    rewrites: [{ source: "app/**", destination: "/index.html" }],
    renderSingle: true,
    headers: [
      {
        source: "**/*.@(jpg|jpeg|gif|png)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache",
          },
        ],
      },
    ],
  }).run()
```
#### [Exemplo](https://github.com/jacksonbicalho/bicalho/tree/master/packages/ssldev/examples/)

