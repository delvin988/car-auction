const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, Item, Bid, sequelize } = require("../models/index")
const { OAuth2Client } = require('google-auth-library');
const oauth2Client = new OAuth2Client();

module.exports = class AuthController {
  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      const data = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password", "updatedAt", "createdAt"],
        },
      });

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: "EmailRequired" };
      if (!password) throw { name: "PasswordRequired" };

      const user = await User.findOne({ where: { email } });
      if (!user) throw { name: "InvalidUser" };

      const comparedUser = comparePassword(password, user.password);
      if (!comparedUser) throw { name: "InvalidUser" };

      const access_token = signToken({ id: user.id });
      const id = user.id

      res.status(200).json({ message: "Success Login", access_token, id });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    // console.log(req.headers);
    try {
      const ticket = await oauth2Client.verifyIdToken({
        idToken: req.headers["google-token"],
        audience: "933231867226-9efkmdhmftmj109ms1qmodtjct3id4ml.apps.googleusercontent.com",
      });

      const payload = ticket.getPayload();
      // console.log(payload);

      let user = await User.findOne({
        where: {
          email: payload.email,
        },
      });

      if (!user) {
        user = await User.create({
          firstname: payload.given_name,
          lastname: payload.family_name,
          email: payload.email,
          password: "dummy-password-" + Date.now() + Math.random(),
        });
      }

      const access_token = signToken({ id: user.id });

      res.status(201).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
};