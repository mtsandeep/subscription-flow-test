# Tasks to Complete

This document outlines what you need to implement. Please read carefully.

## Scope

**What you SHOULD do:**
- ✅ Complete the existing TODO items in the codebase
- ✅ Implement the backend endpoints needed for the subscription flow
- ✅ Connect the frontend pages to create a working end-to-end flow

**What you should NOT do:**
- ❌ Add new features (cancel subscription, update profile, manage plans, etc.)
- ❌ Create new screens/pages (all 4 pages already exist - use them)
- ❌ Add authentication/login systems
- ❌ Implement admin features
- ❌ Add payment gateway integration

> Focus on quality over quantity. A clean, working implementation of the core flow is better than a half-baked feature-rich app.

---

## Backend Tasks

Design and implement the API endpoints needed for the subscription flow. You decide the request/response structure.

### 1. Coupon Validation
**File:** `server/routes/coupons.js`

**Flow:**
- User enters a coupon code on the Coupon page
- Validate if the coupon exists and has remaining uses
- Return the discount details to the frontend

**Things to consider:**
- What happens if the coupon doesn't exist?
- What happens if the coupon has reached max uses?
- What information does the frontend need to display the discount?

---

### 2. Subscribe
**File:** `server/routes/subscriptions.js`

**Flow:**
- User completes the flow and clicks "Subscribe" on the Summary page
- Create a subscription record in the database
- If a coupon was used, increment its usage count
- Return the subscription details

**Requirements:**
- Validate and create subscription record
- Design the `subscriptions` table schema yourself

**Things to consider:**
- What data do you need to store for a subscription?
- How do you ensure the coupon usage is updated during the subscription creation?
- What happens if two users try to use the last available coupon at the same time?

---

### 3. Get User's Subscription Details

**Flow:**
- When a returning user enters their username, fetch their profile
- If they already have a subscription, show their subscription details on the Profile page

---

## Frontend Tasks

All 4 pages already exist with UI components. Your job is to connect them to the backend APIs.

### 1. State Management
Implement a way to pass data between the 4 pages:
- User data (from Profile page)
- Selected plan (from Plan page)
- Applied coupon (from Coupon page)

You can use: React Context, localStorage, URL state, or any approach you prefer.

### 2. Page Refresh Handling
If the user refreshes at any step:
- Redirect back to `/profile`
- show `existingUser` view of the profile page with previously entered data

### 3. Connect the Flow

| Page | What to implement |
|------|-------------------|
| **Profile** | Create new user OR fetch existing user (by username). If user has subscription, show their plan details. |
| **Plan** | Fetch plans from API, allow user to select one |
| **Coupon** | Validate coupon via API, show discount if valid, allow skip |
| **Summary** | Show order summary with final price, call subscribe API on submit, redirect to profile on success |

---

## Evaluation Criteria

Your submission will be evaluated on:

1. **Correctness** - Does the flow work end-to-end?
2. **API Design** - Are the endpoints well-structured? Is the request/response sensible?
3. **Data Integrity** - Are database transactions used properly?
4. **Security** - Are common security best practices followed?
5. **Race Conditions** - Is coupon usage handled correctly with concurrent requests?
6. **Code Quality** - Is the code clean, readable, and well-organized?
7. **Decision Justification** - Can you explain why you made certain design choices?

---

## Tips

1. Start with the backend, test endpoints with curl or Postman
2. Then connect the frontend pages one by one
3. Test the complete flow before submitting
4. Edge cases to test:
   - Invalid coupon code
   - Coupon that reached max uses
   - User refreshes mid-flow
   - Existing username (returning user with/without subscription)
   - Two users trying to use the last coupon simultaneously
