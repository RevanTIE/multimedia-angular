import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit{
    public titulo: string;
    public user: User;
    public identity: any;
    public token: any;
    public alertMessage;
    public url: string;
    public filesToUpload: Array<File>;

    constructor(
        private _userService: UserService
    ){
        this.titulo= 'Actualizar mis datos';
        this.user= this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
        console.log('user-edit.component.ts cargado');
    }
    onSubmit(){
        console.log(this.user);
        this._userService.updateUser(this.user).subscribe(
            response =>{
                // let identity = response.user; //.user;
                // this.user = identity;
                if(!response.user){
                    this.alertMessage ="El usuario no se ha actualizado";
                }else{
                    // this.user = response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById("identity_name").innerHTML= this.user.name;

                    if(!this.filesToUpload){
                        //Redirección
                    }else{
                        this.makeFileRequest(this.url + '/upload-image-user/' + this.user._id, [], this.filesToUpload)
                        .then(
                            (result: any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));

                                console.log(this.user);
                            }
                        )
                        .catch((error) =>
                        {
                            console.log("Error onSubmit \n");
                        })
                    }
                    this.alertMessage = "Datos actualizados correctamente";
                }
            },
            error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                  let body = JSON.stringify(error.error.message);
                  this.alertMessage = body;
                  console.log(error);
                }
            }
        );
    }
    
    fileChangeEvent(fileInput: any){ //Para seleccionar los archivos que se van a subir
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
    makeFileRequest(url: string, params: Array<string>, files: Array<File>){ //Petición AJAX para subir ficheros convencionales
        var token = this.token;

        return new Promise( (resolve, reject) => {
            var formData: any = new FormData();
            var xhr= new XMLHttpRequest();

            for(var i  =0; i< files.length; i++){
                formData.append('image', files[i], files[i].name);
            }
            xhr.onreadystatechange = () => {
                if(xhr.readyState ==4){
                    if(xhr.status == 200) {
                        console.log('Response is: \n' + xhr.response);
                        console.log('Ready State is: ' + xhr.readyState + " and Status is " + xhr.status);
                        resolve(JSON.parse(xhr.response)); //JSON.parse(xhr.response)
                    }
                }else{
                    reject(xhr.response);
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
            
        });
    }
}
