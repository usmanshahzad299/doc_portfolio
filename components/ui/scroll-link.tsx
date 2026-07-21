"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface ScrollLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId: string;
  children: React.ReactNode;
}

export function ScrollLink({
  targetId,
  children,
  className,
  onClick,
  ...props
}: ScrollLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        // Update history state so URL hash updates without breaking repeat clicks
        window.history.pushState(null, "", `#${targetId}`);
      }
    } else {
      e.preventDefault();
      router.push(`/#${targetId}`);
    }
  };

  return (
    <a
      href={`/#${targetId}`}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
