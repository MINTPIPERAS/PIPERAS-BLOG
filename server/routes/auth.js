import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

const router = express.Router()

router.post("/login", async (req, res) => {

  const { username, password } = req.body

  const user = await User.findOne({ username })

  if (!user) {
    return res.status(401).json({ msg: "用户不存在" })
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return res.status(401).json({ msg: "密码错误" })
  }

  const token = jwt.sign(
    { id: user._id },
    "SECRET_KEY",
    { expiresIn: "7d" }
  )

  res.json({ token })

})

export default router