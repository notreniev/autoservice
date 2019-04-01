import { CustomLoggedHeaderComponent } from './custom-logged-header/custom-logged-header';
import { MessageBoxComponent } from './message-box/message-box';
import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { UserInfoComponent } from './user-info/user-info';
import { UserMenuComponent } from './user-menu/user-menu';
@NgModule({
	declarations: [CustomLoggedHeaderComponent,
    MessageBoxComponent,
    UserInfoComponent,
    UserMenuComponent,
    ProgressBarComponent,
    ProgressBarComponent],
	imports: [],
	exports: [CustomLoggedHeaderComponent,
    MessageBoxComponent,
    UserInfoComponent,
    UserMenuComponent,
    ProgressBarComponent,
    ProgressBarComponent]
})
export class ComponentsModule {}
