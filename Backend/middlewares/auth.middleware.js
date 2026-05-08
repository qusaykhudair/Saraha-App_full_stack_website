import jwt from "jsonwebtoken";
import { getProfile } from "../src/modules/user/user.service.js";
import { BadRequestException, NotFoundException } from "../src/common/utils/error.utils.js";
import { tokenRepository } from "../src/DB/models/token/token.repository.js";
import { redisClient } from "../src/DB/models/redis.connection.js";

export const isAuthenticated = async(req, res, next) => {
    try {
        // get data from req
        const {authorization} = req.headers;
        if (!authorization) throw new BadRequestException("Token is required");
        
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        const secret = process.env.JWT_SECRET || "default_jwt_secret_key";
        
        const payload = jwt.verify(token, secret);
        
        // get profile service
        const user = await getProfile({ _id: payload.sub });
        if (!user) throw new NotFoundException("User not found");
        
        // check credential update at
        if(user.crdentialUpdateAt && new Date(user.crdentialUpdateAt).getTime() > payload.iat * 1000){
            throw new BadRequestException("Invalid Token, please login again");
        }
        
        // check if token is blacklisted in database or Redis
        const [tokenInDB, tokenInRedis] = await Promise.all([
            tokenRepository.getOne({ token }),
            redisClient.get(`token:${token}`)
        ]);
        
        if (tokenInDB || tokenInRedis) {
            throw new BadRequestException("Token is blacklisted, please login again");
        }
        
        // inject user and payload to req object
        req.user = user;
        req.payload = payload;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return next(new BadRequestException("Invalid token"));
        }
        if (error.name === "TokenExpiredError") {
            return next(new BadRequestException("Token expired, please login again"));
        }
        next(error);
    }
}