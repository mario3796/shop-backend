import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/users.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async signup(user: User) {
    try {
      const hashedPass = await bcrypt.hash(
        user.password,
        +process.env.SALT_ROUNDS,
      );
      const newUser = new this.userModel({
        email: user.email,
        username: user.username,
        password: hashedPass,
        cart: {
          items: [],
        },
      });
      return await newUser.save();
    } catch (err) {
      throw new NotAcceptableException(err.message);
    }
  }

  async validateInput(user: User) {
    const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!user.email) {
      throw new NotAcceptableException('please fill the email field!');
    }
    if (!user.email.match(emailPattern)) {
      throw new NotAcceptableException('please enter a valid email');
    }
    let renderedUser = await this.userModel.findOne({ email: user.email });
    if (renderedUser) {
      throw new NotAcceptableException('email already exists!');
    }
    if (!user.username) {
      throw new NotAcceptableException('please fill the username field!');
    }
    renderedUser = await this.userModel.findOne({ username: user.username });
    if (renderedUser) {
      throw new NotAcceptableException('username already exists!');
    }
    if (!user.password) {
      throw new NotAcceptableException('please fill the password field!');
    }
    if (user.password.length < 6) {
      throw new NotAcceptableException(
        'password must not be less than 6 characters!',
      );
    }
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotAcceptableException('User not found!');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new NotAcceptableException('Wrong password!');
    return user;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);
      if (!user) throw new NotFoundException('User not found!');
      const token = this.jwtService.sign({ id: user._id });
      const decoded = this.jwtService.verify(token);
      return {
        userId: user._id,
        token,
        expirationTime: decoded.exp,
      };
    } catch (err) {
      throw new NotAcceptableException(err.message);
    }
  }
}
