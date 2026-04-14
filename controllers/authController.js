import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error("Email already in use");
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

export { registerUser, loginUser, getCurrentUser };
