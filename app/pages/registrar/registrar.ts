import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, ViewController} from 'ionic-angular';
import {FORM_DIRECTIVES, FormControl, FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

export interface UserCredentials {
  email: string;
  password: string;
}

interface ValidationResult {
  [key: string]: boolean;
}
export class CheckedValidator {

  public static isChecked(control: FormControl): ValidationResult {
    var valid = control.value === false || control.value === 'false';
    if (valid) {
      return { isChecked: true };
    }
    return null;
  }
}

export class EmailValidator {

  public static isValid(control: FormControl): ValidationResult {
    var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let valid = emailReg.test(control.value);

    if (!valid) {
      return { isValid: true };
    }
    return null;
  }
}

@Component({
  templateUrl: 'build/pages/registrar/registrar.html',
})
export class RegistrarPage {

  createFirebaseAccountForm: FormGroup;
  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  dateOfBirth: AbstractControl;
  terms: AbstractControl;
  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private fb: FormBuilder, private viewCtrl: ViewController) {

    this.createFirebaseAccountForm = this.fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      'dateOfBirth': [new Date().toISOString().slice(0, 10), Validators.compose([Validators.required])],
      'terms': [false, CheckedValidator.isChecked]
    });

    this.username = this.createFirebaseAccountForm.controls['username'];
    this.email = this.createFirebaseAccountForm.controls['email'];
    this.password = this.createFirebaseAccountForm.controls['password'];
    this.dateOfBirth = this.createFirebaseAccountForm.controls['dateOfBirth'];
    this.terms = this.createFirebaseAccountForm.controls['terms'];

  }


  getFormattedDate(): string {
    let now = new Date();
    let mm = now.getMonth() + 1;
    let dd = now.getDate();

    let formattedDate = [now.getFullYear(), !mm[1] && '0', mm, !dd[1] && '0', dd].join('-');
    return formattedDate;
  }

  onSubmit(signupForm: any): void {
    var self = this;

    var l2 = firebase.auth().createUserWithEmailAndPassword(signupForm.email, signupForm.password);
    let loader = this.loadingCtrl.create({
      content: 'Creando cuenta ...',
      dismissOnPageChange: true
    });

    let newUser: UserCredentials = {
      email: signupForm.email,
      password: signupForm.password
    };

    loader.present();

    l2
      .then(function (result) {

        loader.dismiss()
          .then(() => {
            self.viewCtrl.dismiss({
              user: newUser
            }).then(() => {
              let toast = self.toastCtrl.create({
                message: 'Cuenta creado con éxito ;)',
                duration: 4000,
                position: 'top'
              });
              toast.present();
              //self.CreateAndUploadDefaultImage();
            });
          });

        console.log(result);
      }).catch(function (error) {
        console.log(error);
      });
  }

}

