import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LucideAngularModule, MenuIcon } from 'lucide-angular';
gsap.registerPlugin(ScrollTrigger); // Register once

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [LucideAngularModule],
  styleUrls: ['./header.css'], // Corrected
})
export class Header implements AfterViewInit, OnDestroy {
  readonly Menu = MenuIcon;

  @ViewChild('header') headerRef!: ElementRef;
  private gsapContext!: gsap.Context;

  constructor(@Inject(PLATFORM_ID) private platfromId: Object) {}

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
