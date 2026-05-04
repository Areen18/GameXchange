# QR Code Payment GUI - Testing Guide

## 🎯 How to See the QR Code Payment GUI

The QR code payment interface will appear in the **Manual Trade Detail Modal** when specific conditions are met.

---

## ✅ Prerequisites

### 1. Server Must Be Running
```bash
npm run dev
```

You should see:
```
[0] GameXchange API running on http://localhost:4000
[1] ➜  Local:   http://localhost:3001/
```

### 2. Two User Accounts Needed
You need **two different accounts** to test the complete flow:
- **Seller Account** - Creates listings and provides payment info
- **Buyer Account** - Purchases accounts and sees QR code

---

## 📋 Step-by-Step Testing Guide

### Step 1: Create Seller Account (or use existing)

**Option A: Use Existing Test Account**
```
Email: seller.raven@gamexchange.dev
Password: SeedAccount123!
```

**Option B: Create New Account**
1. Go to http://localhost:3001
2. Click "Sign Up"
3. Create account with:
   - Full Name: Test Seller
   - Email: testseller@example.com
   - Password: TestPass123!

### Step 2: Create a Listing (as Seller)

1. Log in as seller
2. Click profile icon → "Create Listing"
3. Fill in the form:
   - Region: NA
   - Level: 100
   - Rank: Diamond 1
   - Skins: 20
   - Price: 5000
   - Transfer Email: test@example.com
   - Transfer Password: testpass123
4. Click "List Account"

### Step 3: Create Buyer Account

**IMPORTANT:** You need a **different account** to be the buyer!

1. Log out from seller account
2. Sign up with new account:
   - Full Name: Test Buyer
   - Email: testbuyer@example.com
   - Password: TestPass123!

### Step 4: Create a Trade (as Buyer)

1. Log in as buyer (testbuyer@example.com)
2. Browse marketplace
3. Find the listing you created
4. Click "View Details"
5. Click "Buy Now"
6. Confirm purchase

**Result:** Trade is created with status `pending_payment`

### Step 5: Add Payment Info (as Seller)

1. Log out from buyer account
2. Log in as seller (seller.raven@gamexchange.dev or testseller@example.com)
3. Click profile icon → "Active Trades"
4. Find the trade (should show "Selling" badge)
5. Click on the trade to open details
6. You should see: **"Action Required: Provide Payment Details"**
7. Click "Add Payment Details"
8. Enter:
   - **QR Code URL:** `https://via.placeholder.com/300x300.png?text=Test+QR+Code`
   - **UPI ID:** `testseller@upi`
   - **Instructions:** `Please pay ₹5000 to this UPI ID`
9. Click "Submit Payment Info"

### Step 6: View QR Code (as Buyer) ⭐

1. Log out from seller account
2. Log in as buyer (testbuyer@example.com)
3. Click profile icon → "Active Trades"
4. Find the trade (should show "Buying" badge)
5. Click on the trade to open details

**🎉 YOU SHOULD NOW SEE:**
- ✅ **Payment Information** section
- ✅ **QR Code image** (the placeholder image)
- ✅ **UPI ID** with copy button
- ✅ **Payment instructions**
- ✅ **Amount to Pay** highlighted
- ✅ **"I Have Completed Payment"** button

---

## 🖼️ What the QR Code GUI Looks Like

```
┌─────────────────────────────────────────────────────┐
│  💳 Payment Information                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Scan QR Code to Pay:                              │
│  ┌─────────────────────────────────────────┐       │
│  │                                         │       │
│  │         [QR CODE IMAGE]                 │       │
│  │                                         │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│  UPI ID:                                           │
│  ┌─────────────────────────────────────────┐       │
│  │ testseller@upi                    [📋]  │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│  Instructions:                                     │
│  Please pay ₹5000 to this UPI ID                   │
│                                                     │
│  💰 Amount to Pay: ₹5,250                          │
│                                                     │
│  ┌─────────────────────────────────────────┐       │
│  │   I Have Completed Payment              │       │
│  └─────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 Troubleshooting

### Issue: "QR Code not showing"

#### Check 1: Are you logged in as the BUYER?
- The QR code only shows to the **buyer**
- If you're the seller, you won't see it
- Log in with the buyer account

#### Check 2: Did the seller add payment info?
- Open browser console (F12)
- Check the trade object:
```javascript
// In console, check:
console.log(selectedTrade);
// Should show:
// payment_qr_code: "https://..."
// payment_upi_id: "testseller@upi"
```

#### Check 3: Is the trade status correct?
- Trade status must be `pending_payment`
- Check in Active Trades list
- Status badge should show "Pending Payment"

#### Check 4: Check the API response
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh Active Trades
4. Find the `/api/trades` request
5. Check the response:
```json
{
  "trades": [{
    "id": "...",
    "status": "pending_payment",
    "type": "buy",
    "payment_qr_code": "https://...",
    "payment_upi_id": "testseller@upi"
  }]
}
```

### Issue: "Trade not showing in Active Trades"

1. Make sure you're logged in as buyer or seller
2. Refresh the page
3. Check if trade was created successfully
4. Look in browser console for errors

### Issue: "Cannot add payment info"

1. Make sure you're logged in as the **seller**
2. Trade status must be `pending_payment`
3. Check browser console for API errors

---

## 🧪 Quick Test with Sample QR Code

If you want to test quickly without creating accounts:

### Use These Test QR Code URLs:

**Option 1: Placeholder Image**
```
https://via.placeholder.com/300x300.png?text=Test+QR+Code
```

**Option 2: Sample UPI QR Code**
```
https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=upi://pay?pa=test@upi%26pn=TestSeller%26am=5000
```

**Option 3: Base64 Image**
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==
```

