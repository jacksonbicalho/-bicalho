import {Config} from '@bicalho/config'

const config1 = new Config()
.configure({
  name: 'jackson',
  surname: 'Bicalho',
  options: {
    opt1: true,
    opt2: '/.****',
    opt3: false,
  }
});

const config2 = new Config()
.configure({
  public: 'nova configuração',
  cache: true,
  options: {
    opt1: true,
    opt2: '/.****',
    opt3: [
      {
        a: true,
      }
      ,{
        b: false,
      }
    ]
  }
});
console.log('[2023-12-21 23:04:31 ', config1.getConfig());
console.log('[2023-12-21 23:37:46] >>>>> config2: ', config2.getConfig());



