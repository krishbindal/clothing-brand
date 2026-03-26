import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@clothingbrand.com'
const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || 'LUXE'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  await transporter.sendMail({
    from: `"${BRAND_NAME}" <${FROM_EMAIL}>`,
    to: email,
    subject: `Verify your ${BRAND_NAME} account`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0A0A0A; color: #F5F5F5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .logo { font-size: 28px; font-weight: 700; letter-spacing: 0.2em; color: #C9A84C; text-align: center; margin-bottom: 40px; }
            .card { background: #161616; border: 1px solid #222222; border-radius: 12px; padding: 40px; }
            h1 { font-size: 24px; font-weight: 600; margin: 0 0 16px; }
            p { color: #B0B0B0; line-height: 1.6; margin: 0 0 24px; }
            .button { display: inline-block; background: linear-gradient(135deg, #C9A84C, #E8C97A); color: #0A0A0A; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; }
            .footer { text-align: center; margin-top: 40px; color: #666666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">${BRAND_NAME}</div>
            <div class="card">
              <h1>Welcome${name ? `, ${name}` : ''}! 👋</h1>
              <p>Thank you for creating your ${BRAND_NAME} account. Please verify your email address to unlock exclusive access to our collections.</p>
              <p>This link expires in 24 hours.</p>
              <a href="${verifyUrl}" class="button">Verify Email Address</a>
              <p style="margin-top: 24px; font-size: 12px; color: #666666;">If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: `"${BRAND_NAME}" <${FROM_EMAIL}>`,
    to: email,
    subject: `Reset your ${BRAND_NAME} password`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0A0A0A; color: #F5F5F5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .logo { font-size: 28px; font-weight: 700; letter-spacing: 0.2em; color: #C9A84C; text-align: center; margin-bottom: 40px; }
            .card { background: #161616; border: 1px solid #222222; border-radius: 12px; padding: 40px; }
            h1 { font-size: 24px; font-weight: 600; margin: 0 0 16px; }
            p { color: #B0B0B0; line-height: 1.6; margin: 0 0 24px; }
            .button { display: inline-block; background: linear-gradient(135deg, #C9A84C, #E8C97A); color: #0A0A0A; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; }
            .footer { text-align: center; margin-top: 40px; color: #666666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">${BRAND_NAME}</div>
            <div class="card">
              <h1>Reset Your Password</h1>
              <p>Hi${name ? ` ${name}` : ''}! We received a request to reset your password. Click the button below to create a new one.</p>
              <p>This link expires in 1 hour.</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p style="margin-top: 24px; font-size: 12px; color: #666666;">If you didn't request a password reset, please secure your account immediately.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderData: {
    orderId: string
    items: Array<{
      name: string
      quantity: number
      price: number
      size: string
      color: string
    }>
    total: number
    shippingAddress: {
      firstName: string
      lastName: string
      line1: string
      city: string
      state: string
      postalCode: string
    }
  }
) {
  const itemsHtml = orderData.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #222222;">
          <strong>${item.name}</strong><br>
          <span style="color: #888888; font-size: 12px;">Size: ${item.size} | Color: ${item.color}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #222222; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #222222; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>
    `
    )
    .join('')

  await transporter.sendMail({
    from: `"${BRAND_NAME}" <${FROM_EMAIL}>`,
    to: email,
    subject: `Order Confirmed - ${orderData.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmed</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0A0A0A; color: #F5F5F5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .logo { font-size: 28px; font-weight: 700; letter-spacing: 0.2em; color: #C9A84C; text-align: center; margin-bottom: 40px; }
            .card { background: #161616; border: 1px solid #222222; border-radius: 12px; padding: 40px; }
            h1 { font-size: 24px; font-weight: 600; margin: 0 0 16px; }
            p { color: #B0B0B0; line-height: 1.6; margin: 0 0 16px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 8px 0; border-bottom: 1px solid #333; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            .total { font-size: 18px; font-weight: 600; color: #C9A84C; }
            .footer { text-align: center; margin-top: 40px; color: #666666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">${BRAND_NAME}</div>
            <div class="card">
              <h1>Order Confirmed! ✓</h1>
              <p>Thank you for your order. We're processing it now and will update you once it ships.</p>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top: 16px;"><strong>Total</strong></td>
                    <td style="padding-top: 16px; text-align: right;" class="total">$${orderData.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              <p style="margin-top: 24px;"><strong>Shipping to:</strong><br>
                ${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}<br>
                ${orderData.shippingAddress.line1}<br>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export async function sendNewsletterSubscriptionEmail(email: string) {
  const recipient = process.env.NEWSLETTER_NOTIFY_EMAIL || FROM_EMAIL
  const safeEmail = escapeHtml(email)

  await transporter.sendMail({
    from: `"${BRAND_NAME}" <${FROM_EMAIL}>`,
    to: recipient,
    subject: `New newsletter signup for ${BRAND_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Newsletter Signup</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0A0A0A; color: #F5F5F5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .card { background: #161616; border: 1px solid #222222; border-radius: 12px; padding: 32px; }
            h1 { font-size: 22px; margin: 0 0 16px; }
            p { color: #B0B0B0; margin: 0 0 12px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <h1>New Newsletter Signup</h1>
              <p>A visitor subscribed to the newsletter.</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}
