import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    // Aqui você faria o this.http.post para o backend do seu colega
    console.log('Dados de cadastro:', {
      name: this.name,
      email: this.email,
      password: this.password
    });

    if (this.name && this.email && this.password.length >= 6) {
      alert('Cadastro realizado com sucesso! Redirecionando para o login...');
      this.router.navigate(['/login']);
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}