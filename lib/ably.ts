import Ably from "ably";

const ablyClient = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_API_KEY!);

export default ablyClient;

export interface ChatMessage {
  text: string;
  sender: string;
  timestamp: string;
}

export class ChatChannel {
  private channel: any;

  constructor(userId: string, selectedUserId: string) {
    const channelId = [userId, selectedUserId].sort().join("-");
    this.channel = ablyClient.channels.get(channelId);
  }

  async connect(): Promise<void> {
    await this.channel.attach();
  }

  async subscribe(callback: (msg: ChatMessage) => void): Promise<void> {
    this.channel.subscribe("message", (msg: any) => {
      callback(msg.data as ChatMessage);
    });
  }

  async publish(message: ChatMessage): Promise<void> {
    await this.channel.publish("message", message);
  }

  async getHistory(): Promise<ChatMessage[]> {
    const history = await this.channel.history();
    return history.items.map((item: any) => item.data as ChatMessage).reverse();
  }

  disconnect(): void {
    this.channel.unsubscribe();
    this.channel.detach();
  }
}
