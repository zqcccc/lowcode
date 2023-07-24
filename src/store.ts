import { makeAutoObservable } from 'mobx';

class Website {
  name = '';
  constructor() {
    makeAutoObservable(this);
  }
  setName(value: string) {
    this.name = value;
  }
}

export const website = new Website()
