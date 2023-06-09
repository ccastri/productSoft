import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.3s', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('0.3s', style({ opacity: 0 }))]),
]);

export const slideInAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ opacity: 0 })]),
    group([
      query(':leave', [animate('300ms', style({ opacity: 1 }))], {
        optional: true,
      }),
    ]),
  ]),
]);
