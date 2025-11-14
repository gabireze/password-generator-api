# 🔐 Password Generator API

[![codecov](https://codecov.io/gh/gabireze/password-generator-api/branch/main/graph/badge.svg)](https://codecov.io/gh/gabireze/password-generator-api)

A secure and flexible password generation API built with [NestJS](https://nestjs.com/). Supports multiple formats including JSON, text, XML, CSV, YAML, and HTML.

## 🚀 Features

- Generate multiple random passwords with custom rules
- Format output as:
  - JSON
  - Plain Text
  - XML
  - CSV
  - YAML
  - HTML
- Exclude specific characters (e.g., `lIO0`)
- Choose custom separators and quoting
- Fully documented with Swagger (OpenAPI)
- Includes unit and E2E tests

## 📦 Installation

```bash
npm install
```

## 🧪 Run in development

```bash
npm run start:dev
```

## 🏗️ Build for production

```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

After running the app, visit:

```
http://localhost:3000/api
```

This loads the Swagger UI with all available endpoints.

## 🔄 Example request

### POST `/password/generate`

```json
{
  "length": 12,
  "uppercase": true,
  "lowercase": true,
  "numbers": true,
  "symbols": true,
  "quantity": 3,
  "format": "json"
}
```

#### Supported formats:  
`json` | `text` | `xml` | `csv` | `yaml` | `html`

## ✅ Run tests

```bash
npm run test        # Unit tests
npm run test:e2e    # End-to-End tests
npm run test:cov    # Coverage report
```

## 🧹 Code quality

```bash
npm run lint        # Check code style
npm run lint:fix    # Fix lint issues
npm run prettier:fix
```

## 🔧 Export OpenAPI docs (Swagger JSON)

```bash
npm run export:swagger
```

## 📁 Project Structure

```
src/
  ├── password/            # Password generator module
  ├── app.controller.ts    # Healthcheck route
  ├── swagger.ts           # Swagger export
  └── main.ts              # Entry point
```

<!-- GitAds-Verify: SR6LSW2ZG8BDVFYHQ1PJJ54GHH1DTAGZ -->
