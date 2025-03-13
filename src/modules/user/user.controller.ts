import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/modules/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/modules/auth/decorators/user.decorator'
import { UserDto } from './user.dto'
import { UserService } from './user.service'

@Controller({ path: 'user/profile', version: process.env.API_VERSION })
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	@Auth()
	async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
		const { password, ...data } = await this.userService.update(id, dto)
		return data
	}

	@HttpCode(200)
	@Auth()
	@Get()
	async getProfileData(@CurrentUser('id') id: string) {
		return await this.userService.getProfileData(id)
	}
}
