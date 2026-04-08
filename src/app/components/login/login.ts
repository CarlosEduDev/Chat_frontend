import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  private router = inject(Router);

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
      console.log("Os campos Email e Senha não podem estar vazios.");
      return false
    }else if(!this.validateEmail(email)){
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

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

  onsubmit(){
    this.isLoading = true;
    
    if(this.email === "admin@teste.com" && this.password === "admin123"){
      localStorage.setItem('user_token', 'token teste gerado no seerver');
      console.log("Login bem-sucedido!");
    }

    this.router.navigate(['/chat']);



    // return this.validateFields(this.email, this.password);
  }

  
}
