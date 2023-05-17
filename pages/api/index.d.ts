import { IronSession } from "iron-session";

export type IUser = {
  id: number;
  nickname: string;
  avatar: string;
}

export type ISession = IronSession & IUser & Record<string, any>;


export type IArticle = {
  id: number,
  title: string,
  content: string,
  create_time: Date,
  update_time: Date,
  is_delete: boolean,
  views: number,
  user: IUser,
  comments: IComment[]
};

export type IComment = {
  id: number,
  content: string,
  create_time: Date,
  update_time: Date,
  user: IUser,
  article: IArticle
}

export type IResponse<T> = {
  code: number,
  msg: string,
  data?: T
}