# Fly.io Deployment Steps

## 1. Install Fly CLI (Windows)

Run in PowerShell:

```​powershell
iwr https://fly.io/install.ps1 -useb | iex
```​

Then log in:

```​powershell
fly auth login
```​

## 2. Initialize Flask App

In the project directory:

```​powershell
fly launch
```​

## 3. Set Secrets

Replace the sensitive values below with your own:

```​powershell
fly secrets set FLASK_ENV=production FLASK_DEBUG=0 FLASK_PORT=5000 FLASK_WEB_ORIGIN=https://web-xxxx.fly.dev FLASK_SECRET_KEY=your_secret_key FLASK_TOKEN_ISSUER=your_token_issuer FLASK_SQLALCHEMY_DATABASE_URI="postgresql+psycopg://username:password@host:5432/dbname?sslmode=disable" FLASK_EMAIL_PROVIDER=mailgun FLASK_EMAIL_API_URL=https://api.mailgun.net/v3/your-mailgun-domain/messages FLASK_EMAIL_API_KEY=your-mailgun-api-key
```​

## 4. Create PostgreSQL Instance

```​powershell
fly postgres create
```​

## 5. Attach Database to Flask App

```​powershell
fly postgres attach --app your-app-name your-postgres-instance
```​

## 6. Deploy the App

```​powershell
fly deploy
```​

## 7. Migrations

```​powershell
fly ssh console -a your-app-name
```​

```bash
flask --app app.app db upgrade
```​

## 8. Useful Commands

- View logs:

```​powershell
fly logs
```​

- SSH into container:

```​powershell
fly ssh console
```​

- List secrets:

```​powershell
fly secrets list
```​

- Unset a secret:

```​powershell
fly secrets unset FLASK_EMAIL_API_KEY
```​
