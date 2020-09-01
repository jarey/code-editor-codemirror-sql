import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';

import { WindowRef } from './WindowRef';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  @ViewChild('myEditor', {read: null, static: false}) myEditor;

  constructor(private winRef: WindowRef) {
  }

  ngAfterViewInit() {
    const mime = 'text/x-mariadb';
    const currentWindow = this.winRef.nativeWindow;
    // get mime type
    // if (currentWindow.location.href.indexOf('mime=') > -1) {
    //   mime = currentWindow.location.href.substr(currentWindow.location.href.indexOf('mime=') + 5);
    // }
    currentWindow.editor = CodeMirror.fromTextArea(this.myEditor.nativeElement, {
      mode: mime,
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      // matchBrackets: true,
      autofocus: true,
      extraKeys: {"Ctrl-Space": "autocomplete"},
        hint: CodeMirror.hint.sql,
        hintOptions: {
            tables: {
                "table1": [ "col_A", "col_B", "col_C" ],
                "table2": [ "other_columns1", "other_columns2" ]
            }
        }
    });
  }
}