import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prismaSingleton';

export const authHandler = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "email", placeholder: "Email"},
                password: {label: "Password", type: "password", placeholder: "Password"},
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                            password: credentials.password,
                        },
                    });
                    if (!user) {
                        return null;
                    }
                    return {id: user.id.toString(), email: user.email};
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        })
    ]
}