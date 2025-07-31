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
import { Updateconfig } from '../../services/udpate-config/updateconfig';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
gsap.registerPlugin(ScrollTrigger); // Register once

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [LucideAngularModule, ToastModule],
  styleUrls: ['./header.css'],
  providers: [MessageService],
})
export class Header implements AfterViewInit, OnDestroy {
  readonly Menu = MenuIcon;
  readonly ServerIcon = Server;
  readonly ProfileIcon = NotebookIcon;
  readonly DeviceIcon = Monitor;

  @ViewChild('header') headerRef!: ElementRef;
  private sidebarService = inject(Sidebar);
  private router = inject(Router);
  private updateConfigService = inject(Updateconfig);
  private messageService = inject(MessageService);
  private gsapContext!: gsap.Context;
  public successFlag: boolean = false;
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

  updateOpenMUCConfigurations() {
    console.log('triggered');
    this.updateConfigService.restartApplication().subscribe({
      next: (response) => {
        if (!response.error) {
          this.successFlag = true;
          console.log(response);
          this.generateToast(
            'Configuration updated successfully',
            this.successFlag
          );
        } else {
          this.successFlag = false;
          this.generateToast('Error Updating Configurations', this.successFlag);
        }
      },
      error: (error) => {
        this.successFlag = false;
        this.generateToast('Error Updating Configurations', this.successFlag);
      },
    });
  }

  generateToast(msg: string, flag: boolean) {
    this.messageService.add({
      severity: flag ? 'success' : 'error',
      summary: msg,
      life: 3000,
      closable: true,
    });
  }

  ngOnDestroy(): void {
    this.gsapContext?.revert();
  }
}
