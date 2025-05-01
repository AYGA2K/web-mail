import { Hono } from 'hono'
import { MailController } from '../controllers/mail.controller.js'

const mailRoutes = new Hono()
const mailController = new MailController()

mailRoutes.post('/send', mailController.send)
mailRoutes.delete('/:id', mailController.deleteEmail)
mailRoutes.get('/:userId', mailController.getEmailsByUser)
mailRoutes.patch('/:id/read', mailController.markAsRead)
mailRoutes.get('/:userId/:emailId', mailController.getEmail)

export default mailRoutes
