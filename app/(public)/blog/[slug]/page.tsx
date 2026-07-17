import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  absoluteUrl,
  BLOG_OG_FALLBACK_IMAGE,
  BUSINESS_DETAILS,
} from "@/lib/site-config";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const getPublishedPostBySlug = cache(async (slug: string) => {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true },
  });
});

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post || !post.published) {
    return {
      title: "Post Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const postImage = post.coverImage || BLOG_OG_FALLBACK_IMAGE;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name],
      images: [
        {
          url: postImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [postImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const post = await getPublishedPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const postImage = absoluteUrl(post.coverImage || BLOG_OG_FALLBACK_IMAGE);
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    image: [postImage],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
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
    <div className="min-h-screen bg-white py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema).replace(/</g, "\\u003c"),
        }}
      />
      <article className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button
              variant="outline"
              className="mb-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          <div className="mb-8 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={post.coverImage || BLOG_OG_FALLBACK_IMAGE}
              alt={post.title}
              width={1600}
              height={900}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-auto max-h-[400px] w-full object-cover"
            />
          </div>

          <header className="mb-8">
            <Badge className="bg-blue-100 text-blue-700 mb-4">
              {format(new Date(post.createdAt), "MMMM dd, yyyy")}
            </Badge>
            <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                {getInitials(post.author.name)}
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">
                  {post.author.name}
                </p>
                <p className="text-sm text-gray-500">Medical Professional</p>
              </div>
            </div>
          </header>

          <div
            className="prose-content max-w-none text-gray-700 [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
}
