import { animate, state, style, transition, trigger } from '@angular/animations';

export const SlideAnimation =
  trigger('fadeIn', [
    state('stable', style({ opacity: 1 })),    
    state('*', style({ opacity: 0 })),

    transition('* => stable', animate('300ms ease-in'))//,
    //transition('stable => *', animate('300ms ease-in', style({ opacity: 0 })))
  ]);