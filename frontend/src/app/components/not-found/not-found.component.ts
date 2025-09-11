import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
  private translate = inject(TranslateService);
  constructor(private router: Router) {
    setTimeout(() => {
      this.goLogin();
    }, 5000);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
