const jsonwebtoken = require("jsonwebtoken");
const { serialize } = require("cookie");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;

const userModel = require('../models/index').user

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required!",
        });
      }
  
      const findUser = await userModel.findOne({ where: { email } });
      if (!findUser) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }
  
      const passwordMatch = await bcrypt.compare(password, findUser.password);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect Password!",
        });
      }
  
      //generate jwt token
      const tokenPayload = {
        id_user: findUser.id,
        role: findUser.role,
        nama_user: findUser.nama_user,
      };
  
      const token = jsonwebtoken.sign(tokenPayload, SECRET_KEY);
  
      const cookie = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 1, // 1 day
      });
  
      res.setHeader("Set-Cookie", cookie);
  
      return res.status(200).json({
        message: "Success login",
        data: {
          token: token,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal error",
        err: error.message,
      });
    }
  };
  

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({
      where: { email, role: "customer" },
    });
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "Email or password doesn't match",
      });
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (!passwordMatch) {
      return res.status(404).json({
        success: false,
        message: "Email or password doesn't match",
      });
    }

    // Generate jwt token
    const tokenPayload = {
      id_user: findUser.id,
      role: findUser.role,
      nama_user: findUser.nama_user,
    };

    const token = jsonwebtoken.sign(tokenPayload, SECRET_KEY);

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1, // 1 day
    });

    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({
      message: "Success login",
      data: {
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal error",
      err: error,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const cookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 0, // Setting maxAge to 0 will delete the cookie
    });

    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({
      message: "Success logout",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal error",
      err: error,
    });
  }
};

exports.getUserLogin = async (req, res) => {
  try {
    const userData = req.userData;

    if (!userData) {
      return res.json({
        success: false,
        message: "Invalid Token",
        data: null,
      });
    }

    return res.json({
      success: true,
      data: userData,
      message: "Successfully retrieved User Login Data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal error",
    });
  }
};
