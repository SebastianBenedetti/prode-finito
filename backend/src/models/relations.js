import User from "./user.js";
import Match from "./match.js";
import Prediction from "./prediction.js";

User.hasMany(Prediction, { foreignKey: "userId" });
Prediction.belongsTo(User, { foreignKey: "userId" });

Match.hasMany(Prediction, { foreignKey: "matchId" });
Prediction.belongsTo(Match, { foreignKey: "matchId" });

export { User, Match, Prediction };
