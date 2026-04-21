"use client";

import Navbar from "@/components/navbar/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  ChevronRight,
  DollarSign,
  Globe,
  Image,
  Key,
  Link2,
  Loader2,
  Lock,
  MapPin,
  Plus,
  Trash2,
  Type,
  Upload,
  Video,
} from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const LocationPicker = lazy(() =>
  import("@/components/location-picker").then((m) => ({
    default: m.LocationPicker,
  })),
);

const createEventSchema = z
  .object({
    title: z.string().min(2, "Event title is required."),
    description: z
      .string()
      .min(10, "Description should be at least 10 characters."),
    category: z.string().min(1, "Please select a category."),
    visibility: z.enum(["public", "private"]),
    startDateTime: z.string().min(1, "Start date and time is required."),
    endDateTime: z.string().min(1, "End date and time is required."),
    isOnline: z.boolean(),
    location: z.string().optional(),
    platform: z.string().optional(),
    eventLink: z.string().optional(),
    meetingId: z.string().optional(),
    passcode: z.string().optional(),
    accessInstructions: z.string().optional(),
    generalPrice: z.string().optional(),
    generalQuantity: z.string().optional(),
    generalSalesEnd: z.string().optional(),
    vipPrice: z.string().optional(),
    vipQuantity: z.string().optional(),
    vipSalesEnd: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const start = Date.parse(values.startDateTime);
    const end = Date.parse(values.endDateTime);

    if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDateTime"],
        message: "End date must be after start date.",
      });
    }

    if (values.isOnline) {
      if (!values.eventLink || values.eventLink.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["eventLink"],
          message: "Event link is required for online events.",
        });
      } else {
        const urlCheck = z.string().url().safeParse(values.eventLink);
        if (!urlCheck.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["eventLink"],
            message: "Please enter a valid URL.",
          });
        }
      }
    } else if (!values.location || values.location.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Location is required for in-person events.",
      });
    }
  });