---

## 📊 Complete Flow Diagram

```
SELLER                          BUYER
  │                              │
  ├─ Create Listing              │
  │                              │
  │                              ├─ Browse & Buy
  │                              │
  ├─ Receive Email ◄─────────────┤ Trade Created
  │  "Buyer wants to purchase"   │
  │                              │
  ├─ Add Payment Info            │
  │  • QR Code URL               │
  │  • UPI ID                    │
  │  • Instructions              │
  │                              │
  │                              ├─ View QR Code ⭐
  │                              │  • See QR image
  │                              │  • Copy UPI ID
  │                              │  • Read instructions
  │                              │
  │                              ├─ Complete Payment
  │                              │  (Outside app)
  │                              │
  │                              ├─ Click "Payment Completed"
  │                              │
  ├─ Receive Email ◄─────────────┤ Payment Reported
  │  "Buyer reported payment"    │
  │                              │
  ├─ Verify Payment              │
  │  (Check bank/UPI app)        │
  │                              │
  ├─ Submit Credentials          │
  │  • Riot ID                   │
  │  • Password                  │
  │                              │
  │                              ├─ View Credentials
  │                              │  • Copy Riot ID
  │                              │  • Copy Password
  │                              │
  │                              ├─ Verify Account
  │                              │  (Log into Riot)
  │                              │
  │                              ├─ Confirm Receipt
  │                              │
  ├─ Trade Completed ◄───────────┤ Trade Completed
  │                              │
```

---

## 🎯 Expected Behavior at Each Stage

### Stage 1: Trade Created (pending_payment)
- **Seller sees:** "Action Required: Provide Payment Details" button
- **Buyer sees:** "Waiting for seller to add payment information"

### Stage 2: Payment Info Added (pending_payment)
- **Seller sees:** "Waiting for buyer to complete payment"
- **Buyer sees:** ⭐ **QR CODE + UPI ID + "I Have Completed Payment" button**

### Stage 3: Payment Reported (payment_reported)
- **Seller sees:** "Action Required: Share Credentials" button
- **Buyer sees:** "Waiting for seller to share credentials"

### Stage 4: Credentials Shared (credentials_shared)
- **Seller sees:** "Waiting for buyer confirmation"
- **Buyer sees:** Riot ID + Password + "Confirm Account Received" button

### Stage 5: Completed (completed)
- **Both see:** "Trade Completed Successfully" ✅

---

## 💡 Pro Tips

1. **Use Two Browsers:** Open Chrome for seller, Firefox for buyer
2. **Use Incognito Mode:** Easier to manage multiple accounts
3. **Keep DevTools Open:** Monitor API calls and errors
4. **Test with Real QR:** Use a real UPI QR code generator for realistic testing
5. **Check Email:** Make sure email notifications are working

---

## 🔗 Useful Links

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:4000
- **API Health:** http://localhost:4000/api/health
- **Test Page:** Open `test-frontend-api.html` in browser

---

## ✅ Checklist

Before reporting issues, verify:

- [ ] Server is running (both frontend and backend)
- [ ] Using two different accounts (seller and buyer)
- [ ] Trade was created successfully
- [ ] Seller added payment info (QR code or UPI ID)
- [ ] Logged in as **buyer** when checking for QR code
- [ ] Trade status is `pending_payment`
- [ ] Checked browser console for errors
- [ ] Checked Network tab for API responses

---

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ Seller can add payment QR code/UPI
2. ✅ Buyer sees the QR code image
3. ✅ Buyer can copy UPI ID
4. ✅ Buyer can click "I Have Completed Payment"
5. ✅ Status updates to `payment_reported`
6. ✅ Seller receives notification

---

**Need Help?** Check the browser console (F12) for error messages and API responses.

**Last Updated:** April 22, 2026  
**Status:** Manual Payment System Active ✅
