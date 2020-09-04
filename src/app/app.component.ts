import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';

import { HttpClientModule } from '@angular/common/http';

import { WindowRef } from './WindowRef';
import { SqlInformationService } from './service/sql-information.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MappedData } from './api/mapped-data';

@Component({
  selector: 'app-sql-editor',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'app';
  form: FormGroup;
  entityManagers: Array<string> = new Array<string>();

  /** Variable que debe tener estructura de objeto jackson:
   * {'table1': [ 'col_A', 'col_B', 'col_C' ],'table2': [ 'other_columns1', 'other_columns2' ]...}
   */
  private tables: any;
  @ViewChild('myEditor', { read: null, static: false }) myEditor;

  constructor(private formBuilder: FormBuilder, private winRef: WindowRef, private sqlInformationService: SqlInformationService) {
  }

  ngOnInit() {
    // Se solicitan los recursos de autocompletado, para conocer el nombre de las tablas/vistas.
    this.form = this.formBuilder.group({
      entorno: [null, Validators.required],
      entityManager: [null, Validators.required]
    });

    this.form.controls.entorno.valueChanges.subscribe(url => {
      this.processAutocompletionInformation(url);
      this.updateCurrentEditor();
    });
  }

  ngAfterViewInit() {
    this.updateCurrentEditor();
  }

  private updateCurrentEditor() {
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

  private obtainTableDataFormatted(data: MappedData): void {
    this.entityManagers = Object.keys(data.mappedInformation);
    for (const entityManager of this.entityManagers) {
      // Array de tablas, seguir mapeando a estructura deseada.
      //data.mappedInformation[entityManager];
    }

    alert(JSON.stringify(data));
    // this.tables = {};
    // Has tus mierdas
    // this.entityManagers;
    return;
  }

  /**
   * Realiza la carga de la información de autocompletado.
   */
  private processAutocompletionInformation(restSystemUrl: string) {
    this.sqlInformationService.getSqlObjectsInformation(restSystemUrl).subscribe(
      data => {
        // Escribir lógica de pintado.
        this.obtainTableDataFormatted(data);
        this.updateCurrentEditor();
      });



  }

  /**
   * Realiza la carga de configuración cuando se pulsa el botón de pantalla.
   */
  public onClickRefresh() {
    if (this.form.valid) {
      this.processAutocompletionInformation(this.form.value.entorno);
    } else {
      alert('Selecciona un sistema.');
    }
  }
}
