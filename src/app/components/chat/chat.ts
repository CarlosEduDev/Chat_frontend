  import { Component, inject, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { LucideAngularModule, User, Mail, Lock, Eye, EyeOff, LogOut, Menu, Send, CheckCheck, Paperclip} from 'lucide-angular';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';

  const BASE_URL = 'https://chat-sd-titw.onrender.com';
  @Component({
    selector: 'app-chat',
    imports: [LucideAngularModule, CommonModule, FormsModule],
    templateUrl: './chat.html',
    styleUrl: './chat.css',
  })
  export class Chat implements OnInit {
    private router = inject(Router);
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


    users: { username: string; email: string }[] = [];
  selectedContact: { username: string; email: string } | null = null;
  messages: any[] = [];
  messageText: string = "";

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const res = await fetch(`${BASE_URL}/api/users`, {
        headers: {
          Authorization: localStorage.getItem('user_token') || ''
        }
      });

      this.users = await res.json();

    } catch (error) {
      console.error(error);
    }
  }

  selectContact(user: any) {
    this.selectedContact = user;
    this.loadConversation();
  }

  async loadConversation() {
    if (!this.selectedContact) return;

    try {
      
      const res = await fetch(
        `${BASE_URL}/api/messages/${this.selectedContact.email}`,
        {
          headers: {
            Authorization: localStorage.getItem('user_token') || ''
          }
        }
      );

      this.messages = await res.json();

    } catch (e) {
      console.error(e);
      this.messages = [];
    }
  }
  async sendMessage() {
    if (!this.selectedContact || !this.messageText.trim()) return;

    try {
      await fetch(`${BASE_URL}/api/messages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          receiverEmail: this.selectedContact.email,
          message: this.messageText
        })
      });

      this.messageText = "";
      this.loadConversation();

    } catch (e) {
      console.error(e);
    }
  }
getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('user_token') || ''
  };
}
  getMyEmail() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.email || '';
  }

  logout(){ localStorage.removeItem('user_token'); this.router.navigate(['/login']); }
}