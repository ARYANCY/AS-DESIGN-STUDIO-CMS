const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/subscribe', async (req, res) => {
  const { name,email } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Ready to Transform Your Space?',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f4f8fc; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); text-align: center;"><a href="https://as-design-studio.onrender.com" target="_blank" style="text-decoration: none;"><img src="cid:logo" alt="AS Design Studio" style="max-width: 150px; margin-bottom: 25px;" /></a><h1 style="color: #2c3e50; font-size: 26px; margin-bottom: 20px;">Design Your Dream Space with AS Design Studio</h1><p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">This is your opportunity to elevate your living space with premium interior design solutions. Our team at <strong>AS Design Studio</strong> is ready to bring creativity, style, and function into every corner of your home.</p><p style="color: #333; font-size: 15px; margin-bottom: 30px;">Let’s discuss your ideas and turn them into reality. Just one call away.</p><a  href="tel:+919395927600" style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">📞 Call </a><p style="color: #777; font-size: 13px; margin-top: 40px;">AS Design Studio • Interior Excellence Delivered</p></div>`,
    attachments: [
      {
        filename: 'logo.jpg',
        path: './public/images/logo.jpg',
        cid: 'logo'
      }
    ]
  };
 

  try {
  await transporter.sendMail(mailOptions);
  res.status(200).send('Email sent successfully'); // ✅ Required!
 } catch (err) {
  console.error('Error sending email:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'error sending mail..please try again later';
  res.status(statusCode).render('errorHandling/error', { statusCode, message });
 }
});

module.exports = router;
