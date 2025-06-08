import { DefaultSession } from "next-auth"
import {  DefaultJWT } from "next-auth/jwt"
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name?: string | null;
      image?: string | null;
      phone?: string | null;
      address?: string | null;
    }  & DefaultSession["user"]; 
    expires: number;
  }
  interface User extends DefaultUser {
    role: string;
    id: string;
    role: string;
    email: string;
    name?: string | null;
    image?: string | null;
    phone?: string | null;
    address?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
      id: string;
      role: string;
      email: string;
      name?: string | null;
      image?: string | null;
      phone?: string | null;
      address?: string | null;
      expires: number
  }
}
