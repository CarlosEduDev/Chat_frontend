import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/login/login';
import { Chat } from "./components/chat/chat";
import { Cadastro } from './components/cadastro/cadastro';

@Component({
  selector: 'app-root'  ,
  imports: [RouterOutlet, Login, Chat, Cadastro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('chat');
}
