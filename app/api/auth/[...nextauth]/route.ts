import NextAuth from "next-auth";
import {authHandler} from "@/lib/authHandler";

const handler = NextAuth(authHandler);

export {handler as GET, handler as POST};