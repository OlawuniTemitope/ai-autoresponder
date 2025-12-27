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

const registerSchema = z.object({
    email: z.string().email("please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // set the path of the error message
})

type registerFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const form = useForm<registerFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    const onSubmit = async (value: registerFormValues) => {
       console.log(value);
        await authClient.signUp.email({
        name: value.email,
        email: value.email,
        password: value.password,
        callbackURL:"/"
       },
    {
        onSuccess: () => {
            router.push("/")
        },
        onError: (error) => {
            toast.error(error.error.message || "Something went wrong")
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
                    Get Started
                </CardTitle>
                <CardDescription>
                    Create an account
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
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
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
                                    Sign up
                                </Button>
                               </div>
                               <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login"
                                className="underline
                                underline-offset-4">
                                    Login
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