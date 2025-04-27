import { Hono } from 'hono'
import { MailController } from '../controllers/mail.controller.js'

const mailRoutes = new Hono()

mailRoutes.post('/send', MailController.sendEmail)
mailRoutes.get('/inbox', MailController.getInbox)
mailRoutes.get('/:id', MailController.getEmail)
mailRoutes.delete('/:id', MailController.deleteEmail)

export default mailRoutes
