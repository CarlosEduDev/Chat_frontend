import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, User, Mail, Lock, Eye, EyeOff } from 'lucide-angular'; 

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
    console.log('Tentativa de cadastro:', { name: this.name, email: this.email });

    const isValid = this.validateFields(this.name, this.email, this.password); 
    //Vai ser preciso checar se o endpoint da API permite cadastro
    console.log('Dados de cadastro:', {
        name: this.name,
        email: this.email,
        password: this.password
      });
    if (isValid) {

      alert('Cadastro realizado com sucesso! Redirecionando...');
    
      this.router.navigate(['/login']); 
    }// Adicionar mais uma verificação para o caso do usuário ter uma conta
     else {
      //O caso onde os dados estão digitados errados ou algo do tipo
      alert('Erro no cadastro. Por favor, verifique os dados informados.');
    }
  } 
}