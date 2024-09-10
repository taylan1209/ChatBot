'use client'

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Import the Label component
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import startNewChat from "@/lib/startNewChat";
import { GetChatbotByIdResponse, Message } from "@/types/types";
import { useQuery } from "@apollo/client";
import { useState } from "react"

function ChatbotPage({params: {id}}:{params:{id:string}}) {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Changed to boolean
  const [chatId, setChatId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const {data:chatBotData} = useQuery<GetChatbotByIdResponse>(GET_CHATBOT_BY_ID,
     {
    variables: {id},
  });

  const {
    loading: loadingQuery, 
    error,
    data,
  } = useQuery<MessagesByChatSessionIdResponse>(GET_MESSAGES_BY_CHAT_SESSION_ID,
    {
    variables:{chat_session_id:chatId},
    skip: !chatId,
  });
  }) 
    variables: { id },
  });
  }


  const handleInformationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const chatId= await startNewChat(name, email, Number(id));

    setChatId(chatId);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <div className="w-full flex bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleInformationSubmit} >

          <DialogHeader>
            <DialogTitle>
            Lets help you out
            </DialogTitle>
            <DialogDescription>
              I just need a few details to get started
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
          className="col-span-3"
           />
          </div>

           <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Email
          </Label>
          <Input id="username" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className="col-span-3" 
           />
          </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name||!email||loading}>
              {!loading? "Continue" : "Loading..."} 
            </Button> 
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
        <div className="pb-4 border-b sticky top-0 z-50 bg-[#4D7DFB] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4">
          <Avatar seed= {chatBotData?.chatbots.name!}
          className="h-12 w-12 bg-white rounded-full border-2 border-white"
          />
          <div>
            <h1 className="truncate text-lg">{chatBotData?.chatbots.name}</h1>
            <p className="text-sm text-gray-300">
              Typically replies Instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatbotPage