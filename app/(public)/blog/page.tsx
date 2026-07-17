import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  absoluteUrl,
  BLOG_OG_FALLBACK_IMAGE,
  BUSINESS_DETAILS,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Medical Blog",
  description:
    "Read expert articles on preventive care, chronic condition management, healthy living, and patient education.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Medical Blog",
    description:
      "Medical insights, wellness guidance, and practical healthcare tips from our clinic team.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: BLOG_OG_FALLBACK_IMAGE,
        width: 1200,
        height: 630,
        alt: "Dr. Portfolio medical blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical Blog",
    description:
      "Medical insights, wellness guidance, and practical healthcare tips from our clinic team.",
    images: [BLOG_OG_FALLBACK_IMAGE],
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Dr. Portfolio Medical Blog",
    description:
      "Medical insights and practical wellness guidance from trusted healthcare professionals.",
    url: absoluteUrl("/blog"),
    publisher: {
      "@type": "MedicalOrganization",
      name: BUSINESS_DETAILS.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg"),
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Medical Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Health tips, medical insights, and wellness advice from our experts
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <Card className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="p-4">
                      {post.coverImage ? (
                        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mb-4 aspect-[4/3] w-full rounded-xl bg-gray-100" />
                      )}

                      <h2 className="line-clamp-2 text-lg font-bold text-gray-900">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {post.excerpt}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                            {getInitials(post.author.name)}
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            {post.author.name}
                          </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-600" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
