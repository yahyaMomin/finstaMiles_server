import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'

export const register = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body
    const newUserName = await userName.replace(/ /g, '_')
    const isUser = await userModel.findOne({ userName: newUserName })
    const isEmail = await userModel.findOne({ email })

    if (isUser)
      return res.status(500).json({
        status: 'error',
        msg: 'username already exist',
      })
    if (isEmail) return res.status(505).json({ status: 'error', msg: 'email already exist' })

    const salt = await bcrypt.genSalt(12)

    const hashPass = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      fullName,
      userName: newUserName,
      email,
      password: hashPass,
    })

    const token = jwt.sign({ id: newUser._id }, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '30d' })

    await newUser.save()

    res.status(201).json({
      status: 'success',
      user: {
        ...newUser._doc,
        password: '',
      },
      token,
    })
  } catch (err) {
    res.status(500).json({ status: 'error', msg: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email }).populate('posts')
    if (!user) return res.status(500).json({ status: 'error', msg: 'user does not exist' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(500).json({ status: 'error', msg: 'incorrect password' })
    const accessToken = createAccessToken({ id: user._id })

    res.status(200).json({
      status: 'success',
      accessToken,
      user: {
        ...user._doc,
        password: '',
      },
    })
  } catch (err) {
    res.status(500).json({ status: 'error', msg: err.message })
  }
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '30d' })
}
