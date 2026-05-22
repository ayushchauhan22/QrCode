import express from 'express'
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/userSchema.js'

dotenv.config()

const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hashedPassword = await bycrypt.hash(password, 10)

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
        const role =
            adminEmail && email.toLowerCase() === adminEmail ? 'admin' : 'user'

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            code: generateRandomCode(),
            role,
        })

        const userdata = await newUser.save()
        const response = {
            _id: userdata._id,
            name: userdata.name,
            email: userdata.email,
        }

        const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token, { httpOnly: true })
        
        res.status(201).json({data: response, token, message: 'User registered successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const isMatch = await bycrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.cookie('token', token, { httpOnly: true })

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                code: user.code,
                role: user.role,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const verifiedToken = (req, res) => {
    res.json({ valid: true, userId: req.user.id })
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name email code role isScanned')
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                code: user.code,
                role: user.role,
                isScanned: user.isScanned,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const logout = (req, res) => {
    res.clearCookie('token')
    res.json({ message: 'Logged out' })
}

