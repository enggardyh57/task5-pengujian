import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    console.log("Token tidak ada");
    res.sendStatus(401);
    return; 
  }

  jwt.verify(token, process.env.JWT_SECRET || "your_default_secret_key", (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
    if (err) {
      console.log("Token tidak valid");
      res.sendStatus(403); 
      return; 
    }
    req.user = user; 
    next();
  });
};

export default authenticateToken;
