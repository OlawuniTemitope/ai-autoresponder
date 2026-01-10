import { betterAuth } from "better-auth";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled:true,
        autoSignIn:true,
    },

    plugins:[
        polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
            checkout({
                products:[
                    {
                        productId: "56b46482-1c7f-44b6-836a-65b1a24f8afe",
                            slug: "pro" //
                    }
                ],
                successUrl: process.env.POLAR_SUCCESS_URL,
                authenticatedUsersOnly:true
            }),
        portal()
        ]
    })]

});