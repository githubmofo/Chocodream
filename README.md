# ChocoDream - Premium Chocolate Experience

<img width="1899" height="968" alt="image" src="https://github.com/user-attachments/assets/f47fc311-3f9b-4e4d-829b-6effd89dfe7b" />

**Live Demo:** [https://chocodream.vercel.app/](https://chocodream.vercel.app/)

ChocoDream is a modern, elegant e-commerce website specializing in **premium, handcrafted chocolates**. It showcases luxury bean-to-bar chocolate experiences with a focus on ethically sourced, high-quality cacao, artisanal production, and exclusive limited-edition offerings.

The site highlights indulgence, sustainability, and gifting — perfect for chocolate connoisseurs, luxury gift buyers, and special occasions.

## ✨ Key Features

- Clean, luxurious minimalistic design with dark chocolate-inspired aesthetics
- Responsive layout (mobile-first experience)
- Product showcase with detailed descriptions (origin, cacao %, tasting notes)
- Interactive shopping cart with real-time total updates
- "Add to Cart" and Checkout flow
- Highlight sections for premium quality, gifting, and fast delivery
- Strong calls-to-action ("Explore Collection", "Add to Cart")
- Emphasis on storytelling: cacao origin, bean-to-bar process, ethical sourcing

## Demo Products (as showcased on the site)

| Product                        | Description                                      | Cacao %       | Origin                          | Price Range    | Notes                          |
|-------------------------------|--------------------------------------------------|---------------|---------------------------------|----------------|--------------------------------|
| To’ak Chocolate — Art Series  | Pinnacle of bean-to-bar chocolate                | 80%           | Piedra de Plata, Manabí, Ecuador| ₹20,000+       | Micro-lot, numbered bars, heirloom Nacional cacao |
| (More premium chocolates)     | Additional handcrafted bars expected             | Varies        | Global sustainable farms        | Premium range  | Beautiful gift packaging       |

*Note: Current version prominently features ultra-premium / collector-edition chocolates.*

## Tech Stack

- **Frontend Framework**: React (likely with Next.js — given Vercel deployment)
- **Styling**: Tailwind CSS / Custom CSS (clean, modern typography & layout)
- **State Management**: React Context / Zustand / Redux Toolkit (for cart)
- **Deployment**: Vercel
- **Icons/Emojis**: Used for visual highlights (premium quality ✨, gifts 🎁, delivery 🚚)
- **Other possible libraries**: React Router (if multi-page), Framer Motion (subtle animations)

## Project Structure (typical)

chocodream/
├── public/                 # static assets, images, favicon
├── src/
│   ├── components/         # reusable: Header, Footer, ProductCard, Cart, Button...
│   ├── pages/              # Home, Products, possibly Cart, Checkout
│   ├── assets/             # product images, hero banners
│   ├── context/            # Cart context / global state
│   ├── styles/             # global CSS or Tailwind config
│   └── App.jsx / main.jsx
├── .gitignore
├── package.json
├── README.md
└── vercel.json             (if custom Vercel config)

Contact / Creator

Built by: JENISH
Location: Ahmedabad, Gujarat, India
Live Site: https://chocodream.vercel.app/
