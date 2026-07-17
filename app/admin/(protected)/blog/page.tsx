"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AdminPost = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = (await response.json()) as AdminPost[];
        setPosts(data);
      } catch {
        setError("Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  async function handleDelete(postId: string) {
    setDeletingPostId(postId);
    setError("");

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch {
      setError("Failed to delete blog post.");
    } finally {
      setDeletingPostId(null);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-2">Manage your blog content</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/dashboard">
            <Button variant="outline">← Dashboard</Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create New Post
            </Button>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            Loading posts...
          </CardContent>
        </Card>
      ) : null}

      {!loading && posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No blog posts yet</p>
            <Link href="/admin/blog/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {!loading && posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
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

                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <Badge
                        className={
                          post.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {format(new Date(post.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/admin/blog/edit/${post.id}`} prefetch={false}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingPostId === post.id}
                        >
                          {deletingPostId === post.id ? "Deleting..." : "Delete"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete "{post.title}"?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            disabled={deletingPostId === post.id}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            disabled={deletingPostId === post.id}
                            onClick={() => handleDelete(post.id)}
                          >
                            {deletingPostId === post.id
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
