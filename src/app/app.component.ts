import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';

import { HttpClientModule } from '@angular/common/http';

import { WindowRef } from './WindowRef';
import { SqlInformationService } from './service/sql-information.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MappedData, ResultData } from './api/mapped-data';
import { NgxTypedJsComponent } from 'ngx-typed-js';

@Component({
  selector: 'app-sql-editor',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'app';
  form: FormGroup;
  entityManagers: Array<string> = new Array<string>();
  tempData: MappedData;

  selectedSystem: string;
  selectedEntityManager: string;
  textoResultado: string[] = null;

  /** Variable que debe tener estructura de objeto jackson:
   * {'table1': [ 'col_A', 'col_B', 'col_C' ],'table2': [ 'other_columns1', 'other_columns2' ]...}
   */
  private tables: any;


  @ViewChild('myEditor', { read: null, static: false }) myEditor;

  @ViewChild(NgxTypedJsComponent, { read: null, static: false }) typed: NgxTypedJsComponent;

  constructor(private formBuilder: FormBuilder, private winRef: WindowRef, private sqlInformationService: SqlInformationService) {
  }

  ngOnInit() {
    // Se solicitan los recursos de autocompletado, para conocer el nombre de las tablas/vistas.
    this.form = this.formBuilder.group({
      entorno: [null, Validators.required],
      entityManager: [null, Validators.required]
    });

    this.form.controls.entorno.valueChanges.subscribe(url => {
      this.selectedSystem = url;
      this.processSystemSelection(url);
    });

    this.form.controls.entityManager.valueChanges.subscribe(selectedEntityManager => {
      this.selectedEntityManager = selectedEntityManager;
      this.processAutocompletionInformation(selectedEntityManager);
      this.updateCurrentEditor();
    });

  }

  ngAfterViewInit() {
    this.initializeEditor();
  }

  private initializeEditor() {
    const mime = 'text/x-mariadb';
    const currentWindow = this.winRef.nativeWindow;
    currentWindow.editor = CodeMirror.fromTextArea(this.myEditor.nativeElement, {
      mode: mime,
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      // matchBrackets: true,
      autofocus: true,
      extraKeys: { 'Ctrl-Space': 'autocomplete' },
      hint: CodeMirror.hint.sql,
      hintOptions: {
        tables: this.tables
      }
    });
  }

  private updateCurrentEditor() {
    const mime = 'text/x-mariadb';
    const currentWindow = this.winRef.nativeWindow;
    currentWindow.editor.toTextArea();
    currentWindow.editor = CodeMirror.fromTextArea(this.myEditor.nativeElement, {
      mode: mime,
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      // matchBrackets: true,
      autofocus: true,
      extraKeys: { 'Ctrl-Space': 'autocomplete' },
      hint: CodeMirror.hint.sql,
      hintOptions: {
        tables: this.tables
      }
    });
  }

  private processAutocompletionInformation(entityManager: string): void {
    this.entityManagers = Object.keys(this.tempData.mappedInformation);
    const tableComposition = {};
    for (const em of this.entityManagers) {
      // Array de tablas, seguir mapeando a estructura deseada.
      if (em === entityManager) {
        this.tempData.mappedInformation[em].forEach(
          element => tableComposition[element.tableName] = element.columnNames
        );
      }
    }
    this.tables = tableComposition;
  }


  private writeEntityManagerSelect(data: MappedData): void {
    this.tempData = data;
    this.entityManagers = Object.keys(data.mappedInformation);
  }

  /**
   * Realiza la carga de la información de autocompletado.
   */
  private processSystemSelection(restSystemUrl: string): void {
    this.sqlInformationService.getSqlObjectsInformation(this.selectedSystem).subscribe(
      data => {
        // Escribir lógica de pintado.
        this.writeEntityManagerSelect(data);
      });
  }

  /**
   * Realiza la carga de configuración cuando se pulsa el botón de pantalla.
   */
  public onClickRefresh(): void {
    if (this.form.valid) {
      this.processAutocompletionInformation(this.form.value.entorno);
    } else {
      alert('Selecciona Sistema y Entity Manager.');
    }
  }


  /**
   * Obtiene el contenido del editor SQL, lo envía al servidor y muestra el resultado de la ejecución en el editor de resultados.
   */
  public sendSqlToServer(): void {
    if (this.form.valid) {
      this.textoResultado = null;
      const currentWindow = this.winRef.nativeWindow;
      this.postDataToServer(currentWindow.editor.getValue());
    } else {
      alert('Selecciona Sistema y Entity Manager.');
    }
  }

  private postDataToServer(data: string): void {
    const obj = this.composeObjectToSend(data);
    this.sqlInformationService.postInformation(this.selectedSystem, obj).subscribe(
      returnedData => {
        // Pintar resultado en pantalla.
        this.printResult(returnedData);
      });
  }

  private composeObjectToSend(data: string): object {
    const obj = {
      entityManagerBeanName: this.selectedEntityManager,
      sql: data
    };
    return obj;
  }

  private printResult(data: Array<ResultData>): void {
    this.createResultFromJson(data);
  }




  private createResultFromJson(data: Array<ResultData>): void {
    this.textoResultado = ['$'];
    data.forEach(
    elemento => {
      const table = document.createElement('table');
      elemento.resultHeader.forEach(
        element => {
          const th = document.createElement('th');
          const text = document.createTextNode(element);
          th.appendChild(text);
          table.appendChild(th);
        }
      );
      elemento.rows.forEach(
        rowElement => {
          const tr = document.createElement('tr');
          rowElement.columns.forEach(
            columnElement => {
              const columna = document.createElement('td');
              const texto = document.createTextNode(columnElement.value);
              columna.appendChild(texto);
              tr.appendChild(columna);
              table.appendChild(tr);
            }
          );
        }
      );
      this.textoResultado[0] += '<span class="prompt"></span>' + '&nbsp;' + elemento.statement + '\n\n';
      this.textoResultado[0] += table.outerHTML;
      this.textoResultado[0] += '\n\n\n$';
    });
    alert(this.textoResultado[0]);
  }
}

