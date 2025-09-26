import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



// Register
export const register = async (req, res, next) => {
  try {
    const { name, email, gender, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, gender, password: hashedPassword, role });
    
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    // Return both token and user
    res.status(201).json({ success: true, message: "User registered successfully", user, token });
  } catch (error) {
    next(error);
  }
};

//     res.status(201).json({ message: "User registered successfully", user });
//   } catch (error) {
//     next(error);
//   }
// };



// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ success: true, message: "Login successful", token, user });
  } catch (error) {
    next(error);
  }
};




// Logout
export const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};
