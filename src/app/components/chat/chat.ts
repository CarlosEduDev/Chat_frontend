import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, User, Mail, Lock, Eye, EyeOff, LogOut, Menu, Send, CheckCheck, Paperclip } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const BASE_URL = 'https://chat-sd-titw.onrender.com';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Ícones Lucide
  readonly User = User;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly Send = Send;
  readonly CheckCheck = CheckCheck;
  readonly Paperclip = Paperclip;

  // Estado do Chat
  users: { username: string; email: string }[] = [];
  selectedContact: { username: string; email: string } | null = null;
  messages: any[] = [];
  messageText: string = "";
  
  messagesCache: { [email: string]: any[] } = {};
  
  private pollingInterval: any;

  ngOnInit() {
    this.loadUsers();
    this.pollingInterval = setInterval(() => {
      if (this.selectedContact) {
        this.loadConversation(true); // true indica que é um "silent update"
      }
    }, 5000);
  }

  ngOnDestroy() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }

  // --- LOGICA DE RESILIÊNCIA (RETRY) ---
  async fetchWithRetry(url: string, options: any, retries = 4, backoff = 1000): Promise<Response> {
    try {
      const res = await fetch(url, options);
      // Se for erro de servidor (5xx), tenta novamente
      if (!res.ok && res.status >= 500 && retries > 0) throw new Error("Server Error");
      return res;
    } catch (err) {
      if (retries <= 0) throw err;
      console.warn(`Tentando novamente... Restam ${retries} tentativas.`);
      await new Promise(r => setTimeout(r, backoff));
      return this.fetchWithRetry(url, options, retries - 1, backoff * 1.5);
    }
  }

  async loadUsers() {
    try {
      const res = await this.fetchWithRetry(`${BASE_URL}/api/users`, { headers: this.getHeaders() });
      if (res.ok) {
        this.users = await res.json();
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error("Falha crítica ao carregar usuários:", error);
    }
  }

  selectContact(user: any) {
    this.selectedContact = user;
    this.messages = this.messagesCache[user.email] || [];
    this.cdr.detectChanges();
    
    this.loadConversation();
  }

  async loadConversation(isPolling = false) {
    if (!this.selectedContact) return;
    const contactEmail = this.selectedContact.email;

    const currentCache = this.messagesCache[contactEmail] || [];
    const lastMessageId = currentCache.length > 0 ? currentCache[currentCache.length - 1].id : null;

    try {
      const url = lastMessageId 
        ? `${BASE_URL}/api/messages/${contactEmail}?lastId=${lastMessageId}`
        : `${BASE_URL}/api/messages/${contactEmail}`;

      const res = await this.fetchWithRetry(url, { headers: this.getHeaders() });

      if (res.ok) {
        const incomingMessages = await res.json();
        
        if (incomingMessages.length > 0) {
          const existingIds = new Set(currentCache.map(m => m.id));
          const uniqueNewMessages = incomingMessages.filter((m: any) => !existingIds.has(m.id));

          if (uniqueNewMessages.length > 0) {
            this.messagesCache[contactEmail] = [...currentCache, ...uniqueNewMessages];
            
            if (this.selectedContact?.email === contactEmail) {
              this.messages = this.messagesCache[contactEmail];
              this.cdr.detectChanges();
              this.scrollToBottom();
            }
          }
        }
      }
    } catch (e) {
      if (!isPolling) console.error("Erro ao carregar conversa:", e);
    }
  }

  async sendMessage() {
    if (!this.selectedContact || !this.messageText.trim()) return;
    
    const textToSend = this.messageText;
    const receiver = this.selectedContact.email;

    this.messageText = "";
    this.cdr.detectChanges();

    try {
      const res = await this.fetchWithRetry(`${BASE_URL}/api/messages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          receiverEmail: receiver,
          message: textToSend
        })
      });

      if (res.ok) {
        await this.loadConversation();
      }
    } catch (e) {
      console.error("Erro ao enviar mensagem:", e);
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('user_token')}`
    };
  }

  getMyEmail() {
    return localStorage.getItem('user_email') || '';
  }

  isMyMessage(msg: any): boolean {
    const myEmail = this.getMyEmail()?.toLowerCase().trim();
    return msg.senderEmail?.toLowerCase().trim() === myEmail;
  }

  logout() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}