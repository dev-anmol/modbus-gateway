import { Component, signal } from '@angular/core';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'modbusgateway';
  sidebarOpen = signal(false);
  
  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }
  
  handleSidebarToggle(isOpen: boolean) {
    this.sidebarOpen.set(isOpen);
  }
  
  handleSidebarClose() {
    this.sidebarOpen.set(false);
  }
}
