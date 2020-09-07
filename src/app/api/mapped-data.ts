
export interface TableData {
  tableName: string;
  columnNames: Array<string>;
}

export interface MappedData {
  mappedInformation: {
    [ entityManager: string]: Array<TableData>;
  };
}

export interface Column {
  index: number;
  type: string;
  value: string;
}

export interface Row {
  index: number;
  columns: Array<Column>;
}

export interface ResultData {
  errorDescription: string;
  executedOk: boolean;
  index: number;
  resultHeader: Array<string>;
  rows: Array<Row>;
  statement: string;
}
