import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Todo } from '../../../../Interfaces/_AppInterfaces';

@Injectable({providedIn: 'root'})

export class TodoStoreService {

  private readonly _todos = new BehaviorSubject<Todo[]>([]);

  readonly todos$ = this._todos.asObservable();

  get todos(): Todo[] {
    return this._todos.getValue();
  };

  set todos(val: Todo[]) {
    this._todos.next(val);
  };

  addTodo(title: string) {
    // we assaign a new copy of todos by adding a new todo to it
    // with automatically assigned ID ( don't do this at home, use uuid() )
    this.todos = [
      ...this.todos, {
        _id: this.todos.length + 1,
        isCompleted: false,
        title
      }
    ];
  };

  removeTodo(id: number) {
    this.todos = this.todos.filter(todo => todo._id !== id);
  };

  setCompleted(id: number, isCompleted: boolean) {
    let todo = this.todos.find(todo => todo._id === id);

    if(todo) {
      // we need to make a new copy of todos array, and the todo as well
      // remember, our state must always remain immutable
      // otherwise, on push change detection won't work, and won't update its view

      const index = this.todos.indexOf(todo);
      this.todos[index] = {
        ...todo,
        isCompleted
      }
      this.todos = [...this.todos];
    }
  };

  // we'll compose the todos$ observable with map operator to create a stream of only completed todos
  readonly completedTodos$ = this.todos$.pipe(
    map(todos => this.todos.filter(todo => todo.isCompleted))
  );



}
