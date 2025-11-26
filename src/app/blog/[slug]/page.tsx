/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { Metadata, ResolvingMetadata } from "next";
import TableOfContents from "@/components/common/tableOfContents";
import BlogCallToAction from "@/components/common/callToAction";
import client from "@/components/config/contentful";
import { APP_CONFIG } from "@/utils/constants";

export const revalidate = 60;

/**
 * Helper to coerce unknown values into a string (or undefined)
 * This protects the Metadata types from arbitrary objects returned by Contentful.
 */
const asString = (v: unknown): string | undefined => {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
};

/**
 * Helper to get Contentful asset URL from different shapes
 */
const getContentfulImageUrl = (img: any): string | undefined => {
  if (!img) return undefined;
  // Common Contentful asset shape: asset.fields.file.url
  const maybeUrl = img?.fields?.file?.url || img?.fields?.file?.url;
  if (typeof maybeUrl === "string" && maybeUrl.length > 0) return maybeUrl;
  // Or direct string stored in the field
  if (typeof img === "string" && img.length > 0) return img;
  return undefined;
};

// ---------------------- METADATA ----------------------
export async function generateMetadata(
  props: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = (props as any)?.params ?? {};
  const slug = String(params.slug ?? "");

  // Fetch blog post by slug
  const response = await client.getEntries({
    content_type: "blog",
    "fields.slug": slug,
    limit: 1,
  });

  const blogPost = response?.items?.[0];
  const data = (blogPost?.fields ?? {}) as Record<string, unknown>;

  const rawTitle = asString(data?.title) ?? "Blog";
  const metaTitle = asString(data?.metaTitle) ?? `${rawTitle} | ${APP_CONFIG.name}`;
  const metaDescription =
    asString(data?.metaDescription) ?? `Read ${rawTitle} – insights from ${APP_CONFIG.name}.`;

  // Attempt to extract hero image from Contentful shapes or fallback field
  const heroImgCandidate =
    getContentfulImageUrl((data as any)?.heroImage) || asString((data as any)?.heroImgUrl);
  const heroImgFull = heroImgCandidate
    ? heroImgCandidate.startsWith("http")
      ? heroImgCandidate
      : `https:${heroImgCandidate}`
    : undefined;

  // Use consistent canonical domain
  const canonicalUrl = `${APP_CONFIG.url}/blog/${encodeURIComponent(slug)}`;

  // Parent may have previous openGraph images — keep them
  const previousImages = (await parent).openGraph?.images ?? [];

  // Normalize openGraph images: accept array of strings or objects with url property
  const ogImages: Array<string | { url: string }> = [];
  if (Array.isArray(previousImages)) {
    for (const img of previousImages) {
      if (typeof img === "string") ogImages.push(img);
      else if (img && typeof (img as any).url === "string") ogImages.push({ url: (img as any).url });
    }
  }
  if (heroImgFull) ogImages.push(heroImgFull);

  // Build metadata object (strings only where required)
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      type: "article",
      images: ogImages.length > 0 ? ogImages : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: heroImgFull ? [heroImgFull] : undefined,
    },
  };
}

// ---------------------- PAGE COMPONENT ----------------------
export default async function BlogArticle(props: unknown) {
  const params = (props as any)?.params ?? {};
  const slug = String(params.slug ?? "");
  const canonicalUrl = `${APP_CONFIG.url}/blog/${encodeURIComponent(slug)}`;

  const response = await client.getEntries({
    content_type: "blog",
    "fields.slug": slug,
    limit: 1,
  });

  const blogPost = response.items?.[0];
  if (!blogPost) return <div>Post not found</div>;
  const data = blogPost.fields as any;

  const updatedAt = new Date(blogPost.sys.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const img = data?.heroImage;
  const imgUrl = getContentfulImageUrl(img) || asString(data?.heroImgUrl) || "";
  const fullImgUrl = imgUrl ? (imgUrl.startsWith("http") ? imgUrl : `https:${imgUrl}`) : undefined;
  const h1 = asString(data?.title) ?? "Blog";

  const headings: { title: string; slug: string }[] = [];

  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { file, title, description } = node.data.target.fields || {};
        const imageUrl = file?.url || "";
        const altText = description || title || "Contentful Image";
        const src = imageUrl ? `https:${imageUrl}` : "";
        return (
          <Image
            src={src}
            alt={altText}
            width={800}
            height={400}
            className="w-auto max-h-[400px] my-4"
            priority
            unoptimized
          />
        );
      },
      [BLOCKS.HEADING_2]: (node: any) => {
        const title = node.content?.[0]?.value ?? "";
        const slug = String(title).toLowerCase().replace(/\s+/g, "-");
        headings.push({ title, slug });
        return (
          <h2 id={slug} className="text-2xl mt-8">
            {title}
          </h2>
        );
      },
    },
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: h1,
    description: asString(data?.metaDescription) || data?.firstParah || "",
    image: fullImgUrl,
    author: {
      "@type": "Organization",
      name: APP_CONFIG.name,
    },
    publisher: {
      "@type": "Organization",
      name: APP_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${APP_CONFIG.url}/images/top4-call-drivers-logo.png`,
      },
    },
    dateModified: blogPost.sys.updatedAt,
    datePublished: blogPost.sys.createdAt,
    mainEntityOfPage: canonicalUrl,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_CONFIG.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${APP_CONFIG.url}/blog` },
      { "@type": "ListItem", position: 3, name: h1, item: canonicalUrl },
    ],
  };

  return (
    <section className="mx-auto px-5 py-16 2xl:p-20 max-w-[1570px] parah-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="lg:flex justify-around gap-2 lg:gap-4">
        <TableOfContents headings={headings} customCss="hidden lg:block" />
        <div className="max-w-[737px] mx-auto" id="content">
          <h1 className="text-4xl md:mb-6 xl:mb-8 text-center leading-tight">{h1}</h1>

          <div className="flex items-center justify-between mx-auto mb-5">
            <div className="flex items-center">
              <Image
                src="/favicon.ico"
                title={APP_CONFIG.name}
                alt={`${data?.title}`}
                height={40}
                width={40}
                quality={100}
                priority
                className="rounded-full mr-2"
              />
              <p>
                <span className="text-gray-900 font-semibold">By:</span> {APP_CONFIG.name}
              </p>
            </div>
            <p>
              <span className="text-gray-900 font-semibold ml-3">Last Updated:</span> {updatedAt}
            </p>
          </div>

          {fullImgUrl && (
            <Image
              src={fullImgUrl}
              className="border"
              alt={`${data?.title}`}
              height={1000}
              width={1000}
              quality={100}
              priority
              unoptimized
            />
          )}

          <p className="text-start mt-5">{data?.firstParah as any}</p>
          <TableOfContents headings={headings} customCss="md:hidden" />

          <div className="mt-5">
            {documentToReactComponents(data?.content as any, renderOptions)}
          </div>
        </div>

        <BlogCallToAction
          title={data?.ctcText}
          description={data?.ctcDescription}
          buttonText={data?.ctcButtonText}
          imgUrl={data?.ctcImage}
        />
      </div>
    </section>
  );
}
