import { Component, OnInit, signal } from '@angular/core';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { RouterOutlet, Scroll } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-root',
  imports: [Sidebar, Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'modbusgateway';
  sidebarOpen = signal(false);

  ngOnInit(): void {

      const initializeScroll = async () => {
        const scroll = (await (import ('locomotive-scroll'))).default;
        const locomotiveScroll = new scroll();
        locomotiveScroll.start();
      }

      initializeScroll();
  }
  
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
