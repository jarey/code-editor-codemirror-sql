import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WindowRef } from './WindowRef';

import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import {
  XDomainStorageConfig,
  UTILS_CONFIG_DATA
} from '@amtega/igvcomp-utils-lib';

import {
  IgvcompCommonLibModule,
  HttpErrorHandlerConfig
} from '@amtega/igvcomp-common-lib';
import { ReactiveFormsModule } from '@angular/forms';

import { errorHandlerConfig } from 'src/environments/error-handler.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    IgvcompCommonLibModule.forRoot(
      environment.authorization.oauth.interceptor,
      environment.xdomain as XDomainStorageConfig
    ),
  ],
  providers: [
    WindowRef,
    {
      provide: HttpErrorHandlerConfig,
      useValue: errorHandlerConfig
    },
    {
      provide: UTILS_CONFIG_DATA,
      useValue: environment
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
