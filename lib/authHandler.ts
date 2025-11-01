import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prismaSingleton';
import bcrypt from 'bcryptjs';

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
                        },
                    });
                    
                    if (!user) {
                        return null;
                    }

                    // Verify password
                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValidPassword) {
                        return null;
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name || user.username,
                    };
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        })
    ]
}