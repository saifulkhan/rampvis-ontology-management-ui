import { Directive, ElementRef, OnInit , Input, Renderer2 } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { Permissions } from '../models/permissions';
 
@Directive({
    selector: '[disableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {
    @Input('disableIfUnauthorized') permission: Permissions; // Required permission passed in
 
    constructor(private el: ElementRef, private renderer: Renderer2, private authorizationService: AuthorizationService) { }
 
    ngOnInit() {
        if (!this.authorizationService.hasPermission(this.permission)) {
            // this.el.nativeElement.disabled = true;
            // TODO: fix without timeout
            setTimeout(() => {
                this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
            }, 2000);
        }
    }
}
