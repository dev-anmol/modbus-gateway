import { Component, signal, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {LucideAngularModule, Server, NotebookIcon, Monitor} from 'lucide-angular'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  readonly ServerIcon  = Server;
  readonly ProfileIcon = NotebookIcon;
  readonly DeviceIcon = Monitor;



  isOpen = input<boolean>(true);
  position = input<'left' | 'right'>('left');
  width = input<string>('230px');
  
  onToggle = output<boolean>();
  onClose = output<void>();
  
  isAnimating = signal(false);
  private router = inject(Router)
  
  toggleSidebar() {
    this.isAnimating.set(true);
    const newState = !this.isOpen();
    this.onToggle.emit(newState);
    
    setTimeout(() => {
      this.isAnimating.set(false);
    }, 300);
  }
  
  closeSidebar() {
    if (this.isOpen()) {
      this.isAnimating.set(true);
      this.onClose.emit();
      
      setTimeout(() => {
        this.isAnimating.set(false);
      }, 300);
    }
  }

  handleNavigation(path: string) {
    this.router.navigate([path]);
  }
}
