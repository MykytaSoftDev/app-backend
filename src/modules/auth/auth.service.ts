import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { UserService } from 'src/modules/user/user.service'
import { AuthDto } from './dto/auth.dto'
import { GoogleAuthDto } from './dto/google-auth.dto'
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService,
	) {}

	async login(dto: AuthDto, isGoogleAuth: boolean) {
		const { password, ...user } = await this.validateUser(dto, isGoogleAuth)
		const tokens = this.issueTokens(user.id)

		return {
			user,
			tokens,
		}
	}

	async register(dto: AuthDto) {
		const isExist = await this.userService.getByEmail(dto.email)

		if (isExist)
			throw new BadRequestException('User with this email already exists.')

		const { password, ...user } = await this.userService.create(dto)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			tokens,
		}
	}

	async googleAuth(dto: GoogleAuthDto) {
		const ticket = await this.verifyGoogleToken(dto.token)

		const user = await this.userService.getByEmail(ticket.email)

		const authDto: AuthDto = {
			email: ticket.email,
			password: ticket.exp.toString(),
			name: ticket.given_name,
		}

		if (user) return await this.login(authDto, true)

		return await this.register(authDto)
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const { password, ...user } = await this.userService.getById(result.id)
		const tokens = this.issueTokens(user.id)

		return { user, tokens }
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '1h',
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto, isGoogleAuth: boolean) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user)
			throw new NotFoundException(
				'User with the provided email address not found. Please check your email and try again.',
			)

		if (!isGoogleAuth) {
			const isValid = await verify(user.password, dto.password)

			if (!isValid)
				throw new UnauthorizedException(
					'Incorrect password. Please try again or reset it.',
				)
		}

		return user
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.configService.get('DOMAIN_NAME'),
			expires: expiresIn,
			secure: true,
			sameSite:
				this.configService.get('ENVIRONMENT') === 'prod' ? 'lax' : 'none',
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: this.configService.get('DOMAIN_NAME'),
			expires: new Date(0),
			secure: true,
			sameSite:
				this.configService.get('ENVIRONMENT') === 'prod' ? 'lax' : 'none',
		})
	}

	async verifyGoogleToken(token: string) {
		try {
			const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: process.env.GOOGLE_CLIENT_ID,
			})
			const payload = ticket.getPayload()
			return payload
		} catch (error) {
			throw new Error('Invalid or expired token.')
		}
	}
}
