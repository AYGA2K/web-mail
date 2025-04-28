import { Hono } from 'hono'
import { MailController } from '../controllers/mail.controller.js'

const mailRoutes = new Hono()
const mailController = new MailController()

mailRoutes.post('/send', mailController.send)
mailRoutes.get('/:id', mailController.getEmail)
mailRoutes.delete('/:id', mailController.deleteEmail)

export default mailRoutes
