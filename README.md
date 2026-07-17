# Doctor Portfolio Website

A professional portfolio website for medical practitioners with integrated blog and appointment booking system.

## Features

### Public Site
- **Hero Section** - Professional landing with key statistics
- **About Section** - Doctor profile and credentials
- **Services Section** - Medical services offered
- **Testimonials** - Patient reviews
- **Contact Section** - Contact information and location

### Blog System
- Public blog listing and individual post pages
- Admin dashboard for creating and managing blog posts
- Support for cover images and rich content
- Draft and published status

### Appointment Booking
- Public appointment request form with validation
- Admin dashboard to view and manage appointments
- Email, phone, and date/time selection
- Status tracking (pending, confirmed, cancelled)

### Admin Dashboard
- Secure authentication system
- Blog post management (create, edit, view)
- Appointment management
- Protected routes with middleware

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Form Validation**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
The `.env` file should already contain:
```
DATABASE_URL="file:./dev.db"
```

3. Run database migrations (already done):
```bash
npx prisma migrate dev
```

4. Seed the database with admin user:
```bash
npm run seed
```

This creates an admin user with:
- **Email**: `admin@example.com`
- **Password**: `admin123`

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── (public routes)
│   │   ├── page.tsx              # Homepage
│   │   ├── blog/                 # Blog pages
│   │   ├── appointments/         # Booking form
│   │   └── api/                  # API routes
│   └── admin/                    # Protected admin routes
│       ├── login/                # Admin login
│       ├── dashboard/            # Admin dashboard
│       ├── blog/                 # Blog management
│       └── appointments/         # Appointment management
├── components/
│   ├── sections/                 # Homepage sections
│   ├── layout/                   # Header & Footer
│   └── ui/                       # shadcn components
├── lib/
│   ├── prisma.ts                 # Database client
│   └── auth.ts                   # Auth configuration
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeder
└── middleware.ts                 # Route protection
```

## Database Schema

### Models
- **User** - Admin users (doctors)
- **BlogPost** - Blog articles
- **Appointment** - Patient appointments
- **Testimonial** - Patient reviews
- **Service** - Medical services offered

## Admin Access

1. Navigate to `/admin/login`
2. Use the credentials from the seed script
3. Access the dashboard at `/admin/dashboard`

### Admin Features
- **Blog Management**: Create, edit, publish/unpublish posts
- **Appointments**: View all appointment requests with patient details
- **Dashboard**: Quick access to all admin functions

## Customization

### Update Doctor Information
Edit the following files:
- `components/sections/hero-section.tsx` - Hero content and stats
- `components/sections/about-section.tsx` - About information
- `components/sections/services-section.tsx` - Services offered
- `components/sections/contact-section.tsx` - Contact details
- `components/layout/header.tsx` - Site name and branding
- `components/layout/footer.tsx` - Footer information

### Add Doctor Photo
Replace the placeholder in `components/sections/about-section.tsx` with an actual image.

### Styling
- Colors and theme can be customized in `app/globals.css`
- Component styles use Tailwind CSS classes
- Primary color is blue-600 (can be changed globally)

## API Endpoints

- `POST /api/auth/[...nextauth]` - Authentication
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create new blog post (auth required)
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment request

## Security

- Admin routes protected by middleware
- Password hashing with bcrypt
- JWT-based session management
- CSRF protection enabled

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Set up the following:
- `DATABASE_URL` - Production database connection
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your production URL

## Future Enhancements

Consider adding:
- Email notifications for new appointments
- Rich text editor for blog posts
- Image upload functionality
- Patient portal for managing appointments
- Online payment integration
- Multiple doctor support
- Calendar integration

## License

Private project - All rights reserved

## Support

For issues or questions, contact the development team.
