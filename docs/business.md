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

## How it looks and feels

Sign-up and sign-in are a single centered form with the Easygenerator mark, the fields for that step, and a link to the other page. There is no extra marketing column.

Field mistakes show next to the field in a strong error color as soon as the person leaves the field. A field that already meets the rules shows a clear success color. Password rules on sign-up light up as they are met.

While the product is checking the account or ending the session, the person sees a spinner and cannot press the action again. Problems that come from the server (wrong sign-in details, an email that is already used, a network failure) appear as a toast at the top of the screen, not as a second error block in the form.

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
