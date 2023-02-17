import { Request } from 'express';
import { verify, JwtPayload, sign } from 'jsonwebtoken';


function Verify(req: Request, userId?: string) {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader?.split(' ')[1];
      const decoded = verify(token as string, process.env.TOKEN_SECRET as string) as JwtPayload;
      if (userId && decoded.user.userId != userId) {
        throw new Error('User id does not match!');
      }
}

function Sign(userId: string) {
    return sign({ user: { userId } }, process.env.TOKEN_SECRET as string);
}

export { Verify, Sign };