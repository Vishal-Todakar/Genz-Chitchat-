import { sendOtpEmail, isEmailConfigured, verifyEmailConfig } from '../services/email';
import { env } from '../config/env';

async function main() {
  const recipient = process.argv[2];

  console.log('\n========================================');
  console.log('  📧 Genz chitchat — Email Test Utility');
  console.log('========================================\n');

  console.log('Configuration Summary:');
  console.log(`  • Provider:   ${env.EMAIL_PROVIDER}`);
  console.log(`  • Host:       ${env.SMTP_HOST}`);
  console.log(`  • Port:       ${env.SMTP_PORT} (Secure: ${env.SMTP_SECURE})`);
  console.log(`  • User:       ${env.SMTP_USER || '(NOT SET)'}`);
  console.log(`  • Pass:       ${env.SMTP_PASS ? '********' : '(NOT SET)'}`);
  console.log(`  • From:       ${env.EMAIL_FROM}`);
  console.log(`  • Configured: ${isEmailConfigured() ? 'YES ✅' : 'NO ❌'}\n`);

  if (!recipient || !recipient.includes('@')) {
    console.error('❌ Error: No valid recipient address provided.\n');
    console.log('Usage:');
    console.log('  npm run test:email -- your-email@example.com\n');
    console.log('Example:');
    console.log('  npm run test:email -- alex@gmail.com\n');
    process.exit(1);
  }

  // 1. Verify connection
  console.log(`Step 1: Verifying SMTP connection to ${env.SMTP_HOST}...`);
  const verification = await verifyEmailConfig();
  if (!verification.ok) {
    console.error(`\n❌ SMTP Connection Check Failed:`);
    console.error(`  ${verification.message}\n`);
    console.log('👉 Please ensure SMTP_USER and SMTP_PASS (Gmail App Password) are correctly configured in server/.env.');
    process.exit(1);
  }

  // 2. Send test email
  const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`\nStep 2: Sending test OTP email (${testOtp}) to ${recipient}...`);

  try {
    const result = await sendOtpEmail({
      to: recipient,
      otp: testOtp,
      expiryMinutes: 5,
    });

    console.log('\n🎉 SUCCESS! Test email was successfully accepted by SMTP server.');
    console.log(`  • Message ID: ${result.messageId}`);
    console.log(`  • Recipient:  ${recipient}`);
    console.log(`  • Code Sent:  ${testOtp}`);
    console.log('\nCheck the inbox (and spam/junk folder) of the recipient to confirm arrival.\n');
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ FAILED TO DELIVER EMAIL:');
    console.error(`  ${err.message || String(err)}\n`);
    console.log('Common fixes:');
    console.log('  1. For Gmail: Use a 16-character App Password (not your normal Gmail password).');
    console.log('  2. For Port 465: Ensure SMTP_SECURE=true. For Port 587: Set SMTP_SECURE=false.');
    console.log('  3. Check that your network/firewall permits outbound connections to port 465/587.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
