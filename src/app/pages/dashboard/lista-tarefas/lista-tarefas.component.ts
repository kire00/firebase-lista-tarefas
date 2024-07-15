import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrl: './lista-tarefas.component.scss'
})
export class ListaTarefasComponent implements OnInit {

  // variável para controlar se a lista de tarefas foi iniciada (true) ou não (false). Inicializada como false.
  visualizarLista: boolean = false;

  // formulário da tarefa
  tarefaForm: FormGroup;

  // vetor de tarefas
  tarefas$!: Observable<any[]>;

  edicaoTarefaForm: FormGroup; 

  tarefaEmEdicao: any = null;
  // o construtor do componente declara quais serão os campos do formulário (manipulados no HTML através da tag "formGroup"), 
  // como eles são inicializados e se eles são obrigatórios ou não.
  constructor(private fb: FormBuilder, private db: AngularFirestore,  private afAuth: AngularFireAuth, private router: Router) { 
    this.tarefaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      dificuldade: ['', Validators.required]
    });
    this.edicaoTarefaForm = this.fb.group({ // Formulário de edição
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      dificuldade: ['', Validators.required]
    });

  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.tarefas$ = this.db.collection('tarefas', ref => ref.where('userId', '==', user.uid)).valueChanges({ idField: 'id' });
        this.tarefas$.subscribe(tarefas => {
          if (tarefas.length > 0) {
            this.visualizarLista = true;
          }
        });
      } else {
        this.router.navigate(['/home']);
      }
    });
  }
  // cria uma variável e atribui o valor do formulário para ela. Além disso, adiciona o atributo concluída como false, para sempre começar como pendente. 
  // adiciona no vetor de tarefas e limpa os campos do formulário.
  onSubmit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        let tarefa = this.tarefaForm.value;
        tarefa.concluida = false;
        tarefa.userId = user.uid;
        this.db.collection('tarefas').add(tarefa).then(() => {
          alert('Tarefa adicionada!');
          this.visualizarLista = true;
          this.tarefaForm.reset();
        });
      }
    });
  }

  ativarLista(){
    this.visualizarLista = true;
  }

  // procura a tarefa a partir de seu título e torna seu atributo "concluída" como true.
  concluirTarefa(id: string): void {
    this.db.collection('tarefas').doc(id).update({ concluida: true });
  }

  // procura a tarefa a partir de seu título e a exclui.
  excluirTarefa(id: string): void {
    this.db.collection('tarefas').doc(id).delete();
  }

  editarTarefa(tarefa: any): void { // Inicia a edição da tarefa
    this.tarefaEmEdicao = tarefa;
    this.edicaoTarefaForm.patchValue(tarefa);
  }

  onEditSubmit(id: string): void { // Salva as alterações da tarefa editada
    if (this.edicaoTarefaForm.valid) {
      this.db.collection('tarefas').doc(id).update(this.edicaoTarefaForm.value).then(() => {
        alert('Tarefa atualizada!');
        this.tarefaEmEdicao = null;
        this.edicaoTarefaForm.reset();
      });
    }
  }

  logout() {
    this.afAuth.signOut().then(() => {
      alert('Logout successful');
      this.router.navigate(['/home']);
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
  
  trackByFn(index: number, item: any) {
    return item.id;
}
}
