import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, User, Mail, Lock, Eye, EyeOff } from 'lucide-angular'; 


const BASE_URL = 'https://chat-sd-titw.onrender.com';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  readonly User = User;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  private router = inject(Router);
  private http = inject(HttpClient);

  name = '';
  email = '';
  password = '';
  showPassword = false;

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  validateName(name: string): boolean {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/;
    return nameRegex.test(name);
  }

  validateFields(name: string, email: string, password: string): boolean{
    if(!email || !password || !name){
      console.log("Os campos Email e Senha não podem estar vazios.");
      return false
    }
    else if(!this.validateName(name)){
      console.log("Nome inválido. ");
      return false;
    }
    else if(!this.validateEmail(email)){
      console.log("Email inválido.");
      return false;
    }
    else if(password.length < 6){
      console.log("A senha deve conter pelo menos 6 caracteres.");
      return false;
    }

    console.log("Login bem-sucedido!");
    return true;
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }

    
    onRegister() {
    const isValid = this.validateFields(this.name, this.email, this.password);

    if (!isValid) {
      alert('Erro no cadastro. Verifique os dados.');
      return;
    }

    const registerData = {
      username    : this.name,
      email: this.email,
      password: this.password
    };

    this.http.post<any>(`${BASE_URL}/api/register`, registerData)
      .subscribe({
        next: (res) => {
          console.log("Cadastro realizado:", res);

          alert(res.message || "Usuário cadastrado com sucesso!");

          this.router.navigate(['/login']);
        },

        error: (err) => {
          alert(`Erro no cadastro:${err} `);

          if (err.status === 0) {
            alert("Servidor offline ou problema de CORS.");
          } else if (err.status === 400) {
            alert("Dados inválidos ou usuário já existe.");
          } else {
            alert("Erro ao cadastrar: " + err.message);
          }
        }
      });
  }
}