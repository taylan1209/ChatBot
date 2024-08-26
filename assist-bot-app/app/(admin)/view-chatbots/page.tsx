import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";

import { GET_CHATBOTS_BY_USER } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
    Chatbot,
    GetChatbotsByUserData,
    GetChatbotsByUserDataVariables,
} from "@/types/types";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function ViewChatbots() {
  const { userId } = auth();
  if (!userId) return;

  try {
    const response = await serverClient.query<
      GetChatbotsByUserData,
      GetChatbotsByUserDataVariables
    >({
      query: GET_CHATBOTS_BY_USER,
      variables: { clerk_user_id: userId },
    });

    // Check if response and chatbotsByUser exist
    const chatbotsByUser: Chatbot[] = response?.data?.chatbotsByUser || [];

    const sortedChatbotsByUser: Chatbot[] = chatbotsByUser.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return (
      <div className="flex-1 pb-20 p-10">
        <h1 className="text-2xl font-bold mb-4">
          Active Bots
        </h1>

        {sortedChatbotsByUser.length === 0 ? (
          <div>
            <p>
              You have not created any chatbots yet. Click on the button below to create one.
            </p>
            <Link href="/create-chatbot">
              <Button className="bg-blue-500 text-white p-3 rounded-md mt-5">
                Create Chatbot
              </Button>
            </Link>
          </div>
        ) : (
          <ul>
            {sortedChatbotsByUser.map((chatbot) => (
              <Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`}>
                <li className="relative mb-4 p-4 border rounded-lg shadow-sm hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar seed={chatbot.name} />
                    <h2 className="text-xl font-bold ">{chatbot.name}</h2>
                  </div>
                  <p className="absolute top-5 right-5 text-xs text-gray-400">
                    Created: {new Date(chatbot.created_at).toLocaleString()}
                  </p>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching chatbots:", error);
    return (
      <div className="flex-1 pb-20 p-10">
        <h1 className="text-2xl font-bold mb-4">Active Bots</h1>
        <p className="text-red-500">Failed to load chatbots. Please try again later.</p>
      </div>
    );
  }
}

export default ViewChatbots;
