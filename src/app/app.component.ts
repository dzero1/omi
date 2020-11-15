import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'omi';
  inHomepage = true;

  constructor(private _router:Router){}

  play(){
    this.inHomepage = false;
    this._router.navigate(['play']);
  }

  home(){
    Swal.fire({
      title: "Are you sure you want to exit from this game?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Let\'s exit!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.inHomepage = true;
        this._router.navigate(['/']);
      }
    })
  }
}
