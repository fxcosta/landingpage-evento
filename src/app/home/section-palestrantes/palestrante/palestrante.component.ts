import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-palestrante',
    templateUrl: './palestrante.component.html',
    styleUrls: ['./palestrante.component.scss']
})
export class PalestranteComponent implements OnInit {

    @Input() palestrante: any;
    showBio: boolean = false;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() { }

    trust(url: string): any {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    boxEnter(): void {
        this.showBio = true;
    }

    boxLeave(): void {
        this.showBio = false;
    }

}
