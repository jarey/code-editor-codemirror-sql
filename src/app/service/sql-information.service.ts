import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MappedData } from '../api/mapped-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqlInformationService {

  constructor(private http: HttpClient) { }

  /**
   *
   * @param url Realiza la invocación del endpoint de datos de SQL en función del sistema seleccionado,
   * que se indique en la url argumento.
   */
  public getSqlObjectsInformation(url: string): Observable<MappedData> {
    return this.http.get<MappedData>(url + 'public/sqlUtils');
  }
}
