import client from "@/components/config/contentful";
import { APP_CONFIG } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import {
  generateMetadata as generateSEOMetadata,
  generateStructuredData,
} from "@/lib/seo";

export const revalidate = 60;
export const metadata = generateSEOMetadata({
  title: "TOP4 Call Drivers Blogs",
  description:
    "Read safety tips, customer stories, and service updates from TOP4 Call Drivers – your trusted professional driver partner across Tamil Nadu.",
  keywords: [
    "driver safety tips",
    "car travel blog",
    "top4 call drivers news",
    "acting drivers insights",
  ],
  url: "/blog",
});

async function getData() {
  try {
    const response = await client.getEntries({ content_type: "blog" });
    return response.items || [];
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return [];
  }
}

function toAbsoluteUrl(raw?: string | null | undefined) {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
  if (/^images\.ctfassets\.net/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

const blogCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "TOP4 Call Drivers Blog",
  description:
    "Insights, safety tips, and product updates from TOP4 Call Drivers across Tamil Nadu.",
  url: `${APP_CONFIG.url}/blog`,
  publisher: {
    "@type": "Organization",
    name: APP_CONFIG.name,
    url: APP_CONFIG.url,
  },
};
const blogBreadcrumbSchema = generateStructuredData("breadcrumb", {
  items: [
    { name: "Home", url: APP_CONFIG.url },
    { name: "Blog", url: `${APP_CONFIG.url}/blog` },
  ],
});

const Blog = async () => {
  const data = await getData();

  return (
    <div className="pb-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogCollectionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogBreadcrumbSchema),
        }}
      />
      <div>
        <div className="bg-zinc-100 pt-10 pb-10 px-5 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-4 !text-4xl font-bold text-gray-800">
              TOP4 Call Drivers Blogs
            </h1>
            <p className="text-gray-600">
              Explore driving tips, customer stories, safety advice, and updates
              from TOP4 Call Drivers — Chennai’s most reliable chauffeur and
              acting driver service. Stay informed, drive safe, and travel with
              confidence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1170px] mx-auto p-5">
          {data?.map((item: any, i: number) => {
            const blogData = item.fields ?? {};
            const rawUrl = blogData?.heroImage?.fields?.file?.url as
              | string
              | undefined;
            const absoluteUrl = toAbsoluteUrl(rawUrl);

            return (
              <div key={blogData?.slug ?? i} className="max-w-md">
                <div className="bg-white my-border h-full cursor-pointer group rounded-sm overflow-hidden">
                  <Link
                    href={`/blog/${blogData?.slug}`}
                    title={blogData?.title ?? "Blog Post"}
                    className="block hover:text-blue-800"
                  >
                    {absoluteUrl ? (
                      <div className="w-full h-[205px] relative">
                        <Image
                          src={absoluteUrl}
                          alt={blogData?.title ?? "blog image"}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-full bg-gray-200 h-[185px]" />
                    )}

                    <div className="p-4">
                      <h2 className="leading-tight text-zinc-700 group-hover:text-yellow-600 !text-xl font-semibold">
                        {blogData?.title}
                      </h2>
                      <p className="text-gray-600 line-clamp-6 mt-2">
                        {blogData?.firstParah}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blog;
