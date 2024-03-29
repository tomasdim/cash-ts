import { NextApiRequest } from 'next';

export interface ResponseFuncs {
  GET?: Function;
  POST?: Function;
  PUT?: Function;
  DELETE?: Function;
}

export interface Operation {
  _id?: string;
  name: string;
  amount: number;
  date: string;
  type: string;
  category?: string;
}

export interface Pagination {
  count: number;
  pageCount: number;
}

export interface Response {
  pagination: Pagination;
  items: Operation[];
}
export interface Session {
  expires: Date;
  user: User;
}

export interface User {
  email?: string;
  image: string;
  name: string;
}

export interface Props {
  pagedOperations: Response;
  operations: Operation[];
  session: Session;
  expenses: Operation[];
  income: Operation[];
}

export interface ModalProps {
  function: Function;
}

export interface NavbarProps {
  username: string;
  img: string;
}
