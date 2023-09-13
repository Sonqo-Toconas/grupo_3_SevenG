const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../views/users/usuarios.json')
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const usuario = {
    index: (req, res) => {
        res.render('userPanel');
    },

    registro: (req, res) => {
        res.render('register')
    },

    procesoCrear: (req, res) => {
        let errors = validationResult(req)
        if (errors.isEmpty()) {
            const data = req.body;

            if (req.file) {
                var usarImage = req.file.filename
            } else {
                var usarImage = "default.png"
            }

            const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
            const nuevoUser = {
                id: users[users.length - 1].id + 1,
                nombre: data.nombre,
                email: data.email,
                telefono: parseInt(data.telefono),
                contraseña: bcrypt.hashSync(req.body.contrasena, 10),
                imagen: usarImage
            }

            users.push(nuevoUser);
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, " "))
            res.redirect('/');
        }
        else {
            res.render('register', {
                errors: errors.array(),
                old: req.body
            })
        }
    },

    login: (req, res) => {
        res.render('login', {
            mensajeP: false,
            mensajeEmail: false,
        })
    },

    processLogin: (req, res) => {
        let buscarPorPropiedad = function (propiedad, texto) {
            let usuarios = this.datos()
            let usuarioEncontrado = usuarios.find(usuario => usuario[propiedad] == texto)
            return usuarioEncontrado
        }

        let errors = validationResult(req)
        if (errors.isEmpty()) {
            let usuario = buscarPorPropiedad('email', req.body.email)
            if (usuario) {
                let validadContra = bcrypt.compareSync(req.body.password, usuario.contraseña);
                if (validadContra) {
                    return res.redirect('/')
                } else {
                    return res.render('login', {
                        errors: errors.array(),
                        old: req.body,
                        mensajeEmail: false,
                        mensajeP: 'contraseña es invalida'
                    })
                }
            } else {
                res.render('login', {
                    mensajeP: false,
                    mensajeEmail: 'email es invalido'
                })
            }
        }
        else {
            res.render('login', {
                errors: errors.errors,
                old: req.body,
                mensajeP: false,
                mensajeEmail: 'email es invalido'
            })
        }
    }
}

module.exports = usuario