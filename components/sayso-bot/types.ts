export type ChatRole = "user" | "assistant";
export type ChatMessageData = {
  id: string;
  role: ChatRole;
  content: string;
  time: string;
};
