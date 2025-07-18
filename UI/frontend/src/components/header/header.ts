import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger); // Register once

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'], // Corrected
})
export class Header implements AfterViewInit, OnDestroy {
  @ViewChild('header') headerRef!: ElementRef;
  private gsapContext!: gsap.Context;

  ngAfterViewInit(): void {
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

  ngOnDestroy(): void {
    this.gsapContext?.revert();
  }
}
