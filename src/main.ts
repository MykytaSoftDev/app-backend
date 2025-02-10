import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.enableCors({
		origin: [process.env.FRONTEND, process.env.CDN, 'http://localhost:5501'],
		credentials: true,
		exposedHeaders: 'set-cookie',
	})
	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
