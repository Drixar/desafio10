import { Router } from "express"
import { UserModel } from "../../models/user.js";

  const router = Router();

  router.get('/register', (req, res) => {
    res.render('sessions/register')
  })

  router.post('/register', async (req, res) => {
    const userNew = req.body
    if (userNew.email == 'adminCoder@coder.com' && userNew.password == 'adminCod3r123') {
      userNew.role = 'Admin'
    } else userNew.role = 'User'
    const user = new UserModel(userNew)
    await user.save()
    res.redirect('/sessions/login')
  })

  router.get('/login', (req, res) => {
    res.render('sessions/login')
  })

  router.post('/login', async (req, res) => {
    const {email, password } = req.body 
    const user = await UserModel.findOne({email, password}).lean().exec()
    if (!user) {
        return res.status(401).render("errors/base", {
            error: 'Error en Email y / o Contraseña'
        })
    } req.session.user = user
    res.redirect("/products")
  }) 

  router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).render('/errors/base', {
            error: err
        })
        else res.redirect('/sessions/login')
    })
  })

  export default router