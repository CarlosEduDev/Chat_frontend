    import { CommonModule } from '@angular/common';
    import { HttpClient } from '@angular/common/http';
    import { Component, OnInit, inject } from '@angular/core';
    import { FormsModule } from '@angular/forms';
    import { Router, RouterLink } from '@angular/router';
    import { LucideAngularModule, User, Mail, Lock, Eye, EyeOff } from 'lucide-angular';


    const BASE_URL = 'https://chat-sd-titw.onrender.com';

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

      onsubmit() {
  if (!this.validateFields(this.email, this.password)) {
    return;
  }

  this.isLoading = true;

  const loginData = {
    email: this.email,
    password: this.password
  };

  this.http.post<any>(
    `${BASE_URL}/api/login`,
    loginData
  ).subscribe({
    next: (res) => {
  console.log("Login confirmado!");

  const token = res.token || res.jwt || res.accessToken;

      if (!token) {
        alert("Token não recebido da API.");
        this.isLoading = false;
        return;
      }

      // ✅ 1. salva token
      localStorage.setItem('user_token', token);

      // ✅ 2. SALVA EMAIL (ESSENCIAL PRO CHAT)
      localStorage.setItem('user_email', this.email.toLowerCase().trim());

      // (opcional, pode manter ou remover)
      localStorage.setItem('user', JSON.stringify({
        email: this.email
      }));

      // ✅ 3. navega
      this.router.navigate(['/chat']);
      this.isLoading = false;
    },

    error: (err) => {
      this.isLoading = false;
      console.error("Erro ao autenticar:", err);

      if (err.status === 0) {
        alert("Servidor offline ou problema de CORS.");
      } else if (err.status === 401 || err.status === 403) {
        alert("E-mail ou senha incorretos.");
      } else if (err.status === 404) {
        alert("Endpoint /login não encontrado.");
      } else {
        alert("Erro: " + err.message);
      }
    }
  });
}
  }

      
