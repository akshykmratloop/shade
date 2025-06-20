// Dynamic email payload templates for user-related actions

// User Account Creation Email
export const userAccountCreationPayload = ({ name, email, password }) => ({
  to: email,
  subject: "Your Account Details",
  text: `Hello ${name}, your account has been created successfully. Username: ${email}, Password: ${password}. Please change your password after logging in.`,
  html: `
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;">
      <div style="
        max-width: 480px;
        margin: 40px auto;
        padding: 32px 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        position: relative;
        overflow: hidden;
        animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;
      ">
        <svg width="100%" height="100" viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;z-index:0;pointer-events:none;">
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="480" y2="100" gradientUnits="userSpaceOnUse">
              <stop stop-color="#a5b4fc"/>
              <stop offset="1" stop-color="#f472b6"/>
            </linearGradient>
          </defs>
          <ellipse cx="240" cy="50" rx="220" ry="40" fill="url(#paint0_linear)" fill-opacity="0.18"/>
        </svg>
        <div style="position:relative;z-index:1;">
          <h2 style="text-align:center;color:#333;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Welcome to Our Platform! <span style="font-size:1.5rem;">🎉</span></h2>
          <p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p>
          <p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">Your account has been <span style="color:#6366f1;font-weight:600;">successfully created</span>. Here are your login details:</p>
          <div style="
            background: rgba(255,255,255,0.45);
            border-radius: 14px;
            box-shadow: 0 2px 12px 0 rgba(99,102,241,0.08);
            padding: 18px 20px;
            margin-bottom: 24px;
            border: 1px solid rgba(99,102,241,0.13);
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: slideInUp 1.1s cubic-bezier(.39,.575,.56,1) 0.2s both;
          ">
            <p style="font-size:1.08rem;margin:0 0 8px 0;"><strong>Username:</strong> <span style="color:#6366f1;">${email}</span></p>
            <p style="font-size:1.08rem;margin:0;"><strong>Password:</strong> <span style="color:#f472b6;">${password}</span></p>
          </div>
          <p style="font-size:1rem;color:#666;text-align:center;margin-bottom:24px;">Please change your password after logging in for security purposes.</p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="http://localhost:3001/login" style="
              display:inline-block;
              background: linear-gradient(90deg, #6366f1 0%, #f472b6 100%);
              color:#fff;
              padding: 14px 32px;
              font-size:1.08rem;
              font-weight:600;
              text-decoration:none;
              border-radius: 8px;
              box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);
              transition: background 0.3s, box-shadow 0.3s;
              letter-spacing:0.5px;
            ">Login Now</a>
          </div>
          <p style="font-size:0.98rem;color:#999;text-align:center;margin-bottom:0;">If you didn't request this, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;">
          <p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
      <style>
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      </style>
    </div>
  `,
});

// User Account Update Email
export const userAccountUpdatePayload = ({ name, email }) => ({
  to: email,
  subject: "Your Account Details Updated",
  text: `Hello ${name}, your account details have been updated successfully.`,
  html: `
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;">
      <div style="
        max-width: 480px;
        margin: 40px auto;
        padding: 32px 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        position: relative;
        overflow: hidden;
        animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;
      ">
        <svg width="100%" height="100" viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;z-index:0;pointer-events:none;">
          <defs>
            <linearGradient id="paint1_linear" x1="0" y1="0" x2="480" y2="100" gradientUnits="userSpaceOnUse">
              <stop stop-color="#a5b4fc"/>
              <stop offset="1" stop-color="#f472b6"/>
            </linearGradient>
          </defs>
          <ellipse cx="240" cy="50" rx="220" ry="40" fill="url(#paint1_linear)" fill-opacity="0.18"/>
        </svg>
        <div style="position:relative;z-index:1;">
          <h2 style="text-align:center;color:#333;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Your Account Details Updated</h2>
          <p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p>
          <p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">Your account details have been <span style="color:#6366f1;font-weight:600;">updated</span> successfully. If you made this change, please ignore this email. If not, please contact support.</p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="http://localhost:3001/login" style="
              display:inline-block;
              background: linear-gradient(90deg, #6366f1 0%, #f472b6 100%);
              color:#fff;
              padding: 14px 32px;
              font-size:1.08rem;
              font-weight:600;
              text-decoration:none;
              border-radius: 8px;
              box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);
              transition: background 0.3s, box-shadow 0.3s;
              letter-spacing:0.5px;
            ">Login Now</a>
          </div>
          <p style="font-size:0.98rem;color:#999;text-align:center;margin-bottom:0;">If you didn't request this, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;">
          <p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
      <style>
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      </style>
    </div>
  `,
});

// Add more payload templates as needed and export them here
