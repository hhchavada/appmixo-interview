import { UserRepository } from '../repositories/userRepository';
import { CreateUserDto, LoginDto, AuthResponse, IUser, UserModel } from '../interfaces/user.interface';
import { generateToken } from '../utils/jwt';
import { MESSAGES } from '../constants/constants';
import { logger } from '../utils/logger';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private sanitizeUser(user: UserModel): Omit<IUser, 'password'> {
    const userObj = user.toObject();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  }

  async register(userData: CreateUserDto): Promise<AuthResponse> {
    try {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      
      if (existingUser) {
        throw new Error(MESSAGES.USER.EMAIL_EXISTS);
      }

      const user = await this.userRepository.create(userData);
      
      const token = generateToken({
        userId: user._id!.toString(),
        email: user.email,
        role: user.role,
      });

      const userWithoutPassword = this.sanitizeUser(user);

      logger.info(`User registered successfully: ${user.email}`);

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(loginData: LoginDto): Promise<AuthResponse> {
    try {
      const user = await this.userRepository.findByEmailWithPassword(loginData.email);
      
      if (!user) {
        throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
      }

      const isPasswordValid = await user.comparePassword(loginData.password);
      
      if (!isPasswordValid) {
        throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
      }

      const token = generateToken({
        userId: user._id!.toString(),
        email: user.email,
        role: user.role,
      });

      const userWithoutPassword = this.sanitizeUser(user);

      logger.info(`User logged in successfully: ${user.email}`);

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<Omit<IUser, 'password'>> {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        throw new Error(MESSAGES.USER.NOT_FOUND);
      }

      return this.sanitizeUser(user);
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }
}
