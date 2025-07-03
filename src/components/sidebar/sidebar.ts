import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  isOpen = input<boolean>(false);
  position = input<'left' | 'right'>('left');
  width = input<string>('250px');
  
  onToggle = output<boolean>();
  onClose = output<void>();
  
  isAnimating = signal(false);
  
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
}
