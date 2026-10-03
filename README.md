# Multi-Vendor Booking & Reservation API

A backend RESTful API for a **Multi-Vendor Booking & Reservation platform** built with **Node.js, Express.js, and MongoDB**.

The system allows customers to discover vendors, book services through available time slots, make online payments, and submit reviews.

**Live Server:** https://multi-vendor-production.up.railway.app/

## Features

* **Authentication & Authorization:** JWT authentication with role-based access control for Customer, Owner, and Admin.
* **Vendor Management:** Owners can manage their businesses, working hours, services, and booking slots.
* **Service & Slot Management:** Services with configurable duration, pricing, and automatically generated time slots.
* **Booking System:** Customers can book available slots, view their bookings, and cancel bookings.
* **Online Payments:** Paymob integration with Unified Checkout and webhook-based payment confirmation.
* **Reviews:** Customers can rate and review services with duplicate-review prevention.
* **API Query Features:** Pagination, filtering, sorting, field selection, and keyword search.
* **Validation & Error Handling:** Joi validation, reusable middleware, async error handling, and centralized error management.

## User Roles

* **Customer:** Browse vendors and services, book slots, manage payments, and submit reviews.
* **Owner:** Manage owned vendors, services, working hours, slots, and related bookings.
* **Admin:** Manage system-wide resources and access administrative operations.

## Booking Flow

```text
Customer
   ↓
Vendor
   ↓
Service
   ↓
Available Slot
   ↓
Booking
   ↓
Payment
   ↓
Review
```

## Tech Stack

* **Node.js 24.13.1**
* **Express.js**
* **MongoDB / Mongoose**
* **JWT / bcrypt**
* **Joi**
* **Paymob API & Webhooks**
* **Postman**
* **Railway**

## Installation

Clone the repository:

```bash
git clone https://github.com/gamal-dev1/Multi-Vendor
```

Install dependencies:

```bash
npm install
```

Create a .env file based on the environment variables listed below.

Start the server:

```bash
npm start
```

## Environment Variables

Create a `.env` file using the variables below.

```env
# DB_CONNECTION=mongodb://localhost:27017/multi-vendor
DB_ONLINE=
ROUND=
JWT_KEY=
PAYMOB_BASE_URL=https://accept.paymob.com
PAYMOB_INTEGRATION_ID=
PAYMOB_SECRET_KEY=
PAYMOB_PUBLIC_KEY=
PAYMOB_HMAC_SECRET=
BASE_URL=
```

> Payments run in **Paymob test mode**.


## API Documentation

**Postman Collection:**
[View Postman Documentation](https://documenter.getpostman.com/view/52617149/2sBYB1PUTR)

The documentation includes available endpoints, authentication requirements, request examples, and API operations.

## API Query Examples

Supported collection endpoints provide reusable query features:

```text
?page=2
?price[gte]=500
?sort=-price
?fields=title,price
?keyword=doctor
```

Multiple query parameters can be combined where supported.

## Security

* JWT authentication
* Password hashing with bcrypt
* Role-based authorization
* Owner-based resource access
* Booking and payment ownership checks
* Joi request validation
* Paymob webhook HMAC verification
