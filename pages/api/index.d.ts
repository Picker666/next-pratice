import { IronSession } from "iron-session";

export type ISession = IronSession & { userId?: string, nickname?: string, avatar?: string} & Record<string, any>;