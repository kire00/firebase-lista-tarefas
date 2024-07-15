import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userLoggedIn: boolean = false;
  loginAttemptedWhileLoggedIn: boolean = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.userLoggedIn = !!user;
    });
  }

  goToLogin() {
    if (this.userLoggedIn) {
      this.loginAttemptedWhileLoggedIn = true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToTasks() {
    if (this.userLoggedIn) {
      this.router.navigate(['/lista-tarefas']);
    } else {
      alert('Você precisa fazer login para acessar a lista de tarefas.');
    }
  }
}
