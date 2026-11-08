export type ChatApiResponse = {
  answer?: string;
  message?: string;
};


export type ChatHistoryMessage = {
  id: number | string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

export type ChatHistoryResponse = {
  success: boolean;
  data: ChatHistoryMessage[];
  message?: string;
};