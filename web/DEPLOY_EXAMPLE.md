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

## 2. Initialize Next.js App

In the project directory:

```​powershell
fly launch
```​

## 3. Set Secrets

Replace the URLs below with your own deployment URLs:

```​powershell
fly secrets set NEXT_PUBLIC_USER_API_URL=https://user-api-xxxx.fly.dev NEXT_PUBLIC_SURVEY_API_URL=https://survey-api-xxxx.fly.dev NEXT_PUBLIC_USER_API_HEALTH_ENDPOINT=https://user-api-xxxx.fly.dev/health/ready NEXT_PUBLIC_SURVEY_API_HEALTH_ENDPOINT=https://survey-api-xxxx.fly.dev/health/ready
```​

## 4. Deploy the App

```​powershell
fly deploy
```​

## 5. Useful Commands

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
fly secrets unset NEXT_PUBLIC_USER_API_URL
```​
