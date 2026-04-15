// Authentication Test Script
// Run with: node test-auth.js

const API_URL = 'http://localhost:4000/api';

async function testAuth() {
  console.log('🧪 Testing GameXchange Authentication System\n');

  // Test 1: Signup with weak password (should fail)
  console.log('Test 1: Signup with weak password');
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'weak',
        fullName: 'Test User'
      })
    });
    const data = await response.json();
    console.log(response.ok ? '❌ FAILED: Should reject weak password' : '✅ PASSED: Weak password rejected');
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  console.log('');

  // Test 2: Signup with strong password (should succeed)
  console.log('Test 2: Signup with strong password');
  const testEmail = `test${Date.now()}@example.com`;
  let authToken = null;
  let refreshToken = null;
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePass123!',
        fullName: 'Test User'
      })
    });
    const data = await response.json();
    console.log(response.ok ? '✅ PASSED: Strong password accepted' : '❌ FAILED: Should accept strong password');
    if (response.ok) {
      authToken = data.token;
      refreshToken = data.refreshToken;
      console.log('User created:', data.user.email);
      console.log('Token received:', authToken ? 'Yes' : 'No');
      console.log('Refresh token received:', refreshToken ? 'Yes' : 'No');
    } else {
      console.log('Response:', data);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  console.log('');

  // Test 3: Login with wrong password (should fail)
  console.log('Test 3: Login with wrong password');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword123!'
      })
    });
    const data = await response.json();
    console.log(!response.ok ? '✅ PASSED: Wrong password rejected' : '❌ FAILED: Should reject wrong password');
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  console.log('');

  // Test 4: Login with correct password (should succeed)
  console.log('Test 4: Login with correct password');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePass123!'
      })
    });
    const data = await response.json();
    console.log(response.ok ? '✅ PASSED: Correct password accepted' : '❌ FAILED: Should accept correct password');
    if (response.ok) {
      authToken = data.token;
      refreshToken = data.refreshToken;
      console.log('Login successful');
    } else {
      console.log('Response:', data);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  console.log('');

  // Test 5: Access protected endpoint with token (should succeed)
  console.log('Test 5: Access protected endpoint with valid token');
  if (authToken) {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      console.log(response.ok ? '✅ PASSED: Protected endpoint accessible' : '❌ FAILED: Should access with valid token');
      if (response.ok) {
        console.log('User data:', data.user);
      } else {
        console.log('Response:', data);
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  } else {
    console.log('⚠️  SKIPPED: No auth token available');
  }
  console.log('');

  // Test 6: Refresh token (should succeed)
  console.log('Test 6: Refresh access token');
  if (refreshToken) {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const data = await response.json();
      console.log(response.ok ? '✅ PASSED: Token refresh successful' : '❌ FAILED: Should refresh token');
      if (response.ok) {
        console.log('New token received:', data.token ? 'Yes' : 'No');
        console.log('New refresh token received:', data.refreshToken ? 'Yes' : 'No');
        authToken = data.token;
      } else {
        console.log('Response:', data);
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  } else {
    console.log('⚠️  SKIPPED: No refresh token available');
  }
  console.log('');

  // Test 7: Change password (should succeed)
  console.log('Test 7: Change password');
  if (authToken) {
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: 'SecurePass123!',
          newPassword: 'NewSecurePass456!'
        })
      });
      const data = await response.json();
      console.log(response.ok ? '✅ PASSED: Password changed successfully' : '❌ FAILED: Should change password');
      console.log('Response:', data);
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  } else {
    console.log('⚠️  SKIPPED: No auth token available');
  }
  console.log('');

  // Test 8: Logout (should succeed)
  console.log('Test 8: Logout');
  if (authToken) {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      console.log(response.ok ? '✅ PASSED: Logout successful' : '❌ FAILED: Should logout');
      console.log('Response:', data);
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  } else {
    console.log('⚠️  SKIPPED: No auth token available');
  }
  console.log('');

  // Test 9: Rate limiting (should fail after 5 attempts)
  console.log('Test 9: Rate limiting (attempting 6 failed logins)');
  const rateLimitEmail = `ratelimit${Date.now()}@example.com`;
  let rateLimited = false;
  for (let i = 1; i <= 6; i++) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: rateLimitEmail,
          password: 'WrongPassword123!'
        })
      });
      const data = await response.json();
      if (response.status === 429) {
        console.log(`✅ PASSED: Rate limited after ${i} attempts`);
        console.log('Response:', data);
        rateLimited = true;
        break;
      } else {
        console.log(`Attempt ${i}: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ ERROR on attempt ${i}:`, error.message);
    }
  }
  if (!rateLimited) {
    console.log('❌ FAILED: Should be rate limited after 5 attempts');
  }
  console.log('');

  console.log('🎉 Authentication tests completed!');
}

// Run tests
testAuth().catch(console.error);
