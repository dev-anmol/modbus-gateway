import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  LucideAngularModule,
  MenuIcon,
  Server,
  NotebookIcon,
  Monitor,
} from 'lucide-angular';
import { Sidebar } from '../../services/global/sidebar';
import { Router } from '@angular/router';
gsap.registerPlugin(ScrollTrigger); // Register once

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [LucideAngularModule],
  styleUrls: ['./header.css'], // Corrected
})
export class Header implements AfterViewInit, OnDestroy {
  readonly Menu = MenuIcon;
  readonly ServerIcon = Server;
  readonly ProfileIcon = NotebookIcon;
  readonly DeviceIcon = Monitor;

  @ViewChild('header') headerRef!: ElementRef;
  private sidebarService = inject(Sidebar);
  private router = inject(Router);
  private gsapContext!: gsap.Context;
  public isMobile = computed(() => this.sidebarService.isSideBarOpen());
  constructor(@Inject(PLATFORM_ID) private platfromId: Object) {}

  handleToggle() {
    this.sidebarService.updateState();
  }

  handleNavigation(path: string) {
    this.router.navigate([path]);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platfromId)) {
      this.gsapContext = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: '10% top',
            end: '+=200px',
            scrub: true,
          },
        });
        timeline.to(this.headerRef.nativeElement, {
          y: -100,
          ease: 'expo.in',
          duration: 0.1,
        });
      }, this.headerRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.gsapContext?.revert();
  }
}
