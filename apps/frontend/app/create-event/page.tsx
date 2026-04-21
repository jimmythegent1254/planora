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
import { lazy, Suspense, useState, type ReactNode } from "react";
import type { Control, FieldPath, UseFormReturn } from "react-hook-form";
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
type CreateEventFieldName = FieldPath<CreateEventFormData>;
type StringFieldName = Exclude<CreateEventFieldName, "isOnline">;

const CATEGORY_OPTIONS = [
  "Technology",
  "Music",
  "Food & Drink",
  "Business",
  "Wellness",
  "Arts & Culture",
  "Sports",
] as const;

const PLATFORM_OPTIONS = [
  "Zoom",
  "Google Meet",
  "Microsoft Teams",
  "YouTube Live",
  "Twitch",
  "Custom / Other",
] as const;

function TwoColumnGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function ThreeColumnGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-3">{children}</div>;
}

type BaseFieldProps = {
  control: Control<CreateEventFormData>;
  name: StringFieldName;
  label: string;
  className?: string;
  labelClassName?: string;
};

function TextField({
  control,
  name,
  label,
  placeholder,
  type = "text",
  className,
  labelClassName,
  inputClassName = "h-11 rounded-xl",
}: BaseFieldProps & {
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  inputClassName?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} className={inputClassName} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TextareaField({
  control,
  name,
  label,
  placeholder,
  className,
  inputClassName = "min-h-32 rounded-xl",
}: BaseFieldProps & {
  placeholder?: string;
  inputClassName?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} className={inputClassName} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SelectField({
  control,
  name,
  label,
  options,
  placeholder,
  className,
  defaultValue,
}: BaseFieldProps & {
  options: readonly string[];
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            value={(field.value as string | undefined) || defaultValue}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className="h-11 w-full rounded-xl">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TicketTypeForm({
  control,
  namePrefix,
  title,
}: {
  control: Control<CreateEventFormData>;
  namePrefix: "general" | "vip";
  title: string;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-card-foreground">{title}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ThreeColumnGrid>
        <TextField
          control={control}
          name={`${namePrefix}Price` as StringFieldName}
          label="Price"
          placeholder="$0.00"
          className="space-y-1"
          labelClassName="text-xs"
          inputClassName="h-9 rounded-lg text-sm"
        />
        <TextField
          control={control}
          name={`${namePrefix}Quantity` as StringFieldName}
          label="Quantity"
          placeholder="Unlimited"
          className="space-y-1"
          labelClassName="text-xs"
          inputClassName="h-9 rounded-lg text-sm"
        />
        <TextField
          control={control}
          name={`${namePrefix}SalesEnd` as StringFieldName}
          label="Sales End"
          type="date"
          className="space-y-1"
          labelClassName="text-xs"
          inputClassName="h-9 rounded-lg text-sm"
        />
      </ThreeColumnGrid>
    </div>
  );
}

function BasicInformationSection({
  form,
  visibility,
}: {
  form: UseFormReturn<CreateEventFormData>;
  visibility: CreateEventFormData["visibility"];
}) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextField
          control={form.control}
          name="title"
          label="Event Title"
          placeholder="Give your event a clear, catchy title"
        />
        <TextareaField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Describe what attendees can expect..."
        />
        <TwoColumnGrid>
          <SelectField
            control={form.control}
            name="category"
            label="Category"
            options={CATEGORY_OPTIONS}
            placeholder="Select category"
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
        </TwoColumnGrid>
      </CardContent>
    </Card>
  );
}

function DateAndLocationSection({
  form,
  isOnline,
}: {
  form: UseFormReturn<CreateEventFormData>;
  isOnline: boolean;
}) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          Date & Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TwoColumnGrid>
          <TextField
            control={form.control}
            name="startDateTime"
            label="Start Date & Time"
            type="datetime-local"
          />
          <TextField
            control={form.control}
            name="endDateTime"
            label="End Date & Time"
            type="datetime-local"
          />
        </TwoColumnGrid>

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

            <SelectField
              control={form.control}
              name="platform"
              label="Platform"
              options={PLATFORM_OPTIONS}
              defaultValue="Zoom"
              placeholder="Select platform"
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

            <TwoColumnGrid>
              <TextField
                control={form.control}
                name="meetingId"
                label="Meeting ID (optional)"
                placeholder="123 456 7890"
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
            </TwoColumnGrid>

            <TextareaField
              control={form.control}
              name="accessInstructions"
              label="Access Instructions (optional)"
              placeholder="Any extra info attendees need to join (waiting room, dial-in, dress code, etc.)"
              inputClassName="min-h-20 rounded-xl"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TicketsSection({ form }: { form: UseFormReturn<CreateEventFormData> }) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TicketTypeForm
          control={form.control}
          namePrefix="general"
          title="General Admission"
        />
        <TicketTypeForm control={form.control} namePrefix="vip" title="VIP Pass" />

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
  );
}

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

            <BasicInformationSection form={form} visibility={visibility} />
            <DateAndLocationSection form={form} isOnline={isOnline} />
            <TicketsSection form={form} />

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
