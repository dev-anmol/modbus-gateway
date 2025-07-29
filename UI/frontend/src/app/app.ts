import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Sidebar, Header, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'modbusgateway';
  sidebarOpen = signal(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const initializeScroll = async () => {
        const LocomotiveScroll = (await import('locomotive-scroll') as any).default;
        const scroll = new LocomotiveScroll({
          el: document.querySelector('[data-scroll-container]'),
          smooth: true
        });
      };
      initializeScroll();
    }
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

  getHeaderClasses(): string {
    const baseClasses = 'transition-all duration-300';
    const sidebarClasses = this.sidebarOpen() 
      ? 'md:ml-[230px]]'
      : 'md:ml-0';
    
    return `${baseClasses} ${sidebarClasses}`;
  }

  getMainContentClasses(): string {
    const baseClasses = 'transition-all duration-300 flex-1';
    const sidebarClasses = this.sidebarOpen() 
      ? 'md:ml-[230px]'
      : 'md:ml-0';
    
    return `${baseClasses} ${sidebarClasses}`;
  }
}
