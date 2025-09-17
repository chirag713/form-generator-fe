"use client";

import React, { useEffect, useState } from "react";
import { MdNumbers } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance } from "@/types/formElementType";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import useDesigner from "@/hooks/useDesigner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const type: ElementsType = "CheckboxField";

const extraAttributes = {
  label: "Accept Terms and Conditions",
  helperText: "You must agree to proceed",
  required: true,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean(),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const CheckboxFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerButtonElement: {
    Icon: MdNumbers,
    label: "Checkbox Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue === "true";
    }
    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

// --------------------- Designer Component ---------------------
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { label, helperText } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row gap-2 items-center">
        <Checkbox disabled />
        <Label>{label}</Label>
      </div>
      {helperText && <p className="text-muted-foreground text-[0.8rem] ml-6">{helperText}</p>}
    </div>
  );
}

// --------------------- Form Component ---------------------
function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: (key: string, value: string) => void;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText } = element.extraAttributes;

  const [checked, setChecked] = useState(defaultValue === "true");
  const [error, setError] = useState<string | null>(null);

  // Sync error state with parent validation
  useEffect(() => {
    if (isInvalid) {
      setError(required ? "This field is required" : "Invalid value");
    } else {
      setError(null);
    }
  }, [isInvalid, required]);

  const validateField = (isChecked: boolean) => {
    if (required && !isChecked) {
      setError("This field is required");
      return false;
    }
    setError(null);
    return true;
  };

  const handleChange = (isChecked: boolean) => {
    setChecked(isChecked);
    validateField(isChecked);
    if (submitValue) submitValue(element.id, isChecked.toString());
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row gap-2 items-center">
        <Checkbox
          checked={checked}
          onCheckedChange={(checked) => handleChange(!!checked)}
          className={cn(error && "border-red-500")}
        />
        <Label className={cn(error && "text-red-500")}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      {error ? (
        <p className="text-red-500 text-[0.8rem] ml-6">{error}</p>
      ) : (
        helperText && <p className="text-muted-foreground text-[0.8rem] ml-6">{helperText}</p>
      )}
    </div>
  );
}

// --------------------- Properties Component ---------------------
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();

  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  const applyChanges = (values: PropertiesFormSchemaType) => {
    const { label, helperText, required } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: { label, helperText, required }
    });
  };

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-3"
      >
        {/* Label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter checkbox label"
                  onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                />
              </FormControl>
              <FormDescription>The label displayed next to the checkbox</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Helper Text */}
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter helper text"
                  onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                />
              </FormControl>
              <FormDescription>Additional information or instructions</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Required */}
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>Whether this checkbox must be checked</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}