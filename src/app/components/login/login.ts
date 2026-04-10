import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, User, Mail, Lock, Eye, EyeOff } from 'lucide-angular';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  private router = inject(Router);
  private http = inject(HttpClient);

  //icons
  readonly User = User;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  ngOnInit(): void {
    const token = localStorage.getItem('user_token');

    if(token){
      this.router.navigate(['/chat']);
    }
  }

  email = '';
  password = '';
  isLoading = false;
  showPassword = false;
  rememberMe = false;

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateFields(email: string, password: string): boolean{
    if(!email || !password){
      alert("Os campos Email e Senha não podem estar vazios.");
      return false
    }else if(!this.validateEmail(email)){
      alert("Email inválido.");
      return false;
    }
    else if(password.length < 6){
      alert("A senha deve conter pelo menos 6 caracteres.");
      return false;
    }

    return true;
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

  onsubmit(){
    
    if(!this.validateFields(this.email, this.password)){
      return;
    }
    
    this.isLoading = true;

    const loginData = {email: this.email, password: this.password};

    this.http.post<any>('http://localhost:3000/login', loginData).subscribe({
      next: (res) => {
        // Se cair aqui, o banco confirmou o usuário
        console.log("Login confirmado no banco de dados!");
        
        // Salva o token enviado pelo servidor
        localStorage.setItem('user_token', res.token);
        
        // Só navega se o login deu certo
        this.router.navigate(['/chat']);
        this.isLoading = false;
      },
      error: (err) => {
        // Se cair aqui, o email ou senha não existem no banco
        this.isLoading = false;
        console.error("Erro ao autenticar:", err);

        // Isso vai nos dizer o "Status" do erro no console
  console.log("Status do Erro:", err.status);
  console.log("Mensagem Completa:", err.message);

  if (err.status === 0) {
    alert("O servidor está desligado ou o CORS não está configurado.");
  } else if (err.status === 401 || err.status === 403) {
    alert("E-mail ou senha incorretos (Resposta do Banco).");
  } else if (err.status === 404) {
    alert("A URL /login não foi encontrada no servidor.");
  } else {
    alert("Erro desconhecido: " + err.message);
  }
   }
    });



    // return this.validateFields(this.email, this.password);
  }

  
}
