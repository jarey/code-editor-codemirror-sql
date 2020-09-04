
export interface TableData {
  tableName: string;
  columnNames: Array<string>;
}

export interface MappedData {
  mappedInformation: {
    [ entityManager: string]: Array<TableData>;
  };
}
