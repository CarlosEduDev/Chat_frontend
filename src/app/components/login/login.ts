import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  isLoading = false;
  showPassword = false;

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

  onsubmit(): boolean{
    this.isLoading = true;
    // Ao clicar no botão de login, a função onsubmit é chamada. Ela define isLoading como true para indicar que o processo de login está em andamento. Em seguida, ela chama a função validateFields, passando os valores de email e senha para validação. O resultado da validação é retornado, indicando se o login foi bem-sucedido ou não.

    // DEPOIS DE CLICAR NO BOTÃO PRECISO DE ALGUMA FORMA VOLTAR O VALOR DE isLoading PARA FALSE, POIS SE FICAR TRUE ELE VAI FICAR MOSTRANDO O LOADING INDEFINIDAMENTE, ENTÃO PRECISO DE UM TEMPO PARA SIMULAR O PROCESSO DE LOGIN E DEPOIS VOLTAR O VALOR PARA FALSE, ASSIM O LOADING VAI DESAPARECER APÓS ALGUNS SEGUNDOS.

    // APÓS CLICAR NO BOTÃO DE LOGIN, O USER VAI PARA OUTRA ROTA

    return this.validateFields(this.email, this.password);
  }

  
}
