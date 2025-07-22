'use client'

import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ClientTestimonials = () => {
    const getAllTestimonials = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/testimonals/return-all");
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.log("Error: ", error);
            return [];
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ['testimonials'],
        queryFn: getAllTestimonials
    });

    if (isLoading) {
        return (
            <div className="bg-gray-950 py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <Skeleton className="h-10 w-64 mx-auto" />
                        <Skeleton className="h-6 w-48 mx-auto mt-2" />
                    </div>
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-gray-950 py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            No testimonials yet
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    const firstRow = data.slice(0, Math.ceil(data.length / 2));
    const secondRow = data.slice(Math.ceil(data.length / 2));

    const ReviewCard = ({ testimonial }) => {
        return (
            <div
                className={cn(
                    "relative cursor-pointer overflow-hidden rounded-xl border p-4",
                    "border-gray-800 bg-gray-900 hover:bg-gray-800",
                    "transform-gpu transition-all duration-300 ease-in-out hover:scale-105",
                    "w-[300px] h-[200px] flex flex-col justify-between"
                )}
            >
                <div>
                    <div className="flex items-center gap-2">
                        {testimonial.organizationId?.logoUrl ? (
                            <img
                                src={testimonial.organizationId.logoUrl}
                                alt={testimonial.organizationId.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-400 text-lg">
                                    {testimonial.name.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-semibold text-white">{testimonial.name}</h3>
                            <p className="text-xs text-gray-400">{testimonial.position}</p>
                        </div>
                    </div>

                    <div className="mt-4 flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < testimonial.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                            />
                        ))}
                    </div>

                    <p className="mt-3 text-sm text-gray-300 line-clamp-3">
                        "{testimonial.description}"
                    </p>
                </div>

                <div className="mt-4 border-t border-gray-800 pt-3">
                    <p className="text-xs text-gray-400 truncate">
                        {testimonial.organizationId?.name || 'Unknown company'}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-950 py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Client Testimonials
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-300">
                        What our clients say about us
                    </p>
                </div>

                <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg">
                    <Marquee pauseOnHover className="[--duration:40s]">
                        {firstRow.map((testimonial) => (
                            <ReviewCard key={testimonial._id} testimonial={testimonial} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:40s]">
                        {secondRow.map((testimonial) => (
                            <ReviewCard key={testimonial._id} testimonial={testimonial} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-950"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-950"></div>
                </div>
            </div>
        </div>
    );
};

export default ClientTestimonials;