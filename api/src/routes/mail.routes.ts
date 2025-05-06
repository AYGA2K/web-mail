import { z } from 'zod'
import { OpenAPIHono } from '@hono/zod-openapi'
import { MailController } from '../controllers/mail.controller.js'
import { buildOpenAPIRoute } from '../utils/openapi.util.js'
import { createEmailSchema } from '../schemas/emails/request/create.schema.js'

const mailRoutes = new OpenAPIHono()
const mailController = new MailController()

mailRoutes.openapi(
  buildOpenAPIRoute({
    name: 'Mail',
    method: 'post',
    path: '/send',
    summary: 'Send an email',
    description: 'Send a new email message',
    schema: createEmailSchema,
  }),
  mailController.send
)

mailRoutes.openapi(
  buildOpenAPIRoute({
    name: 'Mail',
    method: 'delete',
    path: '/:id',
    summary: 'Delete an email',
    description: 'Delete an email by ID',
    params: z.object({
      id: z.string().uuid().describe('Email ID'),
    }),
  }),
  mailController.deleteEmail
)

mailRoutes.openapi(
  buildOpenAPIRoute({
    name: 'Mail',
    method: 'get',
    path: '/:userId',
    summary: 'Get all emails for a user',
    description: 'Fetch all emails for a given user',
    params: z.object({
      userId: z.string().uuid().describe('User ID'),
    }),
  }),
  mailController.getEmailsByUser
)

mailRoutes.openapi(
  buildOpenAPIRoute({
    name: 'Mail',
    method: 'patch',
    path: '/:id/read',
    summary: 'Mark email as read',
    description: 'Mark an email as read by ID',
    params: z.object({
      id: z.string().uuid().describe('Email ID'),
    }),
  }),
  mailController.markAsRead
)

mailRoutes.openapi(
  buildOpenAPIRoute({
    name: 'Mail',
    method: 'get',
    path: '/:userId/:emailId',
    summary: 'Get specific email',
    description: 'Retrieve a specific email by user and email ID',
    params: z.object({
      userId: z.string().uuid().describe('User ID'),
      emailId: z.string().uuid().describe('Email ID'),
    }),
  }),
  mailController.getEmail
)

export default mailRoutes

