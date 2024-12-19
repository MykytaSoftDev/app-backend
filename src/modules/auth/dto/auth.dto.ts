import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@IsString()
	@IsOptional()
	name: string

	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@IsString()
	password: string
}
