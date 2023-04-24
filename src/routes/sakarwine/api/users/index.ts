import { brewExpressFuncCreateOrFindAll } from "code-alchemy";
import User from "../../../../models/User";
import verifyToken from "../../../../utils/verify-token";

export default brewExpressFuncCreateOrFindAll(
  User,
  {
    afterFunctionStart(req) {
      verifyToken(req);
    },
  },
  "mongoose"
);
