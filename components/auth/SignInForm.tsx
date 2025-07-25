"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signInSchema } from "@/lib/validation";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";

const SignInForm = () => {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof signInSchema>) {
		setError(null);
		setLoading(true);
		try {
			authClient.signIn.email(
				{
					email: values.email,
					password: values.password,
					callbackURL: "/",
				},
				{
					onSuccess: () => {
						setLoading(false);
					},

					onError: ({ error }) => {
						setError(error.message);
						setLoading(false);
					},
				}
			);
		} catch (error: any) {
			setError(error.message);
		}
	}

	const onSocial = (provider: "google") => {
		setError(null);
		try {
			authClient.signIn.social(
				{
					provider: provider,
					callbackURL: "/",
				},
				{
					onSuccess: () => {},

					onError: ({ error }) => {
						setError(error.message);
					},
				}
			);
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className=" w-full space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="example@.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input placeholder="*************" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{error && (
					<Alert variant="destructive">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<Button disabled={loading} className="w-full" type="submit">
					{loading ? (
						<LoaderCircle className="w-4 h-4 animate-spin transition-all duration-100" />
					) : (
						"Sign in"
					)}
				</Button>
				<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
					<span className="bg-card text-muted-foreground relative z-10 px-2">
						Or continue with
					</span>
				</div>
				<div className="flex justify-center items-center gap-4">
					<Button
						disabled={loading}
						variant="outline"
						type="button"
						className="w-full cursor-pointer"
						onClick={() => onSocial("google")}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
								fill="currentColor"
							/>
						</svg>

						<span className="sr-only">Login with Google</span>
					</Button>
				</div>
				<div className="text-center text-sm">
					Don&apos;t have an account?{" "}
					<Link href="/sign-up" className="underline underline-offset-4">
						Sign up
					</Link>
				</div>
			</form>
		</Form>
	);
};

export default SignInForm;
