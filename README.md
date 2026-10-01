# Multi-Vendor Booking & Reservation API

A scalable backend API for a **Multi-Vendor Booking & Reservation platform** built with **Node.js, Express.js, and MongoDB**, supporting vendor-based services, time-slot booking, secure payments, role-based access control, and customer reviews.

**Live Server:** `YOUR_LIVE_SERVER_URL`

---

## Key Features

* **Authentication & RBAC:** JWT-based authentication with role-specific permissions for **Customer, Owner, and Admin**.

* **Multi-Vendor Management:** Vendors can manage their own businesses, services, working hours, and available booking slots.

* **Service & Slot Management:** Vendors can create services and generate available time slots based on service duration and scheduling.

* **Booking Management:** Customers can book available service slots, view their bookings, and cancel bookings when needed, with cancelled slots becoming available again.

* **Secure Online Payments:** **Paymob** integration for card payments with webhook-based payment confirmation.

* **Payment Management:** Booking-based payment records supporting **cash and card** payment methods.

* **Customer Reviews:** Customers can review services after completing a booking, with rating and comment support and prevention of duplicate reviews for the same service.

* **API Query Features:** Reusable **pagination, filtering, sorting, field selection, and keyword search** for supported collection endpoints.

* **Validation & Error Handling:** Joi validation, reusable middleware, async error handling, custom application errors, and centralized error management.

## User Roles

* **Customer:** Browses vendors and services, views available slots, creates and cancels bookings, manages payments, and submits reviews for completed services.

* **Owner:** Manages owned vendors, services, slots, and accesses bookings related to their vendors.

* **Admin:** Has access to system-wide administrative operations and all bookings.

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

## Tech Stack & Architecture

* **Backend:** Node.js, Express.js

* **Database:** MongoDB, Mongoose

* **Authentication:** JWT, bcrypt

* **Validation:** Joi

* **Payments:** Paymob API, Webhooks

* **Architecture:** Modular MVC, reusable middleware, centralized error handling, and reusable API feature utilities.

* **Query Utilities:** Pagination, filtering, sorting, field selection, and keyword search.

## API Documentation

**Postman Collection:** `YOUR_POSTMAN_DOCUMENTATION_URL`

The API documentation contains the available endpoints, request examples, authentication requirements, and supported API operations.



## API Query Examples

The API supports reusable query features on supported collection endpoints.

**Pagination**

```text
?page=2
```

**Filtering**

```text
?price[gte]=500
```

**Sorting**

```text
?sort=-price
```

**Field Selection**

```text
?fields=title,price
```

**Keyword Search**

```text
?keyword=doctor
```

Multiple query features can be combined when supported by the endpoint.


## Error Handling

The API uses centralized error handling with reusable asynchronous error handling and custom application errors to provide consistent API responses.

## Security & Authorization

* JWT-based authentication
* Password hashing with bcrypt
* Role-based authorization
* Protected resources
* Owner-based access control
* Customer booking ownership checks
* Payment ownership validation
* Joi request validation
* Paymob webhook verification


```
