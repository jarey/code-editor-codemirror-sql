import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MappedData, ResultData } from '../api/mapped-data';
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
    return this.http.get<MappedData>(url + 'private/sqlUtils');
  }

  public postInformation(url: string, data: object): Observable<Array<ResultData>> {
    return this.http.post<Array<ResultData>>(url + 'private/sqlUtils', data);
  }
}
