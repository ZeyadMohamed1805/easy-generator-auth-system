# Product

This application lets a person create an account, sign in, and reach a private welcome page. It is a focused sign-up / sign-in product, not a full learning platform.

## Who it is for

Anyone who needs to register with a name, email, and password, then return later with the same email and password.

## What they can do

1. **Sign up** with name, email, and password. After a successful sign-up they are signed in and see the application page.
2. **Sign in** with email and password. After a successful sign-in they see the application page.
3. **Open the application page**, which shows: “Welcome to the application.” The page also greets them by name.
4. **Sign out**, which ends the session and returns them to sign-in.

They cannot open the application page unless they have a valid session. If they are already signed in, sign-up and sign-in send them to the application page.

## Field rules

These rules apply whenever someone submits a form. The product rejects invalid values before creating an account or starting a session.

### Email

- Must be a valid email address.
- Compared without regard to letter case (stored in lowercase).
- Sign-up: if the email is already registered, the person is told it cannot be used.
- Sign-in: if the email or password is wrong, they see a generic “invalid credentials” message. The product does not say which field was wrong.

### Name (sign-up only)

- At least 3 characters after trimming spaces.
- At most 100 characters.

### Password

- At least 8 characters.
- At least one letter.
- At least one number.
- At least one special character (anything that is not a letter or a number).

## Session

A signed-in session is kept by the application, not by a token the person copies. Signing out ends that session. Sessions expire; the product can quietly refresh a still-valid session while they use the app.

## What this product does not do

Password reset, email verification, social sign-in, and user profiles beyond name and email are out of scope.
