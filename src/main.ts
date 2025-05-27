import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableVersioning({
		type: VersioningType.URI,
		prefix: 'v',
	})

	app.setGlobalPrefix('api')
	app.use(cookieParser())
	// CORS cofigured in nginx
	// app.enableCors({
	// 	origin: ['*'],
	// 	credentials: true,
	// 	exposedHeaders: 'set-cookie',
	// })
	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
