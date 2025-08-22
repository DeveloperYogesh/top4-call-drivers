import React from 'react';
import Link from 'next/link';

export default function ServiceCard({slug, title, excerpt}:{slug:string,title:string,excerpt?:string}){
  return (
    <Link href={'/services/'+slug}>
      <a className="block border rounded-lg p-4 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold">{title}</h3>
        {excerpt && <p className="mt-2 text-sm">{excerpt}</p>}
      </a>
    </Link>
  )
}
