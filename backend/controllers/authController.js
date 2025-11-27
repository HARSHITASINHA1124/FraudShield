import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const client = new OAuth2Client(CLIENT_ID);

// Simple in-memory user storage
let users = [];

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hashedPassword });
  res.json({ message: "Signup successful" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Incorrect password" });

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload(); // contains email, name, picture
    let user = users.find((u) => u.email === payload.email);

    if (!user) {
      // create user if not exists
      user = { name: payload.name, email: payload.email, password: null };
      users.push(user);
    }

    const jwtToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Google login successful", token: jwtToken, user });
  } catch (err) {
    res.status(400).json({ message: "Invalid Google token" });
  }
};
