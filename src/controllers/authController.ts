import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { CreateUserDto, LoginDto } from '../interfaces/user.interface';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { MESSAGES, HTTP_STATUS } from '../constants/constants';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body;
    
    const result = await this.authService.register(userData);
    
    return sendSuccess(
      res,
      result,
      MESSAGES.AUTH.REGISTER_SUCCESS,
      HTTP_STATUS.CREATED
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const loginData: LoginDto = req.body;
    
    const result = await this.authService.login(loginData);
    
    return sendSuccess(
      res,
      result,
      MESSAGES.AUTH.LOGIN_SUCCESS,
      HTTP_STATUS.OK
    );
  });

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return sendError(
        res,
        MESSAGES.AUTH.TOKEN_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const user = await this.authService.getUserById(userId);
    
    return sendSuccess(
      res,
      user,
      'Profile retrieved successfully',
      HTTP_STATUS.OK
    );
  });
}
