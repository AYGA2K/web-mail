import dotenv from 'dotenv'

dotenv.config()

interface Config {
  PORT: number
  JWT_SECRET: string
  CORS_ORIGINS: string[]
}

const config: Config = {
  PORT: parseInt(process.env.PORT || '3000'),
  JWT_SECRET: process.env.JWT_SECRET || 'secret-key',
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173']
}

export { config }
