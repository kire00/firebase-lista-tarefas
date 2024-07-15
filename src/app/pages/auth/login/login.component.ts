import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    const { email, password } = this.loginForm.value;
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        alert('Sucesso no Login');
        this.router.navigate(['/lista-tarefas']);
      })
      .catch(error => {
        alert('Login falhou: ' + error.message);
      });
  }
}
