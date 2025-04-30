"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { useSelector } from 'react-redux';

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-none", className)}
        {...props}
    />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
    const sidebarMinimized = useSelector(state => state.rtkreducer.sidebarMinimized);

    return (
        <AccordionPrimitive.Header className="flex w-full">
            <AccordionPrimitive.Trigger
                ref={ref}
                className={cn(
                    "flex items-center justify-between w-full py-0 transition-all outline-none",
                    "[&[data-state=open]>div>div]:text-indigo-600 dark:[&[data-state=open]>div>div]:text-indigo-400",
                    className
                )}
                {...props}
            >
                <div className="flex items-center w-full">
                    {children}
                </div>

                {!sidebarMinimized && (
                    <ChevronDown
                        className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 
                     [&[data-state=open]]:rotate-180 [&[data-state=open]]:text-indigo-600
                     dark:[&[data-state=open]]:text-indigo-400"
                    />
                )}
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            className
        )}
        {...props}
    >
        <div className="py-1">{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }