import jwt from 'jsonwebtoken';

import { Jwt } from './types';

export const jwtFactory = async (): Promise<Jwt> => jwt;
