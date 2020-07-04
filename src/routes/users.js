const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { check } = require('express-validator')

router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check(
      'password',
      'La contraseña debe ser mínimo de 6 carácteres'
    ).isLength({ min: 6 })
  ],
  userController.createUser
)

module.exports = router
