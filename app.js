const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/', (req, res) => {
  res.json({
    text: 'hello'
  })
})

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403)
    } else {
      res.json({ text: 'Post created...', authData })
    }
  })
})

app.post('/api/login', (req, res) => {
  //Mock user
  const user = {
    id: 1,
    username: 'damian',
    email: 'damianjnc@gmail.com'
  }

  jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
    res.json({ token })
  })
})

//format of token
//Authorization: Bearer <access_token>

//verify token
function verifyToken(req, res, next) {
  //get auth header value
  const bearerHeader = req.headers['authorization']
  //check if bearer is not undefined
  if (typeof bearerHeader !== 'undefined') {
    //split at the space
    const bearer = bearerHeader.split(' ')

    //get token from the array
    const bearerToken = bearer[1]

    //set the token
    req.token = bearerToken

    //next middleware
    next()
  } else {
    //Forbidden
    res.sendStatus(403)
  }
}

app.listen('5000', () => console.log('Server is running on port 5000'))
