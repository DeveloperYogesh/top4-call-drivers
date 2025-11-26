"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Heading = {
  title: string;
  slug: string;
};

type TableOfContentsProps = {
  headings: Heading[];
  customCss?: string;
};

const TableOfContents = (props: TableOfContentsProps) => {
  const { headings, customCss } = props;

  return (
    <section
      className={`rounded-lg right-2 mt-3 my-border w-full lg:max-w-md md:mt-5 lg:mt-56 h-fit lg:sticky lg:top-16 bg-zinc-50 ${customCss}`}
      id="table-of-contents"
    >
      <div className="px-4 py-2 md:py-4 bg-zinc-200 rounded-t-lg">
        <h6 className="font-normal m-0 text-zinc-900">Table of Contents</h6>
      </div>
      <ul className="space-y-2 pl-8 px-4 py-2 md:py-4 list-decimal">
        {headings.map((heading) => (
          <li key={heading.slug}>
            <Link
              href={`#${heading.slug}`}
              title={`${heading.title}`}
              className="text-zinc-700 hover:text-ownYellow"
            >
              {heading.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TableOfContents;
