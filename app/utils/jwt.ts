import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

export const generateToken = async (payload: any) => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
};

export const verifyToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}; 