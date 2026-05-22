import { useEffect, useMemo, useRef, useState } from "react";
import { db } from "@/lib/firebase";
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
import { Send, MessageSquare, User, Shield } from "lucide-react";

export default function Messages() {
  const { user, isAdmin } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState(
    isAdmin ? null : user?.uid
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10" data-testid="messages-page">
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#6A66EB]">
          // messages
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-black tracking-tighter text-white">
          {isAdmin ? "Boîte de réception" : "Discuter avec l'équipe"}
        </h1>
        <p className="mt-2 max-w-lg font-mono text-xs text-[#A8A8B8]">
          {isAdmin
            ? "Sélectionne un utilisateur pour lui répondre."
            : "Pose tes questions — l'admin te répond dès que possible."}
        </p>
      </header>

      <div
        className={`grid gap-5 ${
          isAdmin ? "grid-cols-1 lg:grid-cols-[300px_1fr]" : "grid-cols-1"
        }`}
      >
        {isAdmin && (
          <ConversationList
            activeId={activeConversationId}
            onSelect={setActiveConversationId}
          />
        )}
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
      className="rounded-lg border border-white/8 bg-[#0A0A0F] p-2 max-h-[70vh] overflow-y-auto"
      data-testid="admin-conversations-list"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8] px-3 py-2">
        {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
      </p>
      {conversations.length === 0 ? (
        <p className="font-mono text-xs text-[#A8A8B8] p-3">Aucune conversation.</p>
      ) : (
        <ul className="space-y-1">
          {conversations.map((c) => {
            const isActive = activeId === c.id;
            return (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c.id)}
                  className={`w-full text-left p-3 rounded-md transition-all ${
                    isActive
                      ? "bg-[#6A66EB]/10 border-l-2 border-[#6A66EB]"
                      : "border-l-2 border-transparent hover:bg-white/5"
                  }`}
                  data-testid={`conversation-item-${c.id}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#6A66EB]/15 border border-[#6A66EB]/25 flex items-center justify-center flex-shrink-0">
                      <User className="h-3.5 w-3.5 text-[#6A66EB]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-white truncate">
                        {c.userEmail || c.id}
                      </p>
                      {c.lastMessage && (
                        <p className="font-mono text-[10px] text-[#A8A8B8] truncate mt-0.5">
                          {c.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
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
      className="rounded-lg border border-white/8 bg-[#0A0A0F] flex flex-col overflow-hidden"
      style={{ minHeight: "70vh" }}
      data-testid="conversation-view"
    >
      {!conversationId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#6A66EB]/5 border border-[#6A66EB]/20 flex items-center justify-center mb-4">
            <MessageSquare className="h-5 w-5 text-[#6A66EB]/50" />
          </div>
          <p className="font-mono text-sm text-[#A8A8B8]">
            Sélectionne une conversation pour démarrer.
          </p>
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
            data-testid="messages-list"
          >
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-[#6A66EB]/5 border border-[#6A66EB]/20 flex items-center justify-center mb-4">
                  <MessageSquare className="h-5 w-5 text-[#6A66EB]/50" />
                </div>
                <p className="font-mono text-sm text-[#A8A8B8]">
                  Aucun message — lance la conversation.
                </p>
              </div>
            ) : (
              messages.map((m, i) => {
                const mine = isAdmin ? m.from === "admin" : m.from === "user";
                const showAvatar =
                  i === 0 || messages[i - 1]?.from !== m.from;
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${
                      mine ? "justify-end" : "justify-start"
                    }`}
                    data-testid={`message-${m.id}`}
                  >
                    {!mine && (
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          showAvatar ? "opacity-100" : "opacity-0"
                        } ${
                          m.from === "admin"
                            ? "bg-[#6A66EB]/20 border border-[#6A66EB]/40"
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        {m.from === "admin" ? (
                          <Shield className="h-3 w-3 text-[#6A66EB]" />
                        ) : (
                          <User className="h-3 w-3 text-[#A8A8B8]" />
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        mine
                          ? "bg-[#6A66EB] text-white rounded-br-sm"
                          : "bg-[#050508] border border-white/8 text-[#EDEDED] rounded-bl-sm"
                      }`}
                    >
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
            className="border-t border-white/5 p-3 flex gap-2 bg-[#050508]/50"
            data-testid="message-form"
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              className="bg-[#0A0A0F] border-white/10 text-white font-mono focus-visible:ring-[#6A66EB] focus-visible:border-[#6A66EB] h-10"
              data-testid="message-input"
            />
            <Button
              type="submit"
              disabled={sending || !text.trim()}
              className="bg-[#6A66EB] hover:bg-[#5853D6] text-white h-10 px-4"
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
