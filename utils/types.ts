export interface ResponseFuncs {
  GET?: Function;
  POST?: Function;
  PUT?: Function;
  DELETE?: Function;
}

export interface Operation {
  _id?: number;
  name: string;
  amount: number;
  date: Date;
  type: string;
  category?: string;
}
