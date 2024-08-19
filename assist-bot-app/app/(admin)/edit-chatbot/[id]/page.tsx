'use client'


import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/graphql/apolloClient";
import Link from "next/link";

import { useEffect, useState } from "react";

function EditChatbot({params:{id}}: {params:{id:string}}) {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;

    setUrl(url);
  }, [id])

    return (
      <div className='px-0 md:p-10'>
      <div className='md:sticky md:top-0 z-50 sm:max-w-sm ml-auto 
      space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2991EE]'>
      <h2 className='text-white text-sm font-bold'>Link to Chat</h2>
      <p className='text-sm italic text-white'> Share this link with 
      your customers to start conservations with your chatbot
      </p>
      <div>
        <Link href={url} className="w-full cursor-pointer 
        hover:opacity-50">
          <Input value={url} readOnly className="cursor-pointer" />
        </Link>
      </div>
      </div>
    </div>
    );
}

export default EditChatbot;