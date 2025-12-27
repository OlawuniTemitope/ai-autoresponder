"use client";

import z from "zod";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast} from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const loginSchema = z.object({
    email: z.string().email("please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
})

type loginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const form = useForm<loginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (value: loginFormValues) => {
        await authClient.signIn.email({
            email: value.email,
            password: value.password,
            callbackURL: "/"
        },{
            onSuccess: () => {
                toast.success("Logged in successfully");
                router.push("/");
            },
            onError: (error) => {
               toast.error(error.error.message || "Failed to login"); 
            }
        })
    };

    const isPending = form.formState.isSubmitting;

    return (
    <> 
    <div className="flex flex-col gap-6">
        <Card>
            <CardHeader className="text-center">
                <CardTitle>
                    Welcome back
                </CardTitle>
                <CardDescription>
                    Login to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className=" grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button
                                variant="outline"
                                type="button"
                                disabled={isPending}
                                >
                                    <Image 
                                    src="/images/github.svg"
                                    alt="github"
                                    width={20}
                                    height={20}
                                    />
                                    Continue with Github
                                </Button>
                                <Button
                                variant="outline"
                                className="w-full"
                                type="button"
                                disabled={isPending}
                                >
                                     <Image 
                                    src="/images/google.svg"
                                    alt="google"
                                    width={20}
                                    height={20}
                                    />
                                    Continue with Google
                                </Button>
                            </div>
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="@example.com"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="*******"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>                                        </FormItem>
                                    )}
                                />
                                <Button 
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full"
                                >
                                    Login
                                </Button>
                               </div>
                               <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup"
                                className="underline
                                underline-offset-4">
                                    Sign up
                                </Link>
                               </div>
                        </div>
                    </form>
                    
                </Form>
            </CardContent>
        </Card>
    </div>
    </>
)
}