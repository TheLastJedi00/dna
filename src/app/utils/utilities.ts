import { inject } from "@angular/core";
import { Router } from "@angular/router";

export function navigateTo(url: string) {
  const router = inject(Router);
  router.navigate([url]);
}