
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  done: boolean
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  constructor(private http: HttpClient) { }

  public tasks: Task[] = [];
  public newTask: string = '';
  public alertForm: boolean = false;

  ngOnInit(): void {
    this.loadTasks();
  }

  public loadTasks():void {
    const url = "http://localhost:3000/task"
    this.http.get<Task[]>(url).toPromise().then(data => {
      this.tasks = data;
    })
  }

  public save(): void {
    this.alertForm = false;
    const url = "http://localhost:3000/task"
    this.http.post(url, {title: this.newTask}).toPromise().then( _ => {
      this.newTask = '';
      this.loadTasks();
    })
  }

  public callAlert(): void {
    this.alertForm = true;
  }

  public deleteTask(id: number): void {
    const url = `http://localhost:3000/task/${id}`
    this.http.delete(url).toPromise().then( _ => {
      this.loadTasks();
    })
  }

  public toggleTask(task: Task): void {
    task.done = !task.done;
    const url = `http://localhost:3000/task/${task.id}`
    this.http.patch(url, {done: task.done}).toPromise()
  }

  public formTasks = new FormGroup({
    title: new FormControl(this.newTask, [
      Validators.required,
    ]),
  })

  public validate(): void {
    this.formTasks.valid ? this.save() : this.callAlert();
  }

}
