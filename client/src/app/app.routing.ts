import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// import user
import { UserEditComponent } from "./components/user-edit.component";

const appRoutes: Routes = [
    {path: '', component: UserEditComponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: '**', component: UserEditComponent}
];

export const appRoutingProviders: any[] = []; //servicio
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);