import "dotenv/config";
import { query } from "./server/db.js";

async function verifyAllUsers() {
  console.log("Verifying all existing users...");
  
  const result = await query(
    `UPDATE users 
     SET email_verified = TRUE,
         verification_token = NULL,
         verification_token_expires = NULL,
         updated_at = NOW()
     WHERE email_verified = FALSE
     RETURNING email, full_name`
  );
  
  if (result.rowCount > 0) {
    console.log(`✅ Verified ${result.rowCount} user(s):`);
    result.rows.forEach(user => {
      console.log(`   - ${user.full_name} (${user.email})`);
    });
  } else {
    console.log("✅ All users are already verified!");
  }
  
  process.exit(0);
}

verifyAllUsers().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
