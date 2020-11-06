import { Directive, ElementRef, OnInit , Input } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { Permissions } from '../models/permissions';
 
@Directive({
    selector: '[hideIfUnauthorized]'
})
export class HideIfUnauthorizedDirective implements OnInit {
    @Input('hideIfUnauthorized') permission: Permissions; // Required permission passed in
 
    constructor(private el: ElementRef, private authorizationService: AuthorizationService) { }
 
    ngOnInit() {
        if (!this.authorizationService.hasPermission(this.permission)) {
            this.el.nativeElement.style.display = 'none';
        }
    }
}
