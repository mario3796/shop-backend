import { Controller, Body, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.model';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  @HttpCode(201)
  async signup(@Body() user: User) {
    await this.authService.validateInput(user);
    const signedUser = await this.authService.signup(user);
    return {
      user: signedUser,
      message: 'Signed up successfully!',
    };
  }

  @Post('/login')
  @HttpCode(201)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const token = await this.authService.login(email, password);
    return {
      ...token,
      message: 'Logged in successfully!',
    };
  }
}
