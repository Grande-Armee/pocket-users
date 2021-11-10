import jwt from 'jsonwebtoken';

import { Jwt } from './interfaces';

export const jwtFactory = async (): Promise<Jwt> => jwt;