type CreateEventFormData = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const [coverImageName, setCoverImageName] = useState<string | null>(null);
  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      visibility: "public",
      startDateTime: "",
      endDateTime: "",
      isOnline: false,
      location: "",
      platform: "Zoom",
      eventLink: "",
      meetingId: "",
      passcode: "",
      accessInstructions: "",
      generalPrice: "",
      generalQuantity: "",
      generalSalesEnd: "",
      vipPrice: "",
      vipQuantity: "",
      vipSalesEnd: "",
    },
  });

  const isOnline = form.watch("isOnline");
  const visibility = form.watch("visibility");

  const onSubmit = (data: CreateEventFormData) => {
    console.log("Create event payload:", data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="basic" className="mb-8">
          <TabsList variant="line" className="h-auto w-full justify-start p-0">
            <TabsTrigger value="basic" className="flex-none px-0 py-1">
              Basic Info
            </TabsTrigger>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <TabsTrigger value="date-location" className="flex-none px-0 py-1">
              Date & Location
            </TabsTrigger>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <TabsTrigger value="tickets" className="flex-none px-0 py-1">
              Tickets
            </TabsTrigger>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <TabsTrigger value="review" className="flex-none px-0 py-1">
              Review
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Create New Event
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details to publish your event.
        </p>

        <Form {...form}>
          <form
            className="mt-8 space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Cover Image */}
            <Card className="border-2 border-dashed bg-secondary/30 transition-colors hover:border-primary/30">
              <CardHeader className="items-center text-center">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-primary" />
                  Cover Image
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center px-4 pb-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Upload cover image
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG, or GIF up to 5MB. Recommended: 1920x1080
                </p>
                <input
                  id="cover-image"
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setCoverImageName(file?.name ?? null);
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-1.5 cursor-pointer"
                  type="button"
                  onClick={() =>
                    document.getElementById("cover-image")?.click()
                  }
                >
                  <Image className="h-3.5 w-3.5" />
                  Choose File
                </Button>
                {coverImageName && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Selected: {coverImageName}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Give your event a clear, catchy title"
                          className="h-11 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what attendees can expect..."
                          className="min-h-32 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="Technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Food & Drink">
                              Food & Drink
                            </SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Wellness">Wellness</SelectItem>
                            <SelectItem value="Arts & Culture">
                              Arts & Culture
                            </SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => field.onChange("public")}
                              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium ${
                                visibility === "public"
                                  ? "bg-rose-500 text-white hover:bg-rose-600"
                                  : "bg-transparent border border-slate-300 text-slate-900 hover:bg-rose-50"
                              }`}
                            >
                              <Globe className="h-4 w-4" /> Public
                            </Button>
                            <Button
                              type="button"
                              onClick={() => field.onChange("private")}
                              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium ${
                                visibility === "private"
                                  ? "bg-rose-500 text-white hover:bg-rose-600"
                                  : "bg-transparent border border-slate-300 text-slate-900 hover:bg-rose-50"
                              }`}
                            >
                              <Lock className="h-4 w-4" /> Private
                            </Button>
                          </div>
                        </FormControl>
                        <div className="pt-1">
                          <Badge variant="secondary" className="capitalize">
                            {visibility}
                          </Badge>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date & Location */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Date & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            className="h-11 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            className="h-11 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isOnline"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border bg-secondary/30 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Video className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <FormLabel
                            htmlFor="online"
                            className="cursor-pointer text-sm font-medium text-foreground"
                          >
                            Online event
                          </FormLabel>
                          <FormDescription>
                            Host this event virtually instead of in-person.
                          </FormDescription>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          id="online"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                {!isOnline ? (
                  <FormField
                    control={form.control}
                    name="location"
                    render={() => (
                      <FormItem>
                        <Suspense
                          fallback={
                            <div className="space-y-1.5">
                              <FormLabel>Location</FormLabel>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  placeholder="Search for a venue or enter address"
                                  className="h-11 rounded-xl pl-10"
                                />
                              </div>
                              <div className="flex h-[320px] items-center justify-center rounded-xl border bg-secondary/30">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                              </div>
                            </div>
                          }
                        >
                          <LocationPicker
                            value={form.watch("location") ?? ""}
                            onChange={(addr) =>
                              form.setValue("location", addr, {
                                shouldValidate: true,
                              })
                            }
                          />
                        </Suspense>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">
                        Virtual Event Details
                      </h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <Select
                            value={field.value ?? "Zoom"}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 w-full rounded-xl">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Zoom">Zoom</SelectItem>
                              <SelectItem value="Google Meet">
                                Google Meet
                              </SelectItem>
                              <SelectItem value="Microsoft Teams">
                                Microsoft Teams
                              </SelectItem>
                              <SelectItem value="YouTube Live">
                                YouTube Live
                              </SelectItem>
                              <SelectItem value="Twitch">Twitch</SelectItem>
                              <SelectItem value="Custom / Other">
                                Custom / Other
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Link</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                type="url"
                                placeholder="https://zoom.us/j/123456789"
                                className="h-11 rounded-xl pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Attendees will receive this link after registering.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="meetingId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meeting ID (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 456 7890"
                                className="h-11 rounded-xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="passcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passcode (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  placeholder="••••••"
                                  className="h-11 rounded-xl pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="accessInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Instructions (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any extra info attendees need to join (waiting room, dial-in, dress code, etc.)"
                              className="min-h-20 rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tickets */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ticket type 1 */}
                <div className="rounded-xl border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">
                      General Admission
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 cursor-pointer text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="generalPrice"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="$0.00"
                              className="h-9 rounded-lg text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="generalQuantity"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Quantity</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Unlimited"
                              className="h-9 rounded-lg text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="generalSalesEnd"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Sales End</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="h-9 rounded-lg text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Ticket type 2 */}
                <div className="rounded-xl border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">
                      VIP Pass
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 cursor-pointer text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="vipPrice"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="$0.00"
                              className="h-9 rounded-lg text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vipQuantity"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Quantity</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Unlimited"
                              className="h-9 rounded-lg text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vipSalesEnd"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Sales End</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="h-9 rounded-lg text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full cursor-pointer gap-1.5"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Add Ticket Type
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer rounded-xl"
                type="button"
              >
                Save as Draft
              </Button>
              <Button
                size="lg"
                className="cursor-pointer gap-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                type="submit"
              >
                Publish Event
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
