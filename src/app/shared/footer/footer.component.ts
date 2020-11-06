import { Component } from '@angular/core';

@Component({
    selector: 'app-footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent {
    today: Date = new Date();
}
