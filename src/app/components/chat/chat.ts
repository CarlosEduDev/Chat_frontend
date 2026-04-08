import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  private router = inject(Router);

  logout(){
    localStorage.removeItem('user_token');

    this.router.navigate(['/login']);
  }
}
