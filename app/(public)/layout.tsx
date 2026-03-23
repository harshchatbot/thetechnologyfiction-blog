import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SubscribeModal } from "@/components/layout/subscribe-modal";
import { WhatsAppChatButton } from "@/components/layout/whatsapp-chat-button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <SubscribeModal />
      <main>{children}</main>
      <Footer />
      <WhatsAppChatButton />
    </div>
  );
}
