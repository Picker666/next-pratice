import { IronSession } from "iron-session";

export type User = {
  id: number;
  nickname: string;
  avatar: string;
}

export type ISession = IronSession & User & Record<string, any>;


export type IArticle = {
  id: number,
  title: string,
  content: string,
  create_time: Date,
  update_time: Date,
  is_delete: boolean,
  views: number,
  user: User,
};