"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { addPropertySchema } from "@/lib/validation";
import { addProperty } from "@/lib/actions/property.action";
import {
	processPropertyChat,
	ChatMessage,
	PropertyFormData,
} from "@/lib/actions/ai-property.action";
import { toast } from "sonner";
import {
	LoaderCircle,
	Bot,
	User,
	Send,
	Sparkles,
	CheckCircle,
	ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIMessage } from "@/constants";
import FormInputField from "./EachFields";

const MainPropertyForm = () => {
	const [loading, setLoading] = useState(false);
	const [aiMode, setAiMode] = useState(false);
	const [aiLoading, setAiLoading] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([AIMessage]);
	const [inputValue, setInputValue] = useState("");
	const [extractedData, setExtractedData] = useState<PropertyFormData>({});
	const [conversationComplete, setConversationComplete] = useState(false);
	const router = useRouter();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const form = useForm<z.infer<typeof addPropertySchema>>({
		resolver: zodResolver(addPropertySchema),
		defaultValues: {
			address: "",
			country: "",
			towerShip: "",
			city: "",
			zipCode: "",
			propertyType: "",
			listingType: "",
			bedrooms: "",
			bathrooms: "",
			areaSqFt: "",
			floor: "",
			totalFloors: "",
			price: "",
			activeFilingsCount: "",
			filingHistoryCount: "",
			pendingAuthorizations: "",
			outstandingInvoices: "",
		},
	});

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleChatSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim() || aiLoading) return;

		const userMessage = inputValue.trim();
		setInputValue("");
		setAiLoading(true);

		// Add user message to chat
		const newUserMessage: ChatMessage = {
			id: Date.now().toString(),
			role: "user",
			content: userMessage,
		};

		setMessages((prev) => [...prev, newUserMessage]);

		try {
			// Call server action
			const response = await processPropertyChat(messages, userMessage);

			if (response.success) {
				// Add AI response to chat
				const aiMessage: ChatMessage = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: response.message,
				};

				setMessages((prev) => [...prev, aiMessage]);

				// Handle extracted data
				if (response.extractedData) {
					setExtractedData(response.extractedData);
				}

				if (response.conversationComplete) {
					setConversationComplete(true);
					toast.success(
						"All property information collected! You can now fill the form."
					);
				}
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			console.error("Chat error:", error);
			toast.error("Failed to process your message. Please try again.");
		} finally {
			setAiLoading(false);
		}
	};

	const fillFormWithAIData = () => {
		if (!extractedData) return;

		Object.keys(extractedData).forEach((key) => {
			const value = extractedData[key as keyof PropertyFormData];
			if (value) {
				form.setValue(key as keyof PropertyFormData, value);
			}
		});

		setAiMode(false);
		toast.success("Form filled with AI data! You can review and submit.");
	};

	const resetAIChat = () => {
		setMessages([AIMessage]);
		setExtractedData({});
		setConversationComplete(false);
		setInputValue("");
	};

	async function onSubmit(values: z.infer<typeof addPropertySchema>) {
		try {
			setLoading(true);
			if (!values) throw new Error("Form values are empty");

			const response = await addProperty(values);
			console.log(values);
			if (response.success && response.data) {
				form.reset();
				resetAIChat();
				setLoading(false);
				toast.success(response.message || "Property added successfully");
				// Redirect to properties list or dashboard
				router.push("/"); // Adjust path as needed
			} else {
				toast.error(response.message || "Failed to add property");
			}
		} catch (error: any) {
			toast.error(error.message || "An error occurred while adding property");
		} finally {
			setLoading(false);
		}
	}

	const handleBack = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-background">
			<div className=" mx-auto py-8 px-4 max-w-6xl">
				{/* Header */}
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={handleBack}
						className="mb-4 hover:bg-accent">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</Button>

					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-3xl font-bold">Add New Property</h1>
						<Sparkles className="w-6 h-6 text-primary" />
					</div>
					<p className="text-muted-foreground">
						Fill in the details manually or let AI help you by asking questions.
					</p>
				</div>

				{/* Main Content */}
				<Card className="w-full">
					<CardHeader className="pb-4">
						<Tabs value={aiMode ? "ai" : "manual"} className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="manual" onClick={() => setAiMode(false)}>
									Manual Entry
								</TabsTrigger>
								<TabsTrigger value="ai" onClick={() => setAiMode(true)}>
									<Bot className="w-4 h-4 mr-2" />
									Revalio AI 
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</CardHeader>

					<CardContent>
						<Tabs value={aiMode ? "ai" : "manual"} className="w-full">
							<TabsContent value="manual" className="mt-0">
								<div className="space-y-6">
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="space-y-6">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<FormInputField
													control={form.control}
													name="address"
													label="Property Address"
													placeholder="Enter full property address"
													required
													colSpan="md:col-span-1"
												/>

												<FormInputField
													control={form.control}
													name="country"
													label="Country"
													placeholder="Select or enter country"
													required
													colSpan="md:col-span-1"
												/>

												<FormInputField
													control={form.control}
													name="city"
													label="City"
													placeholder="Enter City Name"
													required
												/>

												<FormInputField
													name="towerShip"
													control={form.control}
													label="Township/Area"
													placeholder="Enter township or area name"
													colSpan="md:col-span-1"
												/>

												<FormInputField
													control={form.control}
													name="zipCode"
													label="Zip Code"
													placeholder="Enter zip code"
													required
													colSpan="md:col-span-1"
													type="text"
												/>
												<FormInputField
													control={form.control}
													name="propertyType"
													label="Property Type"
													placeholder="e.g., House, Apartment"
													required
													colSpan="md:col-span-1"
												/>
												<FormInputField
													control={form.control}
													name="listingType"
													label="Listing Type"
													placeholder="e.g., Rent, Sale"
													required
													colSpan="md:col-span-1"
												/>
												<FormInputField
													control={form.control}
													name="bedrooms"
													label="Bedrooms"
													placeholder="Enter number of bedrooms"
													required
													colSpan="md:col-span-1"
												/>
												<FormInputField
													control={form.control}
													name="bathrooms"
													label="Bathrooms"
													placeholder="Enter number of bathrooms"
													required
													colSpan="md:col-span-1"
												/>
												<FormInputField
													control={form.control}
													name="areaSqFt"
													label="Area (sq ft)"
													placeholder="Enter area in square feet"
													required
													colSpan="md:col-span-1"
												/>
												<FormInputField
													control={form.control}
													name="floor"
													label="Floor"
													placeholder="Enter floor number"
													required
													colSpan="md:col-span-1"
												/>
												<FormInputField
													control={form.control}
													name="totalFloors"
													label="Total Floors"
													placeholder="Enter total number of floors"
													required
													colSpan="md:col-span-1"
												/>
												<FormInputField
													control={form.control}
													name="price"
													label="Price"
													placeholder="Enter property price"
													required
													colSpan="md:col-span-1"
												/>
												<FormInputField
													control={form.control}
													name="activeFilingsCount"
													label="Active Filings Count"
													placeholder="Enter active filings count"
													required
													colSpan="md:col-span-1"
												/>

												<FormInputField
													control={form.control}
													name="filingHistoryCount"
													label="Filing History Count"
													placeholder="Enter filing history count"
													required
													colSpan="md:col-span-1"
												/>

												<FormInputField
													control={form.control}
													name="pendingAuthorizations"
													label="Pending Authorizations"
													placeholder="Enter pending authorizations count"
													required
												/>
												<FormInputField
													control={form.control}
													name="outstandingInvoices"
													label="Outstanding Invoices"
													placeholder="Enter outstanding invoices count"
													required
												/>
											</div>

											<div className="flex gap-4 pt-6">
												<Button
													type="button"
													variant="outline"
													onClick={handleBack}
													className="flex-1 sm:flex-none">
													Cancel
												</Button>
												<Button
													type="submit"
													className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
													disabled={loading}>
													{loading ? (
														<>
															<LoaderCircle className="w-4 h-4 animate-spin mr-2" />
															Adding Property...
														</>
													) : (
														"Add Property"
													)}
												</Button>
											</div>
										</form>
									</Form>
								</div>
							</TabsContent>

							<TabsContent value="ai" className="mt-0">
								<div className="space-y-6">
									{/* AI Chat Interface */}
									<div className="bg-muted/30 rounded-lg p-6">
										<ScrollArea className="h-[400px] pr-4">
											<div className="space-y-4">
												{messages.map((message) => (
													<div
														key={message.id}
														className={`flex items-start gap-3 ${
															message.role === "user"
																? "flex-row-reverse"
																: "flex-row"
														}`}>
														<div
															className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
																message.role === "user"
																	? "bg-primary text-primary-foreground"
																	: "bg-secondary text-secondary-foreground"
															}`}>
															{message.role === "user" ? (
																<User className="w-5 h-5" />
															) : (
																<Bot className="w-5 h-5" />
															)}
														</div>
														<div
															className={`flex-1 max-w-[75%] ${
																message.role === "user"
																	? "text-right"
																	: "text-left"
															}`}>
															<div
																className={`inline-block p-4 rounded-lg ${
																	message.role === "user"
																		? "bg-primary text-primary-foreground"
																		: "bg-background border"
																}`}>
																<div className="whitespace-pre-wrap text-sm">
																	{message.content}
																</div>
															</div>
														</div>
													</div>
												))}
												{aiLoading && (
													<div className="flex items-start gap-3">
														<div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
															<Bot className="w-5 h-5" />
														</div>
														<div className="flex-1">
															<div className="inline-block p-4 rounded-lg bg-background border">
																<div className="flex items-center gap-2 text-sm">
																	<LoaderCircle className="w-4 h-4 animate-spin" />
																	Revalio is thinking...
																</div>
															</div>
														</div>
													</div>
												)}
											</div>
											<div ref={messagesEndRef} />
										</ScrollArea>
									</div>

									{/* Chat Input */}
									<form onSubmit={handleChatSubmit} className="flex gap-3">
										<Input
											value={inputValue}
											onChange={(e) => setInputValue(e.target.value)}
											placeholder="Type your message here..."
											className="flex-1 h-12"
											disabled={aiLoading}
										/>
										<Button
											type="submit"
											disabled={aiLoading || !inputValue.trim()}
											className="px-6">
											<Send className="w-4 h-4" />
										</Button>
									</form>

									{/* AI Data Preview & Actions */}
									{conversationComplete &&
										Object.keys(extractedData).length > 0 && (
											<div className="p-6 bg-green-50 border border-green-200 rounded-lg">
												<div className="flex items-start justify-between gap-4">
													<div className="flex items-start gap-3">
														<CheckCircle className="w-6 h-6 text-green-600 mt-1" />
														<div>
															<div className="text-lg font-semibold text-green-800 mb-2">
																Property Information Collected!
															</div>
															<div className="text-sm text-green-700 space-y-2">
																{extractedData.address && (
																	<div>
																		<strong>Address:</strong>{" "}
																		{extractedData.address}
																	</div>
																)}
																{extractedData.country && (
																	<div>
																		<strong>Country:</strong>{" "}
																		{extractedData.country}
																	</div>
																)}
																{extractedData.city && (
																	<div>
																		<strong>City:</strong> {extractedData.city}
																	</div>
																)}
																{extractedData.towerShip && (
																	<div>
																		<strong>Township/Area:</strong>{" "}
																		{extractedData.towerShip}
																	</div>
																)}
															</div>
														</div>
													</div>
													<div className="flex flex-col gap-2">
														<Button
															size="sm"
															onClick={resetAIChat}
															variant="outline">
															Start Over
														</Button>
														<Button size="sm" onClick={fillFormWithAIData}>
															Fill Form
														</Button>
													</div>
												</div>
											</div>
										)}

									{/* Submit Actions for AI mode */}
									<div className="flex gap-4 pt-4">
										<Button
											type="button"
											variant="outline"
											onClick={handleBack}
											className="flex-1 sm:flex-none">
											Cancel
										</Button>
										<Button
											onClick={form.handleSubmit(onSubmit)}
											className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
											disabled={loading}>
											{loading ? (
												<>
													<LoaderCircle className="w-4 h-4 animate-spin mr-2" />
													Adding Property
												</>
											) : (
												"Add Property"
											)}
										</Button>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default MainPropertyForm;
