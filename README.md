# Hawthorn Booksellers

A premium, frontend-only bookstore built with React, TypeScript, Vite and React Router. The catalogue, cart, wishlist, checkout and account flows all run locally in the browser; there is no server, database or payment integration.

## Run locally

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
npm run lint
npm run preview
```

## What is included

- 36 original demo titles across 12 categories, with covers drawn in CSS/SVG.
- Home, catalogue, category, search, book detail, cart, checkout, order confirmation, wishlist, account, auth and support routes.
- Filtering by category, author, language, format, rating, price and stock; sorting and load-more pagination.
- Search suggestions with keyboard navigation, plus a full search page.
- Cart drawer, quantity controls, stock clamping and four demo coupons: `WELCOME10`, `READ15`, `SHELF20`, `FRESHIP`.
- Five-step demo checkout with inline validation and locally stored orders.
- Demo sign-in/registration, recently viewed books, wishlist and local persistence.
- Responsive layouts, reduced-motion support, focus-trapped overlays and accessible feedback.

## Demo boundaries

- Authentication accepts any password of six or more characters and stores only a name and email locally.
- Checkout never collects or processes real payment details; card fields are presentational.
- Orders, cart, wishlist, coupon and account data live in `localStorage` under the `bookstore_*` keys.
- Book data, reviews, stock and delivery estimates are fictional demo content.
