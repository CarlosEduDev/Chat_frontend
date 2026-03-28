import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/login/login';
import { Chat } from "./components/chat/chat";

@Component({
  selector: 'app-root'  ,
  imports: [RouterOutlet, Login, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('chat');
}
