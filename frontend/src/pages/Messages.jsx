import { useEffect, useMemo, useRef, useState } from "react";
import { db, ADMIN_UID } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, User } from "lucide-react";

export default function Messages() {
  const { user, isAdmin } = useAuth();
  // For users: the conversation is identified by their own uid.
  // For admin: select among all existing conversations.
  const [activeConversationId, setActiveConversationId] = useState(
    isAdmin ? null : user?.uid
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8" data-testid="messages-page">
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6A66EB]">
          // direct_message
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-black tracking-tighter text-white">
          {isAdmin ? "Boîte de réception" : "Discuter avec l'équipe"}
        </h1>
        <p className="mt-2 font-mono text-xs text-[#A8A8B8]">
          {isAdmin
            ? "Sélectionne un utilisateur pour répondre."
            : "Pose tes questions, l'admin te répondra dès que possible."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {isAdmin ? (
          <ConversationList
            activeId={activeConversationId}
            onSelect={setActiveConversationId}
          />
        ) : null}
        <ConversationView
          conversationId={activeConversationId}
          currentUid={user?.uid}
          isAdmin={isAdmin}
          userEmail={user?.email}
          userDisplayName={user?.displayName}
        />
      </div>
    </div>
  );
}

function ConversationList({ activeId, onSelect }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "conversations"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setConversations(arr);
    });
    return unsub;
  }, []);

  return (
    <aside
      className="rounded-xl border border-[#6A66EB]/25 bg-[#0A0A0F] p-3 max-h-[70vh] overflow-y-auto"
      data-testid="admin-conversations-list"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6A66EB]/70 px-2 py-1.5">
        {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
      </p>
      {conversations.length === 0 ? (
        <p className="font-mono text-xs text-[#A8A8B8] p-3">Aucune conversation.</p>
      ) : (
        <ul className="space-y-1.5">
          {conversations.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={`w-full text-left p-3 rounded-md border transition-all ${
                  activeId === c.id
                    ? "border-[#6A66EB] bg-[#6A66EB]/10"
                    : "border-[#6A66EB]/15 bg-[#050508] hover:border-[#6A66EB]/40"
                }`}
                data-testid={`conversation-item-${c.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#6A66EB]/15 border border-[#6A66EB]/30 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 text-[#6A66EB]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-white truncate">
                      {c.userEmail || c.id}
                    </p>
                    {c.lastMessage && (
                      <p className="font-mono text-[10px] text-[#A8A8B8] truncate">
                        {c.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function ConversationView({ conversationId, currentUid, isAdmin, userEmail, userDisplayName }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setMessages(arr);
    });
    return unsub;
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const placeholder = useMemo(() => {
    if (!conversationId) return "Sélectionne une conversation…";
    return isAdmin ? "Répondre à l'utilisateur…" : "Écris ton message…";
  }, [conversationId, isAdmin]);

  const send = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !conversationId) return;
    setSending(true);
    try {
      // Upsert the conversation metadata
      await setDoc(
        doc(db, "conversations", conversationId),
        {
          userId: conversationId,
          userEmail: isAdmin ? undefined : userEmail || null,
          userDisplayName: isAdmin ? undefined : userDisplayName || null,
          lastMessage: body,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await addDoc(collection(db, "conversations", conversationId, "messages"), {
        text: body,
        from: isAdmin ? "admin" : "user",
        senderUid: currentUid,
        senderEmail: userEmail || null,
        createdAt: serverTimestamp(),
      });
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      className="rounded-xl border border-[#6A66EB]/25 bg-[#0A0A0F] flex flex-col"
      style={{ minHeight: "70vh" }}
      data-testid="conversation-view"
    >
      {!conversationId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <MessageSquare className="h-10 w-10 text-[#6A66EB]/40 mb-3" />
          <p className="font-mono text-sm text-[#A8A8B8]">
            Sélectionne une conversation pour démarrer.
          </p>
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-3"
            data-testid="messages-list"
          >
            {messages.length === 0 ? (
              <p className="font-mono text-xs text-[#A8A8B8] text-center mt-10">
                Aucun message. Lance la conversation 👇
              </p>
            ) : (
              messages.map((m) => {
                const mine = isAdmin ? m.from === "admin" : m.from === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    data-testid={`message-${m.id}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2.5 border ${
                        mine
                          ? "bg-[#6A66EB] text-white border-[#6A66EB]"
                          : "bg-[#050508] text-[#EDEDED] border-[#6A66EB]/25"
                      }`}
                    >
                      <p className="font-mono text-[9px] uppercase tracking-wider opacity-70 mb-0.5">
                        {m.from === "admin" ? "Admin" : "Utilisateur"}
                      </p>
                      <p className="font-mono text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {m.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form
            onSubmit={send}
            className="border-t border-[#6A66EB]/15 p-3 flex gap-2"
            data-testid="message-form"
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              className="bg-[#050508] border-[#6A66EB]/30 text-white font-mono focus-visible:ring-[#6A66EB]"
              data-testid="message-input"
            />
            <Button
              type="submit"
              disabled={sending || !text.trim()}
              className="bg-[#6A66EB] hover:bg-[#5853D6] text-white font-mono uppercase tracking-wider text-xs"
              data-testid="message-send-btn"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </>
      )}
    </section>
  );
}
