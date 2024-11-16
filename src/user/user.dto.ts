import {
	IsBoolean,
	IsEmail,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

export class UserDto {
	id: string

	@IsEmail()
	@IsOptional()
	email: string

	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@IsOptional()
	@IsString()
	password: string

	@IsString()
	@IsOptional()
	name: string

	@IsBoolean()
	@IsOptional()
	isAdmin: boolean

	@IsString()
	@IsOptional()
	apiKey: string
}
