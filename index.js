/*
 * Необходимо написать ф-ию, которая отправляет запрос на сервер.
 * Этот запрос можно отправить с разными фильтрами.
 * Ф-ия, что будет написана, должна уметь кешировать запрос и предотвращать повторную отправку на сервер
 * с текущими параметрами фильтра.
 * У кеша есть время жизни ( скажем 5 сек), после чего он уничтожится.
 * Это значит, что после повторного запроса с текущим фильтром произойдет запрос на сервер и эти данные
 * опять попадут в кеш.
 */
const express = require('express')
const app = express()
const mcache = require('memory-cache')

app.set('view engine', 'pug')

const cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000)
        res.sendResponse(body)
      }
      next()
    }
  }
}

app.get('/', cache(5), (req, res) => {
  setTimeout(() => {
    res.render('index', {
      title: 'Кеширование запросов',
      message: 'Первая загрузка этой страницы происходит с сервера, но следующие 5 секунд перезагрузка будет из кеша.',
      date: new Date()
    })
  }, 5000) //setTimeout для эмуляции длительного запроса
})

app.get('/user/:id', cache(10), (req, res) => {
  setTimeout(() => {
    if (req.params.id == 1) {
      res.json(
        {
          'id': 1,
          'name': 'Leanne Graham',
          'username': 'Bret',
          'email': 'Sincere@april.biz',
          'address': {
            'street': 'Kulas Light',
            'suite': 'Apt. 556',
            'city': 'Gwenborough',
            'zipcode': '92998-3874',
            'geo': {
              'lat': '-37.3159',
              'lng': '81.1496'
            }
          },
          'phone': '1-770-736-8031 x56442',
          'website': 'hildegard.org',
          'company': {
            'name': 'Romaguera-Crona',
            'catchPhrase': 'Multi-layered client-server neural-net',
            'bs': 'harness real-time e-markets'
          }
        }
      )
    } else if (req.params.id == 2) {
      res.json(
        {
          'id': 2,
          'name': 'Ervin Howell',
          'username': 'Antonette',
          'email': 'Shanna@melissa.tv',
          'address': {
            'street': 'Victor Plains',
            'suite': 'Suite 879',
            'city': 'Wisokyburgh',
            'zipcode': '90566-7771',
            'geo': {
              'lat': '-43.9509',
              'lng': '-34.4618'
            }
          },
          'phone': '010-692-6593 x09125',
          'website': 'anastasia.net',
          'company': {
            'name': 'Deckow-Crist',
            'catchPhrase': 'Proactive didactic contingency',
            'bs': 'synergize scalable supply-chains'
          }
        }
      )
    } else if (req.params.id == 3) {
      res.json(
        {
          'id': 3,
          'name': 'Clementine Bauch',
          'username': 'Samantha',
          'email': 'Nathan@yesenia.net',
          'address': {
            'street': 'Douglas Extension',
            'suite': 'Suite 847',
            'city': 'McKenziehaven',
            'zipcode': '59590-4157',
            'geo': {
              'lat': '-68.6102',
              'lng': '-47.0653'
            }
          },
          'phone': '1-463-123-4447',
          'website': 'ramiro.info',
          'company': {
            'name': 'Romaguera-Jacobson',
            'catchPhrase': 'Face to face bifurcated interface',
            'bs': 'e-enable strategic applications'
          }
        }
      )
    }
  }, 3000) //setTimeout для эмуляции длительного запроса
})

app.use((req, res) => {
  res.status(404).send('') //not found
})

app.listen(3333, function () {
  console.log(`Example app listening on port 3333!`)
})
