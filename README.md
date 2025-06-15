# ZemenConverter - Ethiopian ↔️ Gregorian Date Converter

A modern, SEO-optimized web application for converting dates between Ethiopian and Gregorian calendars.

## Features

- Ethiopian ↔️ Gregorian date conversion
- Holiday and name day display
- Favorite dates saving
- Mobile and desktop optimized
- Clean, modern UI with black, white, and blue theme

## Tech Stack

- **Frontend**: Next.js 14
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Hosting**: Vercel
- **SEO**: next-seo
- **Ads**: Google AdSense

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
zemen-calender/
├── app/                    # Next.js 14 app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn components
│   └── converter/        # Date converter components
├── lib/                  # Utility functions
│   ├── utils.ts         # Helper functions
│   └── ethiopian-date.ts # Date conversion logic
├── prisma/              # Database schema and migrations
├── public/             # Static assets
└── styles/            # Global styles
```

## License

MIT