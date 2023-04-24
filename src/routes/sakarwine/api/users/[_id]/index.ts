import { brewExpressFuncFindOneOrUpdateOrDeleteByParam } from "code-alchemy";
import User, { IUser } from "../../../../../models/User";
import verifyToken from "../../../../../utils/verify-token";

export default brewExpressFuncFindOneOrUpdateOrDeleteByParam(
  User,
  {
    afterFunctionStart(req) {
      verifyToken(req);
    },
    beforeUpdate(data: IUser, req) {
      delete req.body.password;
      delete req.body.email;
      delete req.body.profilePicture;
    },
  },
  "User not found!",
  "_id",
  "mongoose"
);
