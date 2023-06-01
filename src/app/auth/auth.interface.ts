import { Request } from 'express';
import { IUser } from '../users/users.interface';

export interface IAuthRequest extends Request {
  user: IUser;
  token: string;
}
